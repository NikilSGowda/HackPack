"""Unit Tests for Message & Social Engineering Analyzer"""

import pytest
from app.analyzers.message_analyzer import analyze_message


def test_benign_message():
    clean_text = "Hi Mark, please review the quarterly budget spreadsheet before our team standup tomorrow. Thanks!"
    res = analyze_message(clean_text)
    assert res.threat_level == "safe"
    assert res.risk_score < 35
    assert len(res.detected_indicators) == 0


def test_coercive_urgency():
    urgent_text = "URGENT ACTION REQUIRED: Your account is suspended immediately within 24 hours unless you act now."
    res = analyze_message(urgent_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "ARTIFICIAL_URGENCY" in indicator_codes
    assert res.risk_score >= 35


def test_credential_and_otp_harvesting():
    harvest_text = "Please enter your password, PIN, and share your one-time password OTP to verify your identity."
    res = analyze_message(harvest_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "CREDENTIAL_HARVESTING" in indicator_codes
    assert res.risk_score >= 45


def test_irreversible_payment_request():
    payment_text = "Kindly send an urgent wire transfer of $1,000 using Western Union or Apple gift cards to clear fee."
    res = analyze_message(payment_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "IRREVERSIBLE_PAYMENT" in indicator_codes


def test_fake_prize_lottery():
    prize_text = "Congratulations, you have won $50,000 in the international cash prize lottery! 100% guaranteed reward."
    res = analyze_message(prize_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "FAKE_PRIZE_LOTTERY" in indicator_codes


def test_authority_impersonation():
    impersonation_text = "This is the IRS Fraud Department alerting you of an urgent lawsuit regarding unpaid federal taxes."
    res = analyze_message(impersonation_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "AUTHORITY_IMPERSONATION" in indicator_codes


def test_embedded_shortener_link():
    link_text = "Your USPS parcel is delayed. Click bit.ly/usps-track to resolve immediately."
    res = analyze_message(link_text)
    indicator_codes = [ind.code for ind in res.detected_indicators]
    assert "EMBEDDED_SUSPICIOUS_LINK" in indicator_codes
    assert res.threat_level in ["suspicious", "high_risk"]
    assert res.risk_score >= 45
