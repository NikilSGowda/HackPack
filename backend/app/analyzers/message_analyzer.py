"""ScamShield Message & Social Engineering Analyzer Module
Detects coercive psychological urgency, authority impersonation,
credential harvesting, and fraudulent financial lures in SMS, emails, and DMs.
"""

import re
import time
import uuid
from typing import List, Optional
from app.models.schemas import ThreatIndicator, ScanResponse
from app.analyzers.url_analyzer import SHORTENER_DOMAINS

# 1. Coercive Urgency & Threatening Language
URGENCY_PATTERNS = [
    r"\bimmediate(?:ly)?\b",
    r"\burgent(?:ly)?\b",
    r"\bwithin 24 hours\b",
    r"\bwithin 12 hours\b",
    r"\baction required\b",
    r"\baccount (?:suspended|frozen|locked|terminated|disabled)\b",
    r"\bfinal notice\b",
    r"\blegal action\b",
    r"\barrest warrant\b",
    r"\bpolice\b",
    r"\blawsuit\b",
    r"\bsuspicious activity detected\b",
    r"\bunauthorized (?:transaction|debit|charge|access)\b",
    r"\bact now\b",
    r"\btime is running out\b"
]

# 2. Credential, Identity & OTP Harvesting
CREDENTIAL_PATTERNS = [
    r"\b(?:enter|confirm|verify|submit|update|provide) your (?:password|pin|passcode)\b",
    r"\b(?:one-time|one time) (?:password|passcode|code|otp)\b",
    r"\botp\b",
    r"\bverification code\b",
    r"\b(?:ssn|social security number)\b",
    r"\b(?:credit|debit) card (?:number|details|cvv|cvc)\b",
    r"\bkyc (?:verification|update|compliance)\b",
    r"\blogin credentials\b",
    r"\bsecurity questions?\b",
    r"\bbilling address\b",
    r"\bverify your identity\b"
]

# 3. Suspicious Payment Requests & Irreversible Methods
PAYMENT_PATTERNS = [
    r"\bwire transfer\b",
    r"\bwestern union\b",
    r"\bmoneygram\b",
    r"\bgift cards?\b",
    r"\bapple gift cards?\b",
    r"\bsteam gift cards?\b",
    r"\b(?:crypto|cryptocurrency|bitcoin|btc|eth|usdt)\b",
    r"\bwallet address\b",
    r"\bcashier'?s check\b",
    r"\bnon-refundable deposit\b",
    r"\bprocessing fee\b",
    r"\bclearance fee\b",
    r"\bprepaid card\b"
]

# 4. Fake Prize, Lottery & Windfall Notifications
PRIZE_PATTERNS = [
    r"\b(?:congratulations|congrats),? you (?:have )?won\b",
    r"\bwinner\b",
    r"\blottery (?:claim|prize|winning)\b",
    r"\bcash prize\b",
    r"\bwon \$\d+\b",
    r"\binheritance\b",
    r"\bbeneficiary\b",
    r"\b100% guaranteed (?:return|profit|reward)\b",
    r"\bfree (?:money|crypto|gift|iphone)\b",
    r"\bselected (?:randomly|for exclusive reward)\b"
]

# 5. Brand & Authority Impersonation
IMPERSONATION_PATTERNS = [
    r"\b(?:irs|internal revenue service)\b",
    r"\bgeek squad\b",
    r"\bfraud (?:department|division|prevention|unit)\b",
    r"\bsecurity (?:team|department|division)\b",
    r"\b(?:chase|wells fargo|bank of america|citi) (?:alert|security|support)\b",
    r"\b(?:usps|fedex|dhl|ups) (?:delivery|notification|tracking|courier)\b",
    r"\b(?:amazon|apple|microsoft|netflix|paypal) (?:support|billing|security|care)\b",
    r"\bnorton (?:antivirus|security)\b",
    r"\bmcafee security\b"
]

# URL extraction pattern (matches http/https, www, or common bare shortener domains)
URL_REGEX = re.compile(
    r"(?:https?://[^\s]+|www\.[^\s]+|(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|tiny\.cc|cutt\.ly|ow\.ly)/[^\s]+)",
    re.IGNORECASE
)


