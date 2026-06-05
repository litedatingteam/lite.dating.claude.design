/* lite.dating — trust & safety / ops mock data (window.TS) */
(function () {
  // anonymized subjects — moderators never see real identities or full profiles
  const CASES = [
    { id: 'C-4821', type: 'report', subjectRef: 'User #8842', priority: 'high', status: 'open', age: '12m', ai: true,
      reason: 'Harassment', policy: 'P-3.2 Harassment & threats', evidence: 3, channel: null,
      summary: 'Repeated unwanted contact requests after a pass. Two screenshots and one message attached.' },
    { id: 'C-4820', type: 'report', subjectRef: 'User #5510', priority: 'med', status: 'in-review', age: '41m', ai: false,
      reason: 'Fake / impersonation', policy: 'P-2.1 Authenticity', evidence: 2, channel: null,
      summary: 'Reporter claims photos belong to a public figure. Photo-match signal raised.' },
    { id: 'C-4818', type: 'report', subjectRef: 'User #9024', priority: 'low', status: 'open', age: '1h', ai: true,
      reason: 'Off-platform harm', policy: 'P-4.0 Off-platform', evidence: 1, channel: 'instagram',
      summary: 'Reported harassment continued on Instagram after a handle trade.' },
    { id: 'C-4805', type: 'report', subjectRef: 'User #3391', priority: 'high', status: 'escalated', age: '3h', ai: false,
      reason: 'Minor safety', policy: 'P-1.0 Age & minors', evidence: 2, channel: null,
      summary: 'Possible underage account. Escalated to senior review — restricted pending decision.' },
  ];

  const APPEALS = [
    { id: 'A-219', userRef: 'User #8842', decision: 'Visibility hold', action: 'Profile hidden from Discover', reason: 'Harassment', ai: true, human: true, deadline: '5d', status: 'open', statement: 'The messages were taken out of context — we had matched and were joking.' },
    { id: 'A-217', userRef: 'User #2204', decision: 'Suspension (7 days)', action: 'Account suspended', reason: 'Spam / solicitation', ai: true, human: false, deadline: '2d', status: 'in-review', statement: '' },
    { id: 'A-212', userRef: 'User #6678', decision: 'Photo rejected', action: 'Photo removed', reason: 'Contact info in image', ai: false, human: true, deadline: 'expired', status: 'denied', statement: 'It was just my coffee shop sign, not a phone number.' },
  ];

  const IG_QUEUE = [
    { id: 'IG-771', userRef: 'User #1180', handle: '••••••23', signal: 'New handle', risk: 'low', age: '8m' },
    { id: 'IG-770', userRef: 'User #4419', handle: '••••er', signal: 'Reused across accounts', risk: 'high', age: '22m' },
    { id: 'IG-768', userRef: 'User #7732', handle: '••••07', signal: 'Mismatch name', risk: 'med', age: '55m' },
  ];
  const PHOTO_QUEUE = [
    { id: 'PH-2231', userRef: 'User #1180', flag: 'Auto-pass', risk: 'low', age: '3m' },
    { id: 'PH-2230', userRef: 'User #5510', flag: 'Possible public figure', risk: 'high', age: '12m' },
    { id: 'PH-2228', userRef: 'User #9981', flag: 'Face not clear', risk: 'med', age: '30m' },
    { id: 'PH-2225', userRef: 'User #3120', flag: 'Contact info detected', risk: 'high', age: '1h' },
  ];
  const REVERIFY_QUEUE = [
    { id: 'RV-118', userRef: 'User #2204', reason: 'New device + sensitive change', risk: 'med', age: '15m' },
    { id: 'RV-117', userRef: 'User #8842', reason: 'Post-appeal re-check', risk: 'high', age: '40m' },
  ];

  const AUDIT = [
    { actor: 'mod_eda', role: 'Moderator', action: 'Revealed evidence', target: 'C-4821 · item 2', reason: 'Assess threat severity', time: '2m ago', sensitive: true },
    { actor: 'admin_halit', role: 'Owner', action: 'Changed role', target: 'mod_kerem → Moderator', reason: 'Onboarding', time: '18m ago', sensitive: false },
    { actor: 'mod_eda', role: 'Moderator', action: 'Applied decision', target: 'C-4820 · visibility hold', reason: 'P-2.1 authenticity', time: '26m ago', sensitive: false },
    { actor: 'system', role: 'System', action: 'AI flag raised', target: 'C-4818', reason: 'Off-platform harm classifier', time: '1h ago', sensitive: false },
    { actor: 'admin_halit', role: 'Owner', action: 'Exported audit range', target: '7-day window', reason: 'Monthly compliance', time: '3h ago', sensitive: true },
  ];

  const RISK = [
    { title: 'Burst sign-ups', sev: 'high', value: '+312%', desc: '47 accounts from one ASN in 10 min. Rate-limit engaged automatically.', action: 'Review cohort' },
    { title: 'Repeat reporters', sev: 'med', value: '6 users', desc: 'Accounts filing reports far above baseline. Possible false-report abuse.', action: 'Audit reporters' },
    { title: 'Handle reuse', sev: 'med', value: '14 matches', desc: 'Same IG handle verified on multiple accounts this week.', action: 'Cross-check' },
    { title: 'Selfie mismatch', sev: 'low', value: '3 flags', desc: 'Verification selfie differs from profile photos.', action: 'Queue re-verify' },
  ];

  const AD_PLACEMENTS = [
    { slot: 'Discover feed (native)', status: 'ok', label: 'Advertisement', note: 'After 5 cards · labeled · separated' },
    { slot: 'Why-it-free page', status: 'ok', label: 'Sponsored links', note: 'Google-certified CMP' },
    { slot: 'Request modal', status: 'blocked', label: '—', note: 'Ads disallowed near actions' },
    { slot: 'Report / appeal flow', status: 'blocked', label: '—', note: 'Ads disallowed in safety' },
    { slot: 'Verification selfie', status: 'blocked', label: '—', note: 'Ads disallowed' },
    { slot: 'Admin / evidence pages', status: 'blocked', label: '—', note: 'Ads disallowed' },
  ];

  const MODERATORS = [
    { handle: 'admin_halit', name: 'Halit T. ARICAN', role: 'Owner', status: 'active', cases: 0, shift: 'On call' },
    { handle: 'admin_derya', name: 'Derya K.', role: 'Admin', status: 'active', cases: 12, shift: 'Day' },
    { handle: 'mod_eda', name: 'Eda S.', role: 'Moderator', status: 'on-shift', cases: 38, shift: 'Evening' },
    { handle: 'mod_kerem', name: 'Kerem A.', role: 'Moderator', status: 'invited', cases: 0, shift: '—' },
  ];

  const ROLE_PERMS = [
    ['Review moderation cases', [false, true, true]],
    ['Apply decisions (hold/suspend)', [false, true, true]],
    ['Reveal sensitive evidence (logged)', [false, true, true]],
    ['Manage ad compliance', [true, true, false]],
    ['View revenue & visitors', [true, true, false]],
    ['Manage moderators & roles', [true, false, false]],
    ['Export audit logs', [true, true, false]],
    ['Legal & crawler settings', [true, false, false]],
  ]; // columns: Owner, Admin, Moderator

  const POLICY_TEMPLATES = [
    { code: 'P-1.0', title: 'Age & minors', tone: 'Zero tolerance', uses: 4 },
    { code: 'P-2.1', title: 'Authenticity & impersonation', tone: 'Standard', uses: 31 },
    { code: 'P-3.2', title: 'Harassment & threats', tone: 'Standard', uses: 58 },
    { code: 'P-4.0', title: 'Off-platform harm', tone: 'Contextual', uses: 12 },
    { code: 'P-5.1', title: 'Spam & solicitation', tone: 'Standard', uses: 44 },
  ];

  // overview metrics + tiny series for CSS charts
  const METRICS = {
    kpis: [
      { label: 'Daily active', value: '18.4k', delta: '+6.2%', up: true },
      { label: 'New profiles (24h)', value: '742', delta: '+11%', up: true },
      { label: 'Mutual connections (24h)', value: '1,209', delta: '+4.4%', up: true },
      { label: 'Open safety cases', value: '23', delta: '-3', up: true },
    ],
    revenue: [
      { label: 'Ad revenue (30d)', value: '€8,410', delta: '+9.1%', up: true },
      { label: 'eCPM', value: '€2.74', delta: '+0.3', up: true },
      { label: 'Fill rate', value: '94.2%', delta: '+1.1%', up: true },
      { label: 'Blocked-slot savings', value: '0 violations', delta: 'clean', up: true },
    ],
    visitorsSeries: [32, 38, 35, 44, 52, 48, 61, 58, 67, 72, 69, 81],
    revenueSeries: [180, 220, 210, 260, 240, 300, 290, 340, 330, 380, 360, 420],
    sources: [['Organic search', 46], ['Direct', 27], ['Social', 18], ['Referral', 9]],
    countries: [['Türkiye', 58], ['Germany', 14], ['Netherlands', 8], ['UK', 6], ['Other', 14]],
  };

  window.TS = { CASES, APPEALS, IG_QUEUE, PHOTO_QUEUE, REVERIFY_QUEUE, AUDIT, RISK, AD_PLACEMENTS, MODERATORS, ROLE_PERMS, POLICY_TEMPLATES, METRICS };
})();
