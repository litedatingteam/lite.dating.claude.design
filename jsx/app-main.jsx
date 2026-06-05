/* lite.dating — root: store, router, tweaks, mount */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "gradient": 60,
  "palette": ["oklch(0.68 0.18 0)", "oklch(0.60 0.18 300)", "oklch(0.74 0.12 220)"],
  "motion": true,
  "theme": "Consumer"
}/*EDITMODE-END*/;

const PALETTES = [
  ['oklch(0.68 0.18 0)', 'oklch(0.60 0.18 300)', 'oklch(0.74 0.12 220)'],   // Bloom
  ['oklch(0.67 0.19 335)', 'oklch(0.58 0.19 288)', 'oklch(0.70 0.14 250)'], // Orchid
  ['oklch(0.69 0.17 25)', 'oklch(0.62 0.17 352)', 'oklch(0.76 0.13 70)'],   // Sunset
  ['oklch(0.70 0.15 350)', 'oklch(0.62 0.15 250)', 'oklch(0.74 0.12 196)'], // Lagoon
];

const PUBLIC_SCREENS = ['landing', 'how', 'safety', 'free', 'about', 'contact', 'privacy', 'terms'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ name: 'landing', param: null });
  const [toasts, setToasts] = useState([]);

  // ---- mutable app store ----
  const [favorites, setFavorites] = useState(() => new Set());
  const [sent, setSent] = useState(() => window.DB.SENT.map((x) => ({ ...x })));
  const [inbox, setInbox] = useState(() => window.DB.INBOX.map((x) => ({ ...x })));
  const [connections, setConnections] = useState(() => window.DB.CONNECTIONS.map((x) => ({ ...x })));

  const toast = (msg, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { id, msg, kind }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 2600);
  };

  const go = (name, param = null) => {
    setRoute({ name, param });
    window.scrollTo({ top: 0 });
    const el = document.querySelector('.app-scroll'); if (el) el.scrollTop = 0;
  };

  const store = {
    favorites,
    toggleFav: (id) => setFavorites((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }),
    sent,
    sendRequest: ({ to, channel, note }) => setSent((s) => [{ id: 's' + Date.now(), to, channel, note, status: 'pending', when: 'now' }, ...s]),
    inbox,
    connections,
    acceptRequest: (id) => {
      const req = inbox.find((r) => r.id === id);
      if (!req) return;
      setInbox((s) => s.filter((r) => r.id !== id));
      const handles = { instagram: '@new.connect', telegram: '@new_t' };
      setConnections((c) => [{ id: 'c' + Date.now(), who: req.from, channel: req.channel, handle: handles[req.channel], daysLeft: 14 }, ...c]);
    },
    declineRequest: (id) => setInbox((s) => s.filter((r) => r.id !== id)),
  };

  // ---- apply tweaks to :root ----
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--grad-mix', (t.gradient / 100).toFixed(2));
    r.style.setProperty('--motion', t.motion ? '1' : '0');
    if (Array.isArray(t.palette)) {
      r.style.setProperty('--pink', t.palette[0]);
      r.style.setProperty('--violet', t.palette[1]);
      r.style.setProperty('--cyan', t.palette[2]);
    }
    const opsRoute = route.name === 'mod' || route.name === 'admin';
    if (opsRoute || t.theme === 'Operational') r.setAttribute('data-theme', 'ops');
    else r.removeAttribute('data-theme');
  }, [t, route]);

  // ---- render screen ----
  const renderScreen = () => {
    switch (route.name) {
      case 'landing': return <Landing />;
      case 'how': return <HowItWorks />;
      case 'safety': return <Safety />;
      case 'free': return <WhyFree />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'privacy': case 'terms': return <LegalPlaceholder />;
      case 'signin': return <SignIn />;
      case 'onb': return <Onboarding />;
      case 'discover': return <Discover />;
      case 'discover-empty': return <DiscoverEmpty framed />;
      case 'profile': return <ProfileDetail id={route.param || 'mira'} />;
      case 'inbox': return <Inbox />;
      case 'sent': return <Sent />;
      case 'connections': return <Connections />;
      case 'favorites': return <Favorites />;
      case 'me': return <YourProfile />;
      case 'edit': return <EditProfile />;
      case 'settings': return <Settings />;
      case 'safety-center': return <SafetyCenter />;
      case 'report': return <ReportFlow />;
      case 'appeal': return <AppealFlow />;
      case 'legal-gate': return <LegalGate />;
      case 'mod': return <ModApp />;
      case 'admin': return <AdminApp />;
      default: return <Landing />;
    }
  };

  const isPublic = PUBLIC_SCREENS.includes(route.name);

  return (
    <NavCtx.Provider value={{ route, go, store, toast, toasts }}>
      <div className="app-root">
        {isPublic
          ? <><PublicNav />{renderScreen()}<PublicFooter /></>
          : renderScreen()}
      </div>
      <ToastHost />
      <ProtoNavigator />

      <TweaksPanel>
        <TweakSection label="Brand feel" />
        <TweakSlider label="Gradient vividness" value={t.gradient} min={0} max={100} unit="%" onChange={(v) => setTweak('gradient', v)} />
        <TweakColor label="Accent palette" value={t.palette} options={PALETTES} onChange={(v) => setTweak('palette', v)} />
        <TweakToggle label="Motion" value={t.motion} onChange={(v) => setTweak('motion', v)} />
        <TweakSection label="Theme preview" />
        <TweakRadio label="Surface" value={t.theme} options={['Consumer', 'Operational']} onChange={(v) => setTweak('theme', v)} />
      </TweaksPanel>
    </NavCtx.Provider>
  );
}

/* lightweight safety-center placeholder reachable from sidebar (full build next pass) */
function SafetyCenterStub() {
  const { go, toast } = useNav();
  const items = [
    ['flag', 'Report a user', 'Tell us what happened'],
    ['x', 'Block someone', 'Stop all contact'],
    ['shield', 'Report off-platform harm', 'Even if it happened elsewhere'],
    ['info', 'Appeal a decision', 'Ask for a human review'],
    ['eye', 'Active decisions', 'See any restrictions on your account'],
    ['mail', 'Contact safety team', 'safety@lite.dating'],
  ];
  return (
    <AppFrame title="Safety center">
      <p className="muted" style={{ fontSize: 14.5, marginBottom: 20, maxWidth: 560 }}>Everything to keep you safe, in one calm place. Reports protect users — false reports harm users — and we review both.</p>
      <div className="disc-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        {items.map(([icon, title, desc]) => (
          <div key={title} className="card pad row" style={{ gap: 14, cursor: 'pointer' }} onClick={() => toast('Full report/appeal flows arrive in the next build pass')}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={19} /></span>
            <div><strong style={{ color: 'var(--ink)' }}>{title}</strong><p className="muted" style={{ fontSize: 13 }}>{desc}</p></div>
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

window.SafetyCenterStub = SafetyCenterStub;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
