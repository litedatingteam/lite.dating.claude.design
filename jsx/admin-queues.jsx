/* lite.dating — admin queue surfaces */

function QueueHead({ title, desc, count, hideSort, sort, onSort }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
      <div><div className="row" style={{ gap: 10 }}><span className="eyebrow">{title}</span>{count != null && <span className="badge neutral">{count} in queue</span>}</div><p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{desc}</p></div>
      {!hideSort && <div className="row" style={{ gap: 8 }}><div className="seg"><button className={!sort || sort === 'newest' ? 'on' : ''} onClick={() => onSort && onSort('newest')}>Newest</button><button className={sort === 'priority' ? 'on' : ''} onClick={() => onSort && onSort('priority')}>Priority</button></div></div>}
    </div>
  );
}

function QueueActions({ onA, onR, aLabel = 'Approve', rLabel = 'Reject' }) {
  const { toast } = useNav();
  return (
    <div className="row" style={{ gap: 6 }}>
      <button className="btn sm" style={{ height: 30, background: 'var(--green-w)', color: 'var(--green)', border: 'none' }} onClick={(e) => { e.stopPropagation(); toast(aLabel + 'd · logged', 'ok'); }}><Icon name="check" size={13} />{aLabel}</button>
      <button className="btn sm" style={{ height: 30, background: 'var(--red-w)', color: 'var(--red)', border: 'none' }} onClick={(e) => { e.stopPropagation(); toast(rLabel + 'ed · logged', 'warn'); }}>{rLabel}</button>
    </div>
  );
}

function AdminModeration({ onOpen }) {
  const [sort, setSort] = useState('newest');
  const SEV_RANK = { critical: 0, high: 1, medium: 2, med: 2, low: 3 };
  const cases = [...window.TS.CASES].sort((a, b) => sort === 'priority' ? (SEV_RANK[a.priority] ?? 9) - (SEV_RANK[b.priority] ?? 9) : 0);
  return (
    <div>
      <QueueHead title="Moderation queue" desc="Case-based review. Open a case to see evidence and apply a reasoned decision." count={cases.length} sort={sort} onSort={setSort} />
      <DataTable cols={['Case', 'Reason', 'Subject', 'Policy', 'Priority', 'Status', 'Age']}
        rows={cases.map((c) => ({ _onClick: () => onOpen(c), cells: [
          <span className="row" style={{ gap: 7 }}><span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{c.id}</span>{c.ai && <span className="badge neutral" style={{ fontSize: 10 }}>AI</span>}</span>,
          c.reason, <span className="mono muted">{c.subjectRef}</span>, <span className="faint" style={{ fontSize: 12 }}>{c.policy.split(' ')[0]}</span>, <SevBadge sev={c.priority} />, <StatusPill status={c.status} />, <span className="faint">{c.age}</span>,
        ] })) } />
    </div>
  );
}

function AdminDecisionConsole({ c, onBack }) {
  const { toast } = useNav();
  const TEMPLATES = window.TS.POLICY_TEMPLATES.map((t) => `${t.code} · ${t.title}`);
  const ACTIONS = ['No action', 'Warning', 'Visibility hold', 'Temporary suspension', 'Re-verification required', 'Escalate permanent ban to Owner', 'Escalate evidence export to Owner'];
  const [tpl, setTpl] = useState(TEMPLATES[0]);
  const [action, setAction] = useState('Warning');
  const [sev, setSev] = useState('Medium');
  const [internal, setInternal] = useState('');
  const [notice, setNotice] = useState('');
  const isEscalate = action.startsWith('Escalate');
  const canApply = action && internal.trim() && (isEscalate || notice.trim());
  return (
    <div className="card pad stack" style={{ gap: 12 }}>
      <span className="eyebrow">Decision console</span>
      <Field label="Policy template"><Dropdown value={tpl} onChange={setTpl} options={TEMPLATES} /></Field>
      <Field label="Action"><Dropdown value={action} onChange={setAction} options={ACTIONS} /></Field>
      <Field label="Severity"><div className="seg" style={{ alignSelf: 'flex-start' }}>{['Low', 'Medium', 'High'].map((s) => <button key={s} className={sev === s ? 'on' : ''} onClick={() => setSev(s)}>{s}</button>)}</div></Field>
      <Field label="Internal note (required)" hint="Visible to staff only · written to audit log"><textarea className="textarea" style={{ minHeight: 64 }} value={internal} onChange={(e) => setInternal(e.target.value)} placeholder="Why this decision…" /></Field>
      {!isEscalate && <Field label="User-facing reasoned notice (required)" hint="The person sees this exact text with their decision"><textarea className="textarea" style={{ minHeight: 64 }} value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="Plain-language reason for the user…" /></Field>}
      {isEscalate && <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 9 }}><Icon name="shield" size={15} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} /><span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>This action is Owner-only. Escalating sends the case to the Owner approval queue with your note attached.</span></div>}
      {/* audit preview */}
      <div className="card pad stack" style={{ gap: 6, background: 'var(--surface-2)', border: 'none' }}>
        <span className="eyebrow">Audit log preview</span>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-soft)' }}>actor=admin_derya · case={c.id} · action={action} · sev={sev} · policy={tpl.split(' · ')[0]} · ts=now</span>
      </div>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn ghost" onClick={onBack}>Cancel</button>
        <button className="btn ink" style={{ flex: 1 }} disabled={!canApply} onClick={() => { toast(isEscalate ? 'Escalated to Owner · logged' : `Decision applied to ${c.id} · logged`, isEscalate ? 'warn' : 'ok'); onBack(); }}>{isEscalate ? 'Escalate to Owner' : 'Apply decision'}</button>
      </div>
    </div>
  );
}

