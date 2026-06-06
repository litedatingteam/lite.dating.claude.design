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
      <RadioDot on={on} />
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

function ReportFlow({ offPlatform }) {
  const { go, toast, store } = useNav();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(offPlatform ? 'Off-platform harm' : null);
  const [detail, setDetail] = useState('');
  const PLATFORMS = offPlatform ? ['Instagram', 'Telegram', 'WhatsApp', 'In person', 'Other'] : ['Instagram', 'Telegram'];
  const [channel, setChannel] = useState(PLATFORMS[0]);
  const [handle, setHandle] = useState('');
  const ret = store.returnTo || { name: 'safety-center' };
  const goRet = () => go(ret.name, ret.param);
  const back = () => (step > 1 ? setStep(step - 1) : goRet());

  if (step === 4) {
    return (
      <FlowShell title="Report submitted" onBack={goRet}>
        <div className="tac stack" style={{ alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--green-w)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}><Icon name="check" size={32} /></div>
          <h1 style={{ fontSize: 24 }}>Thank you — we’ve got it</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 420 }}>Our safety team reviews every report. You stay anonymous — the reported person will never learn who reported them. If action is taken, they may receive a notice with the reason category.</p>
          <span className="badge neutral mono">Case ref · R-{Math.floor(1000 + Math.random() * 9000)}</span>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <button className="btn ghost" onClick={() => go('safety-center')}>Safety center</button>
            <button className="btn primary" onClick={goRet}>Back</button>
          </div>
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell title={offPlatform ? 'Report off-platform harm' : 'Report a user'} step={step} total={3} onBack={back}
      footer={
        <div className="row" style={{ gap: 10 }}>
          {step > 1 && <button className="btn ghost lg" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="btn primary lg" style={{ flex: 1 }} disabled={step === 1 && (!type || !handle.trim())} onClick={() => setStep(step + 1)}>{step === 3 ? 'Submit report' : 'Continue'}</button>
        </div>
      }>
      {step === 1 && <div className="stack" style={{ gap: 12 }}>
        <h1 style={{ fontSize: 24 }}>{offPlatform ? 'Where did this happen?' : 'What happened?'}</h1>
        <p className="muted" style={{ fontSize: 14 }}>{offPlatform ? 'Tell us the platform and handle where the harm took place, then the reason.' : 'Tell us which handle this is about, then choose the closest reason.'}</p>
        <div className="card pad stack" style={{ gap: 12, marginTop: 2 }}>
          <Field label={offPlatform ? 'Where did it happen?' : 'Which handle are you reporting?'}>
            <div className="seg" style={{ alignSelf: 'flex-start', flexWrap: 'wrap', maxWidth: '100%' }}>
              {PLATFORMS.map((pl) => <button key={pl} className={channel === pl ? 'on' : ''} onClick={() => setChannel(pl)}>{pl}</button>)}
            </div>
          </Field>
          {channel !== 'In person' && (
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}>@</span>
              <input className="input" style={{ paddingLeft: 26 }} placeholder={`their ${channel} handle`} value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9._]/gi, ''))} />
            </div>
          )}
        </div>
        <span className="eyebrow" style={{ marginTop: 4 }}>Reason</span>
        <div className="stack" style={{ gap: 10 }}>
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
  const { go, store } = useNav();
  const [step, setStep] = useState(1);
  const ret = store.returnTo || { name: 'safety-center' };
  const retLabel = ret.name === 'decisions' ? 'Active decisions' : ret.name === 'settings' ? 'Settings' : 'Safety center';
  const goRet = () => go(ret.name, ret.param);
  const [reason, setReason] = useState(null);
  const [statement, setStatement] = useState('');
  const decision = { type: 'Visibility hold', action: 'Your profile is hidden from Discover', cat: 'Harassment (P-3.2)', ai: true, human: true, window: '6 months', response: '5 days' };

  if (step === 3) {
    return (
      <FlowShell title="Appeal submitted" onBack={goRet}>
        <div className="tac stack" style={{ alignItems: 'center', gap: 16, padding: '40px 0' }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--green-w)', display: 'grid', placeItems: 'center', color: 'var(--green)' }}><Icon name="check" size={32} /></div>
          <h1 style={{ fontSize: 24 }}>Your appeal is in</h1>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 380 }}>A human reviewer will look at your case independently of the original decision. We aim to respond within 5 days. You’ll get a notice by email and in your Safety center.</p>
          <span className="badge neutral mono">Appeal ref · A-{Math.floor(200 + Math.random() * 99)}</span>
          <button className="btn primary" style={{ marginTop: 8 }} onClick={goRet}>Back to {retLabel}</button>
        </div>
      </FlowShell>
    );
  }

  return (
    <FlowShell title="Appeal a decision" step={step} total={2} onBack={() => (step > 1 ? setStep(step - 1) : goRet())}
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
            <Row k="Appeal window" v={<strong style={{ color: 'var(--ink)' }}>{decision.window} from the decision</strong>} />
            <Row k="Target response" v={<span>within {decision.response}</span>} />
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

/* ---------- legal gate (shared base for first-signup + policy-update) ---------- */
const VERB_LABEL = { confirm: 'Confirm', accept: 'Accept', acknowledge: 'Acknowledge', agree: 'Agree', consent: 'Consent (optional)' };

function LegalGateBase({ eyebrow, title, helper, items, ctaWord, footnote, onConfirm, onClose, closeLabel }) {
  const [checks, setChecks] = useState({});
  const [docOpen, setDocOpen] = useState(null);
  const required = items.filter((it) => it.required).map((it) => it.key);
  const allReq = required.every((k) => checks[k]);
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, filter: 'blur(6px)', opacity: 0.5, pointerEvents: 'none' }}><div className="app-frame"><div /><div className="app-scroll"><div className="disc-grid">{[0, 1, 2].map((i) => <div key={i} className="card" style={{ height: 300 }} />)}</div></div></div></div>
      <div className="overlay" style={{ position: 'fixed' }}>
        <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
          <div style={{ padding: '24px 26px 0' }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <span className="eyebrow">{eyebrow}</span>
              {onClose && <button className="btn icon sm ghost" onClick={onClose} aria-label={closeLabel || 'Close'}><Icon name="x" size={16} /></button>}
            </div>
            <h1 style={{ fontSize: 23, marginTop: 8 }}>{title}</h1>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{helper}</p>
          </div>
          <div style={{ padding: 20 }} className="stack">
            {items.map((it) => (
              <label key={it.key} className="card pad row" style={{ gap: 12, cursor: 'pointer', marginBottom: 10, alignItems: 'flex-start', borderColor: checks[it.key] ? 'var(--green)' : 'var(--line)' }} onClick={() => setChecks((c) => ({ ...c, [it.key]: !c[it.key] }))}>
                <span style={{ marginTop: 1 }}><CheckBox green on={!!checks[it.key]} /></span>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--ink)', fontSize: 14 }}>{it.title}</strong>
                    <span className={`badge ${it.verb === 'consent' ? 'ig' : it.verb === 'accept' || it.verb === 'agree' || it.verb === 'confirm' ? 'verified' : 'neutral'}`} style={{ fontSize: 10.5 }}>{VERB_LABEL[it.verb]}</span>
                    {it.version && <span className="mono faint" style={{ fontSize: 10.5 }}>{it.version}</span>}
                  </div>
                  {it.desc && <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, marginTop: 3 }}>{it.desc}</p>}
                  {it.doc && <button type="button" className="mono" onClick={(e) => { e.stopPropagation(); setDocOpen(it.docKey || it.key); }} style={{ fontSize: 11.5, color: 'var(--violet)', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-mono)' }}>Read full text →</button>}
                </div>
              </label>
            ))}
            <button className="btn primary lg block" style={{ marginTop: 4 }} disabled={!allReq} onClick={onConfirm}>{allReq ? ctaWord : 'Confirm required items to continue'}</button>
            {onClose && <button className="btn ghost block" style={{ marginTop: 8 }} onClick={onClose}>{closeLabel || 'Cancel'}</button>}
            <p className="faint tac" style={{ fontSize: 11.5, marginTop: 8 }}>{footnote}</p>
          </div>
        </div>
      </div>
      {docOpen && <LegalDocModal docKey={docOpen} onClose={() => setDocOpen(null)} />}
    </div>
  );
}

