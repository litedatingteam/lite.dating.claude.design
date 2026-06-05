/* lite.dating — Owner console (highest role: approvals, oversight, break-glass) */

const OWNER_USER = { handle: 'owner_halit', role: 'Owner', initials: 'HA' };

const SEV = {
  critical: ['risk', 'var(--red)', 'Critical'],
  high: ['pending', 'var(--amber)', 'High'],
  medium: ['neutral', 'var(--cyan)', 'Medium'],
};

function ApprovalCard({ a, onApprove, onDecline }) {
  const s = SEV[a.sev];
  const needsConfirm = a.sev === 'critical';
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="card pad stack" style={{ gap: 12 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 10 }}>
          <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{a.id}</span>
          <span className={`badge ${s[0]}`}><span className="dot" style={{ background: s[1] }} />{s[2]}</span>
          <span className="badge neutral">{a.kind}</span>
        </div>
        <span className="faint" style={{ fontSize: 12 }}>{a.when} ago · by <span className="mono">{a.by}</span></span>
      </div>
      <div>
        <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{a.subject}</strong>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{a.note}</p>
      </div>
      {needsConfirm && confirming && (
        <div className="card pad" style={{ background: 'var(--red-w)', border: 'none', display: 'flex', gap: 9 }}>
          <Icon name="shield" size={15} style={{ color: 'var(--red)', flex: 'none' }} />
          <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.45 }}>This action is irreversible and Owner-only. Confirm once more to apply — it will be recorded in the audit log.</span>
        </div>
      )}
      <div className="row" style={{ gap: 10 }}>
        {needsConfirm
          ? <button className="btn danger sm" style={{ flex: 1 }} onClick={() => { if (!confirming) { setConfirming(true); return; } onApprove(a); }}>{confirming ? 'Confirm & apply' : 'Approve'}</button>
          : <button className="btn primary sm" style={{ flex: 1 }} onClick={() => onApprove(a)}>Approve</button>}
        <button className="btn ghost sm" onClick={() => onDecline(a)}>Decline</button>
      </div>
    </div>
  );
}

function OwnerApprovals({ embed }) {
  const { toast } = useNav();
  const [items, setItems] = useState(() => window.TS.OWNER_APPROVALS.map((x) => ({ ...x })));
  const resolve = (a, verb) => { setItems((s) => s.filter((x) => x.id !== a.id)); toast(`${a.kind} ${verb} · logged`, verb === 'approved' ? 'ok' : 'warn'); };
  const list = embed ? items.slice(0, 3) : items;
  return (
    <div className="stack" style={{ gap: 12 }}>
      {!embed && <QueueHead title="Awaiting your approval" desc="Critical actions only the Owner can confirm: permanent bans, role changes, legal publishing, evidence downloads and ad-safe overrides." count={items.length} />}
      {list.length === 0
        ? <div className="card pad row" style={{ gap: 10, justifyContent: 'center', color: 'var(--muted)' }}><Icon name="check" size={16} style={{ color: 'var(--green)' }} />Nothing needs your approval right now.</div>
        : list.map((a) => <ApprovalCard key={a.id} a={a} onApprove={(x) => resolve(x, 'approved')} onDecline={(x) => resolve(x, 'declined')} />)}
    </div>
  );
}

