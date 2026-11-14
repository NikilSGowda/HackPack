/**
 * ScamShield Client-Side Defensive Heuristics Engine
 * Provides immediate, offline-capable analysis of URLs and messages
 * using cybersecurity heuristics, entropy calculations, and pattern matching.
 */

// Known confusable characters mapping (Cyrillic, Greek, Latin lookalikes)
const HOMOGLYPH_MAP = {
  '\u0430': 'a', // Cyrillic small letter a
  '\u0441': 'c', // Cyrillic small letter es
  '\u0435': 'e', // Cyrillic small letter ie
  '\u0456': 'i', // Cyrillic small letter byelorussian-ukrainian i
  '\u0458': 'j', // Cyrillic small letter je
  '\u043e': 'o', // Cyrillic small letter o
  '\u0440': 'p', // Cyrillic small letter er
  '\u0455': 's', // Cyrillic small letter dze
  '\u0443': 'y', // Cyrillic small letter u
  '\u0445': 'x', // Cyrillic small letter ha
  '\u03bf': 'o', // Greek small letter omicron
  '\u03b1': 'a', // Greek small letter alpha
  '\u03c1': 'p', // Greek small letter rho
  '\u03bd': 'v', // Greek small letter nu
};

const SUSPICIOUS_TLDS = [
  'xyz', 'top', 'work', 'click', 'buzz', 'fit', 'surf', 'rest', 'tk',
  'ml', 'cf', 'gq', 'cc', 'su', 'ru', 'cam', 'country', 'stream', 'gdn',
  'monster', 'link', 'live', 'icu', 'vip', 'quest', 'cfd', 'sbs'
];

const TARGET_BRANDS = [
  'paypal', 'apple', 'microsoft', 'google', 'amazon', 'chase', 'wellsfargo',
  'bankofamerica', 'citi', 'netflix', 'binance', 'coinbase', 'metamask',
  'facebook', 'instagram', 'whatsapp', 'usps', 'fedex', 'dhl', 'irs',
  'steam', 'discord', 'telegram', 'roblox', 'epicgames', 'att', 'verizon'
];

const PHISHING_KEYWORDS = [
  'login', 'verify', 'update', 'secure', 'account', 'banking', 'wallet',
  'confirm', 'signin', 'auth', 'recovery', 'validate', 'unlock', 'security',
  'billing', 'support', 'dispute', 'kyc', 'reactivate', 'suspended'
];

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly',
  'ow.ly', 'rebrand.ly', 'cutt.ly', 'shorturl.at'
];

/**
 * Calculates Shannon entropy of a string (measures character randomness)
 */