/* first-time legal acceptance — after auth, before onboarding */
function SignupLegalGate() {
  const { go, toast } = useNav();
  return (
    <LegalGateBase
      eyebrow="Before you start"
      title="Confirm the rules and notices"
      helper="To keep lite.dating safe and transparent, please confirm the required rules and notices. We record the document version and timestamp of your confirmation. Account signup is not conditional on personalized ad consent."
      ctaWord="Confirm & start onboarding"
      footnote="Ad/cookie consent is handled separately by Google’s certified consent system, not here."
      onConfirm={() => { toast('Confirmation recorded — let’s build your profile', 'ok'); go('onb'); }}
      onClose={() => go('signin')} closeLabel="Back to sign in"
      items={[
        { key: 'adult', title: 'I am 18 years or older', verb: 'confirm', required: true },
        { key: 'terms', title: 'Terms of Service', verb: 'accept', version: 'v1.0', doc: true, required: true, desc: 'The agreement between you and lite.dating.' },
        { key: 'privacy', title: 'Privacy Policy', verb: 'acknowledge', version: 'v1.0', doc: true, required: true, desc: 'How your data is collected, used and protected.' },
        { key: 'gdpr', title: 'GDPR Notice', verb: 'acknowledge', version: 'v1.0', doc: true, required: true, desc: 'Your rights under EU data-protection law.' },
        { key: 'kvkk', title: 'KVKK Aydınlatma Metni', verb: 'acknowledge', version: 'v1.0', doc: true, required: true, desc: 'Türkiye data-protection disclosure.' },
        { key: 'community', title: 'Community Guidelines / Safety Rules', verb: 'agree', version: 'v1.0', doc: true, docKey: 'rules', required: true, desc: 'How we treat each other here, and what isn’t allowed.' },
      ]} />
  );
}

