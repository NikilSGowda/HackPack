# ScamShield 🛡️
### Intelligent Digital Scam, Phishing URL & Fraudulent Message Detection System

ScamShield is an educational and defensive cybersecurity application designed to evaluate potential online threats including phishing URLs, fraudulent SMS messages, scam emails, lookalike domains, and deceptive QR codes (quishing).

---

## 🚀 Live Development Servers

Both servers are active and running:
- **Frontend (React + Vite):** [http://localhost:5173/](http://localhost:5173/)
- **Backend API (FastAPI):** [http://localhost:8000/](http://localhost:8000/)
- **Interactive Swagger Documentation:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interactive ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Quick Commands

```powershell
# Start Frontend Dev Server
cd c:\nikil\frontend
npm run dev

# Start FastAPI Backend Server
cd c:\nikil\backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run Automated Test Suite (28 unit & integration tests)
cd c:\nikil\backend
python -m pytest -v
```

---

## 🛡️ FastAPI Backend Endpoints & Architecture (Phase 2 Completed)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/scan/url` | Passive structural inspection of target URL (Punycode, homoglyphs, IP hostnames, Shannon entropy, brand spoofing). **Never visits or executes untrusted targets.** |
| `POST` | `/api/scan/message` | Analyzes SMS, emails, or DMs for coercive urgency deadlines, credential/OTP requests, fake prize notifications, and irreversible financial lures. |
| `GET` | `/api/health` | Service health status, environment, and active defense rule count. |
| `GET` | `/api/history` | Retrieves recent scan history records with risk scores and classifications. |
| `GET` | `/docs` | Interactive Swagger UI API documentation and testing interface. |

### Security Safeguards Implemented
1. **Passive Inspection Shield:** Zero outbound HTTP or socket connections are initiated to scanned target URLs, preventing Server-Side Request Forgery (SSRF) and malware triggers.
2. **PII Masking & Safe Logging:** Sensitive credentials (passwords, PINs, OTPs, SSNs, credit cards) are automatically redacted before logging. Audits log target SHA-256 digests rather than raw content.
3. **In-Memory Rate Limiting:** Sliding-window token bucket limiter enforcing client IP limits (60 req/min) returning HTTP 429 with `Retry-After` headers.
4. **Input Sanitization & Validation:** Pydantic models with strict character checks (blocking null bytes, control characters, and enforcing length bounds).
5. **HTTPS Clarification:** Explicitly documents that HTTPS only guarantees encrypted transport and does **not** guarantee a site is safe or legitimate (over 80% of phishing sites use free SSL certificates).

---

## 🌟 Implemented Pages & Features (Phase 1 & Phase 2)

### 1. Landing Page
- Application introduction with cyber glow aesthetic.
- 4-step detection pipeline visualization (Input Sanitization → Heuristics & Entropy → Composite Risk Scoring → Plain-English Guidance).
- Quick navigation into scanners, threat lab, and dashboard.
- Educational cybersecurity disclaimer.

### 2. Live Cyber Threat Dashboard
- **Real-Time Telemetry Cards:** Total scans, verified safe targets, suspicious warnings, and critical threats blocked.
- **7-Day Trend Chart:** Interactive Recharts area chart comparing query volume vs. threat detection frequency.
- **Threat Categories Donut Chart:** Categorization across Credential Harvesting, Financial Lures, Homoglyphs, Delivery Scams, and Authority Impersonation.
- **Recent Activity Feed:** Live log of inspected targets with one-click forensic report inspection.

### 3. Phishing & Malicious URL Scanner
- Input field with RFC URL validation and auto-protocol normalization.
- 1-click test scenarios: Fake Chase Bank, Punycode PayPal, Raw IP Phishing Host, Legitimate GitHub, Obfuscated Bitly Shortlink.
- Deep inspection toggles: IDN Homoglyphs, Shannon character entropy (DGA detection), deep subdomain nesting, and risky TLD reputation.
- Automated URL defanging (e.g. `hxxps://example[.]com`) to prevent accidental malware clicks.
- Cyber radar scanning animation with celebratory confetti upon 100% verified safe domains.

### 4. SMS & Email Message Deception Scanner
- Multi-line message analyzer with character counter.
- Evaluates psychological coercion markers, artificial urgency deadlines ("account suspended within 24 hours"), credential harvesting prompts ("enter PIN / OTP"), and irreversible payment requests (wire transfer, gift cards, crypto).
- 1-click test scenarios: USPS Failed Delivery SMS, Bank Freeze Threat, CEO Urgent Wire Request, Legitimate Coworker Email.

### 5. Quishing (QR Code Phishing) Defense Inspector *(Unique Feature)*
- Tests physical and visual QR code threat vectors.
- Interactive scenarios: Parking Meter Superimposed Sticker, Fake Restaurant Tabletop QR, Legitimate EV Charging Station.
- Extracts and passes decoded hyperlink targets to the ScamShield defensive engine.

### 6. Interactive Threat Lab / Phishing Simulator *(Unique Feature)*
- Game-based educational simulator where users inspect simulated smartphone SMS and email transmissions.
- Predicts whether communications are Safe or a Scam.
- Reveals forensic red flags, attacker psychology breakdown, and tracks defensive accuracy score.

### 7. Digital Scam Encyclopedia *(Knowledge Base)*
- Searchable reference articles covering Phishing, Smishing, Quishing, IDN Homoglyphs, Business Email Compromise (BEC), and Pig Butchering.
- Telltale signs, red flags, and defensive checklists.

### 8. Comprehensive Security Evaluation & Scan History
- Circular SVG risk gauge (0 to 100 composite risk index).
- Warning indicators with severity tags (Critical, High, Warning, Info).
- Plain-English threat summary explaining *how* the attack tricks victims.
- Interactive Remediation Checklist with checkable steps.
- Homoglyph visualizer displaying character-by-character Unicode spoofing.
- Filterable and searchable history table with JSON export and history clearing.

### 9. Theme & Cyber Audio Engine
- Cyber Dark Mode (default) and Clean Light Mode.
- Web Audio API synthesizer for cyber audio feedback (subtle radar blips on safe, alert tones on high-risk threats; can be muted).
- Persistent state in `localStorage`.

---

## 🛣️ Phased Roadmap

- **Phase 1 (Completed):** Complete React + Vite + Tailwind CSS frontend with high-fidelity client-side defensive heuristics and interactive modules.
- **Phase 2 (Next Step):** Python FastAPI backend with Pydantic schemas, SSRF-hardened domain resolvers, and passive threat intelligence feed integration.
- **Phase 3:** Machine learning NLP classifier (Scikit-Learn TF-IDF pipeline) and Gemini API plain-English explanation integration.
- **Phase 4:** SQLAlchemy SQLite / PostgreSQL database persistence with user accounts and team threat dashboards.
- **Phase 5:** End-to-end integration, rate limiting, and deployment hardening.