export function calculateShannonEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = str[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

/**
 * Defang a URL so it cannot be accidentally clicked in security reports
 * e.g., https://bad.com -> hxxps://bad[.]com
 */
export function defangUrl(url) {
  if (!url) return '';
  return url
    .replace(/^https:\/\//i, 'hxxps://')
    .replace(/^http:\/\//i, 'hxxp://')
    .replace(/\./g, '[.]');
}

/**
 * Detects homoglyphs and punycode spoofing in a domain name
 */
export function detectHomoglyphs(domain) {
  const flags = [];
  let containsHomoglyph = false;
  let normalized = '';

  for (const char of domain) {
    if (HOMOGLYPH_MAP[char]) {
      containsHomoglyph = true;
      flags.push({
        char,
        spoofing: HOMOGLYPH_MAP[char],
        unicode: `U+${char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()}`
      });
      normalized += HOMOGLYPH_MAP[char];
    } else {
      normalized += char;
    }
  }

  const isPunycode = domain.toLowerCase().startsWith('xn--') || domain.includes('.xn--');

  return {
    containsHomoglyph,
    isPunycode,
    flags,
    normalized,
  };
}

/**
 * Comprehensive URL Analysis Engine
 */
export function analyzeUrl(rawInput) {
  const startTime = performance.now();
  let input = (rawInput || '').trim();

  // Normalize protocol if omitted
  let protocolOmitted = false;
  if (!/^https?:\/\//i.test(input)) {
    protocolOmitted = true;
    input = 'http://' + input;
  }

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format. Please provide a well-formed web address (e.g., https://example.com).',
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(':', '').toLowerCase();
  const pathname = parsed.pathname;
  const search = parsed.search;
  const fullPath = pathname + search;

  const indicators = [];
  let riskScore = 5; // Baseline low risk

  // 1. IP Address Hostname Detection
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const isDirectIp = ipRegex.test(hostname);
  if (isDirectIp) {
    riskScore += 45;
    indicators.push({
      id: 'IP_HOSTNAME',
      title: 'Direct IP Address Hostname',
      severity: 'critical',
      description: 'The URL uses a raw IP address instead of a registered domain name. Legitimate services virtually never ask customers to log in to numeric IP hosts.',
      weight: 45,
    });
  }

  // 2. Protocol Security (HTTP vs HTTPS)
  if (protocol === 'http' && !protocolOmitted) {
    riskScore += 15;
    indicators.push({
      id: 'UNENCRYPTED_HTTP',
      title: 'Unencrypted HTTP Protocol',
      severity: 'warning',
      description: 'The connection lacks SSL/TLS encryption. Sensitive credentials or forms submitted over HTTP can be intercepted in transit.',
      weight: 15,
    });
  }

  // 3. Homoglyph / Punycode Inspection
  const homoglyphResult = detectHomoglyphs(hostname);
  if (homoglyphResult.containsHomoglyph || homoglyphResult.isPunycode) {
    riskScore += 50;
    indicators.push({
      id: 'HOMOGLYPH_SPOOF',
      title: 'IDN Homograph / Lookalike Domain Attack Detected',
      severity: 'critical',
      description: `Target domain contains non-standard characters disguised as familiar letters (e.g., Cyrillic confusables or punycode xn--). Attacker is likely impersonating ${homoglyphResult.normalized}.`,
      weight: 50,
      details: homoglyphResult.flags,
    });
  }

  // 4. Subdomain Depth Analysis
  const hostParts = hostname.split('.');
  const tld = hostParts.slice(-1)[0];
  const domainOnly = hostParts.length >= 2 ? hostParts.slice(-2).join('.') : hostname;

  if (hostParts.length >= 4) {
    riskScore += 25;
    indicators.push({
      id: 'EXCESSIVE_SUBDOMAINS',
      title: 'Deep Subdomain Nesting',
      severity: 'high',
      description: `Domain contains ${hostParts.length - 2} subdomain layers (${hostname}). Phishers often nest brand names in subdomains (e.g. chase.bank.customer.attacker-domain.com) to deceive mobile viewers.`,
      weight: 25,
    });
  }

  // 5. Suspicious TLD Reputation
  if (SUSPICIOUS_TLDS.includes(tld)) {
    riskScore += 25;
    indicators.push({
      id: 'SUSPICIOUS_TLD',
      title: `High-Risk Top-Level Domain (.${tld})`,
      severity: 'warning',
      description: `The .${tld} top-level domain exhibits high historical abuse rates in automated phishing campaigns and malware distribution.`,
      weight: 25,
    });
  }

  // 6. Brand Impersonation / Typosquatting in Subdomains
  const impersonatedBrand = TARGET_BRANDS.find(brand => {
    // Check if brand appears in hostname, but isn't the primary registered domain
    return hostname.includes(brand) && !domainOnly.startsWith(brand + '.');
  });

  if (impersonatedBrand) {
    riskScore += 40;
    indicators.push({
      id: 'BRAND_IMPERSONATION',
      title: `Potential Brand Impersonation (${impersonatedBrand.toUpperCase()})`,
      severity: 'critical',
      description: `The domain references the brand "${impersonatedBrand}" in its prefix or subdomain, but is registered under an unrelated entity (${domainOnly}).`,
      weight: 40,
    });
  }

  // 7. Phishing Keywords in Path or Host
  const foundKeywords = PHISHING_KEYWORDS.filter(kw => hostname.includes(kw) || fullPath.toLowerCase().includes(kw));
  if (foundKeywords.length > 0) {
    const kwWeight = Math.min(foundKeywords.length * 10, 25);
    riskScore += kwWeight;
    indicators.push({
      id: 'CREDENTIAL_KEYWORDS',
      title: 'Authentication & Credential Traps In URL',
      severity: foundKeywords.length >= 2 ? 'high' : 'warning',
      description: `URL contains sensitive authentication keywords: [${foundKeywords.join(', ')}]. Attackers use these patterns to build fake portal landing pages.`,
      weight: kwWeight,
    });
  }

  // 8. Shannon Entropy Analysis (Random string / DGA detection)
  const hostEntropy = calculateShannonEntropy(hostname.replace(/\./g, ''));
  if (hostEntropy > 3.9 && hostname.length > 14) {
    riskScore += 20;
    indicators.push({
      id: 'HIGH_ENTROPY_DOMAIN',
      title: `High Character Entropy (${hostEntropy})`,
      severity: 'warning',
      description: 'The domain name exhibits unusually high randomness, consistent with Domain Generation Algorithms (DGA) or disposable throwaway domains.',
      weight: 20,
    });
  }

  // 9. Shortener Detection
  if (SHORTENERS.includes(hostname)) {
    riskScore += 20;
    indicators.push({
      id: 'URL_SHORTENER',
      title: 'Obfuscated URL Shortener Service',
      severity: 'warning',
      description: `Uses a redirector (${hostname}) that conceals the true final destination from the user.`,
      weight: 20,
    });
  }

  // 10. Hyphen Overuse
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    riskScore += 15;
    indicators.push({
      id: 'HYPHEN_OVERUSE',
      title: 'Excessive Hyphenation in Domain',
      severity: 'info',
      description: `Domain contains ${hyphenCount} hyphens. Attackers frequently use hyphenated strings to mimic official service URLs.`,
      weight: 15,
    });
  }

  // Clamp risk score to [0, 100]
  const finalRisk = Math.min(100, Math.max(0, riskScore));

  let threatLevel = 'safe';
  let category = 'Verified Safe';

  if (finalRisk >= 70) {
    threatLevel = 'high_risk';
    category = impersonatedBrand ? `Impersonation of ${impersonatedBrand.toUpperCase()}` : 'Credential Phishing / Malicious Site';
  } else if (finalRisk >= 35) {
    threatLevel = 'suspicious';
    category = 'Suspicious Domain / Potential Scam';
  } else {
    threatLevel = 'safe';
    category = 'Low Risk / Standard Domain';
  }

  // Plain-English Explanation
  let explanation = '';
  if (threatLevel === 'high_risk') {
    explanation = `ScamShield detected severe threat signals on this URL. It exhibits patterns commonly employed by cybercriminals to steal login passwords or payment details. Under no circumstances should you enter credentials or download files from this site.`;
  } else if (threatLevel === 'suspicious') {
    explanation = `This URL possesses multiple suspicious attributes (such as risky TLD or unusual subdomains) that deviate from typical trusted websites. Proceed with caution and do not disclose personal information.`;
  } else {
    explanation = `No hostile deception indicators were detected. The domain structure, protocol, and character patterns align with standard legitimate web services.`;
  }

  const recommendations = [
    threatLevel === 'high_risk' ? 'Do NOT navigate to this site or submit any passwords/KYC data.' : 'Ensure browser shows a valid lock icon before entering information.',
    threatLevel === 'high_risk' ? 'If you have already entered login information, immediately change your password on the genuine official website.' : 'Verify the exact domain spelling in your browser address bar.',
    'Always access sensitive portals via official bookmarks or the mobile app rather than clicking direct links.',
    threatLevel !== 'safe' ? 'Report this link to the Anti-Phishing Working Group (APWG) or your security team.' : 'Keep Multi-Factor Authentication (MFA) enabled on your primary accounts.'
  ];

  const duration = Math.round(performance.now() - startTime);

  return {
    isValid: true,
    inputUrl: rawInput,
    defangedUrl: defangUrl(rawInput),
    hostname,
    protocol,
    tld,
    entropy: hostEntropy,
    riskScore: finalRisk,
    threatLevel,
    category,
    explanation,
    indicators,
    recommendations,
    homoglyphs: homoglyphResult,
    executionTimeMs: duration,
    scanType: 'url',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Comprehensive Message Analysis Engine (SMS, Emails, Social Media)
 */
export function analyzeMessage(rawText) {
  const startTime = performance.now();
  const text = (rawText || '').trim();

  if (!text || text.length < 5) {
    return {
      isValid: false,
      error: 'Message is too short to evaluate. Please provide at least a complete sentence.',
    };
  }

  const indicators = [];
  let riskScore = 5;

  const lowerText = text.toLowerCase();

  // 1. Urgency & Coercion Markers
  const URGENCY_TRIGGERS = [
    'immediate', 'urgent', 'within 24 hours', 'within 12 hours', 'action required',
    'account suspended', 'account frozen', 'locked immediately', 'final notice',
    'unauthorized transaction', 'arrest', 'warrant', 'police', 'legal action',
    'terminated', 'deadline', 'act now'
  ];
  const matchedUrgency = URGENCY_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedUrgency.length > 0) {
    const weight = Math.min(matchedUrgency.length * 15, 35);
    riskScore += weight;
    indicators.push({
      id: 'ARTIFICIAL_URGENCY',
      title: 'High-Pressure Urgency Tactics',
      severity: matchedUrgency.length >= 2 ? 'critical' : 'high',
      description: `Message relies on coercive urgency triggers: [${matchedUrgency.join(', ')}]. Scammers use stress and deadlines to suppress rational verification.`,
      weight,
      triggers: matchedUrgency,
    });
  }

  // 2. Credential & Identity Harvesting
  const HARVEST_TRIGGERS = [
    'password', 'pin', 'ssn', 'social security', 'one-time password', 'otp',
    'verification code', 'kyc verification', 'credit card', 'cvv', 'security code',
    'verify your identity', 'confirm details', 'login credentials', 'billing address'
  ];
  const matchedHarvest = HARVEST_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedHarvest.length > 0) {
    const weight = Math.min(matchedHarvest.length * 15, 40);
    riskScore += weight;
    indicators.push({
      id: 'CREDENTIAL_HARVESTING',
      title: 'Credential / Identity Harvesting Flags',
      severity: 'critical',
      description: `Message solicits private identity or security credentials: [${matchedHarvest.join(', ')}]. Legitimate institutions will never demand OTPs or passwords over unsolicited channels.`,
      weight,
      triggers: matchedHarvest,
    });
  }

  // 3. Financial Lures & Crypto Promises
  const FINANCIAL_TRIGGERS = [
    'wire transfer', 'western union', 'crypto', 'bitcoin', 'gift card',
    'guaranteed return', 'lottery', 'winner', 'won $', 'cash prize',
    'processing fee', 'inheritance', 'clearance fee', 'claim your reward', 'free money'
  ];
  const matchedFinancial = FINANCIAL_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedFinancial.length > 0) {
    const weight = Math.min(matchedFinancial.length * 15, 35);
    riskScore += weight;
    indicators.push({
      id: 'FINANCIAL_LURE',
      title: 'Financial Lure or Irreversible Payment Request',
      severity: 'high',
      description: `Detected high-risk payment lures: [${matchedFinancial.join(', ')}]. Gift cards, wire transfers, and crypto are irreversible payment methods favored by fraudsters.`,
      weight,
      triggers: matchedFinancial,
    });
  }

  // 4. Impersonation of Authority / Tech Support
  const IMPERSONATION_TRIGGERS = [
    'irs department', 'geek squad', 'fraud division', 'security department',
    'bank alert', 'usps delivery', 'fedex courier', 'dhl express', 'amazon customer care',
    'apple support', 'netflix billing team', 'microsoft support', 'norton antivirus'
  ];
  const matchedImpersonation = IMPERSONATION_TRIGGERS.filter(trigger => lowerText.includes(trigger));
  if (matchedImpersonation.length > 0) {
    const weight = 25;
    riskScore += weight;
    indicators.push({
      id: 'AUTHORITY_IMPERSONATION',
      title: 'Brand / Authority Impersonation',
      severity: 'high',
      description: `Message claims to originate from official entity: [${matchedImpersonation.join(', ')}]. Attackers spoof known brands to establish instant false credibility.`,
      weight,
      triggers: matchedImpersonation,
    });
  }

  // 5. Embedded Links / Shorteners in Message
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}\/[^\s]*/gi;
  const embeddedUrls = text.match(urlPattern) || [];
  if (embeddedUrls.length > 0) {
    const containsShortener = embeddedUrls.some(u => SHORTENERS.some(s => u.includes(s)));
    const weight = containsShortener ? 30 : 20;
    riskScore += weight;
    indicators.push({
      id: 'EMBEDDED_LINKS',
      title: containsShortener ? 'Embedded Obfuscated Shortlink' : 'Embedded Web Link',
      severity: containsShortener ? 'critical' : 'warning',
      description: `Contains embedded link(s): [${embeddedUrls.join(', ')}]. ${containsShortener ? 'The destination is concealed behind a URL shortener.' : 'Check destination domain carefully.'}`,
      weight,
      urls: embeddedUrls,
    });
  }

  // 6. Excessive Uppercase / Screaming text
  const uppercaseLetters = (text.match(/[A-Z]/g) || []).length;
  const totalLetters = (text.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 20 && (uppercaseLetters / totalLetters) > 0.45) {
    riskScore += 15;
    indicators.push({
      id: 'AGGRESSIVE_CASING',
      title: 'Aggressive Capitalization / Pressure Style',
      severity: 'info',
      description: 'Contains unusually high ratio of uppercase characters (screaming text), frequently used to provoke emotional impulse.',
      weight: 15,
    });
  }

  const finalRisk = Math.min(100, Math.max(0, riskScore));

  let threatLevel = 'safe';
  let category = 'Clean Communication';

  if (finalRisk >= 65) {
    threatLevel = 'high_risk';
    category = 'Phishing / Fraudulent Scam Message';
  } else if (finalRisk >= 35) {
    threatLevel = 'suspicious';
    category = 'Suspicious Communication / Potential Spam';
  } else {
    threatLevel = 'safe';
    category = 'Low Risk Communication';
  }

  let explanation = '';
  if (threatLevel === 'high_risk') {
    explanation = `This message exhibits hallmark signatures of a social engineering attack. It attempts to create artificial urgency, harvest sensitive credentials, or lure you into an irreversible transaction. Do not reply or click any links.`;
  } else if (threatLevel === 'suspicious') {
    explanation = `This communication contains language patterns or embedded links that warrant scrutiny. Avoid clicking links directly; verify the sender through independent channels.`;
  } else {
    explanation = `The message lacks typical indicators of fraud or pressure tactics. It reads as a standard conversational or legitimate transactional communication.`;
  }

  const recommendations = [
    threatLevel === 'high_risk' ? 'Do NOT reply, call any phone numbers provided, or click embedded links.' : 'Verify unexpected communications directly with the sender via a known trusted number.',
    threatLevel === 'high_risk' ? 'Forward this message to 7726 (SPAM) to alert telecommunication anti-fraud networks.' : 'Never share two-factor authentication codes with anyone, including support agents.',
    'Always look up company customer service numbers yourself on official websites rather than trusting inbound messages.',
    threatLevel !== 'safe' ? 'Block the sender on your mobile device or email client.' : 'Keep your spam and scam filters updated.'
  ];

  const duration = Math.round(performance.now() - startTime);

  return {
    isValid: true,
    rawText: text,
    riskScore: finalRisk,
    threatLevel,
    category,
    explanation,
    indicators,
    recommendations,
    embeddedUrls,
    executionTimeMs: duration,
    scanType: 'message',
    timestamp: new Date().toISOString(),
  };
}
