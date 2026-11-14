"""Secure Logging Module
Provides PII redaction and cryptographic hashing of scanned targets
to prevent sensitive user inputs (e.g. passwords, OTPs, SSNs) from
being recorded in application logs.
"""

import re
import hashlib
import logging
import sys
from typing import Optional

# Setup standard logger
logger = logging.getLogger("scamshield")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] [ScamShield] %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# PII Redaction Patterns
CREDIT_CARD_REGEX = re.compile(r"\b(?:\d[ -]*?){13,19}\b")
SSN_REGEX = re.compile(r"\b\d{3}[- ]?\d{2}[- ]?\d{4}\b")
PHONE_REGEX = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
EMAIL_REGEX = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PASSWORD_REGEX = re.compile(r"(?i)(password|pass|pin|otp|secret)[\s:=]+([^\s,;]+)")


def redact_pii(text: str) -> str:
    """Masks personally identifiable information before logging."""
    if not text:
        return ""
    text = PASSWORD_REGEX.sub(r"\1=***REDACTED***", text)
    text = CREDIT_CARD_REGEX.sub("[CARD_REDACTED]", text)
    text = SSN_REGEX.sub("[SSN_REDACTED]", text)
    text = EMAIL_REGEX.sub("[EMAIL_REDACTED]", text)
    text = PHONE_REGEX.sub("[PHONE_REDACTED]", text)
    return text


def hash_target(target: str) -> str:
    """Generates SHA-256 digest of input target for audit logging without storing raw content."""
    return hashlib.sha256(target.strip().encode("utf-8", errors="ignore")).hexdigest()


def log_safe_scan(
    scan_id: str,
    scan_type: str,
    target_content: str,
    risk_score: int,
    threat_level: str,
    client_ip: Optional[str] = "unknown"
):
    """Safely logs a scan event with target hash and redacted summary."""
    target_digest = hash_target(target_content)
    logger.info(
        f"Scan Completed | id={scan_id} | type={scan_type} | client_ip={client_ip} "
        f"| target_hash={target_digest[:12]}... | risk_score={risk_score} | threat_level={threat_level}"
    )