function AdminReportDetail({ c, onBack }) {
  const { toast } = useNav();
  return (
    <div className="stack" style={{ gap: 16 }}>
      <button className="btn ghost sm" style={{ alignSelf: 'start' }} onClick={onBack}><Icon name="arrowL" size={15} />Back to queue</button>
      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}><span className="mono" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>{c.id}</span><SevBadge sev={c.priority} /><StatusPill status={c.status} />{c.ai && <span className="badge neutral"><Icon name="sparkle" size={12} />AI-flagged</span>}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }} className="how-grid">
        <div className="stack" style={{ gap: 14 }}>
          <div className="card pad stack" style={{ gap: 10 }}>
            <span className="eyebrow">Case detail</span>
            <Row k="Reason" v={c.reason} /><div className="hr" /><Row k="Subject" v={<span className="mono">{c.subjectRef}</span>} /><div className="hr" /><Row k="Policy" v={c.policy} /><div className="hr" /><Row k="Channel context" v={c.channel ? c.channel : '—'} />
          </div>
          <div className="card pad stack" style={{ gap: 8 }}><span className="eyebrow">Summary</span><p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{c.summary}</p></div>
          <div className="stack" style={{ gap: 10 }}><span className="eyebrow">Evidence · blurred by default</span><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>{Array.from({ length: c.evidence }).map((_, i) => <EvidenceItem key={i} index={i} kind="evidence" />)}</div></div>
        </div>
        <div className="stack" style={{ gap: 12 }}>
          <AdminDecisionConsole c={c} onBack={onBack} />
          <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none' }}><p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Admins act on cases, not on a browsable list of users. Every action here is written to the audit log.</p></div>
        </div>
      </div>
    </div>
  );
}