/* policy-update gate — shown after login when policies change */
function LegalGate() {
  const { go, toast } = useNav();
  return (
    <LegalGateBase
      eyebrow="Before you continue"
      title="We’ve updated our policies"
      helper="Please review and confirm to keep using lite.dating. Your confirmation and its timestamp are recorded."
      ctaWord="Confirm & continue"
      footnote="Optional photo-verification consent can be changed anytime in Settings."
      onConfirm={() => { toast('Policies accepted — thanks', 'ok'); go('discover'); }}
      onClose={() => go('landing')} closeLabel="Sign out"
      items={[
        { key: 'terms', title: 'Terms of Service', verb: 'accept', version: 'v1.1', doc: true, required: true, desc: 'We clarified handle expiry and false-report consequences.' },
        { key: 'privacy', title: 'Privacy Policy', verb: 'acknowledge', version: 'v1.1', doc: true, required: true, desc: 'New detail on how verification selfies are stored.' },
        { key: 'gdpr', title: 'GDPR Notice', verb: 'acknowledge', version: 'v1.1', doc: true, required: true, desc: 'Updated lawful-basis table for EU users.' },
        { key: 'kvkk', title: 'KVKK Aydınlatma Metni', verb: 'acknowledge', version: 'v1.1', doc: true, required: true, desc: 'Türkiye data-protection disclosure refreshed.' },
        { key: 'photo', title: 'Photo verification consent', verb: 'consent', doc: true, docKey: 'privacy', required: false, desc: 'Optional: keep a reusable reference selfie. You can decline.' },
      ]} />
  );
}

