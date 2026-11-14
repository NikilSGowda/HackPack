"""ScamShield Passive URL Analyzer Module
Provides passive structural and lexical evaluation of web addresses
WITHOUT visiting, executing, or initiating outbound network traffic
to untrusted targets.
"""

import math
import re
import socket
import time
import uuid
from typing import Dict, List, Tuple, Any, Optional
from urllib.parse import urlparse, unquote

from app.models.schemas import ThreatIndicator, ScanResponse

# Confusable Homoglyphs (Cyrillic & Greek lookalikes)
HOMOGLYPH_MAP: Dict[str, str] = {
    "\u0430": "a",  # Cyrillic small letter a
    "\u0441": "c",  # Cyrillic small letter es
    "\u0435": "e",  # Cyrillic small letter ie
    "\u0456": "i",  # Cyrillic small letter byelorussian-ukrainian i
    "\u0458": "j",  # Cyrillic small letter je
    "\u043e": "o",  # Cyrillic small letter o
    "\u0440": "p",  # Cyrillic small letter er
    "\u0455": "s",  # Cyrillic small letter dze
    "\u0443": "y",  # Cyrillic small letter u
    "\u0445": "x",  # Cyrillic small letter ha
    "\u03bf": "o",  # Greek small letter omicron
    "\u03b1": "a",  # Greek small letter alpha
    "\u03c1": "p",  # Greek small letter rho
    "\u03bd": "v",  # Greek small letter nu
}

SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "click", "buzz", "fit", "surf", "rest", "tk",
    "ml", "cf", "gq", "cc", "su", "ru", "cam", "country", "stream", "gdn",
    "monster", "link", "live", "icu", "vip", "quest", "cfd", "sbs"
}

KNOWN_TARGET_BRANDS = [
    "paypal", "apple", "microsoft", "google", "amazon", "chase", "wellsfargo",
    "bankofamerica", "citi", "netflix", "binance", "coinbase", "metamask",
    "facebook", "instagram", "whatsapp", "usps", "fedex", "dhl", "irs",
    "steam", "discord", "telegram", "roblox", "epicgames", "att", "verizon"
]

PHISHING_KEYWORDS = [
    "login", "verify", "update", "secure", "account", "banking", "wallet",
    "confirm", "signin", "auth", "recovery", "validate", "unlock", "security",
    "billing", "support", "dispute", "kyc", "reactivate", "suspended"
]

SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "buff.ly",
    "ow.ly", "rebrand.ly", "cutt.ly", "shorturl.at", "tiny.cc"
}


def defang_url(url: str) -> str:
    """Replaces protocols and dots with defanged syntax to prevent accidental execution."""
    if not url:
        return ""
    result = re.sub(r"^https://", "hxxps://", url, flags=re.IGNORECASE)
    result = re.sub(r"^http://", "hxxp://", result, flags=re.IGNORECASE)
    return result.replace(".", "[.]")


def calculate_entropy(text: str) -> float:
    """Calculates Shannon entropy to detect algorithmic randomness (DGA domains)."""
    if not text:
        return 0.0
    freq: Dict[str, int] = {}
    length = len(text)
    for char in text:
        freq[char] = freq.get(char, 0) + 1
    entropy = 0.0
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return round(entropy, 2)


def is_ip_address(hostname: str) -> bool:
    """Checks if a hostname is an IPv4 or IPv6 address."""
    clean_host = hostname.strip("[]")
    try:
        socket.inet_aton(clean_host)
        return True
    except socket.error:
        pass
    try:
        socket.inet_pton(socket.AF_INET6, clean_host)
        return True
    except (socket.error, AttributeError, OSError):
        pass
    return False


