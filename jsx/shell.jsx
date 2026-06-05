/* lite.dating — shell: nav context, chrome, prototype navigator */
const NavCtx = createContext(null);
const useNav = () => useContext(NavCtx);

/* ---------------- public nav + footer ---------------- */
const PUB_LINKS = [
  ['how', 'How it works'], ['safety', 'Safety'], ['free', 'Why it\u2019s free'], ['about', 'About'], ['contact', 'Contact'],
];
function PublicNav() {
  const { route, go } = useNav();
  return (
    <header className="pubnav">
      <div className="pubnav-in">
        <Logo size={21} onClick={() => go('landing')} />
        <nav className="pubnav-links">
          {PUB_LINKS.map(([k, label]) => (
            <a key={k} className={route.name === k ? 'on' : ''} onClick={() => go(k)}>{label}</a>
          ))}
        </nav>
        <span className="pubnav-spacer" />
        <div className="pubnav-cta">
          <button className="btn ghost sm" onClick={() => go('signin')}>Sign in</button>
          <button className="btn primary sm" onClick={() => go('signin')}>Join free</button>
        </div>
      </div>
    </header>
  );
}

function FootCol({ title, links }) {
  const { go } = useNav();
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div className="eyebrow" style={{ marginBottom: 4 }}>{title}</div>
      {links.map(([k, label]) => (
        <a key={label} onClick={() => k && go(k)} style={{ fontSize: 14, color: 'var(--muted)', cursor: k ? 'pointer' : 'default', textDecoration: 'none' }}>{label}</a>
      ))}
    </div>
  );
}
function PublicFooter() {
  const { go } = useNav();
  return (
    <footer className="pub-foot">
      <div className="pub-foot-in">
        <div className="stack" style={{ gap: 12, maxWidth: 280 }}>
          <Logo size={20} />
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.55 }}>Skip the swiping. Skip the chat. Just trade handles. A free, consent-first way to meet people.</p>
          <p className="faint" style={{ fontSize: 12 }}>Operated by Halit Turan ARICAN as an individual operator based in Türkiye.</p>
        </div>
        <FootCol title="Product" links={[['how', 'How it works'], ['safety', 'Safety'], ['free', 'Why it\u2019s free'], ['signin', 'Join free']]} />
        <FootCol title="Company" links={[['about', 'About'], ['contact', 'Contact'], [null, 'support@lite.dating']]} />
        <FootCol title="Legal" links={[['privacy', 'Privacy'], ['terms', 'Terms'], ['privacy', 'GDPR'], ['privacy', 'KVKK']]} />
      </div>
    </footer>
  );
}

/* ---------------- app chrome ---------------- */
const APP_NAV = [
  ['discover', 'Discover', 'compass'],
  ['inbox', 'Requests', 'inbox'],
  ['sent', 'Sent', 'send'],
  ['connections', 'Connections', 'link'],
  ['favorites', 'Favorites', 'heart'],
];
function Sidebar() {
  const { route, go, store } = useNav();
  const active = route.name;
  return (
    <aside className="sidebar">
      <div style={{ padding: '4px 8px 14px' }}><Logo size={20} onClick={() => go('discover')} /></div>
      {APP_NAV.map(([k, label, icon]) => {
        const count = k === 'inbox' ? store.inbox.length : 0;
        return (
          <div key={k} className={`sb-link ${active === k ? 'on' : ''}`} onClick={() => go(k)}>
            <Icon name={icon} size={19} /> {label}
            {count > 0 && <span className="count">{count}</span>}
          </div>
        );
      })}
      <div className="sb-sep" />
      <div className={`sb-link ${active === 'me' ? 'on' : ''}`} onClick={() => go('me')}><Icon name="user" size={19} /> Your profile</div>
      <div className={`sb-link ${active === 'settings' ? 'on' : ''}`} onClick={() => go('settings')}><Icon name="gear" size={19} /> Settings</div>
      <div className={`sb-link ${active === 'safety' ? 'on' : ''}`} onClick={() => go('safety-center')}><Icon name="shield" size={19} /> Safety center</div>
      <div className="sb-foot">
        <div className="sb-link" onClick={() => go('landing')}><Icon name="logout" size={19} /> Sign out</div>
      </div>
    </aside>
  );
}
function BottomNav() {
  const { route, go, store } = useNav();
  const items = [['discover', 'Discover', 'compass'], ['inbox', 'Requests', 'inbox'], ['connections', 'Links', 'link'], ['favorites', 'Saved', 'heart'], ['me', 'You', 'user']];
  return (
    <nav className="botnav">
      {items.map(([k, label, icon]) => (
        <a key={k} className={route.name === k ? 'on' : ''} onClick={() => go(k)}>
          {k === 'inbox' && store.inbox.length > 0 && <span className="nbdot" />}
          <Icon name={icon} size={21} /> {label}
        </a>
      ))}
    </nav>
  );
}
function AppFrame({ title, actions, children }) {
  return (
    <div className="app-frame">
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          <h1>{title}</h1>
          <span className="grow" />
          {actions}
        </div>
        <div className="app-scroll fade-in" key={title}>{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

/* ---------------- toast ---------------- */
function ToastHost() {
  const { toasts } = useNav();
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="dot" style={{ background: t.kind === 'ok' ? 'var(--green)' : t.kind === 'warn' ? 'var(--amber)' : 'var(--cyan)' }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------------- prototype navigator ---------------- */
const PROTO_GROUPS = [
  ['Public', [['landing', 'Landing'], ['how', 'How it works'], ['safety', 'Safety'], ['free', 'Why it\u2019s free'], ['about', 'About'], ['contact', 'Contact'], ['privacy', 'Legal pages']]],
  ['Auth & onboarding', [['signin', 'Sign in'], ['onb', 'Onboarding']]],
  ['Main app', [['discover', 'Discover'], ['discover-empty', 'Discover \u00b7 empty'], ['inbox', 'Requests'], ['sent', 'Sent'], ['connections', 'Connections'], ['favorites', 'Favorites'], ['me', 'Your profile'], ['edit', 'Edit profile'], ['settings', 'Settings']]],
  ['Trust & safety', [['safety-center', 'Safety center'], ['report', 'Report flow'], ['appeal', 'Appeal flow'], ['legal-gate', 'Legal update gate']]],
  ['Moderator', [['mod', 'Moderator console']]],
  ['Admin', [['admin', 'Admin console']]],
];
function ProtoNavigator() {
  const { route, go } = useNav();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="proto-fab" onClick={() => setOpen((o) => !o)} title="Jump to any screen" aria-label="Prototype screen navigator">
        <Icon name={open ? 'x' : 'grid'} size={20} />
      </button>
      {open && (
        <div className="proto-panel">
          <h4 className="eyebrow">Prototype map</h4>
          {PROTO_GROUPS.map(([grp, links]) => (
            <div key={grp}>
              <div className="proto-grp">{grp}</div>
              {links.map(([k, label]) => (
                <div key={k} className={`proto-link ${route.name === k ? 'on' : ''}`} onClick={() => { go(k); setOpen(false); }}>
                  <Icon name="chevR" size={13} /> {label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

Object.assign(window, { NavCtx, useNav, PublicNav, PublicFooter, AppFrame, Sidebar, BottomNav, ToastHost, ProtoNavigator });