function AdminAppeals() {
  const [open, setOpen] = useState(null);
  const A = window.TS.APPEALS;
  return (
    <div>
      <QueueHead title="Appeals queue" desc="Independent human review of decisions. Appeals are read in full before any change." count={A.length} />
      <div className="stack" style={{ gap: 12 }}>
        {A.map((a) => (
          <div key={a.id} className="card pad stack" style={{ gap: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div className="row" style={{ gap: 10 }}><span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{a.id}</span><span className="mono muted">{a.userRef}</span><StatusPill status={a.status} /></div>
              <div className="row" style={{ gap: 8 }}>{a.ai && <span className="badge neutral">AI-assisted</span>}{a.human && <span className="badge verified"><Icon name="check" />Human</span>}<span className="faint" style={{ fontSize: 12 }}>Deadline {a.deadline}</span></div>
            </div>
            <div className="row" style={{ gap: 18, flexWrap: 'wrap' }}><Row k="Decision" v={a.decision} /><Row k="Action" v={a.action} /><Row k="Reason" v={a.reason} /></div>
            {a.statement && <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', padding: '10px 12px', borderRadius: 'var(--r-sm)' }}>“{a.statement}”</p>}
            {a.status !== 'denied' && <div className="row" style={{ gap: 8 }}><QueueActions aLabel="Overturn" rLabel="Uphold" /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function VerifyQueue({ title, desc, data, cols, render }) {
  return (
    <div>
      <QueueHead title={title} desc={desc} count={data.length} />
      <DataTable cols={cols} rows={data.map(render)} />
    </div>
  );
}
function MaskedHandle({ handle }) {
  const { toast } = useNav();
  const [shown, setShown] = useState(false);
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState('');
  if (shown) return <span className="mono" style={{ position: 'relative', color: 'var(--ink)' }} title="Revealed · watermarked · logged">{handle}<span style={{ marginLeft: 6, fontSize: 9, color: 'var(--faint)', letterSpacing: '0.08em' }}>· logged</span></span>;
  if (asking) return (
    <span className="row" style={{ gap: 5 }}>
      <input className="input" placeholder="reason…" value={reason} onChange={(e) => setReason(e.target.value)} style={{ height: 30, fontSize: 12, padding: '4px 8px', width: 110 }} />
      <button className="btn sm" style={{ height: 30 }} disabled={!reason} onClick={() => { setShown(true); toast('Handle reveal logged to audit trail', 'warn'); }}>Reveal</button>
    </span>
  );
  return <button className="btn ghost sm" style={{ height: 30 }} onClick={() => setAsking(true)}><span className="mono" style={{ letterSpacing: '0.06em' }}>@••••••</span><Icon name="eye" size={13} /></button>;
}

function AdminIG() {
  return <VerifyQueue title="Instagram verification queue" desc="Confirm a handle belongs to this account. Handles are masked by default — reveal requires a reason and is watermarked and logged." data={window.TS.IG_QUEUE}
    cols={['Ref', 'User', 'Handle', 'Signal', 'Risk', 'Age', 'Action']}
    render={(q) => ({ cells: [<span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{q.id}</span>, <span className="mono muted">{q.userRef}</span>, <MaskedHandle handle={q.handle} />, q.signal, <SevBadge sev={q.risk} />, <span className="faint">{q.age}</span>, <QueueActions />] })} />;
}
function AdminPhoto() {
  return <VerifyQueue title="Photo verification queue" desc="Private selfies are matched to profile photos. Never shown to users, never used for ads." data={window.TS.PHOTO_QUEUE}
    cols={['Ref', 'User', 'Flag', 'Risk', 'Age', 'Action']}
    render={(q) => ({ cells: [<span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{q.id}</span>, <span className="mono muted">{q.userRef}</span>, q.flag, <SevBadge sev={q.risk} />, <span className="faint">{q.age}</span>, <QueueActions aLabel="Pass" rLabel="Fail" />] })} />;
}
function AdminTelegram() {
  return <VerifyQueue title="Telegram verification queue" desc="Telegram identity is bound to the account, not just the @username. Usernames are masked by default — reveal requires a reason and is watermarked and logged." data={window.TS.TG_QUEUE}
    cols={['Ref', 'User', 'Username', 'Account', 'Signal', 'Risk', 'Age', 'Action']}
    render={(q) => ({ cells: [<span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{q.id}</span>, <span className="mono muted">{q.userRef}</span>, <MaskedHandle handle={q.handle} />, <span className="mono faint" style={{ fontSize: 11 }}>{q.account}</span>, q.signal, <SevBadge sev={q.risk} />, <span className="faint">{q.age}</span>, <QueueActions />] })} />;
}
function AdminReverify() {
  return <VerifyQueue title="Re-verification queue" desc="Triggered by new devices, sensitive changes, or post-decision checks." data={window.TS.REVERIFY_QUEUE}
    cols={['Ref', 'User', 'Reason', 'Risk', 'Age', 'Action']}
    render={(q) => ({ cells: [<span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{q.id}</span>, <span className="mono muted">{q.userRef}</span>, q.reason, <SevBadge sev={q.risk} />, <span className="faint">{q.age}</span>, <QueueActions aLabel="Clear" rLabel="Hold" />] })} />;
}

function AdminAdCompliance() {
  const P = window.TS.AD_PLACEMENTS;
  return (
    <div>
      <QueueHead title="Ad compliance" desc="Where ads may and may not appear. Sensitive surfaces are hard-blocked." />
      <div className="card pad" style={{ background: 'var(--green-w)', border: 'none', display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}><Icon name="check" size={18} style={{ color: 'var(--green)', flex: 'none' }} /><p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}><strong>All policies passing.</strong> 0 ads detected near requests, accept/decline, unlocks, verification, reporting, appeals, or admin pages.</p></div>
      <DataTable cols={['Placement', 'Status', 'Label', 'Notes']}
        rows={P.map((p) => ({ cells: [<strong style={{ color: 'var(--ink)' }}>{p.slot}</strong>, <StatusPill status={p.status} />, p.label === '—' ? <span className="faint">—</span> : <span className="ad-label">{p.label}</span>, <span className="muted" style={{ fontSize: 12.5 }}>{p.note}</span>] })) } />
      <div className="card pad" style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="row" style={{ gap: 10 }}><Icon name="shield" size={18} style={{ color: 'var(--violet)' }} /><strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>Consent model</strong></div>
          <span className="badge verified"><Icon name="check" />CMP connected</span>
        </div>
        <ul className="muted" style={{ fontSize: 13, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
          <li>Ads/cookie consent is collected via Google’s certified CMP (EEA, UK, Switzerland) — not a homemade banner.</li>
          <li>Account signup is <strong>not</strong> conditional on personalized ad consent.</li>
          <li>Ads only render once ad eligibility <em>and</em> the user’s CMP consent state both allow it.</li>
        </ul>
      </div>
    </div>
  );
}

Object.assign(window, { AdminModeration, AdminReportDetail, AdminAppeals, AdminIG, AdminTelegram, AdminPhoto, AdminReverify, AdminAdCompliance, QueueHead, QueueActions });
