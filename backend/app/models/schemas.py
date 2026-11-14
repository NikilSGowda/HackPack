"""Pydantic Schemas for Request & Response Data Models"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class UrlScanRequest(BaseModel):
    url: str = Field(
        ...,
        min_length=1,
        max_length=2048,
        description="Target web address or domain to analyze passively.",
        examples=["https://secure-chase-update.verify-acc-login.xyz/auth"]
    )

    @field_validator("url")
    @classmethod
    def validate_and_strip_url(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("URL cannot be empty or whitespace only.")
        if any(c in cleaned for c in ["\x00", "\r", "\n"]):
            raise ValueError("URL contains invalid control characters.")
        return cleaned


class MessageScanRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=3,
        max_length=10000,
        description="Text content of suspicious SMS, email, or direct message.",
        examples=["URGENT: Your bank account is frozen. Confirm your OTP at bit.ly/3xZ9qL within 12 hours."]
    )
    sender: Optional[str] = Field(
        None,
        max_length=256,
        description="Optional sender phone number, email address, or username."
    )

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Message cannot be empty or whitespace only.")
        return cleaned


class ThreatIndicator(BaseModel):
    code: str = Field(..., description="Unique alphanumeric identifier for the rule.")
    title: str = Field(..., description="Human-readable title of the indicator.")
    severity: str = Field(..., description="Severity level: info, warning, high, or critical.")
    description: str = Field(..., description="Detailed technical explanation of the detected threat flag.")
    weight: float = Field(..., description="Weight score contributed to the total composite risk.")
    details: Optional[Dict[str, Any]] = Field(None, description="Optional extra metadata (e.g. matched homoglyphs).")


class ScanResponse(BaseModel):
    scan_id: str = Field(..., description="Unique identifier for this scan transaction.")
    scan_type: str = Field(..., description="Vector type: 'url' or 'message'.")
    target: str = Field(..., description="Defanged version of the input safe for non-executable display.")
    risk_score: int = Field(..., ge=0, le=100, description="Normalized risk score from 0 (clean) to 100 (critical threat).")
    threat_level: str = Field(..., description="Classification: 'safe', 'suspicious', or 'high_risk'.")
    threat_category: str = Field(..., description="Categorical classification (e.g. Credential Harvesting, Brand Spoofing).")
    detected_indicators: List[ThreatIndicator] = Field(default_factory=list, description="List of detected rule indicators.")
    explanation: str = Field(..., description="Plain-language educational summary of why this score was determined.")
    security_recommendations: List[str] = Field(default_factory=list, description="Actionable defensive steps recommended for the user.")
    processing_status: str = Field(default="completed", description="Execution status: 'completed' or 'error'.")
    execution_time_ms: float = Field(..., description="Server execution time in milliseconds.")
    timestamp: str = Field(..., description="ISO 8601 timestamp of analysis.")


class HealthResponse(BaseModel):
    status: str = Field(default="healthy")
    service: str
    version: str
    timestamp: str
    active_rules: int
    environment: str


class ScanHistoryItem(BaseModel):
    scan_id: str
    scan_type: str
    target: str
    risk_score: int
    threat_level: str
    threat_category: str
    timestamp: str


class ScanHistoryResponse(BaseModel):
    total: int
    scans: List[ScanHistoryItem]


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    status_code: int
    timestamp: str
