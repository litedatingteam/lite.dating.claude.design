/* lite.dating — admin surfaces */

const ADMIN_USER = { handle: 'admin_halit', role: 'Owner', initials: 'HA' };

/* ---------- chart primitives (CSS only) ---------- */
function KPI({ label, value, delta, up }) {
  return (
    <div className="card pad">
      <div className="muted" style={{ fontSize: 12.5 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', marginTop: 4 }}>{value}</div>
      {delta && <div className="row" style={{ gap: 5, marginTop: 6 }}><Icon name={up ? 'arrowR' : 'arrowL'} size={13} style={{ color: up ? 'var(--green)' : 'var(--red)', transform: up ? 'rotate(-45deg)' : 'rotate(45deg)' }} /><span style={{ fontSize: 12.5, fontWeight: 600, color: up ? 'var(--green)' : 'var(--red)' }}>{delta}</span></div>}
    </div>
  );
}
function MiniBars({ series, color = 'var(--violet)', height = 120 }) {
  const max = Math.max(...series);
  return (
    <div className="row" style={{ alignItems: 'flex-end', gap: 5, height }}>
      {series.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: i === series.length - 1 ? color : `color-mix(in oklch, ${color}, white 55%)`, borderRadius: '4px 4px 2px 2px', transition: 'height .5s var(--ease)' }} />)}
    </div>
  );
}
function BarList({ rows, color = 'var(--violet)' }) {
  return (
    <div className="stack" style={{ gap: 12 }}>
      {rows.map(([label, pct]) => (
        <div key={label} className="stack" style={{ gap: 5 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{label}</span><span className="mono faint" style={{ fontSize: 12 }}>{pct}%</span></div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }} /></div>
        </div>
      ))}
    </div>
  );
}

function AdminOverview({ onNav }) {
  const M = window.TS.METRICS;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="kpi-grid">{M.kpis.map((k) => <KPI key={k.label} {...k} />)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }} className="how-grid">
        <div className="card pad stack" style={{ gap: 14 }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="eyebrow">Visitors · last 12 days</span><span className="badge verified">+18% wow</span></div>
          <MiniBars series={M.visitorsSeries} color="var(--cyan)" />
        </div>
        <div className="card pad stack" style={{ gap: 12 }}>
          <span className="eyebrow">Open ops</span>
          {[['Safety cases', window.TS.CASES.length, 'moderation'], ['Appeals', window.TS.APPEALS.length, 'appeals'], ['Photo queue', window.TS.PHOTO_QUEUE.length, 'photo'], ['IG queue', window.TS.IG_QUEUE.length, 'ig']].map(([l, n, k]) => (
            <div key={l} className="row" style={{ justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' }} onClick={() => onNav(k)}>
              <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{l}</span><span className="row" style={{ gap: 8 }}><strong style={{ color: 'var(--ink)' }}>{n}</strong><Icon name="chevR" size={14} style={{ color: 'var(--faint)' }} /></span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="how-grid">
        <div className="card pad stack" style={{ gap: 14 }}><span className="eyebrow">Traffic sources</span><BarList rows={M.sources} color="var(--violet)" /></div>
        <div className="card pad stack" style={{ gap: 14 }}><span className="eyebrow">Top countries</span><BarList rows={M.countries} color="var(--pink)" /></div>
      </div>
    </div>
  );
}

function AdminRevenue() {
  const M = window.TS.METRICS;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }} className="kpi-grid">{M.revenue.map((k) => <KPI key={k.label} {...k} />)}</div>
      <div className="card pad stack" style={{ gap: 14 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="eyebrow">Ad revenue · last 12 days (€)</span><span className="badge neutral">Google AdSense</span></div>
        <MiniBars series={M.revenueSeries} color="var(--green)" height={140} />
      </div>
      <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
        <Icon name="info" size={18} style={{ color: 'var(--violet)', flex: 'none' }} />
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Revenue is 100% ad-supported. No subscriptions, paid verification, or premium tiers exist in the product — so there’s nothing to reconcile beyond ad performance.</p>
      </div>
    </div>
  );
}

function AdminVisitors() {
  const M = window.TS.METRICS;
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }} className="kpi-grid">
        <KPI label="Visitors (24h)" value="12,803" delta="+6.2%" up />
        <KPI label="Sign-up rate" value="5.8%" delta="+0.4%" up />
        <KPI label="Avg. session" value="4m 12s" delta="+11s" up />
      </div>
      <div className="card pad stack" style={{ gap: 14 }}><span className="eyebrow">Sessions · last 12 days</span><MiniBars series={M.visitorsSeries} color="var(--cyan)" height={150} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="how-grid">
        <div className="card pad stack" style={{ gap: 14 }}><span className="eyebrow">Sources</span><BarList rows={M.sources} color="var(--violet)" /></div>
        <div className="card pad stack" style={{ gap: 14 }}><span className="eyebrow">Countries</span><BarList rows={M.countries} color="var(--pink)" /></div>
      </div>
    </div>
  );
}

