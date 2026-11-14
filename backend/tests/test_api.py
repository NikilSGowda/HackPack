"""End-to-End API and Integration Tests"""

import asyncio
import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from app.core.logging import redact_pii, hash_target
from app.core.rate_limiter import InMemoryRateLimiter


def run_async(coro):
    """Executes an async coroutine synchronously."""
    return asyncio.run(coro)


def test_root_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/")
            assert response.status_code == 200
            data = response.json()
            assert data["service"] == "ScamShield API"
            assert data["status"] == "operational"
    run_async(_test())


def test_health_check_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/health")
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "healthy"
            assert data["active_rules"] == 128
            assert "version" in data
    run_async(_test())


def test_scan_url_valid_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {"url": "https://secure-chase-update.verify-acc-login.xyz/auth"}
            response = await client.post("/api/scan/url", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["scan_type"] == "url"
            assert "scan_id" in data
            assert data["risk_score"] >= 70
            assert data["threat_level"] == "high_risk"
            assert len(data["detected_indicators"]) > 0
            assert "hxxps://" in data["target"]  # Defanged check
            assert len(data["security_recommendations"]) > 0
    run_async(_test())


def test_scan_url_safe_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {"url": "https://github.com/torvalds/linux"}
            response = await client.post("/api/scan/url", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["threat_level"] == "safe"
            assert data["risk_score"] < 35
    run_async(_test())


def test_scan_url_validation_error():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Empty url should fail validation with 422
            response = await client.post("/api/scan/url", json={"url": "   "})
            assert response.status_code == 422
            data = response.json()
            assert data["error"] == "Validation Error"
    run_async(_test())


def test_scan_message_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            payload = {
                "message": "URGENT: Your bank account is locked. Enter your OTP password within 24 hours at bit.ly/test.",
                "sender": "+1 (800) 555-0199"
            }
            response = await client.post("/api/scan/message", json=payload)
            assert response.status_code == 200
            data = response.json()
            assert data["scan_type"] == "message"
            assert data["threat_level"] == "high_risk"
            assert data["risk_score"] >= 65
    run_async(_test())


def test_scan_message_validation_error():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Message too short (< 3 chars)
            response = await client.post("/api/scan/message", json={"message": "hi"})
            assert response.status_code == 422
    run_async(_test())


def test_history_endpoint():
    async def _test():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Perform a scan first
            await client.post("/api/scan/url", json={"url": "https://example.com/test"})
            response = await client.get("/api/history?limit=10")
            assert response.status_code == 200
            data = response.json()
            assert "total" in data
            assert "scans" in data
            assert len(data["scans"]) >= 1
    run_async(_test())


def test_pii_redaction_logging():
    sample = "User entered password=SecretPassword123 and SSN 123-45-6789 and Card 4111 2222 3333 4444"
    redacted = redact_pii(sample)
    assert "SecretPassword123" not in redacted
    assert "123-45-6789" not in redacted
    assert "4111 2222 3333 4444" not in redacted
    assert "[SSN_REDACTED]" in redacted
    assert "[CARD_REDACTED]" in redacted


def test_target_hashing():
    digest = hash_target("https://malicious-phishing.com")
    assert len(digest) == 64  # SHA-256 hex string
    assert digest == hash_target("https://malicious-phishing.com")


def test_rate_limiter_logic():
    local_limiter = InMemoryRateLimiter(requests_per_minute=2)
    test_ip = "192.0.2.1"
    local_limiter.check(test_ip)  # Hit 1: ok
    local_limiter.check(test_ip)  # Hit 2: ok
    with pytest.raises(Exception) as excinfo:
        local_limiter.check(test_ip)  # Hit 3: should raise 429
    assert excinfo.value.status_code == 429
