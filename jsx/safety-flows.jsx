/* lite.dating — trust & safety consumer flows */

function FlowShell({ title, step, total, onBack, children, footer }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="center-col" style={{ padding: '14px 20px', maxWidth: 560, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn icon sm ghost" onClick={onBack}><Icon name="arrowL" size={16} /></button>
          <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{title}</strong>
          {total && <span className="badge neutral" style={{ marginLeft: 'auto' }}>Step {step} / {total}</span>}
        </div>
      </div>
      <div className="center-col" style={{ padding: '28px 20px 40px', maxWidth: 560 }}>{children}</div>
      {footer && <div style={{ position: 'sticky', bottom: 0, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--line-soft)' }}><div className="center-col" style={{ padding: '14px 20px', maxWidth: 560 }}>{footer}</div></div>}
    </div>
  );
}

function RadioCard({ on, title, desc, icon, onClick }) {
  return (
    <div className="card pad row" style={{ gap: 12, cursor: 'pointer', borderColor: on ? 'var(--violet)' : 'var(--line)', boxShadow: on ? '0 0 0 3px color-mix(in oklch, var(--violet), white 80%)' : 'var(--sh-sm)' }} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}>
      {icon && <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={18} /></span>}
      <div style={{ flex: 1 }}><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{title}</strong>{desc && <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 2 }}>{desc}</p>}</div>
      <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (on ? 'var(--violet)' : 'var(--line)'), display: 'grid', placeItems: 'center', flex: 'none' }}>{on && <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--violet)' }} />}</span>
    </div>
  );
}