def detect_homoglyphs(domain: str) -> Tuple[bool, bool, List[Dict[str, str]], str]:
    """Identifies confusable characters (IDN homograph attack) and Punycode notation."""
    contains_homoglyph = False
    flags: List[Dict[str, str]] = []
    normalized_chars: List[str] = []

    for char in domain:
        if char in HOMOGLYPH_MAP:
            contains_homoglyph = True
            flags.append({
                "char": char,
                "spoofing": HOMOGLYPH_MAP[char],
                "unicode": f"U+{ord(char):04X}"
            })
            normalized_chars.append(HOMOGLYPH_MAP[char])
        else:
            normalized_chars.append(char)

    is_punycode = domain.lower().startswith("xn--") or ".xn--" in domain.lower()
    return contains_homoglyph, is_punycode, flags, "".join(normalized_chars)


def levenshtein_distance(s1: str, s2: str) -> int:
    """Calculates edit distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


def analyze_url(raw_url: str) -> ScanResponse:
    """Performs passive, non-interactive structural and lexical threat inspection."""
    start_time = time.perf_counter()
    url = raw_url.strip()

    # Prepend scheme if omitted for reliable parsing
    has_explicit_scheme = bool(re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url))
    parse_target = url if has_explicit_scheme else f"http://{url}"

    parsed = urlparse(parse_target)
    hostname = (parsed.hostname or "").lower()
    scheme = parsed.scheme.lower() if has_explicit_scheme else "none"
    path = parsed.path
    query = parsed.query
    full_path = f"{path}?{query}" if query else path

    indicators: List[ThreatIndicator] = []
    risk_score = 5  # Baseline score

    # 1. IP Address Hostname Inspection
    if is_ip_address(hostname):
        risk_score += 45
        indicators.append(ThreatIndicator(
            code="IP_HOSTNAME",
            title="Direct IP Address Hostname",
            severity="critical",
            description="The URL connects directly to a numeric IP address rather than a registered domain name. Legitimate web services virtually never direct users to raw IP addresses.",
            weight=45.0
        ))

    # 2. HTTPS Evaluation (Explicit Security Clarification)
    if scheme == "http":
        risk_score += 15
        indicators.append(ThreatIndicator(
            code="UNENCRYPTED_HTTP",
            title="Unencrypted HTTP Connection",
            severity="warning",
            description="Connection lacks TLS/SSL encryption. Data entered on this page can be intercepted in transit.",
            weight=15.0
        ))
    elif scheme == "https":
        indicators.append(ThreatIndicator(
            code="HTTPS_ACTIVE",
            title="HTTPS Transport Encryption Active",
            severity="info",
            description="Connection utilizes TLS/SSL. Important: HTTPS only encrypts communication; over 80% of phishing sites use free SSL certificates. HTTPS alone DOES NOT guarantee legitimacy.",
            weight=0.0
        ))

    # 3. IDN Homoglyph / Punycode Inspection
    has_homoglyphs, is_punycode, homoglyph_flags, normalized_domain = detect_homoglyphs(hostname)
    if has_homoglyphs or is_punycode:
        risk_score += 50
        indicators.append(ThreatIndicator(
            code="HOMOGLYPH_PUNYCODE",
            title="Lookalike / Homograph Domain Character Detected",
            severity="critical",
            description=f"Domain contains confusable characters or Punycode encoding spoofing familiar brand '{normalized_domain}'. Attackers use this to forge visually identical domains.",
            weight=50.0,
            details={"flags": homoglyph_flags, "normalized": normalized_domain}
        ))

    # 4. URL Shortener Service
    if hostname in SHORTENER_DOMAINS:
        risk_score += 25
        indicators.append(ThreatIndicator(
            code="URL_SHORTENER",
            title="Obfuscated URL Shortener Service",
            severity="warning",
            description=f"Destination address is concealed behind redirector '{hostname}'. Attackers use shorteners to bypass automated scanning and hide final payloads.",
            weight=25.0
        ))

    # 5. Suspicious URL Encoding & @ Credential Exploitation
    if "@" in parse_target.split("/")[2] if len(parse_target.split("/")) > 2 else "@" in parse_target:
        risk_score += 40
        indicators.append(ThreatIndicator(
            code="AT_SYMBOL_OBFUSCATION",
            title="Embedded Userinfo '@' Symbol in URL",
            severity="critical",
            description="URL contains an '@' character in the authority section. Browsers ignore everything before '@' and route the victim to the host immediately following it.",
            weight=40.0
        ))

    if "%25" in raw_url:
        risk_score += 25
        indicators.append(ThreatIndicator(
            code="DOUBLE_URL_ENCODING",
            title="Suspicious Double URL Encoding Detected",
            severity="high",
            description="URL contains double-percent encoding ('%25'), commonly used to evade basic string-matching web filters and WAF rules.",
            weight=25.0
        ))

    hex_encoded = re.findall(r"%[0-9a-fA-F]{2}", raw_url)
    if len(hex_encoded) >= 4:
        risk_score += 15
        indicators.append(ThreatIndicator(
            code="EXCESSIVE_HEX_ENCODING",
            title="Excessive Hex URL Encoding",
            severity="warning",
            description=f"URL contains {len(hex_encoded)} hex-encoded character tokens, frequently used to obscure deceptive filenames or script endpoints.",
            weight=15.0
        ))

    # 6. Subdomain Depth & Brand Packing
    host_parts = hostname.split(".")
    tld = host_parts[-1] if host_parts else ""
    registered_domain = ".".join(host_parts[-2:]) if len(host_parts) >= 2 else hostname

    if len(host_parts) >= 4:
        risk_score += 25
        indicators.append(ThreatIndicator(
            code="EXCESSIVE_SUBDOMAINS",
            title="Unusual Subdomain Nesting Depth",
            severity="high",
            description=f"Hostname contains {len(host_parts) - 2} subdomain layers ({hostname}). Attackers nest trusted brand names as subdomains (e.g. chase.bank.customer.attacker-domain.com).",
            weight=25.0
        ))

    # 7. Brand Impersonation / Typosquatting
    impersonated_brand: Optional[str] = None
    for brand in KNOWN_TARGET_BRANDS:
        # Check if brand appears in hostname but is not the legitimate registered domain
        if brand in hostname and not registered_domain.startswith(f"{brand}."):
            impersonated_brand = brand
            break
        # Check for slight edit distance (typosquatting like 'paypa1' or 'arnazon')
        main_label = host_parts[0] if host_parts else ""
        if len(brand) >= 5 and 1 <= levenshtein_distance(main_label, brand) <= 2:
            impersonated_brand = brand
            break

    if impersonated_brand:
        risk_score += 40
        indicators.append(ThreatIndicator(
            code="BRAND_IMPERSONATION",
            title=f"Potential Brand Spoofing ({impersonated_brand.upper()})",
            severity="critical",
            description=f"The domain references brand '{impersonated_brand}', but is registered under an unrelated entity '{registered_domain}'.",
            weight=40.0
        ))

    # 8. Authentication & Credential Trap Keywords
    found_keywords = [kw for kw in PHISHING_KEYWORDS if kw in hostname or kw in full_path.lower()]
    if found_keywords:
        kw_weight = min(len(found_keywords) * 10, 25)
        risk_score += kw_weight
        indicators.append(ThreatIndicator(
            code="CREDENTIAL_KEYWORDS",
            title="Authentication & Account Traps In Path",
            severity="high" if len(found_keywords) >= 2 else "warning",
            description=f"Target URL contains high-risk authentication keywords: {found_keywords}. Attackers use these patterns to build phishing landing pages.",
            weight=float(kw_weight)
        ))

    # 9. Shannon Entropy (Random String / DGA Detection)
    domain_entropy = calculate_entropy(hostname.replace(".", ""))
    if domain_entropy > 3.9 and len(hostname) > 13:
        risk_score += 20
        indicators.append(ThreatIndicator(
            code="HIGH_ENTROPY_DOMAIN",
            title=f"High Character Shannon Entropy ({domain_entropy})",
            severity="warning",
            description="Domain name exhibits unusually high algorithmic character randomness, consistent with Domain Generation Algorithms (DGA) or disposable throwaway domains.",
            weight=20.0
        ))

    # 10. Dangerous TLD Reputation
    if tld in SUSPICIOUS_TLDS:
        risk_score += 25
        indicators.append(ThreatIndicator(
            code="SUSPICIOUS_TLD",
            title=f"High-Risk Top-Level Domain (.{tld})",
            severity="warning",
            description=f"The '.{tld}' top-level domain exhibits historically elevated rates of phishing campaigns, spam hosting, and disposable malware distribution.",
            weight=25.0
        ))

    # 11. Hyphen Overuse & Length
    hyphen_count = hostname.count("-")
    if hyphen_count >= 3:
        risk_score += 15
        indicators.append(ThreatIndicator(
            code="HYPHEN_OVERUSE",
            title="Excessive Hyphenation in Domain",
            severity="info",
            description=f"Domain contains {hyphen_count} hyphens. Fraudulent domains frequently string keywords together with hyphens to create deceptive naming.",
            weight=15.0
        ))

    if len(raw_url) > 85:
        risk_score += 10
        indicators.append(ThreatIndicator(
            code="LONG_URL_LENGTH",
            title="Abnormally Long URL Structure",
            severity="info",
            description=f"URL is {len(raw_url)} characters long, commonly used in phishing campaigns to push malicious parameters off-screen on mobile devices.",
            weight=10.0
        ))

    # Clamp composite score
    final_risk = min(100, max(0, risk_score))

    # Classification
    if final_risk >= 70:
        threat_level = "high_risk"
        threat_category = f"Brand Spoofing ({impersonated_brand.upper()})" if impersonated_brand else "Credential Phishing / Malicious Host"
    elif final_risk >= 35:
        threat_level = "suspicious"
        threat_category = "Suspicious Domain / Potential Scam"
    else:
        threat_level = "safe"
        threat_category = "Low Risk / Standard Web Domain"

    # Plain-English Explanation
    if threat_level == "high_risk":
        explanation = (
            "ScamShield passive analysis flagged critical deception indicators on this URL. "
            "It exhibits patterns typical of malicious infrastructure designed to harvest credentials or install malware. "
            "Do not navigate to this address or submit any personal information."
        )
    elif threat_level == "suspicious":
        explanation = (
            "This web address exhibits multiple anomalies (such as high-risk TLD, unusual character randomness, or complex subdomains) "
            "that depart from standard legitimate websites. Exercise extreme caution."
        )
    else:
        explanation = (
            "Passive structural analysis found no significant deception signals. "
            "The domain structure, character entropy, and naming patterns align with standard legitimate websites."
        )

    # Security Recommendations
    recommendations: List[str] = []
    if threat_level == "high_risk":
        recommendations.append("Do NOT visit this website or input any passwords, banking details, or identity credentials.")
        recommendations.append("If you previously entered credentials on this site, immediately change your password on the genuine official portal.")
        recommendations.append("Report this domain to the Anti-Phishing Working Group (APWG) at reportphishing@apwg.org.")
    elif threat_level == "suspicious":
        recommendations.append("Inspect the exact spelling of the domain in your address bar before proceeding.")
        recommendations.append("Access sensitive accounts via your own bookmarks or official mobile apps rather than following links.")
        recommendations.append("Remember: HTTPS alone does not guarantee that a website is legitimate or safe.")
    else:
        recommendations.append("Ensure your browser displays a valid lock icon and verify the domain name spelling.")
        recommendations.append("Maintain Multi-Factor Authentication (MFA) enabled on your accounts.")

    execution_time = round((time.perf_counter() - start_time) * 1000, 2)

    return ScanResponse(
        scan_id=f"url-{uuid.uuid4().hex[:12]}",
        scan_type="url",
        target=defang_url(raw_url),
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
