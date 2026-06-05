/* lite.dating — shell: nav context, chrome, prototype navigator */
const NavCtx = createContext(null);
const useNav = () => useContext(NavCtx);

/* ---------------- public nav + footer ---------------- */
const PUB_LINKS = [
  ['how', 'How it works'], ['safety', 'Safety'], ['free', 'It\u2019s free'], ['about', 'About'], ['contact', 'Contact'],
];
function PublicNav() {
  const { route, go } = useNav();
  const [open, setOpen] = useState(false);
  const nav = (k) => { setOpen(false); go(k); };
  return (
    <header className="pubnav">
      <div className="pubnav-in">
        <Logo size={21} onClick={() => nav('landing')} />
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
        <button className="btn icon sm ghost pubnav-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          <Icon name={open ? 'x' : 'menu'} size={18} />
        </button>
      </div>
      {open && (
        <div className="pubnav-menu">
          {PUB_LINKS.map(([k, label]) => (
            <a key={k} className={route.name === k ? 'on' : ''} onClick={() => nav(k)}>{label}</a>
          ))}
          <div className="hr" style={{ margin: '8px 4px' }} />
          <button className="btn ghost block" onClick={() => nav('signin')}>Sign in</button>
          <button className="btn primary block" onClick={() => nav('signin')}>Join free</button>
        </div>
      )}
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
        </div>
        <FootCol title="Product" links={[['how', 'How it works'], ['safety', 'Safety'], ['rules', 'Community rules'], ['free', 'It\u2019s free'], ['signin', 'Join free']]} />
        <FootCol title="Company" links={[['about', 'About'], ['contact', 'Contact'], [null, 'support@lite.dating']]} />
        <FootCol title="Legal" links={[['privacy', 'Privacy'], ['terms', 'Terms'], ['gdpr', 'GDPR'], ['kvkk', 'KVKK']]} />
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
  const [signOut, setSignOut] = useState(false);
  return (
    <aside className="sidebar">
      <div className="row" style={{ padding: '4px 8px 14px', justifyContent: 'space-between' }}>
        <Logo size={20} onClick={() => go('discover')} />
        <button className="btn icon sm ghost" title="Hide menu" onClick={() => store.toggleNav()}><Icon name="chevR" size={16} style={{ transform: 'rotate(180deg)' }} /></button>
      </div>
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
        <div className="sb-link" onClick={() => setSignOut(true)}><Icon name="logout" size={19} /> Sign out</div>
      </div>
      {signOut && <SignOutModal onClose={() => setSignOut(false)} />}
    </aside>
  );
}
function SignOutModal({ onClose }) {
  const { go, toast } = useNav();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div style={{ padding: 26 }} className="stack">
          <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink)', marginBottom: 12 }}><Icon name="logout" size={20} /></div>
          <h2 style={{ fontSize: 20 }}>Sign out</h2>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 6 }}>Sign out here, or end every active session if you’re on a shared or lost device.</p>
          <div className="stack" style={{ gap: 10, marginTop: 20 }}>
            <button className="btn ink lg block" onClick={() => { onClose(); go('landing'); }}>Sign out of this device</button>
            <button className="btn danger lg block" onClick={() => { onClose(); toast('Signed out of all devices', 'warn'); go('landing'); }}><Icon name="shield" size={16} />Sign out of all devices</button>
            <button className="btn ghost block" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
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
function NotificationBell() {
  const { store, go, toast } = useNav();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const click = (n) => {
    store.markRead(n.id);
    if (n.appeal) { setOpen(false); go('appeal'); }
    else if (n.kind === 'request') { setOpen(false); go('inbox'); }
    else if (n.kind === 'connection') { setOpen(false); go('connections'); }
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn icon ghost" onClick={() => setOpen((o) => !o)} aria-label="Notifications" style={{ position: 'relative' }}>
        <Icon name="bell" size={19} />
        {store.unread > 0 && <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--pink)', color: 'white', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid var(--surface)' }}>{store.unread}</span>}
      </button>
      {open && (
        <div className="notif-pop">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '4px 6px 10px' }}>
            <strong style={{ color: 'var(--ink)', fontSize: 15 }}>Notifications</strong>
            {store.unread > 0 && <button className="btn ghost sm" onClick={() => store.markAllRead()}>Mark all read</button>}
          </div>
          {store.notifs.length === 0
            ? <div className="tac muted" style={{ padding: '24px 8px', fontSize: 13.5 }}>You’re all caught up.</div>
            : <div className="stack" style={{ gap: 4 }}>
                {store.notifs.map((n) => (
                  <div key={n.id} className="notif-item" style={{ background: n.read ? 'transparent' : 'var(--wash-violet)' }} onClick={() => click(n)}>
                    <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={n.icon} size={16} /></span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 6, alignItems: 'center' }}>{!n.read && <span className="dot" style={{ background: 'var(--pink)', width: 7, height: 7 }} />}<strong style={{ color: 'var(--ink)', fontSize: 13 }}>{n.title}</strong><span className="faint" style={{ fontSize: 11, marginLeft: 'auto' }}>{n.when}</span></div>
                      <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 2 }}>{n.body}</p>
                      {n.appeal && <span className="badge" style={{ marginTop: 6, background: 'var(--amber-w)', color: 'color-mix(in oklch, var(--amber), black 18%)', border: 'none', fontSize: 10.5 }}><Icon name="mail" size={11} />Appeal info emailed to you</span>}
                    </div>
                    <button className="btn icon sm ghost" title="Dismiss" onClick={(e) => { e.stopPropagation(); store.dismissNotif(n.id); }}><Icon name="x" size={13} /></button>
                  </div>
                ))}
              </div>}
        </div>
      )}
    </div>
  );
}
function AppFrame({ title, actions, children }) {
  const { store } = useNav();
  return (
    <div className={`app-frame ${store.navHidden ? 'nav-hidden' : ''}`}>
      <Sidebar />
      <main className="app-main">
        <div className="topbar">
          {store.navHidden && <button className="btn icon sm ghost" title="Show menu" onClick={() => store.toggleNav()}><Icon name="menu" size={18} /></button>}
          <h1>{title}</h1>
          <span className="grow" />
          {actions}
          <NotificationBell />
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
  ['Public', [['landing', 'Landing'], ['how', 'How it works'], ['safety', 'Safety'], ['free', 'It\u2019s free'], ['about', 'About'], ['contact', 'Contact'], ['legal', 'Legal index'], ['privacy', 'Privacy'], ['terms', 'Terms'], ['gdpr', 'GDPR'], ['kvkk', 'KVKK']]],
  ['Auth & onboarding', [['signin', 'Sign in'], ['signup-legal', 'First-signup legal gate'], ['onb', 'Onboarding']]],
  ['Main app', [['discover', 'Discover'], ['discover-empty', 'Discover \u00b7 empty'], ['inbox', 'Requests'], ['sent', 'Sent'], ['connections', 'Connections'], ['favorites', 'Favorites'], ['me', 'Your profile'], ['edit', 'Edit profile'], ['settings', 'Settings'], ['ad-experience', 'Ad experience']]],
  ['Trust & safety', [['safety-center', 'Safety center'], ['decisions', 'Active decisions'], ['consent', 'Consent settings'], ['report', 'Report flow'], ['appeal', 'Appeal flow'], ['blocked', 'Blocked accounts'], ['data-export', 'Data export'], ['rules', 'Community rules'], ['legal-gate', 'Legal update gate']]],
  ['Moderator', [['mod', 'Moderator console']]],
  ['Admin', [['admin', 'Admin console']]],
  ['Owner', [['owner', 'Owner console']]],
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