function AdminRisk() {
  return (
    <div>
      <QueueHead title="Risk signals" desc="Automated abuse and integrity signals. High-severity items auto-throttle before review." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }} className="how-grid">
        {window.TS.RISK.map((r) => (
          <div key={r.title} className="card pad stack" style={{ gap: 10 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}><strong style={{ color: 'var(--ink)', fontSize: 15 }}>{r.title}</strong><SevBadge sev={r.sev} /></div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{r.value}</div>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{r.desc}</p>
            <button className="btn ghost sm" style={{ alignSelf: 'start' }}>{r.action}<Icon name="arrowR" size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminAudit() {
  return (
    <div>
      <QueueHead title="Audit logs" desc="Every sensitive action is recorded with actor, reason, and timestamp. Append-only." />
      <DataTable cols={['Actor', 'Role', 'Action', 'Target', 'Reason', 'When']}
        rows={window.TS.AUDIT.map((a) => ({ cells: [
          <span className="row" style={{ gap: 7 }}><span className="mono" style={{ fontWeight: 600, color: 'var(--ink)' }}>{a.actor}</span>{a.sensitive && <span className="badge risk" style={{ fontSize: 10 }}><Icon name="lock" size={10} />sensitive</span>}</span>,
          <span className="muted" style={{ fontSize: 12.5 }}>{a.role}</span>, a.action, <span className="mono" style={{ fontSize: 12.5 }}>{a.target}</span>, <span className="muted" style={{ fontSize: 12.5 }}>{a.reason}</span>, <span className="faint">{a.time}</span>,
        ] })) } />
    </div>
  );
}

function AdminModerators() {
  const { toast } = useNav();
  return (
    <div>
      <QueueHead title="Moderators & team" desc="Manage who can review cases. Roles: Owner, Admin, Moderator — there is no super-admin." />
      <DataTable cols={['Member', 'Handle', 'Role', 'Status', 'Cases (30d)', 'Shift', '']}
        rows={window.TS.MODERATORS.map((m) => ({ cells: [
          <strong style={{ color: 'var(--ink)' }}>{m.name}</strong>, <span className="mono muted">{m.handle}</span>,
          <span className="badge neutral">{m.role}</span>, <StatusPill status={m.status} />, m.cases, <span className="muted" style={{ fontSize: 12.5 }}>{m.shift}</span>,
          <button className="btn ghost sm" onClick={() => toast('Member settings')}>Manage</button>,
        ] })) } />
      <button className="btn ink" style={{ marginTop: 16 }} onClick={() => toast('Invite sent', 'ok')}><Icon name="plus" size={15} />Invite member</button>
    </div>
  );
}

function AdminRoles() {
  const cols = ['Owner', 'Admin', 'Moderator'];
  return (
    <div>
      <QueueHead title="Roles & permissions" desc="Least-privilege by default. Moderators are case-scoped and cannot browse users or see revenue." />
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--line)' }}>
            <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--faint)' }}>Permission</th>
            {cols.map((c) => <th key={c} style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--faint)', textAlign: 'center' }}>{c}</th>)}
          </tr></thead>
          <tbody>
            {window.TS.ROLE_PERMS.map(([perm, vals], i) => (
              <tr key={perm} style={{ borderBottom: i < window.TS.ROLE_PERMS.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{perm}</td>
                {vals.map((v, j) => <td key={j} style={{ padding: '12px 16px', textAlign: 'center' }}>{v ? <Icon name="check" size={16} style={{ color: 'var(--green)' }} /> : <span style={{ color: 'var(--line)' }}>—</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLegal() {
  const { toast } = useNav();
  const docs = [['Privacy Policy', 'v4.2', 'published'], ['Terms of Service', 'v3.1', 'published'], ['GDPR Notice', 'v2.0', 'published'], ['KVKK Metni', 'v2.0', 'published'], ['DSA transparency', 'v1.0', 'draft']];
  return (
    <div className="stack" style={{ gap: 20 }}>
      <div>
        <QueueHead title="Legal documents" desc="Versioned policies. Publishing triggers the in-app legal update gate for all users." />
        <DataTable cols={['Document', 'Version', 'Status', '']} rows={docs.map((d) => ({ cells: [<strong style={{ color: 'var(--ink)' }}>{d[0]}</strong>, <span className="mono">{d[1]}</span>, <StatusPill status={d[2] === 'published' ? 'active' : 'invited'} />, <button className="btn ghost sm" onClick={() => toast('Editing ' + d[0])}>Edit</button>] })) } />
      </div>
      <div>
        <span className="eyebrow">Crawler & indexing</span>
        <div className="card pad stack" style={{ gap: 12, marginTop: 10 }}>
          {[['Allow search indexing of public pages', true], ['Block crawlers from profile & app routes', true], ['Serve ads.txt for AdSense', true], ['Expose DSA point-of-contact', true]].map(([l, v]) => (
            <div key={l} className="row" style={{ justifyContent: 'space-between' }}><span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{l}</span><Switch checked={v} onChange={() => {}} /></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPolicyTemplates() {
  return (
    <div>
      <QueueHead title="Policy templates" desc="Shared by admins and moderators to keep decisions consistent and explainable." />
      <ModPolicyTemplates />
    </div>
  );
}

function AdminApp() {
  const { go } = useNav();
  const [view, setView] = useState('overview');
  const [activeCase, setActiveCase] = useState(null);
  const openCase = (c) => { setActiveCase(c); setView('report-detail'); };
  const nav = [
    { label: 'Insights', items: [['overview', 'Overview', 'grid'], ['revenue', 'Revenue', 'info'], ['visitors', 'Visitors', 'compass']] },
    { label: 'Trust & safety', items: [['moderation', 'Moderation', 'flag', window.TS.CASES.length], ['appeals', 'Appeals', 'info', window.TS.APPEALS.length], ['risk', 'Risk signals', 'shield']] },
    { label: 'Verification', items: [['ig', 'Instagram', 'instagram', window.TS.IG_QUEUE.length], ['photo', 'Photos', 'camera', window.TS.PHOTO_QUEUE.length], ['reverify', 'Re-verify', 'lock', window.TS.REVERIFY_QUEUE.length]] },
    { label: 'Operations', items: [['ads', 'Ad compliance', 'eye'], ['audit', 'Audit logs', 'copy'], ['policy', 'Policy templates', 'star']] },
    { label: 'Team & legal', items: [['team', 'Moderators', 'user'], ['roles', 'Roles', 'lock'], ['legal', 'Legal & crawler', 'info']] },
    { label: 'Leave', items: [['exit', 'Exit to site', 'logout']] },
  ];
  const onNav = (k) => { if (k === 'exit') return go('landing'); setView(k); };
  const titles = { overview: 'Overview', revenue: 'Revenue', visitors: 'Visitors', moderation: 'Moderation queue', 'report-detail': activeCase ? `Case ${activeCase.id}` : 'Case', appeals: 'Appeals', risk: 'Risk signals', ig: 'Instagram queue', photo: 'Photo queue', reverify: 'Re-verification', ads: 'Ad compliance', audit: 'Audit logs', policy: 'Policy templates', team: 'Moderators', roles: 'Roles & permissions', legal: 'Legal & crawler' };
  const screens = {
    overview: <AdminOverview onNav={setView} />, revenue: <AdminRevenue />, visitors: <AdminVisitors />,
    moderation: <AdminModeration onOpen={openCase} />, 'report-detail': activeCase && <AdminReportDetail c={activeCase} onBack={() => setView('moderation')} />,
    appeals: <AdminAppeals />, risk: <AdminRisk />, ig: <AdminIG />, photo: <AdminPhoto />, reverify: <AdminReverify />,
    ads: <AdminAdCompliance />, audit: <AdminAudit />, policy: <AdminPolicyTemplates />, team: <AdminModerators />, roles: <AdminRoles />, legal: <AdminLegal />,
  };
  return (
    <OpsFrame kind="admin" nav={nav} active={view === 'report-detail' ? 'moderation' : view} onNav={onNav} title={titles[view]} user={ADMIN_USER}
      actions={<span className="badge neutral"><Icon name="lock" size={12} />Owner</span>}>
      {screens[view]}
    </OpsFrame>
  );
}

window.AdminApp = AdminApp;
