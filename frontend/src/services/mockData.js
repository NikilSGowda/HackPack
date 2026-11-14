export const INITIAL_STATS = {
  totalScans: 1482,
  safeUrls: 974,
  suspiciousScans: 312,
  scamMessages: 196,
  activeDefenseRules: 128,
  uptimePct: 99.98,
};

export const INITIAL_SCAN_HISTORY = [
  {
    id: 'scan-101',
    target: 'hxxps://secure-chase-update[.]verify-acc-login[.]xyz/auth',
    rawTarget: 'https://secure-chase-update.verify-acc-login.xyz/auth',
    type: 'url',
    riskScore: 92,
    threatLevel: 'high_risk',
    category: 'Credential Harvesting',
    timestamp: '2 mins ago',
    date: '2026-11-14 10:24',
    summary: 'High-risk bank spoofing URL attempting Chase customer credential theft with newly registered .xyz TLD and multiple deceptive subdomains.',
    indicatorsCount: 5,
  },
  {
    id: 'scan-102',
    target: 'hxxps://github[.]com/torvalds/linux',
    rawTarget: 'https://github.com/torvalds/linux',
    type: 'url',
    riskScore: 4,
    threatLevel: 'safe',
    category: 'Verified Safe',
    timestamp: '14 mins ago',
    date: '2026-11-14 10:12',
    summary: 'Legitimate domain with valid SSL certificate, long domain history, clean reputation, and standard DNS routing.',
    indicatorsCount: 0,
  },
  {
    id: 'scan-103',
    target: 'URGENT: Your Netflix membership is frozen. Click here to confirm payment details within 12 hours to prevent termination: bit.ly/3xZ9qL',
    rawTarget: 'URGENT: Your Netflix membership is frozen. Click here to confirm payment details within 12 hours to prevent termination: bit.ly/3xZ9qL',
    type: 'message',
    riskScore: 88,
    threatLevel: 'high_risk',
    category: 'SMS Phishing (Smishing)',
    timestamp: '35 mins ago',
    date: '2026-11-14 09:51',
    summary: 'Classic subscription fraud lure combining artificial urgency, fear of service loss, and an obfuscated shortlink.',
    indicatorsCount: 4,
  },
  {
    id: 'scan-104',
    target: 'hxxp://185[.]220[.]101[.]5/wp-admin/update[.]php',
    rawTarget: 'http://185.220.101.5/wp-admin/update.php',
    type: 'url',
    riskScore: 84,
    threatLevel: 'high_risk',
    category: 'IP-Hosted Phishing / Malware Host',
    timestamp: '1 hour ago',
    date: '2026-11-14 09:25',
    summary: 'Direct raw IP address in URL without domain name, unencrypted HTTP protocol, hosted in high-risk autonomous system (AS).',
    indicatorsCount: 4,
  },
  {
    id: 'scan-105',
    target: 'Hi John, attached is the Q4 marketing budget spreadsheet we discussed during the standup yesterday. Let me know your thoughts.',
    rawTarget: 'Hi John, attached is the Q4 marketing budget spreadsheet we discussed during the standup yesterday. Let me know your thoughts.',
    type: 'message',
    riskScore: 8,
    threatLevel: 'safe',
    category: 'Clean Communication',
    timestamp: '2 hours ago',
    date: '2026-11-14 08:30',
    summary: 'Normal conversational tone with no coercive deadlines, zero credential harvesting keywords, and no suspicious outbound links.',
    indicatorsCount: 0,
  },
  {
    id: 'scan-106',
    target: 'hxxps://pаypal[.]com/signin (Punycode: xn--pypal-4ve.com)',
    rawTarget: 'https://pаypal.com/signin',
    type: 'url',
    riskScore: 96,
    threatLevel: 'high_risk',
    category: 'Homoglyph / Punycode Attack',
    timestamp: '3 hours ago',
    date: '2026-11-14 07:15',
    summary: 'Visual spoofing attack using Cyrillic "а" (U+0430) disguised as Latin "a" to mimic paypal.com.',
    indicatorsCount: 4,
  },
  {
    id: 'scan-107',
    target: 'hxxps://apple-id-verify-unlock[.]support-device[.]top',
    rawTarget: 'https://apple-id-verify-unlock.support-device.top',
    type: 'url',
    riskScore: 78,
    threatLevel: 'suspicious',
    category: 'Brand Impersonation',
    timestamp: '4 hours ago',
    date: '2026-11-14 06:18',
    summary: 'Lookalike subdomain targeting Apple ID credentials using suspicious .top TLD and hyphens.',
    indicatorsCount: 3,
  }
];

