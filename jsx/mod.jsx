/* lite.dating — moderator surfaces */

const MOD_USER = { handle: 'mod_eda', role: 'Moderator', initials: 'ES' };

function EvidenceItem({ index, kind }) {
  const { toast } = useNav();
  const [revealed, setRevealed] = useState(false);
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <div style={{ position: 'relative' }}>
        <Photo label={revealed ? '' : ''} tint={index} ratio="4 / 3" radius="0" style={revealed ? {} : { filter: 'blur(14px)' }} />
        {revealed && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
            <span className="mono" style={{ fontSize: 12, color: 'oklch(0.4 0.02 280 / 0.5)', transform: 'rotate(-18deg)', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.8 }}>
              mod_eda · {new Date().toLocaleDateString()}<br />confidential · logged
            </span>
          </div>
        )}
        {!revealed && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div className="stack" style={{ alignItems: 'center', gap: 8 }}><Icon name="eyeOff" size={22} style={{ color: 'var(--muted)' }} /><span className="ph-label">sensitive · hidden</span></div>
          </div>
        )}
      </div>
      <div className="row" style={{ justifyContent: 'space-between', padding: '10px 12px' }}>
        <span className="mono faint" style={{ fontSize: 11 }}>{kind} · item {index + 1}</span>
        {revealed
          ? <span className="badge verified" style={{ fontSize: 10.5 }}><Icon name="eye" />Revealed · logged</span>
          : asking
          ? <span className="row" style={{ gap: 6 }}>
              <input className="input" placeholder="Reason to reveal…" value={reason} onChange={(e) => setReason(e.target.value)} style={{ height: 30, fontSize: 12, padding: '4px 8px', width: 150 }} />
              <button className="btn sm" disabled={!reason} onClick={() => { setRevealed(true); toast('Reveal logged to audit trail', 'warn'); }} style={{ height: 30 }}>Reveal</button>
            </span>
          : <button className="btn soft sm" style={{ height: 30 }} onClick={() => setAsking(true)}><Icon name="eye" size={13} />Reveal with reason</button>}
      </div>
    </div>
  );
}

function HiddenField({ label, value }) {
  const { toast } = useNav();
  const [shown, setShown] = useState(false);
  return (
    <div className="card pad row" style={{ justifyContent: 'space-between', gap: 12 }}>
      <div><div className="muted" style={{ fontSize: 12 }}>{label}</div><div className="mono" style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600 }}>{shown ? value : '•••••• hidden'}</div></div>
      {!shown && <button className="btn ghost sm" onClick={() => { setShown(true); toast('Access logged to audit trail', 'warn'); }}><Icon name="eye" size={13} />Reveal · logged</button>}
    </div>
  );
}

