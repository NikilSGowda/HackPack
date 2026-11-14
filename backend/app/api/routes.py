"""FastAPI Endpoints Router for ScamShield API"""

import time
from typing import Optional
from fastapi import APIRouter, Depends, Request, HTTPException, status, Header

from app.config import settings
from app.models.schemas import (
    UrlScanRequest,
    MessageScanRequest,
    ScanResponse,
    HealthResponse,
    ScanHistoryResponse
)
from app.analyzers.url_analyzer import analyze_url
from app.analyzers.message_analyzer import analyze_message
from app.storage.history_store import history_store
from app.core.logging import log_safe_scan, logger
from app.core.rate_limiter import rate_limit_dependency

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Status Check",
    description="Returns backend health, active defense rule count, and environment telemetry."
)
async def health_check():
    """Health check endpoint for monitors and load balancers."""
    return HealthResponse(
        status="healthy",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        active_rules=128,
        environment=settings.ENVIRONMENT
    )


@router.post(
    "/scan/url",
    response_model=ScanResponse,
    summary="Analyze Suspicious URL",
    description=(
        "Performs passive, non-interactive structural and lexical inspection of target URL. "
        "Evaluates Punycode, homoglyphs, IP hostnames, Shannon entropy, and brand spoofing. "
        "Does NOT visit or execute untrusted web endpoints."
    ),
    dependencies=[Depends(rate_limit_dependency)]
)
async def scan_url_endpoint(payload: UrlScanRequest, request: Request):
    """Inspects a web address for phishing characteristics."""
    client_ip = request.client.host if request.client else "unknown"

    try:
        response = analyze_url(payload.url)
        history_store.add(response)
        log_safe_scan(
            scan_id=response.scan_id,
            scan_type="url",
            target_content=payload.url,
            risk_score=response.risk_score,
            threat_level=response.threat_level,
            client_ip=client_ip
        )
        return response
    except Exception as exc:
        logger.error(f"Error analyzing URL: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating the web address."
        )


@router.post(
    "/scan/message",
    response_model=ScanResponse,
    summary="Analyze Suspicious Message",
    description=(
        "Analyzes text message, email, or social media communication for social engineering manipulation, "
        "coercive urgency deadlines, credential/OTP requests, and irreversible financial lures."
    ),
    dependencies=[Depends(rate_limit_dependency)]
)
async def scan_message_endpoint(payload: MessageScanRequest, request: Request):
    """Inspects text content for deception and social engineering patterns."""
    client_ip = request.client.host if request.client else "unknown"

    try:
        response = analyze_message(payload.message, payload.sender)
        history_store.add(response)
        log_safe_scan(
            scan_id=response.scan_id,
            scan_type="message",
            target_content=payload.message,
            risk_score=response.risk_score,
            threat_level=response.threat_level,
            client_ip=client_ip
        )
        return response
    except Exception as exc:
        logger.error(f"Error analyzing message: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating the message content."
        )


@router.get(
    "/history",
    response_model=ScanHistoryResponse,
    summary="Retrieve Scan History",
    description="Returns recent scans performed on the system (supports optional authentication header)."
)
async def get_history_endpoint(
    limit: int = 50,
    authorization: Optional[str] = Header(None)
):
    """Returns persistent recent scan records."""
    clamped_limit = min(max(1, limit), 100)
    scans = history_store.get_all(limit=clamped_limit)
    return ScanHistoryResponse(total=len(scans), scans=scans)