/* ---------- full safety center ---------- */
function SafetyCenter() {
  const { go, store } = useNav();
  const goReport = () => { store.setReturnTo({ name: 'safety-center' }); go('report'); };
  const goOff = () => { store.setReturnTo({ name: 'safety-center' }); go('report-offplatform'); };
  const groups = [
    ['Get help now', [
      ['flag', 'Report a user', 'Tell us what happened', goReport],
      ['shield', 'Report off-platform harm', 'Even if it happened on IG or Telegram', goOff],
    ]],
    ['Your decisions', [
      ['info', 'Appeal a decision', 'Ask for an independent human review', () => { store.setReturnTo({ name: 'safety-center' }); go('appeal'); }],
      ['eye', 'Active decisions', 'See any restrictions on your account', () => go('decisions')],
    ]],
    ['Your data & rules', [
      ['copy', 'Export your data', 'Download a copy of everything', () => go('data-export')],
      ['lock', 'Consent settings', 'Manage ad & verification consent', () => { store.setReturnTo({ name: 'safety-center' }); go('consent'); }],
      ['user', 'Community rules', 'What’s allowed and what isn’t', () => go('rules-app')],
      ['mail', 'Contact safety team', 'safety@lite.dating', () => go('safety-contact')],
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

/* ---------- active decisions / account status ---------- */
const STATUS_PREVIEWS = [
  ['good', 'Good standing'],
  ['hold', 'Visibility hold'],
  ['suspended', 'Suspended'],
  ['reverify', 'Re-verify'],
  ['appealing', 'Appeal in review'],
];

function StatusHero({ tone, icon, kicker, title, body }) {
  const bg = { green: 'var(--green-w)', amber: 'var(--amber-w)', red: 'var(--red-w)', cyan: 'color-mix(in oklch, var(--cyan), white 82%)' }[tone];
  const fg = { green: 'var(--green)', amber: 'color-mix(in oklch, var(--amber), black 18%)', red: 'var(--red)', cyan: 'oklch(0.45 0.09 230)' }[tone];
  return (
    <div className="card pad" style={{ background: bg, border: 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--surface)', display: 'grid', placeItems: 'center', color: fg, flex: 'none' }}><Icon name={icon} size={22} /></span>
      <div className="stack" style={{ gap: 5 }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: fg, fontWeight: 700 }}>{kicker}</span>
        <h2 style={{ fontSize: 22 }}>{title}</h2>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{body}</p>
      </div>
    </div>
  );
}

function DecisionNotice({ rows, reviewAi, reviewHuman }) {
  const allRows = [...rows];
  if (reviewAi || reviewHuman) {
    allRows.push(['Review', <span className="row" style={{ gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>{reviewAi && <span className="badge neutral">AI-assisted</span>}{reviewHuman && <span className="badge verified"><Icon name="check" />Human-reviewed</span>}</span>]);
  }
  return (
    <div className="card pad stack" style={{ gap: 12 }}>
      <span className="eyebrow">Decision notice</span>
      {allRows.map(([k, v], i) => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', gap: 16, alignItems: 'baseline', paddingTop: i ? 10 : 0, borderTop: i ? '1px solid var(--line-soft)' : 'none' }}>
          <span className="muted" style={{ fontSize: 13 }}>{k}</span>
          <span style={{ fontSize: 13.5, color: 'var(--ink)', textAlign: 'right' }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function AdsPausedNote() {
  return (
    <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
      <Icon name="eyeOff" size={17} style={{ color: 'var(--muted)', flex: 'none' }} />
      <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Personalized ads are paused</strong> while your account is under safety review. This is a precaution, not a punishment — your data isn’t used for ad targeting during this time.</p>
    </div>
  );
}

function DecisionNoticeModal({ n, onClose, onAppeal }) {
  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Decision notice</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: '12px 22px 22px' }} className="stack">
          <h2 style={{ fontSize: 20 }}>{n.decision}</h2>
          <div className="card pad stack" style={{ gap: 10, marginTop: 4 }}>
            <Row k="Reason category" v={n.reason} />
            <Row k="Policy code" v={<span className="mono">{n.policy}</span>} />
            <Row k="Action taken" v={n.action} />
            <Row k="Applied" v={n.applied} />
            <Row k="Appeal window" v={<strong style={{ color: 'var(--ink)' }}>{n.window}</strong>} />
            <Row k="Target response" v={n.response} />
            <Row k="Review" v={<span className="row" style={{ gap: 6, flexWrap: 'wrap' }}>{n.ai && <span className="badge neutral">AI-assisted</span>}{n.human && <span className="badge verified"><Icon name="check" />Human-reviewed</span>}</span>} />
          </div>
          <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none' }}>
            <strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>Your options</strong>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 4 }}>You can appeal for an independent human review within the appeal window. The decision stays in place until an appeal outcome is reached.</p>
          </div>
          {n.appeal && <button className="btn primary lg block" onClick={() => { onClose(); onAppeal(); }}><Icon name="info" size={16} />Appeal this decision</button>}
        </div>
      </div>
    </div>
  );
}

function ActiveDecisions() {
  const { go, store } = useNav();
  const [status, setStatus] = useState('hold');
  const [noticeOpen, setNoticeOpen] = useState(null);
  const NOTICES = {
    hold: { decision: 'Visibility hold', reason: 'Harassment', policy: 'P-3.2', action: 'Your profile is hidden from Discover', applied: '2 days ago', window: '6 months from the decision', response: 'within 5 days of appeal', ai: true, human: true, appeal: true },
    suspended: { decision: 'Suspension (7 days)', reason: 'Spam / solicitation', policy: 'P-5.1', action: 'Browsing and new requests are paused', applied: 'Today', window: '6 months from the decision', response: 'within 5 days of appeal', ai: true, human: true, appeal: true },
  };
  const openNotice = (k) => setNoticeOpen(NOTICES[k]);

  const views = {
    good: (
      <div className="stack" style={{ gap: 16 }}>
        <StatusHero tone="green" icon="check" kicker="All clear" title="Your account is in good standing" body="There are no restrictions on your account. Keep things kind and you’ll never see this page change." />
        <div className="card pad row" style={{ gap: 12 }}>
          <Icon name="shield" size={18} style={{ color: 'var(--green)', flex: 'none' }} />
          <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>If a decision is ever made about your account, it will appear here with a clear reason and your appeal options.</span>
        </div>
      </div>
    ),
    hold: (
      <div className="stack" style={{ gap: 16 }}>
        <StatusHero tone="amber" icon="eyeOff" kicker="Action taken" title="Your profile is on a visibility hold" body="Your profile is temporarily hidden from Discover while we review a report. You can still see your connections and appeal this decision." />
        <DecisionNotice reviewAi reviewHuman rows={[
          ['Decision', 'Visibility hold'],
          ['Reason', 'Harassment (P-3.2)'],
          ['Applied', '2 days ago'],
          ['Appeal window', <strong style={{ color: 'var(--ink)' }}>6 months from the decision</strong>],
          ['Target response', 'within 5 days of appeal'],
        ]} />
        <AdsPausedNote />
        <div className="row wrap" style={{ gap: 10 }}>
          <button className="btn primary" onClick={() => { store.setReturnTo({ name: 'decisions' }); go('appeal'); }}><Icon name="info" size={16} />Appeal this decision</button>
          <button className="btn ghost" onClick={() => openNotice('hold')}>Read full notice</button>
        </div>
      </div>
    ),
    suspended: (
      <div className="stack" style={{ gap: 16 }}>
        <StatusHero tone="red" icon="lock" kicker="Account restricted" title="Your account is suspended for 7 days" body="Browsing and new requests are paused until the suspension ends. Existing connections are unaffected. You can appeal for an independent human review." />
        <DecisionNotice reviewAi reviewHuman rows={[
          ['Decision', 'Suspension (7 days)'],
          ['Reason', 'Spam / solicitation (P-5.1)'],
          ['Applied', 'Today'],
          ['Ends', 'in 7 days'],
          ['Appeal window', <strong style={{ color: 'var(--ink)' }}>6 months from the decision</strong>],
        ]} />
        <div className="row wrap" style={{ gap: 10 }}>
          <button className="btn primary" onClick={() => { store.setReturnTo({ name: 'decisions' }); go('appeal'); }}><Icon name="info" size={16} />Appeal this decision</button>
          <button className="btn ghost" onClick={() => openNotice('suspended')}>Read full notice</button>
        </div>
      </div>
    ),
    reverify: (
      <div className="stack" style={{ gap: 16 }}>
        <StatusHero tone="cyan" icon="camera" kicker="One quick step" title="Re-verification required" body="To keep your account secure, we need a fresh private selfie. This happens after sign-in on a new device or a sensitive change. It takes under a minute." />
        <DecisionNotice reviewAi={false} reviewHuman={false} rows={[
          ['Trigger', 'New device + sensitive change'],
          ['What we need', 'One private selfie'],
          ['Your photos', 'Stay visible while you re-verify'],
        ]} />
        <div className="card pad" style={{ background: 'var(--green-w)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="lock" size={17} style={{ color: 'var(--green)', flex: 'none' }} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Your selfie stays private — never shown to other users, never used for ads. No government ID is required.</p>
        </div>
        <button className="btn primary" style={{ alignSelf: 'start' }} onClick={() => go('onb')}><Icon name="camera" size={16} />Start re-verification</button>
      </div>
    ),
    appealing: (
      <div className="stack" style={{ gap: 16 }}>
        <StatusHero tone="amber" icon="clock" kicker="In progress" title="Your appeal is being reviewed" body="A human reviewer is looking at your case independently of the original decision. We aim to respond within 5 days. The original visibility hold stays in place until then." />
        <DecisionNotice reviewAi={false} reviewHuman rows={[
          ['Appeal ref', <span className="mono">A-219</span>],
          ['About', 'Visibility hold · Harassment (P-3.2)'],
          ['Submitted', '1 day ago'],
          ['Target response', 'within 5 days'],
          ['Status', <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Awaiting human review</span>],
        ]} />
        <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="info" size={16} style={{ color: 'var(--violet)', flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>You’ll be notified by email and here when there’s an outcome. You don’t need to do anything else for now.</p>
        </div>
      </div>
    ),
  };

  return (
    <AppFrame title="Active decisions" actions={<button className="btn ghost sm" onClick={() => go('safety-center')}><Icon name="arrowL" size={15} />Safety center</button>}>
      <p className="muted" style={{ fontSize: 14, marginBottom: 16, maxWidth: 560 }}>Any decision about your account shows here with a plain-language reason and your options. Decisions are reasoned, and appeals get an independent human review.</p>
      <div className="seg" style={{ marginBottom: 22, flexWrap: 'wrap', maxWidth: '100%' }}>
        {STATUS_PREVIEWS.map(([k, label]) => <button key={k} className={status === k ? 'on' : ''} onClick={() => setStatus(k)}>{label}</button>)}
      </div>
      <div className="center-col fade-in" key={status} style={{ maxWidth: 640, margin: 0 }}>{views[status]}</div>
      {noticeOpen && <DecisionNoticeModal n={noticeOpen} onClose={() => setNoticeOpen(null)} onAppeal={() => { store.setReturnTo({ name: 'decisions' }); go('appeal'); }} />}
    </AppFrame>
  );
}

Object.assign(window, { ReportFlow, AppealFlow, LegalGate, SignupLegalGate, SafetyCenter, ActiveDecisions, FlowShell, RadioCard, Row });
