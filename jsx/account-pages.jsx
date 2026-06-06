/* lite.dating — account & safety pages: community rules, data export, blocked accounts, block modal */

/* ---------- community rules (public) ---------- */
function CommunityRules() {
  const { go, store } = useNav();
  const allowed = [
    ['Be real', 'Use your own recent photos and honest details. Authenticity is the whole point.'],
    ['Ask, don’t pressure', 'Request a handle once. A pass is a complete answer — no means no.'],
    ['Keep consent first', 'Only request channels you’ve verified. Handles reveal only when you both agree.'],
    ['Respect privacy', 'What’s shared here stays here. Don’t screenshot or repost others without consent.'],
  ];
  const notAllowed = [
    ['Harassment or threats', 'Unwanted contact, intimidation, hate, or threats of any kind.'],
    ['Impersonation & fakes', 'Pretending to be someone else, bots, or stolen photos.'],
    ['Spam & solicitation', 'Selling, scams, promotion, or off-platform recruitment.'],
    ['Anything involving minors', 'This is an 18+ service. Zero tolerance, reported to authorities where required.'],
    ['Sexual harassment', 'Unsolicited explicit content or pressure of any kind.'],
    ['Off-platform abuse', 'Harm that continues on Instagram or Telegram after a trade is still our concern.'],
  ];
  return (
    <div className="pub-page section">
      <PageHead eyebrow="Community guidelines" title="Be kind. Be real. Trade with consent." sub="Simple rules that keep lite.dating a calm place to meet people. Breaking them can lead to a hold, suspension, or removal." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 900 }} className="how-grid">
        <div className="stack" style={{ gap: 12 }}>
          <span className="row" style={{ gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--green)' }}><Icon name="check" size={16} />What we’re about</span>
          {allowed.map(([h, b]) => (
            <div key={h} className="card pad stack" style={{ gap: 4 }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{h}</strong><span className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{b}</span></div>
          ))}
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <span className="row" style={{ gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--red)' }}><Icon name="x" size={16} />Not allowed</span>
          {notAllowed.map(([h, b]) => (
            <div key={h} className="card pad stack" style={{ gap: 4 }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{h}</strong><span className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{b}</span></div>
          ))}
        </div>
      </div>
      <div className="card pad" style={{ marginTop: 22, maxWidth: 900, background: 'var(--ink)', color: 'white', border: 'none', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon name="shield" size={22} style={{ color: 'white', flex: 'none' }} />
        <p style={{ fontSize: 14.5, color: 'white', fontWeight: 500, flex: 1, minWidth: 240 }}>See something off? Reporting is quick and the reported person never learns who reported them.</p>
        <button className="btn" style={{ background: 'white', color: 'var(--ink)', border: 'none' }} onClick={() => { store && store.setReturnTo && store.setReturnTo({ name: 'rules' }); go('report'); }}>Report a user<Icon name="arrowR" size={15} /></button>
      </div>
    </div>
  );
}

/* ---------- data export (in-app) ---------- */
function DataExport() {
  const { go } = useNav();
  const [state, setState] = useState('idle'); // idle | preparing | ready
  useEffect(() => {
    if (state !== 'preparing') return;
    const t = setTimeout(() => setState('ready'), 1600);
    return () => clearTimeout(t);
  }, [state]);
  const included = [
    ['user', 'Profile', 'Name, age, city, bio, interests, photos'],
    ['link', 'Connections & requests', 'Sent, received, and mutual handle trades'],
    ['shield', 'Verification status', 'Which channels you verified (not the selfie image)'],
    ['gear', 'Account & settings', 'Email, notification and consent preferences'],
  ];
  return (
    <AppFrame title="Export your data" actions={<button className="btn ghost sm" onClick={() => go('safety-center')}><Icon name="arrowL" size={15} />Safety center</button>}>
      <div className="center-col stack" style={{ gap: 18, maxWidth: 560, margin: 0 }}>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>Get a copy of everything we hold about you, in a portable format. Your private verification selfie is never included in exports.</p>
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">What’s included</span>
          {included.map(([icon, h, d]) => (
            <div key={h} className="card pad row" style={{ gap: 14 }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={18} /></span>
              <div><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{h}</strong><p className="muted" style={{ fontSize: 13 }}>{d}</p></div>
            </div>
          ))}
        </div>
        {state === 'idle' && <button className="btn primary lg block" onClick={() => setState('preparing')}><Icon name="copy" size={17} />Request my data</button>}
        {state === 'preparing' && <div className="card pad row" style={{ gap: 12, justifyContent: 'center' }}><span className="spinner" /><span className="muted" style={{ fontSize: 14 }}>Preparing your export…</span></div>}
        {state === 'ready' && (
          <div className="card pad" style={{ background: 'var(--green-w)', border: 'none', display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div className="row" style={{ gap: 10 }}><Icon name="check" size={18} style={{ color: 'var(--green)' }} /><span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Your export is ready.</span></div>
            <button className="btn soft sm"><Icon name="copy" size={14} />Download .zip</button>
          </div>
        )}
        <p className="faint" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Exports are also emailed to you and available for 7 days. Questions? <span className="mono" style={{ color: 'var(--violet)' }}>privacy@lite.dating</span></p>
      </div>
    </AppFrame>
  );
}

/* ---------- blocked accounts (in-app) ---------- */
function BlockedAccounts() {
  const { go } = useNav();
  const [blocked, setBlocked] = useState([]);
  return (
    <AppFrame title="Blocked accounts" actions={<button className="btn ghost sm" onClick={() => go('safety-center')}><Icon name="arrowL" size={15} />Safety center</button>}>
      <div className="center-col stack" style={{ gap: 16, maxWidth: 560, margin: 0 }}>
        <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="info" size={17} style={{ color: 'var(--violet)', flex: 'none' }} />
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Blocking someone hides you from each other completely and cancels any pending requests between you. They’re never told they were blocked.</p>
        </div>
        {blocked.length === 0
          ? <EmptyState icon="x" title="You haven’t blocked anyone" body="When you block someone, they’ll appear here so you can unblock them later if you change your mind." />
          : <div className="stack" style={{ gap: 10 }}>
              {blocked.map((b) => (
                <div key={b} className="card pad row" style={{ justifyContent: 'space-between' }}>
                  <div className="row" style={{ gap: 12 }}><Avatar size={40} tint={0} /><strong style={{ color: 'var(--ink)' }}>{b}</strong></div>
                  <button className="btn ghost sm" onClick={() => setBlocked((s) => s.filter((x) => x !== b))}>Unblock</button>
                </div>
              ))}
            </div>}
      </div>
    </AppFrame>
  );
}

/* ---------- reusable block modal ---------- */
function BlockModal({ name, onClose, onConfirm }) {
  const { toast } = useNav();
  const [alsoReport, setAlsoReport] = useState(false);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div style={{ padding: 26 }} className="stack">
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--red-w)', display: 'grid', placeItems: 'center', color: 'var(--red)', marginBottom: 14 }}><Icon name="x" size={22} /></div>
          <h2 style={{ fontSize: 21 }}>Block {name}?</h2>
          <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8 }}>You’ll be hidden from each other and any pending requests between you are cancelled. {name} won’t be notified. You can unblock from the Safety center.</p>
          <label className="card pad row" style={{ gap: 10, marginTop: 16, cursor: 'pointer', alignItems: 'flex-start' }} onClick={() => setAlsoReport(!alsoReport)}>
            <span style={{ marginTop: 1 }}><CheckBox on={alsoReport} /></span>
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.45 }}>Also report {name} to the safety team</span>
          </label>
          <div className="row" style={{ gap: 10, marginTop: 22 }}>
            <button className="btn ghost lg" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button className="btn danger lg" style={{ flex: 1 }} onClick={() => { onClose(); onConfirm(alsoReport); }}>Block</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ad experience / ad-safe states ---------- */
function AdExperience() {
  const { go, toast } = useNav();
  const [consent, setConsent] = useState(true); // personalized ads consent (via CMP)
  const state = consent ? 'personalized' : 'nonpersonalized';

  const SafeChip = ({ tone, icon, children }) => {
    const c = { green: 'var(--green)', amber: 'color-mix(in oklch, var(--amber), black 16%)', red: 'var(--red)', muted: 'var(--muted)' }[tone];
    const bg = { green: 'var(--green-w)', amber: 'var(--amber-w)', red: 'var(--red-w)', muted: 'var(--surface-2)' }[tone];
    return <span className="badge" style={{ background: bg, color: c, border: 'none' }}><Icon name={icon} size={13} />{children}</span>;
  };

  // ad-safe state machine (spec 12.3): where ads may render
  const surfaces = [
    ['Discover & profiles', 'green', 'check', 'Ads may show — clearly labeled, in their own card'],
    ['Sensitive / flagged content', 'amber', 'eyeOff', 'Ads limited or non-personalized'],
    ['Requests, accept, unlock', 'red', 'x', 'Never — no ads near these actions'],
    ['Verification, report, appeal', 'red', 'x', 'Never — safety-critical, always ad-free'],
    ['Admin / moderator / evidence', 'red', 'x', 'Never — private, always blocked from ads'],
    ['Account under safety review', 'red', 'x', 'Personalized ads paused entirely'],
  ];

  return (
    <AppFrame title="Ad experience" actions={<button className="btn ghost sm" onClick={() => go('settings')}><Icon name="arrowL" size={15} />Settings</button>}>
      <div className="center-col stack" style={{ gap: 20, maxWidth: 600, margin: 0 }}>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>lite.dating is free and ad-supported with clearly labeled ads shown across the browsing experience. Nothing you can do here costs money, and ads never appear next to a request, an accept, verification, reporting, or appeals.</p>

        {/* current state */}
        <div className="card pad" style={{ background: 'var(--grad-soft)', border: 'none' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
            <span className="eyebrow">Your current ad experience</span>
            <SafeChip tone="green" icon="check">Ads active</SafeChip>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 17 }}>Ads keep lite.dating free</strong>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 6 }}>Whether you see personalized or non-personalized ads is set in your consent choices. Either way, the service stays fully usable — declining personalization never limits any feature.</p>
          <div className="hr" style={{ margin: '14px 0' }} />
          <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}><strong style={{ fontSize: 14, color: 'var(--ink)' }}>Ad choices</strong><p className="faint" style={{ fontSize: 12, marginTop: 2 }}>Personalization is managed through the certified consent system.</p></div>
            <button className="btn primary sm" onClick={() => toast('Opening consent options…')}><Icon name="shield" size={14} />Manage ad choices</button>
          </div>
        </div>

        {/* CMP card */}
        <div className="card pad row" style={{ gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name="shield" size={19} /></span>
            <div><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>Cookie & ad consent</strong><p className="muted" style={{ fontSize: 13 }}>Reopen Google’s certified consent options</p></div>
          </div>
          <button className="btn soft sm" onClick={() => toast('Google CMP would open here')}>Manage</button>
        </div>

        {/* where ads can appear — ad-safe states */}
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">Where ads can and can’t appear</span>
          <div className="card" style={{ overflow: 'hidden' }}>
            {surfaces.map(([label, tone, icon, desc], i) => (
              <div key={label} className="row" style={{ gap: 12, padding: '13px 16px', borderTop: i ? '1px solid var(--line-soft)' : 'none', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0 }}><strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>{label}</strong><p className="muted" style={{ fontSize: 12.5, lineHeight: 1.4 }}>{desc}</p></div>
                <SafeChip tone={tone} icon={icon}>{tone === 'green' ? 'Allowed' : tone === 'amber' ? 'Limited' : 'Never'}</SafeChip>
              </div>
            ))}
          </div>
        </div>

        <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="info" size={16} style={{ color: 'var(--violet)', flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>If your account is ever placed under a safety review, personalized ads pause automatically until it’s resolved. You can see any active decisions in the <button onClick={() => go('decisions')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--violet)', cursor: 'pointer', fontWeight: 600, fontSize: 12.5 }}>Safety center</button>.</p>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---------- in-app community rules + contact (stay inside the app) ---------- */
function CommunityRulesApp() {
  const { go, store } = useNav();
  const allowed = [
    ['Be real', 'Use your own recent photos and honest details.'],
    ['Ask, don’t pressure', 'Request a handle once. A pass is a complete answer.'],
    ['Keep consent first', 'Only request channels you’ve verified. Handles reveal only when you both agree.'],
    ['Respect privacy', 'Don’t screenshot or repost others without consent.'],
  ];
  const notAllowed = [
    ['Harassment or threats', 'Unwanted contact, intimidation, hate, or threats.'],
    ['Impersonation & fakes', 'Pretending to be someone else, bots, or stolen photos.'],
    ['Spam & solicitation', 'Selling, scams, promotion, or off-platform recruitment.'],
    ['Anything involving minors', '18+ only. Zero tolerance, reported to authorities where required.'],
    ['Sexual harassment', 'Unsolicited explicit content or pressure of any kind.'],
    ['Off-platform abuse', 'Harm that continues on IG or Telegram is still our concern.'],
  ];
  return (
    <AppFrame title="Community rules" actions={<button className="btn ghost sm" onClick={() => go('safety-center')}><Icon name="arrowL" size={15} />Safety center</button>}>
      <div className="center-col stack" style={{ gap: 18, maxWidth: 760, margin: 0 }}>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>Simple rules that keep lite.dating a calm place to meet people. Breaking them can lead to a hold, suspension, or removal.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="how-grid">
          <div className="stack" style={{ gap: 12 }}>
            <span className="row" style={{ gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--green)' }}><Icon name="check" size={16} />What we’re about</span>
            {allowed.map(([h, b]) => <div key={h} className="card pad stack" style={{ gap: 4 }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{h}</strong><span className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{b}</span></div>)}
          </div>
          <div className="stack" style={{ gap: 12 }}>
            <span className="row" style={{ gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--red)' }}><Icon name="x" size={16} />Not allowed</span>
            {notAllowed.map(([h, b]) => <div key={h} className="card pad stack" style={{ gap: 4 }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{h}</strong><span className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{b}</span></div>)}
          </div>
        </div>
        <div className="card pad row" style={{ gap: 14, alignItems: 'center', background: 'var(--ink)', border: 'none', flexWrap: 'wrap' }}>
          <Icon name="shield" size={22} style={{ color: 'white', flex: 'none' }} />
          <p style={{ fontSize: 14, color: 'white', fontWeight: 500, flex: 1, minWidth: 220 }}>See something off? Reporting is quick and the reported person never learns who reported them.</p>
          <button className="btn" style={{ background: 'white', color: 'var(--ink)', border: 'none' }} onClick={() => { store.setReturnTo({ name: 'rules-app' }); go('report'); }}>Report a user<Icon name="arrowR" size={15} /></button>
        </div>
      </div>
    </AppFrame>
  );
}

function SafetyContact() {
  const { go, toast } = useNav();
  const [msg, setMsg] = useState('');
  const aliases = [['safety@lite.dating', 'Safety concerns', 'shield'], ['abuse@lite.dating', 'Report abuse', 'flag'], ['privacy@lite.dating', 'Privacy & data', 'lock']];
  return (
    <AppFrame title="Contact safety team" actions={<button className="btn ghost sm" onClick={() => go('safety-center')}><Icon name="arrowL" size={15} />Safety center</button>}>
      <div className="center-col stack" style={{ gap: 18, maxWidth: 600, margin: 0 }}>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>Reach our safety team directly. For an urgent risk to someone’s life, please also contact local emergency services.</p>
        <div className="stack" style={{ gap: 10 }}>
          {aliases.map(([email, desc, icon]) => (
            <div key={email} className="card pad row" style={{ gap: 14 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={18} /></span>
              <div><div className="mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>{email}</div><div className="muted" style={{ fontSize: 13 }}>{desc}</div></div>
            </div>
          ))}
        </div>
        <div className="card pad stack" style={{ gap: 12 }}>
          <span className="eyebrow">Send a message</span>
          <Field label="What’s going on?" hint="A safety specialist will reply by email."><textarea className="textarea" style={{ minHeight: 110 }} placeholder="Describe your concern…" value={msg} onChange={(e) => setMsg(e.target.value)} /></Field>
          <button className="btn primary" style={{ alignSelf: 'flex-start' }} disabled={msg.trim().length < 10} onClick={() => { toast('Message sent to the safety team', 'ok'); setMsg(''); }}><Icon name="mail" size={16} />Send to safety team</button>
        </div>
      </div>
    </AppFrame>
  );
}

/* ---------- consent settings (separate, granular) ---------- */
function ConsentSettings() {
  const { go, toast, store } = useNav();
  const ret = store.returnTo || { name: 'safety-center' };
  const retLabel = ret.name === 'settings' ? 'Settings' : 'Safety center';
  const [c, setC] = useState({ ads: true, selfie: false, analytics: true });
  const set = (k, v) => { setC((s) => ({ ...s, [k]: v })); toast('Preference saved · logged', 'ok'); };
  const rows = [
    ['ads', 'Personalized ads', 'consent', 'Lets Google show ads based on your activity. Handled via Google’s certified consent system. Turning this off keeps the service fully usable with non-personalized ads.'],
    ['selfie', 'Reusable reference selfie', 'consent', 'Optional: store your verification selfie as a private reference so future photo changes review faster. Off by default. Never shown to others or used for ads.'],
    ['analytics', 'Product analytics', 'consent', 'Privacy-respecting usage analytics that help us improve lite.dating. No selling of data, ever.'],
  ];
  return (
    <AppFrame title="Consent settings" actions={<button className="btn ghost sm" onClick={() => go(ret.name, ret.param)}><Icon name="arrowL" size={15} />{retLabel}</button>}>
      <div className="center-col stack" style={{ gap: 16, maxWidth: 600, margin: 0 }}>
        <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>Manage the optional, consent-based processing. <strong style={{ color: 'var(--ink)' }}>None of these are required to use lite.dating</strong> — each change is recorded with a timestamp.</p>

        {rows.map(([k, title, verb, desc]) => (
          <div key={k} className="card pad row" style={{ gap: 14, justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ gap: 8, alignItems: 'center' }}><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{title}</strong><span className="badge ig" style={{ fontSize: 10.5 }}>Consent</span></div>
              <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{desc}</p>
            </div>
            <Switch checked={c[k]} onChange={(v) => set(k, v)} />
          </div>
        ))}

        <div className="card pad row" style={{ gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name="shield" size={19} /></span>
            <div><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>Google cookie & ad consent</strong><p className="muted" style={{ fontSize: 13 }}>Reopen the certified CMP options</p></div>
          </div>
          <button className="btn soft sm" onClick={() => toast('Google CMP would open here')}>Manage</button>
        </div>

        <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
          <Icon name="info" size={16} style={{ color: 'var(--violet)', flex: 'none' }} />
          <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>We log every consent change (what, when, and the document version) so you and we both have a clear record. You can withdraw any consent at any time.</p>
        </div>
      </div>
    </AppFrame>
  );
}

Object.assign(window, { CommunityRules, DataExport, BlockedAccounts, BlockModal, AdExperience, ConsentSettings, CommunityRulesApp, SafetyContact });
