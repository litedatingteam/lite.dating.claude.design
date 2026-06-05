/* lite.dating — operational shell (shared by moderator + admin) */

function OpsBrand({ kind, user }) {
  return (
    <div className="row" style={{ gap: 10, padding: '4px 8px 16px' }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--ink)', display: 'grid', placeItems: 'center', color: 'white', flex: 'none' }}><Icon name={kind === 'admin' ? 'grid' : 'shield'} size={16} /></span>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)', letterSpacing: '-0.02em' }}>lite<span className="muted">.ops</span></div>
        <div className="mono" style={{ fontSize: 9.5, color: 'var(--faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{kind === 'admin' ? 'Admin console' : 'Moderation'}</div>
      </div>
    </div>
  );
}

function OpsFrame({ kind, nav, active, onNav, title, actions, banner, user, children }) {
  const [drawer, setDrawer] = useState(false);
  const navAndClose = (k) => { setDrawer(false); onNav(k); };
  return (
    <div className="app-frame" data-ops="true">
      {drawer && <div className="ops-scrim" onClick={() => setDrawer(false)} />}
      <aside className={`sidebar ops-drawer ${drawer ? 'open' : ''}`}>
        <OpsBrand kind={kind} user={user} />
        {nav.map((grp, gi) => (
          <React.Fragment key={gi}>
            {grp.label && <div className="proto-grp" style={{ margin: '12px 8px 4px' }}>{grp.label}</div>}
            {grp.items.map(([k, label, icon, count]) => (
              <div key={k} className={`sb-link ${active === k ? 'on' : ''}`} onClick={() => navAndClose(k)} style={{ fontSize: 13.5, padding: '9px 12px' }}>
                <Icon name={icon} size={17} /> {label}
                {count != null && count > 0 && <span className="count" style={{ background: 'var(--muted)' }}>{count}</span>}
              </div>
            ))}
          </React.Fragment>
        ))}
        <div className="sb-foot">
          <div className="card" style={{ padding: 10, margin: '0 4px 8px', display: 'flex', gap: 9, alignItems: 'center', background: 'var(--surface-2)', border: 'none' }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink)', color: 'white', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flex: 'none' }}>{user.initials}</span>
            <div style={{ minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.handle}</div><div className="mono faint" style={{ fontSize: 10 }}>{user.role}</div></div>
          </div>
        </div>
      </aside>
      <main className="app-main">
        <div className="topbar">
          <button className="btn icon sm ghost ops-burger" onClick={() => setDrawer(true)} aria-label="Open menu"><Icon name="menu" size={18} /></button>
          <h1 style={{ fontSize: 19 }}>{title}</h1><span className="grow" />{actions}
        </div>
        {banner}
        <div className="app-scroll fade-in" key={active} style={{ maxWidth: 1180 }}>{children}</div>
      </main>
    </div>
  );
}

/* privacy-mode banner used across mod surfaces */
function PrivacyBanner({ text }) {
  return (
    <div style={{ background: 'color-mix(in oklch, var(--cyan), white 82%)', borderBottom: '1px solid var(--line-soft)', padding: '8px 28px' }}>
      <div className="row" style={{ gap: 8, maxWidth: 1180 }}><Icon name="lock" size={14} style={{ color: 'oklch(0.45 0.08 230)' }} /><span style={{ fontSize: 12.5, color: 'oklch(0.40 0.06 250)', fontWeight: 500 }}>{text}</span></div>
    </div>
  );
}

function SevBadge({ sev }) {
  const map = { high: ['risk', 'var(--red)', 'High'], med: ['pending', 'var(--amber)', 'Medium'], low: ['neutral', 'var(--faint)', 'Low'] };
  const m = map[sev] || map.low;
  return <span className={`badge ${m[0]}`}><span className="dot" style={{ background: m[1] }} />{m[2]}</span>;
}
function StatusPill({ status }) {
  const map = {
    open: ['neutral', 'var(--cyan)', 'Open'], 'in-review': ['pending', 'var(--amber)', 'In review'],
    escalated: ['risk', 'var(--red)', 'Escalated'], resolved: ['verified', 'var(--green)', 'Resolved'],
    denied: ['risk', 'var(--red)', 'Denied'], invited: ['neutral', 'var(--faint)', 'Invited'],
    active: ['verified', 'var(--green)', 'Active'], 'on-shift': ['verified', 'var(--green)', 'On shift'],
    ok: ['verified', 'var(--green)', 'Allowed'], blocked: ['risk', 'var(--red)', 'Blocked'],
  };
  const m = map[status] || ['neutral', 'var(--faint)', status];
  return <span className={`badge ${m[0]}`}><span className="dot" style={{ background: m[1] }} />{m[2]}</span>;
}

/* generic data table */
function DataTable({ cols, rows }) {
  return (
    <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5, minWidth: 560 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)' }}>
              {cols.map((c, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--faint)', whiteSpace: 'nowrap' }}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid var(--line-soft)' : 'none', cursor: r._onClick ? 'pointer' : 'default' }} onClick={r._onClick}
                onMouseEnter={(e) => { if (r._onClick) e.currentTarget.style.background = 'var(--surface-2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                {r.cells.map((cell, ci) => <td key={ci} style={{ padding: '12px 16px', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { OpsFrame, OpsBrand, PrivacyBanner, SevBadge, StatusPill, DataTable });
