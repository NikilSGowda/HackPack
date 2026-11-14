"""Thread-Safe Scan History Storage
Provides in-memory persistent storage for recent scans.
"""

from threading import Lock
from typing import List, Optional
from app.models.schemas import ScanHistoryItem, ScanResponse


class HistoryStore:
    def __init__(self, max_items: int = 200):
        self.max_items = max_items
        self._history: List[ScanHistoryItem] = []
        self._lock = Lock()

    def add(self, scan: ScanResponse, user_id: Optional[str] = None):
        item = ScanHistoryItem(
            scan_id=scan.scan_id,
            scan_type=scan.scan_type,
            target=scan.target,
            risk_score=scan.risk_score,
            threat_level=scan.threat_level,
            threat_category=scan.threat_category,
            timestamp=scan.timestamp
        )
        with self._lock:
            self._history.insert(0, item)
            if len(self._history) > self.max_items:
                self._history.pop()

    def get_all(self, limit: int = 50) -> List[ScanHistoryItem]:
        with self._lock:
            return list(self._history[:limit])

    def clear(self):
        with self._lock:
            self._history.clear()


history_store = HistoryStore()
