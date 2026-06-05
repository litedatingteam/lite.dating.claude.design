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

const PUBLIC_SCREENS = ['landing', 'how', 'safety', 'free', 'about', 'contact', 'privacy', 'terms', 'gdpr', 'kvkk', 'cookies', 'safetypolicy', 'moderation', 'contactlegal', 'legal', 'rules'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState({ name: 'landing', param: null });
  const [toasts, setToasts] = useState([]);

  // ---- mutable app store ----
  const [favorites, setFavorites] = useState(() => new Set());
  const [sent, setSent] = useState(() => window.DB.SENT.map((x) => ({ ...x })));
  const [inbox, setInbox] = useState(() => window.DB.INBOX.map((x) => ({ ...x })));
  const [connections, setConnections] = useState(() => window.DB.CONNECTIONS.map((x) => ({ ...x })));
  const [requestsUsed, setRequestsUsed] = useState(4); // successful handle requests in rolling 24h
  const [interests, setInterests] = useState(() => [...window.DB.ME.interests]);
  const [notifs, setNotifs] = useState(() => (window.DB.NOTIFS || []).map((n) => ({ ...n })));
  const [returnTo, setReturnTo] = useState(null);
  const [blocked, setBlocked] = useState(() => new Set());
  const [navHidden, setNavHidden] = useState(false);

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
    requestLimit: 13,
    requestsUsed,
    get requestsLeft() { return Math.max(0, 13 - requestsUsed); },
    sendRequest: ({ to, channel, note }) => {
      setSent((s) => [{ id: 's' + Date.now(), to, channel, note, status: 'pending', when: 'now' }, ...s]);
      setRequestsUsed((n) => n + 1); // only successful requests count
    },
    cancelRequest: (to, channel) => setSent((s) => s.filter((x) => !(x.to === to && (channel ? x.channel === channel : true) && x.status === 'pending'))),
    blocked,
    isBlocked: (id) => blocked.has(id),
    block: (id) => { setBlocked((s) => new Set(s).add(id)); setInbox((s) => s.filter((r) => r.from !== id)); setSent((s) => s.filter((x) => x.to !== id)); setConnections((s) => s.filter((c) => c.who !== id)); },
    navHidden,
    toggleNav: () => setNavHidden((v) => !v),
    inbox,
    connections,
    interests,
    setInterests: (next) => { const arr = typeof next === 'function' ? next(interests) : next; setInterests(arr); window.DB.ME.interests = arr; },
    notifs,
    unread: notifs.filter((n) => !n.read).length,
    markRead: (id) => setNotifs((s) => s.map((n) => n.id === id ? { ...n, read: true } : n)),
    markAllRead: () => setNotifs((s) => s.map((n) => ({ ...n, read: true }))),
    dismissNotif: (id) => setNotifs((s) => s.filter((n) => n.id !== id)),
    returnTo,
    setReturnTo,
    acceptRequest: (id) => {
      const req = inbox.find((r) => r.id === id);
      if (!req) return;
      setInbox((s) => s.filter((r) => r.id !== id));
      setConnections((c) => [{ id: 'c' + Date.now(), who: req.from, channel: req.channel, handle: window.DB.handleFor(req.from, req.channel), daysLeft: 14 }, ...c]);
    },
    declineRequest: (id) => setInbox((s) => s.filter((r) => r.id !== id)),
    // ---- channel-specific selectors (spec §4) ----
    getRequestState: (userId, channel) => {
      const conn = connections.find((c) => c.who === userId && c.channel === channel);
      if (conn && (conn.expired || conn.daysLeft <= 0)) return 'expired';
      if (conn) return 'unlocked';
      if (inbox.find((r) => r.from === userId && r.channel === channel)) return 'incoming';
      const s = sent.find((x) => x.to === userId && x.channel === channel);
      if (s) return s.status; // pending | accepted | declined | cancelled
      return 'none';
    },
    getConnection: (userId, channel) => connections.find((c) => c.who === userId && c.channel === channel) || null,
    canRequestChannel: (userId, channel) => {
      const me = window.DB.ME, p = window.DB.byId(userId);
      if (!me.channels[channel].verified || !p || !p.channels[channel].verified) return false;
      const st = sent.find((x) => x.to === userId && x.channel === channel);
      const conn = connections.find((c) => c.who === userId && c.channel === channel);
      if (conn && !conn.expired && conn.daysLeft > 0) return false;
      if (st && (st.status === 'pending' || st.status === 'declined')) return false;
      return true;
    },
    canAcceptIncomingRequest: (requestId) => {
      const req = inbox.find((r) => r.id === requestId);
      return !!req && window.DB.ME.channels[req.channel].verified;
    },
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
      case 'legal': return <LegalIndex />;
      case 'privacy': case 'terms': case 'gdpr': case 'kvkk': case 'cookies': case 'safetypolicy': case 'moderation': case 'contactlegal': return <LegalDoc docKey={route.name} />;
      case 'signin': return <SignIn />;
      case 'signup-legal': return <SignupLegalGate />;
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
      case 'decisions': return <ActiveDecisions />;
      case 'data-export': return <DataExport />;
      case 'ad-experience': return <AdExperience />;
      case 'consent': return <ConsentSettings />;
      case 'blocked': return <BlockedAccounts />;
      case 'rules': return <CommunityRules />;
      case 'rules-app': return <CommunityRulesApp />;
      case 'safety-contact': return <SafetyContact />;
      case 'report': return <ReportFlow />;
      case 'report-offplatform': return <ReportFlow offPlatform />;
      case 'appeal': return <AppealFlow />;
      case 'legal-gate': return <LegalGate />;
      case 'mod': return <ModApp />;
      case 'admin': return <AdminApp />;
      case 'owner': return <OwnerApp />;
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

/* mount */
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