def analyze_message(raw_text: str, sender: Optional[str] = None) -> ScanResponse:
    """Evaluates message body for manipulative social engineering and fraud markers."""
    start_time = time.perf_counter()
    text = raw_text.strip()
    lower_text = text.lower()

    indicators: List[ThreatIndicator] = []
    risk_score = 5

    # 1. Urgent & Threatening Language
    matched_urgency: List[str] = []
    for pattern in URGENCY_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            matched_urgency.extend(matches)

    if matched_urgency:
        unique_urgency = list(set(matched_urgency))
        weight = min(len(unique_urgency) * 15, 35)
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="ARTIFICIAL_URGENCY",
            title="High-Pressure Urgency Tactics Detected",
            severity="critical" if len(unique_urgency) >= 2 else "high",
            description=f"Message uses coercive stress triggers: {unique_urgency}. Attackers create panic and tight deadlines to prevent rational verification.",
            weight=float(weight),
            details={"matches": unique_urgency}
        ))

    # 2. Credential & Identity Harvesting
    matched_creds: List[str] = []
    for pattern in CREDENTIAL_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            matched_creds.extend(matches)

    if matched_creds:
        unique_creds = list(set(matched_creds))
        weight = min(len(unique_creds) * 20, 45)
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="CREDENTIAL_HARVESTING",
            title="Credential & OTP Harvesting Attempt",
            severity="critical",
            description=f"Message solicits private credentials or security tokens: {unique_creds}. Legitimate institutions never request OTPs or passwords via unsolicited messages.",
            weight=float(weight),
            details={"matches": unique_creds}
        ))

    # 3. Suspicious Payment Requests
    matched_payments: List[str] = []
    for pattern in PAYMENT_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            matched_payments.extend(matches)

    if matched_payments:
        unique_payments = list(set(matched_payments))
        weight = min(len(unique_payments) * 15, 35)
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="IRREVERSIBLE_PAYMENT",
            title="Irreversible Payment / Financial Lure",
            severity="high",
            description=f"Detected high-risk transaction requests: {unique_payments}. Wire transfers, gift cards, and crypto payments cannot be reversed once sent.",
            weight=float(weight),
            details={"matches": unique_payments}
        ))

    # 4. Fake Prize / Lottery Notification
    matched_prizes: List[str] = []
    for pattern in PRIZE_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            matched_prizes.extend(matches)

    if matched_prizes:
        unique_prizes = list(set(matched_prizes))
        weight = min(len(unique_prizes) * 15, 30)
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="FAKE_PRIZE_LOTTERY",
            title="Fake Prize or Advance-Fee Notification",
            severity="high",
            description=f"Message promises unearned windfalls or rewards: {unique_prizes}. Commonly used to entice victims into paying advance processing fees.",
            weight=float(weight),
            details={"matches": unique_prizes}
        ))

    # 5. Brand & Authority Impersonation
    matched_impersonations: List[str] = []
    for pattern in IMPERSONATION_PATTERNS:
        matches = re.findall(pattern, lower_text)
        if matches:
            matched_impersonations.extend(matches)

    if matched_impersonations:
        unique_imp = list(set(matched_impersonations))
        weight = 25
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="AUTHORITY_IMPERSONATION",
            title="Brand / Authority Impersonation",
            severity="high",
            description=f"Message claims to represent trusted entities: {unique_imp}. Attackers masquerade as corporate security or government agencies to command obedience.",
            weight=float(weight),
            details={"matches": unique_imp}
        ))

    # 6. Embedded Links & Shortener Detection
    found_links = URL_REGEX.findall(text)
    if found_links:
        has_shortener = any(any(s in link.lower() for s in SHORTENER_DOMAINS) for link in found_links)
        weight = 30 if has_shortener else 15
        risk_score += weight
        indicators.append(ThreatIndicator(
            code="EMBEDDED_SUSPICIOUS_LINK",
            title="Embedded Web Link in Message" if not has_shortener else "Embedded URL Shortener Redirector",
            severity="critical" if has_shortener else "warning",
            description=f"Message contains {len(found_links)} link(s). {'Includes an obfuscated shortener service hiding the true destination.' if has_shortener else 'Inspect destinations carefully before opening.'}",
            weight=float(weight),
            details={"links": found_links}
        ))

    # 7. Aggressive Capitalization / Screaming Text Style
    letters = re.findall(r"[a-zA-Z]", text)
    if len(letters) >= 20:
        uppercase_ratio = sum(1 for c in letters if c.isupper()) / len(letters)
        if uppercase_ratio > 0.45:
            risk_score += 15
            indicators.append(ThreatIndicator(
                code="AGGRESSIVE_STYLING",
                title="Aggressive Capitalization / Pressure Style",
                severity="info",
                description=f"Contains an unusually high proportion of uppercase characters ({int(uppercase_ratio * 100)}%), commonly used to provoke an emotional panic response.",
                weight=15.0
            ))

    final_risk = min(100, max(0, risk_score))

    # Threat Classification
    if final_risk >= 65:
        threat_level = "high_risk"
        threat_category = "Social Engineering Scam / Fraudulent Message"
    elif final_risk >= 35:
        threat_level = "suspicious"
        threat_category = "Suspicious Communication / Potential Spam"
    else:
        threat_level = "safe"
        threat_category = "Clean Communication"

    # Plain-English Explanation
    if threat_level == "high_risk":
        explanation = (
            "ScamShield NLP inspection identified classic signatures of a digital social engineering attack. "
            "The message employs artificial urgency, requests confidential authentication tokens, or demands "
            "unusual financial transactions. Do NOT reply or click any links."
        )
    elif threat_level == "suspicious":
        explanation = (
            "This communication contains patterns or embedded web links that warrant caution. "
            "Verify the legitimacy of the sender through independent channels before responding or opening links."
        )
    else:
        explanation = (
            "No hostile manipulation or phishing patterns were detected. "
            "The message displays standard conversational language with no coercive demands."
        )

    # Security Recommendations
    recommendations: List[str] = []
    if threat_level == "high_risk":
        recommendations.append("Do NOT reply, call phone numbers in the message, or click embedded links.")
        recommendations.append("Never disclose one-time passwords (OTPs), PINs, or card CVVs over message or call.")
        recommendations.append("Forward suspicious SMS messages to 7726 (SPAM) to alert carrier anti-fraud networks.")
        recommendations.append("Block the sender's phone number or email address on your device.")
    elif threat_level == "suspicious":
        recommendations.append("Verify unexpected notices directly with the organization using known official contact details.")
        recommendations.append("Do not rely on sender caller ID or display names, which can be easily spoofed.")
    else:
        recommendations.append("Continue practicing standard cybersecurity hygiene.")
        recommendations.append("Remember that legitimate companies will never ask for your password in a message.")

    execution_time = round((time.perf_counter() - start_time) * 1000, 2)
    truncated_target = (text[:80] + "...") if len(text) > 80 else text

    return ScanResponse(
        scan_id=f"msg-{uuid.uuid4().hex[:12]}",
        scan_type="message",
        target=truncated_target,
        risk_score=final_risk,
        threat_level=threat_level,
        threat_category=threat_category,
        detected_indicators=indicators,
        explanation=explanation,
        security_recommendations=recommendations,
        processing_status="completed",
        execution_time_ms=execution_time,
        timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    )
