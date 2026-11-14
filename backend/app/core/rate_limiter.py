"""In-Memory Sliding Window Rate Limiter
Prevents API flooding and brute-force scans per client IP address.
"""

import time
from collections import defaultdict
from threading import Lock
from typing import Dict, List
from fastapi import Request, HTTPException, status
from app.config import settings


class InMemoryRateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.window_seconds = 60.0
        self.hits: Dict[str, List[float]] = defaultdict(list)
        self.lock = Lock()

    def check(self, client_ip: str):
        now = time.time()
        cutoff = now - self.window_seconds

        with self.lock:
            # Clean expired timestamps
            timestamps = [t for t in self.hits[client_ip] if t > cutoff]
            if len(timestamps) >= self.requests_per_minute:
                retry_after = int(self.window_seconds - (now - timestamps[0])) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit exceeded. Maximum {self.requests_per_minute} requests per minute allowed.",
                    headers={"Retry-After": str(max(1, retry_after))}
                )
            timestamps.append(now)
            self.hits[client_ip] = timestamps


limiter = InMemoryRateLimiter(requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)


def rate_limit_dependency(request: Request):
    """FastAPI dependency to enforce rate limiting on incoming requests."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    # Respect X-Forwarded-For if behind a proxy
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    limiter.check(client_ip)