function ModDashboard({ onOpen }) {
  const cases = window.TS.CASES;
  const summary = [
    ['Open', cases.filter((c) => c.status === 'open').length, 'var(--cyan)'],
    ['In review', cases.filter((c) => c.status === 'in-review').length, 'var(--amber)'],
    ['Escalated', cases.filter((c) => c.status === 'escalated').length, 'var(--red)'],
    ['Resolved today', 9, 'var(--green)'],
  ];
  return (
    <div className="stack" style={{ gap: 22 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="kpi-grid">
        {summary.map(([label, n, c]) => (
          <div key={label} className="card pad"><div className="row" style={{ gap: 8, marginBottom: 6 }}><span className="dot" style={{ background: c, width: 8, height: 8 }} /><span className="muted" style={{ fontSize: 12.5 }}>{label}</span></div><div style={{ fontSize: 30, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em' }}>{n}</div></div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }} className="how-grid">
        <div className="stack" style={{ gap: 12 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="eyebrow">Your assigned cases</span><span className="badge neutral">Newest first</span></div>
          <div className="stack" style={{ gap: 10 }}>
            {cases.map((c) => (
              <div key={c.id} className="card pad row" style={{ gap: 14, cursor: 'pointer', justifyContent: 'space-between' }} onClick={() => onOpen(c)}>
                <div className="row" style={{ gap: 12, minWidth: 0 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink)', flex: 'none' }}><Icon name="flag" size={17} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div className="row" style={{ gap: 8 }}><span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{c.id}</span>{c.ai && <span className="badge neutral" style={{ fontSize: 10 }}>AI-flagged</span>}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 2 }}>{c.reason} · <span className="muted">{c.subjectRef}</span></div>
                  </div>
                </div>
                <div className="row" style={{ gap: 8, flex: 'none' }}><SevBadge sev={c.priority} /><StatusPill status={c.status} /><span className="faint" style={{ fontSize: 12 }}>{c.age}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Shift</span>
          <div className="card pad stack" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Status</span><StatusPill status="on-shift" /></div>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Window</span><span style={{ fontSize: 13, color: 'var(--ink)' }}>18:00 – 00:00</span></div>
            <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted" style={{ fontSize: 13 }}>Handled today</span><strong style={{ color: 'var(--ink)' }}>38</strong></div>
            <div className="hr" />
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>You only see cases assigned to you. Browsing users or full profiles isn’t available to moderators by design.</p>
          </div>
          <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
            <Icon name="shield" size={16} style={{ color: 'var(--green)', flex: 'none' }} /><p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Every reveal and decision is recorded with your handle, a reason, and a timestamp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIONS = ['No action needed', 'Send warning', 'Visibility hold', 'Suspend 7 days', 'Escalate to senior'];

function ModCaseReview({ c, onBack }) {
  const { toast } = useNav();
  const [policy, setPolicy] = useState(c.policy);
  const [action, setAction] = useState(null);
  const [notice, setNotice] = useState('');
  return (
    <div className="stack" style={{ gap: 18 }}>
      <button className="btn ghost sm" style={{ alignSelf: 'start' }} onClick={onBack}><Icon name="arrowL" size={15} />Back to cases</button>

      <div className="row" style={{ justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 12 }}>
          <span className="mono" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>{c.id}</span>
          <SevBadge sev={c.priority} /><StatusPill status={c.status} />{c.ai && <span className="badge neutral"><Icon name="sparkle" size={12} />AI-flagged</span>}
        </div>
        <span className="faint" style={{ fontSize: 12.5 }}>Opened {c.age} ago</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }} className="how-grid">
        <div className="stack" style={{ gap: 16 }}>
          {/* minimum necessary data */}
          <div className="card pad stack" style={{ gap: 10 }}>
            <span className="eyebrow">Case (minimum necessary data)</span>
            <Row k="Reason reported" v={c.reason} />
            <div className="hr" />
            <Row k="Subject" v={<span className="mono">{c.subjectRef}</span>} />
            <div className="hr" />
            <Row k="Mapped policy" v={c.policy} />
            <div className="hr" />
            <Row k="Reporter" v={<span className="muted">Anonymous to you</span>} />
          </div>

          <div className="card pad stack" style={{ gap: 8 }}>
            <span className="eyebrow">Report summary</span>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{c.summary}</p>
          </div>

          {/* evidence */}
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Evidence · {c.evidence} item{c.evidence === 1 ? '' : 's'} · blurred by default</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {Array.from({ length: c.evidence }).map((_, i) => <EvidenceItem key={i} index={i} kind="screenshot" />)}
            </div>
          </div>

          {/* hidden handle */}
          {c.channel && <HiddenField label="Traded handle (off-platform context)" value={c.channel === 'instagram' ? '@redacted.ig' : '@redacted_tg'} />}
        </div>

        {/* decision console */}
        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Decision console</span>
          <div className="card pad stack" style={{ gap: 14 }}>
            <Field label="Policy template">
              <select className="select" value={policy} onChange={(e) => setPolicy(e.target.value)}>
                {window.TS.POLICY_TEMPLATES.map((p) => <option key={p.code}>{p.code} {p.title}</option>)}
              </select>
            </Field>
            <div className="field">
              <label>Action</label>
              <div className="stack" style={{ gap: 8 }}>
                {ACTIONS.map((a) => (
                  <label key={a} className="row" style={{ gap: 10, cursor: 'pointer', fontSize: 13.5, color: 'var(--ink-soft)' }} onClick={() => setAction(a)}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid ' + (action === a ? 'var(--violet)' : 'var(--line)'), display: 'grid', placeItems: 'center', flex: 'none' }}>{action === a && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet)' }} />}</span>
                    {a}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Reasoned notice (sent to user)" hint="Required. Decisions must explain why.">
              <textarea className="textarea" style={{ minHeight: 90 }} placeholder="Explain the decision in plain language…" value={notice} onChange={(e) => setNotice(e.target.value)} />
            </Field>
            <button className="btn ink lg block" disabled={!action || !notice} onClick={() => { toast(`Decision applied to ${c.id} · logged`, 'ok'); onBack(); }}>Apply decision</button>
            <p className="faint" style={{ fontSize: 11.5, lineHeight: 1.5 }}>Applying records your handle, the policy, the action, and this notice to the audit trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModPolicyTemplates() {
  return (
    <div className="stack" style={{ gap: 12 }}>
      <span className="eyebrow">Policy templates · standardize decisions</span>
      <DataTable cols={['Code', 'Policy', 'Tone', 'Used (30d)', '']}
        rows={window.TS.POLICY_TEMPLATES.map((p) => ({ cells: [<span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{p.code}</span>, p.title, <span className="badge neutral">{p.tone}</span>, p.uses, <button className="btn ghost sm">Preview</button>] }))} />
    </div>
  );
}

function ModShiftNotes() {
  const notes = [
    ['mod_eda', '21:40', 'Watching a burst of look-alike profiles — see C-4820 cluster. Flagged to admin.'],
    ['mod_arif', '18:05', 'Handover: appeals A-217 awaiting human review. Nothing urgent open.'],
    ['system', '18:00', 'Shift started · evening window.'],
  ];
  const [draft, setDraft] = useState('');
  const { toast } = useNav();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.7fr', gap: 18, maxWidth: 900 }} className="how-grid">
      <div className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">Shift notes</span>
        <div className="card pad stack" style={{ gap: 0 }}>
          {notes.map(([who, time, text], i) => (
            <div key={i} className="row" style={{ gap: 12, padding: '12px 0', borderBottom: i < notes.length - 1 ? '1px solid var(--line-soft)' : 'none', alignItems: 'start' }}>
              <span className="mono faint" style={{ fontSize: 11.5, width: 44, flex: 'none' }}>{time}</span>
              <div><div className="mono" style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 600 }}>{who}</div><p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 2 }}>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">Add a note</span>
        <div className="card pad stack" style={{ gap: 10 }}>
          <textarea className="textarea" placeholder="Handover note for the next shift…" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button className="btn ink block" disabled={!draft} onClick={() => { setDraft(''); toast('Shift note added', 'ok'); }}>Post note</button>
        </div>
      </div>
    </div>
  );
}

function ModApp() {
  const { go } = useNav();
  const [view, setView] = useState('dashboard');
  const [activeCase, setActiveCase] = useState(null);
  const open = (c) => { setActiveCase(c); setView('case'); };
  const nav = [
    { items: [['dashboard', 'Dashboard', 'grid'], ['cases', 'My cases', 'flag', window.TS.CASES.length]] },
    { label: 'Reference', items: [['policy', 'Policy templates', 'info'], ['shift', 'Shift notes', 'bell']] },
    { label: 'Leave', items: [['exit', 'Exit to site', 'logout']] },
  ];
  const onNav = (k) => { if (k === 'exit') return go('landing'); if (k === 'cases') { setView('dashboard'); } else setView(k); };
  const titles = { dashboard: 'Moderation dashboard', case: activeCase ? `Case ${activeCase.id}` : 'Case', policy: 'Policy templates', shift: 'Shift notes' };
  return (
    <OpsFrame kind="mod" nav={nav} active={view === 'case' ? 'cases' : view} onNav={onNav} title={titles[view]} user={MOD_USER}
      banner={<PrivacyBanner text="Privacy mode · case-based access only · no user browsing · sensitive evidence blurred and logged on reveal" />}
      actions={<span className="badge neutral"><span className="dot" style={{ background: 'var(--green)' }} />On shift</span>}>
      {view === 'dashboard' && <ModDashboard onOpen={open} />}
      {view === 'case' && activeCase && <ModCaseReview c={activeCase} onBack={() => setView('dashboard')} />}
      {view === 'policy' && <ModPolicyTemplates />}
      {view === 'shift' && <ModShiftNotes />}
    </OpsFrame>
  );
}

window.ModApp = ModApp;
