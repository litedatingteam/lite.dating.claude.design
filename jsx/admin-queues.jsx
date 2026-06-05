/* lite.dating — admin queue surfaces */

function QueueHead({ title, desc, count, hideSort }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
      <div><div className="row" style={{ gap: 10 }}><span className="eyebrow">{title}</span>{count != null && <span className="badge neutral">{count} in queue</span>}</div><p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{desc}</p></div>
      {!hideSort && <div className="row" style={{ gap: 8 }}><div className="seg"><button className="on">Newest</button><button>Priority</button></div></div>}
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
  const cases = window.TS.CASES;
  return (
    <div>
      <QueueHead title="Moderation queue" desc="Case-based review. Open a case to see evidence and apply a reasoned decision." count={cases.length} />
      <DataTable cols={['Case', 'Reason', 'Subject', 'Policy', 'Priority', 'Status', 'Age']}
        rows={cases.map((c) => ({ _onClick: () => onOpen(c), cells: [
          <span className="row" style={{ gap: 7 }}><span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{c.id}</span>{c.ai && <span className="badge neutral" style={{ fontSize: 10 }}>AI</span>}</span>,
          c.reason, <span className="mono muted">{c.subjectRef}</span>, <span className="faint" style={{ fontSize: 12 }}>{c.policy.split(' ')[0]}</span>, <SevBadge sev={c.priority} />, <StatusPill status={c.status} />, <span className="faint">{c.age}</span>,
        ] })) } />
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
          <span className="eyebrow">Admin actions</span>
          <div className="card pad stack" style={{ gap: 10 }}>
            <button className="btn ghost block" onClick={() => toast('Reassigned to moderator', 'ok')}>Reassign to moderator</button>
            <button className="btn ghost block" onClick={() => toast('Escalated for Owner review', 'warn')}>Escalate to Owner</button>
            <button className="btn ink block" onClick={() => { toast('Decision applied · logged', 'ok'); onBack(); }}>Apply decision…</button>
          </div>
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

Object.assign(window, { AdminModeration, AdminReportDetail, AdminAppeals, AdminIG, AdminPhoto, AdminReverify, AdminAdCompliance, QueueHead, QueueActions });