function OwnerHome({ onNav }) {
  const M = window.TS.METRICS;
  const health = [
    ['Open safety cases', String(window.TS.CASES.length), 'flag', 'moderation'],
    ['Appeals pending', String(window.TS.APPEALS.length), 'info', 'appeals'],
    ['Ad-safe violations', '0', 'eye', 'ads'],
    ['Uptime (30d)', '99.98%', 'shield', null],
  ];
  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* business health — owner sees revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="kpi-grid">
        {M.revenue.map((k) => <KPI key={k.label} {...k} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }} className="how-grid">
        {/* approvals */}
        <div className="card pad stack" style={{ gap: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="eyebrow">Awaiting your approval</span>
            <button className="btn ghost sm" onClick={() => onNav('approvals')}>View all<Icon name="arrowR" size={14} /></button>
          </div>
          <OwnerApprovals embed />
        </div>
        {/* platform health + revenue chart */}
        <div className="stack" style={{ gap: 18 }}>
          <div className="card pad stack" style={{ gap: 12 }}>
            <span className="eyebrow">Platform health</span>
            {health.map(([label, val, icon, target]) => (
              <div key={label} className="row" style={{ justifyContent: 'space-between', gap: 10, cursor: target ? 'pointer' : 'default' }} onClick={() => target && onNav(target)}>
                <span className="row" style={{ gap: 9, fontSize: 13.5, color: 'var(--ink-soft)', minWidth: 0 }}><Icon name={icon} size={15} style={{ color: 'var(--violet)', flex: 'none' }} /><span style={{ whiteSpace: 'nowrap' }}>{label}</span></span>
                <strong style={{ color: 'var(--ink)', fontSize: 14, flex: 'none' }}>{val}</strong>
              </div>
            ))}
          </div>
          <div className="card pad stack" style={{ gap: 12 }}>
            <span className="eyebrow">Ad revenue · 12 days ($)</span>
            <MiniBars series={M.revenueSeries} color="var(--green)" height={84} />
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerBreakGlass() {
  const { toast } = useNav();
  const [armed, setArmed] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <div className="stack" style={{ gap: 18 }}>
      <QueueHead title="Break-glass access" desc="Emergency, time-boxed access to restricted data for incident response. Every use is reason-gated, watermarked and logged. Owner-only." />
      <div className="card pad stack" style={{ gap: 14, borderColor: armed ? 'var(--red)' : 'var(--line)' }}>
        <div className="row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div className="row" style={{ gap: 12 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: armed ? 'var(--red-w)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: armed ? 'var(--red)' : 'var(--muted)', flex: 'none' }}><Icon name="lock" size={20} /></span>
            <div><strong style={{ color: 'var(--ink)' }}>Emergency access</strong><p className="muted" style={{ fontSize: 13 }}>{armed ? 'Armed — expires automatically in 30 minutes' : 'Currently disabled'}</p></div>
          </div>
          <span className={`badge ${armed ? 'risk' : 'verified'}`}>{armed ? 'Armed' : 'Secure'}</span>
        </div>
        {!armed && (
          <Field label="Reason (required)" hint="Recorded with your identity and timestamp.">
            <input className="input" placeholder="e.g. Investigate active abuse incident C-4820" value={reason} onChange={(e) => setReason(e.target.value)} />
          </Field>
        )}
        {armed
          ? <button className="btn soft" onClick={() => { setArmed(false); toast('Break-glass access ended · logged', 'ok'); }}>End emergency access</button>
          : <button className="btn danger" disabled={!reason} onClick={() => { setArmed(true); toast('Break-glass armed · logged', 'warn'); }}><Icon name="shield" size={16} />Arm emergency access</button>}
      </div>
      <div>
        <span className="eyebrow">Recent break-glass events</span>
        <div style={{ marginTop: 10 }}>
          <DataTable cols={['Actor', 'Reason', 'When', 'Duration']} rows={window.TS.BREAKGLASS.map((b) => ({ cells: [<span className="mono" style={{ color: 'var(--ink)', fontWeight: 600 }}>{b.actor}</span>, b.reason, b.when, b.dur] }))} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Owner-only: section-by-section legal editor ---------- */
function OwnerLegalEditor() {
  const { toast } = useNav();
  const L = window.LEGAL;
  const keys = Object.keys(L);
  const [docs, setDocs] = useState(() => {
    const o = {};
    keys.forEach((k) => {
      const d = L[k];
      o[k] = {
        title: d.title, version: d.version,
        sections: d.sections.map((s) => ({ title: s, body: `This section sets out “${s}” for the ${d.title}. Edit the full clause text here — it is versioned and, once published, shown to users through the legal update gate.` })),
      };
    });
    return o;
  });
  const [active, setActive] = useState(keys[0]);
  const [dirty, setDirty] = useState(false);
  const doc = docs[active];

  const update = (fn) => { setDocs((prev) => ({ ...prev, [active]: fn(structuredClone(prev[active])) })); setDirty(true); };
  const setSection = (i, patch) => update((d) => { d.sections[i] = { ...d.sections[i], ...patch }; return d; });
  const addSection = () => update((d) => { d.sections.push({ title: 'New section', body: '' }); return d; });
  const removeSection = (i) => update((d) => { d.sections.splice(i, 1); return d; });
  const move = (i, dir) => update((d) => { const j = i + dir; if (j < 0 || j >= d.sections.length) return d; const t = d.sections[i]; d.sections[i] = d.sections[j]; d.sections[j] = t; return d; });
  const bump = (v) => { const m = v.match(/v(\d+)\.(\d+)/); return m ? `v${m[1]}.${Number(m[2]) + 1}` : 'v1.1'; };
  const [vtab, setVtab] = useState('newest');
  const PREV = {
    privacy: [['v0.9', '12 Mar 2026', 'Pre-launch draft'], ['v0.8', '2 Feb 2026', 'Added verification-selfie clause']],
    terms: [['v0.9', '12 Mar 2026', 'Clarified 14-day handle window'], ['v0.8', '2 Feb 2026', 'Initial acceptable-use rules']],
    gdpr: [['v0.9', '12 Mar 2026', 'Lawful-basis table added']],
    kvkk: [['v0.9', '12 Mar 2026', 'İlk taslak']],
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <QueueHead hideSort title="Legal documents" desc="Edit each policy section by section. Saving keeps a draft; publishing bumps the version and triggers the in-app legal update gate for all users." />

      <div className="seg" style={{ alignSelf: 'flex-start', flexWrap: 'wrap', maxWidth: '100%' }}>
        {keys.map((k) => <button key={k} className={active === k ? 'on' : ''} onClick={() => setActive(k)}>{L[k].short}</button>)}
      </div>

      <div className="seg" style={{ alignSelf: 'flex-start' }}>
        <button className={vtab === 'newest' ? 'on' : ''} onClick={() => setVtab('newest')}>Newest</button>
        <button className={vtab === 'previous' ? 'on' : ''} onClick={() => setVtab('previous')}>Previous</button>
      </div>

      {vtab === 'previous' ? (
        <div className="stack" style={{ gap: 10 }}>
          <p className="muted" style={{ fontSize: 13.5 }}>Published versions of <strong style={{ color: 'var(--ink)' }}>{doc.title}</strong>. These are read-only records kept for audit.</p>
          <div className="card pad row" style={{ justifyContent: 'space-between', background: 'var(--green-w)', border: 'none' }}>
            <div><div className="row" style={{ gap: 8, alignItems: 'center' }}><strong style={{ color: 'var(--ink)' }}>{doc.version}</strong><span className="badge verified" style={{ fontSize: 10.5 }}><Icon name="check" />Live</span></div><p className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Current published version</p></div>
            <button className="btn ghost sm" onClick={() => setVtab('newest')}>Edit current</button>
          </div>
          {(PREV[active] || []).map(([v, date, note]) => (
            <div key={v} className="card pad row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div><div className="row" style={{ gap: 8, alignItems: 'center' }}><span className="mono" style={{ fontWeight: 700, color: 'var(--ink)' }}>{v}</span><span className="badge neutral" style={{ fontSize: 10.5 }}>Archived</span></div><p className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{date} · {note}</p></div>
              <div className="row" style={{ gap: 8 }}><button className="btn ghost sm" onClick={() => toast(`Viewing ${doc.title} ${v}`)}>View</button><button className="btn soft sm" onClick={() => toast(`Restored ${v} as a new draft`, 'ok')}>Restore as draft</button></div>
            </div>
          ))}
        </div>
      ) : (<>

      <div className="card pad row" style={{ justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div className="row" style={{ gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name="info" size={19} /></span>
          <div>
            <div className="row" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{doc.title}</strong><span className="badge neutral mono" style={{ fontSize: 10.5 }}>{doc.version}</span>{dirty && <span className="badge pending" style={{ fontSize: 10.5 }}><span className="dot" style={{ background: 'var(--amber)' }} />Unsaved draft</span>}</div>
            <p className="muted" style={{ fontSize: 12.5 }}>{doc.sections.length} sections · {L[active].contact}</p>
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost sm" disabled={!dirty} onClick={() => { setDirty(false); toast('Draft saved', 'ok'); }}>Save draft</button>
          <button className="btn ink sm" onClick={() => { const nv = bump(doc.version); update((d) => { d.version = nv; return d; }); setDirty(false); toast(`${doc.title} ${nv} published · legal gate armed · logged`, 'warn'); }}><Icon name="star" size={14} />Publish {bump(doc.version)}</button>
        </div>
      </div>

      <div className="stack" style={{ gap: 12 }}>
        {doc.sections.map((s, i) => (
          <div key={i} className="card pad stack" style={{ gap: 10 }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="mono faint" style={{ fontSize: 12, width: 22, flex: 'none', paddingTop: 12 }}>{String(i + 1).padStart(2, '0')}</span>
              <input className="input" value={s.title} onChange={(e) => setSection(i, { title: e.target.value })} style={{ fontWeight: 600 }} />
              <div className="row" style={{ gap: 4, flex: 'none' }}>
                <button className="btn icon sm ghost" title="Move up" disabled={i === 0} onClick={() => move(i, -1)}><Icon name="chevD" size={15} style={{ transform: 'rotate(180deg)' }} /></button>
                <button className="btn icon sm ghost" title="Move down" disabled={i === doc.sections.length - 1} onClick={() => move(i, 1)}><Icon name="chevD" size={15} /></button>
                <button className="btn icon sm ghost" title="Remove section" onClick={() => removeSection(i)} style={{ color: 'var(--red)' }}><Icon name="x" size={15} /></button>
              </div>
            </div>
            <textarea className="textarea" value={s.body} onChange={(e) => setSection(i, { body: e.target.value })} style={{ minHeight: 84, marginLeft: 32 }} placeholder={`Write the “${s.title}” clause…`} />
          </div>
        ))}
        <button className="btn ghost" style={{ alignSelf: 'flex-start' }} onClick={addSection}><Icon name="plus" size={16} />Add section</button>
      </div>

      <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 10 }}>
        <Icon name="info" size={16} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} />
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Publishing is an Owner-only action. It bumps the version, records who published it and when, and requires every user to re-accept or acknowledge on their next login. Drafts are not shown to users.</p>
      </div>
      </>)}
    </div>
  );
}

function OwnerApp() {
  const { go } = useNav();
  const [view, setView] = useState('home');
  const nav = [
    { items: [['home', 'Owner home', 'grid'], ['approvals', 'Approvals', 'shield', window.TS.OWNER_APPROVALS.length]] },
    { label: 'Oversight', items: [['revenue', 'Revenue', 'info'], ['roles', 'Roles & permissions', 'lock'], ['legal', 'Legal & publishing', 'star'], ['audit', 'Audit log', 'copy']] },
    { label: 'Controls', items: [['breakglass', 'Break-glass', 'eye']] },
    { label: 'Switch', items: [['admin', 'Admin console', 'compass'], ['exit', 'Exit to site', 'logout']] },
  ];
  const onNav = (k) => { if (k === 'exit') return go('landing'); if (k === 'admin') return go('admin'); setView(k); };
  const titles = { home: 'Owner home', approvals: 'Approvals', revenue: 'Revenue', roles: 'Roles & permissions', legal: 'Legal & publishing', audit: 'Audit log', breakglass: 'Break-glass access' };
  const screens = {
    home: <OwnerHome onNav={setView} />,
    approvals: <OwnerApprovals />,
    revenue: <AdminRevenue />,
    roles: <AdminRoles />,
    legal: <OwnerLegalEditor />,
    audit: <AdminAudit />,
    breakglass: <OwnerBreakGlass />,
  };
  return (
    <OpsFrame kind="owner" nav={nav} active={view} onNav={onNav} title={titles[view]} user={OWNER_USER}
      actions={<span className="badge" style={{ background: 'var(--ink)', color: 'white', border: 'none' }}><Icon name="lock" size={12} />Owner</span>}>
      {screens[view]}
    </OpsFrame>
  );
}

window.OwnerApp = OwnerApp;