export const TELEMETRY_TRENDS = [
  { day: 'Mon', total: 180, scams: 42, safe: 138 },
  { day: 'Tue', total: 210, scams: 55, safe: 155 },
  { day: 'Wed', total: 245, scams: 68, safe: 177 },
  { day: 'Thu', total: 195, scams: 39, safe: 156 },
  { day: 'Fri', total: 310, scams: 94, safe: 216 },
  { day: 'Sat', total: 160, scams: 30, safe: 130 },
  { day: 'Sun', total: 182, scams: 48, safe: 134 },
];

export const THREAT_CATEGORIES_DATA = [
  { name: 'Credential Harvesting', value: 38, color: '#f43f5e' },
  { name: 'Fake Financial / Crypto', value: 24, color: '#f59e0b' },
  { name: 'Homoglyph / Punycode', value: 16, color: '#ec4899' },
  { name: 'Package / Delivery Scam', value: 14, color: '#06b6d4' },
  { name: 'Authority Impersonation', value: 8, color: '#a855f7' },
];

export const THREAT_LAB_SCENARIOS = [
  {
    id: 'sim-1',
    title: 'The "Immediate Account Suspension" Bank Alert',
    type: 'SMS',
    sender: '+1 (833) 902-1844',
    content: '[CITI ALERT] We detected an unauthorized debit of $840.50 from your checking account. If this was not you, visit https://citi-fraud-prevention.net/resolve immediately or your account will be locked.',
    isScam: true,
    targetUrl: 'https://citi-fraud-prevention.net/resolve',
    redFlags: [
      'Artificial Panic: Creates immediate anxiety about losing $840.',
      'Unregistered Domain: "citi-fraud-prevention.net" is not the official citi.com domain.',
      'Tight Deadline: Demands immediate action to avoid account freeze.',
      'Generic Greeting: No customer name or partial account number (e.g. "Ending in 4310").'
    ],
    recommendedAction: 'Do not click the link. Log in directly via your official banking mobile app or call the number on the back of your debit card.'
  },
  {
    id: 'sim-2',
    title: 'The Failed USPS Package Delivery',
    type: 'SMS',
    sender: 'usps-notifications@track-update.com',
    content: 'USPS Notice: Your package #US9842013-X cannot be delivered due to an incomplete street address. Please update your address and pay a $1.85 redelivery fee at: https://usps-post-redelivery.org/update',
    isScam: true,
    targetUrl: 'https://usps-post-redelivery.org/update',
    redFlags: [
      'Micro-Charge Trap: Requests $1.85 to capture credit card number and CVV.',
      'Unofficial Domain: Official USPS is always usps.com, not .org or hyphens.',
      'Generic Tracking Number: Does not match standard USPS 22-digit barcode.'
    ],
    recommendedAction: 'Check tracking numbers only at usps.com. USPS will never demand card details via random SMS.'
  },
  {
    id: 'sim-3',
    title: 'Urgent CEO Wire Transfer Request',
    type: 'Email',
    sender: 'david.miller.ceo@corp-internal-mail.biz',
    content: 'Subject: QUICK FAVOR - IN A MEETING\n\nHey, I am currently stepped into a board meeting and cannot talk on the phone. Are you available to execute a confidential wire transfer for an overseas vendor right now? Reply with your phone number and I will send the wire details.',
    isScam: true,
    targetUrl: '',
    redFlags: [
      'Executive Impersonation (Business Email Compromise - BEC).',
      'Lookalike Domain: Sent from corp-internal-mail.biz instead of the company official domain.',
      'Channel Blocking: "Cannot talk on the phone" prevents direct voice verification.'
    ],
    recommendedAction: 'Always verify unusual fund transfer requests out-of-band via phone or in-person before transferring company capital.'
  },
  {
    id: 'sim-4',
    title: 'Legitimate GitHub Password Reset',
    type: 'Email',
    sender: 'support@github.com',
    content: 'Subject: [GitHub] Please reset your password\n\nWe received a request to reset your password for your account. If you made this request, click the button below to choose a new password. The link will expire in 2 hours.\n\nLink: https://github.com/password_reset/873f912c\n\nIf you did not request this, you can safely ignore this email.',
    isScam: false,
    targetUrl: 'https://github.com/password_reset/873f912c',
    redFlags: [],
    recommendedAction: 'This is a standard transactional reset email. Always inspect that the link genuinely leads to https://github.com.'
  }
];

