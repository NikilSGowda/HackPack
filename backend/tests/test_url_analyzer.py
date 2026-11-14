"""Unit Tests for Passive URL Analyzer"""

import pytest
from app.analyzers.url_analyzer import (
    analyze_url,
    calculate_entropy,
    is_ip_address,
    detect_homoglyphs,
    defang_url
)


def test_defang_url():
    assert defang_url("https://example.com") == "hxxps://example[.]com"
    assert defang_url("http://test.org/path") == "hxxp://test[.]org/path"
    assert defang_url("ftp://server.net") == "ftp://server[.]net"


def test_is_ip_address():
    assert is_ip_address("192.168.1.1") is True
    assert is_ip_address("185.220.101.5") is True
    assert is_ip_address("google.com") is False
    assert is_ip_address("secure-chase.xyz") is False


def test_entropy_calculation():
    # Repetitive characters should have 0 entropy
    assert calculate_entropy("aaaaaaa") == 0.0
    # High randomness should have higher entropy
    random_str = "x8f93kq10al9"
    assert calculate_entropy(random_str) > 3.0


def test_homoglyph_detection():
    # Cyrillic small 'a' (U+0430) disguised as Latin 'a'
    cyrillic_paypal = "p\u0430ypal.com"
    has_homo, is_puny, flags, normalized = detect_homoglyphs(cyrillic_paypal)
    assert has_homo is True
    assert normalized == "paypal.com"
    assert len(flags) == 1
    assert flags[0]["spoofing"] == "a"


def test_punycode_detection():
    puny_domain = "xn--pypal-4ve.com"
    has_homo, is_puny, flags, normalized = detect_homoglyphs(puny_domain)
    assert is_puny is True


def test_analyze_ip_hostname():
    res = analyze_url("http://185.220.101.5/admin/login.php")
    assert res.risk_score >= 60
    assert res.threat_level == "high_risk" or res.threat_level == "suspicious"
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "IP_HOSTNAME" in indicator_codes
    assert "UNENCRYPTED_HTTP" in indicator_codes


def test_analyze_homoglyph_phishing():
    # Using Cyrillic 'a'
    res = analyze_url("https://p\u0430ypal.com/signin")
    assert res.risk_score >= 70
    assert res.threat_level == "high_risk"
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "HOMOGLYPH_PUNYCODE" in indicator_codes


def test_analyze_shortener():
    res = analyze_url("https://bit.ly/urgent-account-reset")
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "URL_SHORTENER" in indicator_codes


def test_https_does_not_guarantee_safe():
    res = analyze_url("https://github.com/torvalds/linux")
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "HTTPS_ACTIVE" in indicator_codes
    # Verified safe overall
    assert res.threat_level == "safe"
    assert res.risk_score < 35
    # Check that explanation or indicator mentions that HTTPS only encrypts
    https_ind = next(ind for ind in res.detected_indicators if ind.code == "HTTPS_ACTIVE")
    assert "DOES NOT guarantee" in https_ind.description


def test_at_symbol_obfuscation():
    res = analyze_url("https://google.com@attacker-site.xyz/login")
    assert res.risk_score >= 70
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "AT_SYMBOL_OBFUSCATION" in indicator_codes