function EvidenceDrop({ label }) {
  return (
    <button className="ad-frame" style={{ padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%', border: '1.5px dashed var(--line)', background: 'var(--surface-2)', borderRadius: 'var(--r-md)', color: 'var(--muted)' }}>
      <Icon name="plus" size={20} /><span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span><span className="faint" style={{ fontSize: 11.5 }}>Screenshots or images · optional</span>
    </button>
  );
}

const REPORT_TYPES = [
  ['Harassment or threats', 'Unwanted contact, intimidation, or threats', 'flag'],
  ['Fake or impersonation', 'Not a real person, or pretending to be someone', 'user'],
  ['Inappropriate content', 'Nudity, hate, or content that breaks the rules', 'eye'],
  ['Off-platform harm', 'Something that happened on Instagram or Telegram', 'shield'],
  ['Spam or solicitation', 'Selling, scams, or repeated promotion', 'info'],
  ['Minor safety concern', 'You believe this person is under 18', 'lock'],
];

function ReportFlow() {
  const { go, toast } = useNav();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [detail, setDetail] = useState('');
  const back = () => (step > 1 ? setStep(step - 1) : go('safety-center'));

  if (step === 4) {
    return (
      <FlowShell title="Report submitted" onBack={() => go('discover')}>
        <div className="tac stack" style={{ alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--green-w)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}><Icon name="check" size={32} /></div>
          <h1 style={{ fontSize: 24 }}>Thank you — we’ve got it</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 380 }}>Our safety team reviews every report. You won’t be told the outcome for privacy reasons, but action is taken when our rules are broken. The reported person is never told who reported them.</p>
          <span className="badge neutral mono">Case ref · R-{Math.floor(1000 + Math.random() * 9000)}</span>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <button className="btn ghost" onClick={() => go('safety-center')}>Safety center</button>
            <button className="btn primary" onClick={() => go('discover')}>Back to browsing</button>
          </div>
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Report a user" step={step} total={3} onBack={back}
      footer={
        <div className="row" style={{ gap: 10 }}>
          {step > 1 && <button className="btn ghost lg" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="btn primary lg" style={{ flex: 1 }} disabled={step === 1 && !type} onClick={() => setStep(step + 1)}>{step === 3 ? 'Submit report' : 'Continue'}</button>
        </div>
      }>
      {step === 1 && <div className="stack" style={{ gap: 12 }}>
        <h1 style={{ fontSize: 24 }}>What happened?</h1>
        <p className="muted" style={{ fontSize: 14 }}>Choose the closest reason. You can add details next.</p>
        <div className="stack" style={{ gap: 10, marginTop: 6 }}>
          {REPORT_TYPES.map(([t, d, ic]) => <RadioCard key={t} on={type === t} title={t} desc={d} icon={ic} onClick={() => setType(t)} />)}
        </div>
      </div>}

      {step === 2 && <div className="stack" style={{ gap: 14 }}>
        <h1 style={{ fontSize: 24 }}>Tell us more</h1>
        <span className="badge neutral" style={{ alignSelf: 'start' }}><Icon name="flag" />{type}</span>
        <Field label="What did you experience?" hint="The more specific you are, the faster we can act.">
          <textarea className="textarea" style={{ minHeight: 130 }} placeholder="Describe what happened, including dates or context if you can…" value={detail} onChange={(e) => setDetail(e.target.value)} />
        </Field>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">Evidence (optional)</span>
          <EvidenceDrop label="Add screenshots" />
        </div>
        <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="lock" size={16} style={{ color: 'var(--green)', flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Evidence is stored securely, shown only to trained reviewers, watermarked, and never shared with the person you’re reporting.</p>
        </div>
      </div>}

      {step === 3 && <div className="stack" style={{ gap: 16 }}>
        <h1 style={{ fontSize: 24 }}>Review &amp; submit</h1>
        <div className="card pad stack" style={{ gap: 10 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Reason</span><strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>{type}</strong></div>
          <div className="hr" />
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Details</span><span style={{ fontSize: 13, color: 'var(--ink)', maxWidth: 280, textAlign: 'right' }}>{detail || 'None added'}</span></div>
          <div className="hr" />
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Evidence</span><span style={{ fontSize: 13, color: 'var(--ink)' }}>0 files</span></div>
        </div>
        <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="info" size={18} style={{ color: 'color-mix(in oklch, var(--amber), black 20%)', flex: 'none' }} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Reports protect users. False reports harm users. We review both.</strong> Knowingly false or malicious reports may lead to restrictions on your own account.</p>
        </div>
      </div>}
    </FlowShell>
  );
}

function AppealFlow() {
  const { go } = useNav();
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(null);
  const [statement, setStatement] = useState('');
  const decision = { type: 'Visibility hold', action: 'Your profile is hidden from Discover', cat: 'Harassment (P-3.2)', ai: true, human: true, deadline: '5 days' };

  if (step === 3) {
    return (
      <FlowShell title="Appeal submitted" onBack={() => go('safety-center')}>
        <div className="tac stack" style={{ alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--green-w)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}><Icon name="check" size={32} /></div>
          <h1 style={{ fontSize: 24 }}>Your appeal is in</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 380 }}>A human reviewer will look at your case independently of the original decision. We aim to respond within 5 days. You’ll get a notice by email and in your Safety center.</p>
          <span className="badge neutral mono">Appeal ref · A-{Math.floor(200 + Math.random() * 99)}</span>
          <button className="btn primary" style={{ marginTop: 8 }} onClick={() => go('safety-center')}>Back to Safety center</button>
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Appeal a decision" step={step} total={2} onBack={() => (step > 1 ? setStep(step - 1) : go('safety-center'))}
      footer={<div className="row" style={{ gap: 10 }}>{step > 1 && <button className="btn ghost lg" onClick={() => setStep(1)}>Back</button>}<button className="btn primary lg" style={{ flex: 1 }} disabled={step === 1 ? !reason : false} onClick={() => setStep(step + 1)}>{step === 2 ? 'Submit appeal' : 'Continue'}</button></div>}>
      {step === 1 && <div className="stack" style={{ gap: 16 }}>
        {/* decision notice */}
        <div className="card pad stack" style={{ gap: 12, borderColor: 'transparent', background: 'var(--amber-w)' }}>
          <div className="row" style={{ gap: 8 }}><Icon name="info" size={18} style={{ color: 'color-mix(in oklch, var(--amber), black 20%)' }} /><strong style={{ color: 'var(--ink)' }}>Decision notice</strong></div>
          <div className="stack" style={{ gap: 8 }}>
            <Row k="Action taken" v={decision.action} />
            <Row k="Decision" v={decision.type} />
            <Row k="Reason category" v={decision.cat} />
            <Row k="Review" v={<span className="row" style={{ gap: 6 }}>{decision.ai && <span className="badge neutral">AI-assisted</span>}{decision.human && <span className="badge verified"><Icon name="check" />Human-reviewed</span>}</span>} />
            <Row k="Appeal deadline" v={<strong style={{ color: 'var(--ink)' }}>{decision.deadline} left</strong>} />
          </div>
        </div>
        <h2 style={{ fontSize: 20 }}>Why are you appealing?</h2>
        <div className="stack" style={{ gap: 10 }}>
          {['I didn’t do what was reported', 'This was a misunderstanding / out of context', 'The report was false or malicious', 'I’ve fixed the issue since', 'Other reason'].map((r) => <RadioCard key={r} on={reason === r} title={r} onClick={() => setReason(r)} />)}
        </div>
      </div>}

      {step === 2 && <div className="stack" style={{ gap: 16 }}>
        <h1 style={{ fontSize: 24 }}>Your statement</h1>
        <span className="badge neutral" style={{ alignSelf: 'start' }}>{reason}</span>
        <Field label="Explain in your own words" hint="A human reviewer reads this. Be clear and specific.">
          <textarea className="textarea" style={{ minHeight: 130 }} placeholder="Tell us what we should know…" value={statement} onChange={(e) => setStatement(e.target.value)} />
        </Field>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">Supporting evidence (optional)</span>
          <EvidenceDrop label="Add files" />
        </div>
      </div>}
    </FlowShell>
  );
}

function Row({ k, v }) {
  return <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}><span className="muted" style={{ fontSize: 13 }}>{k}</span><span style={{ fontSize: 13.5, color: 'var(--ink)', textAlign: 'right' }}>{v}</span></div>;
}

/* ---------- legal update gate (blocking) ---------- */
function LegalGate() {
  const { go, toast } = useNav();
  const [checks, setChecks] = useState({ terms: false, privacy: false, gdpr: false, kvkk: false, photo: false });
  const required = ['terms', 'privacy', 'gdpr', 'kvkk'];
  const allReq = required.every((k) => checks[k]);
  const items = [
    ['terms', 'Terms of Service', 'accept', 'We clarified handle expiry and false-report consequences.'],
    ['privacy', 'Privacy Policy', 'acknowledge', 'New detail on how verification selfies are stored.'],
    ['gdpr', 'GDPR Notice', 'acknowledge', 'Updated lawful-basis table for EU users.'],
    ['kvkk', 'KVKK Aydınlatma Metni', 'acknowledge', 'Türkiye data-protection disclosure refreshed.'],
    ['photo', 'Photo verification consent', 'consent', 'Optional: keep a reusable reference selfie. You can decline.'],
  ];
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* blurred app backdrop */}
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(6px)', opacity: 0.5, pointerEvents: 'none' }}><div className="app-frame"><div /><div className="app-scroll"><div className="disc-grid">{[0, 1, 2].map((i) => <div key={i} className="card" style={{ height: 300 }} />)}</div></div></div></div>
      <div className="overlay" style={{ position: 'fixed' }}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
          <div style={{ padding: '26px 26px 0' }}>
            <span className="eyebrow">Before you continue</span>
            <h1 style={{ fontSize: 23, marginTop: 8 }}>We’ve updated our policies</h1>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>Please review and confirm to keep using lite.dating. Your confirmation and its timestamp are recorded.</p>
          </div>
          <div style={{ padding: 20 }} className="stack">
            {items.map(([k, title, verb, desc]) => (
              <label key={k} className="card pad row" style={{ gap: 12, cursor: 'pointer', marginBottom: 10, alignItems: 'flex-start', borderColor: checks[k] ? 'var(--green)' : 'var(--line)' }} onClick={() => setChecks((c) => ({ ...c, [k]: !c[k] }))}>
                <span style={{ width: 22, height: 22, borderRadius: 6, marginTop: 1, border: '2px solid ' + (checks[k] ? 'var(--green)' : 'var(--line)'), background: checks[k] ? 'var(--green)' : 'transparent', display: 'grid', placeItems: 'center', flex: 'none' }}>{checks[k] && <Icon name="checkSm" size={14} style={{ color: 'white' }} />}</span>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}><strong style={{ color: 'var(--ink)', fontSize: 14 }}>{title}</strong><span className={`badge ${verb === 'consent' ? 'ig' : 'neutral'}`} style={{ fontSize: 10.5 }}>{verb === 'accept' ? 'Accept' : verb === 'consent' ? 'Consent (optional)' : 'Acknowledge'}</span></div>
                  <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 3 }}>{desc}</p>
                  <a className="mono" style={{ fontSize: 11.5, color: 'var(--violet)', cursor: 'pointer' }}>Read full text →</a>
                </div>
              </label>
            ))}
            <button className="btn primary lg block" style={{ marginTop: 4 }} disabled={!allReq} onClick={() => { toast('Policies accepted — thanks', 'ok'); go('discover'); }}>{allReq ? 'Confirm & continue' : 'Confirm required items to continue'}</button>
            <p className="faint tac" style={{ fontSize: 11.5, marginTop: 8 }}>Optional photo-verification consent can be changed anytime in Settings.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- full safety center ---------- */
function SafetyCenter() {
  const { go } = useNav();
  const groups = [
    ['Get help now', [
      ['flag', 'Report a user', 'Tell us what happened', () => go('report')],
      ['x', 'Block someone', 'Stop all contact instantly', null],
      ['shield', 'Report off-platform harm', 'Even if it happened on IG or Telegram', () => go('report')],
    ]],
    ['Your decisions', [
      ['info', 'Appeal a decision', 'Ask for an independent human review', () => go('appeal')],
      ['eye', 'Active decisions', 'See any restrictions on your account', null],
    ]],
    ['Your data & rules', [
      ['copy', 'Export your data', 'Download a copy of everything', null],
      ['lock', 'Consent settings', 'Manage ad & verification consent', () => go('settings')],
      ['user', 'Community rules', 'What’s allowed and what isn’t', null],
      ['mail', 'Contact safety team', 'safety@lite.dating', () => go('contact')],
    ]],
  ];
  return (
    <AppFrame title="Safety center">
      <div className="card pad" style={{ background: 'var(--ink)', color: 'white', border: 'none', marginBottom: 22, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Icon name="shield" size={22} style={{ color: 'white', flex: 'none' }} />
        <p style={{ fontSize: 14.5, color: 'white', fontWeight: 500 }}>Reports protect users. False reports harm users. We review both — calmly and fairly.</p>
      </div>
      <div className="stack" style={{ gap: 24 }}>
        {groups.map(([label, items]) => (
          <div key={label} className="stack" style={{ gap: 12 }}>
            <span className="eyebrow">{label}</span>
            <div className="disc-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {items.map(([icon, title, desc, fn]) => (
                <div key={title} className="card pad row" style={{ gap: 14, cursor: 'pointer' }} onClick={fn || (() => {})}>
                  <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={19} /></span>
                  <div style={{ flex: 1 }}><strong style={{ color: 'var(--ink)' }}>{title}</strong><p className="muted" style={{ fontSize: 13 }}>{desc}</p></div>
                  {fn && <Icon name="chevR" size={16} style={{ color: 'var(--faint)' }} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

Object.assign(window, { ReportFlow, AppealFlow, LegalGate, SafetyCenter, FlowShell, RadioCard, Row });