export const SCAM_ENCYCLOPEDIA_ARTICLES = [
  {
    id: 'phishing',
    title: 'Phishing (Email & Web Deception)',
    severity: 'High',
    description: 'Attackers craft forged websites and emails mimicking trusted entities (banks, tech companies, healthcare) to steal passwords, credentials, and identity information.',
    telltaleSigns: [
      'Mismatched sender address (e.g., support@paypa1-security.com)',
      'Sense of urgency or threat of account suspension',
      'Generic greetings like "Dear Customer"',
      'Subdomains overloading the true domain name'
    ],
    defensiveTips: [
      'Bookmark your primary banking and email portals directly.',
      'Inspect the full domain name before typing credentials.',
      'Enable Multi-Factor Authentication (MFA) using security keys or authenticator apps.'
    ]
  },
  {
    id: 'smishing',
    title: 'Smishing (SMS Phishing)',
    severity: 'High',
    description: 'Fraudulent SMS text messages disguised as banks, delivery couriers, or government agencies attempting to lure victims to malicious websites or toll-fraud phone numbers.',
    telltaleSigns: [
      'Unsolicited package delivery alerts requiring "address updates"',
      'Fraud warnings demanding immediate clicks',
      'Unusual sender numbers or email-to-SMS gateways',
      'Shortened URLs (bit.ly, tinyurl) hiding destination addresses'
    ],
    defensiveTips: [
      'Never click links in text messages from unknown numbers.',
      'Forward suspicious SMS messages to 7726 (SPAM) to alert carriers.',
      'Verify notices directly through official mobile apps.'
    ]
  },
  {
    id: 'quishing',
    title: 'Quishing (QR Code Phishing)',
    severity: 'Medium-High',
    description: 'Malicious QR codes placed on physical surfaces (parking meters, charging kiosks, flyers) or sent via email that bypass traditional security filters because they are images.',
    telltaleSigns: [
      'Physical stickers placed over genuine QR codes on payment kiosks',
      'Emails containing only a QR code with zero searchable text',
      'Prompting immediate credential entry upon scanning'
    ],
    defensiveTips: [
      'Always preview the target URL before opening a scanned QR code.',
      'Physically check if a sticker is superimposed over a printed QR code.',
      'Use ScamShield\'s Quishing Scanner to inspect QR links before navigation.'
    ]
  },
  {
    id: 'homoglyph',
    title: 'IDN Homograph & Punycode Attacks',
    severity: 'Critical',
    description: 'Deceptive domain names using visually identical characters from different alphabets (e.g. Cyrillic "а" or Greek "ο") that render almost identically in browsers.',
    telltaleSigns: [
      'Domains that look identical but display "xn--" in the address bar',
      'Character accents or unusual font rendering',
      'Certificates issued by free automated issuers to freshly registered lookalikes'
    ],
    defensiveTips: [
      'Copy the link into an address bar or ScamShield to inspect the Punycode version.',
      'Never trust visual glance alone for high-value financial transactions.'
    ]
  }
];
