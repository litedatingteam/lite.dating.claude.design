/* lite.dating — inbox / sent / connections / favorites */

function EmptyState({ icon, title, body, action, onAction }) {
  return (
    <div className="tac stack" style={{ alignItems: 'center', gap: 14, padding: '64px 20px', maxWidth: 400, margin: '0 auto' }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--grad-soft)', display: 'grid', placeItems: 'center', color: 'var(--violet)' }}><Icon name={icon} size={32} /></div>
      <h2 style={{ fontSize: 22 }}>{title}</h2>
      <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{body}</p>
      {action && <button className="btn primary" onClick={onAction}>{action}</button>}
    </div>
  );
}

/* ---------------- inbox ---------------- */
function InboxCard({ req }) {
  const { store, toast, go } = useNav();
  const p = window.DB.byId(req.from);
  const tint = window.DB.PROFILES.findIndex((x) => x.id === req.from);
  const CH = { instagram: 'Instagram', telegram: 'Telegram' };
  const meV = window.DB.ME.channels[req.channel].verified;
  return (
    <div className="card" style={{ padding: 16, display: 'grid', gridTemplateColumns: '64px 1fr', gap: 16 }}>
      <button onClick={() => go('profile', p.id)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}><Photo label="" tint={tint} ratio="1 / 1" radius="var(--r-md)" style={{ width: 64, height: 64 }} /></button>
      <div className="stack" style={{ gap: 10, minWidth: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div className="row" style={{ gap: 8, alignItems: 'center' }}><strong style={{ color: 'var(--ink)', fontSize: 16 }}>{p.name}, {p.age}</strong><VerifiedBadge small /></div>
            <div className="faint" style={{ fontSize: 12.5, marginTop: 2 }}>{p.city} · {req.when} ago</div>
          </div>
          <ChannelBadge type={req.channel} />
        </div>
        {req.note && <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, background: 'var(--surface-2)', padding: '10px 12px', borderRadius: 'var(--r-sm)' }}>“{req.note}”</p>}
        {!meV && <div className="row" style={{ gap: 8, background: 'var(--amber-w)', padding: '8px 12px', borderRadius: 'var(--r-sm)' }}><Icon name="info" size={14} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} /><span style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>Verify your {CH[req.channel]} to share it and accept this request.</span></div>}
        <div className="row wrap" style={{ gap: 8 }}>
          {meV
            ? <button className="btn primary sm" onClick={() => { store.acceptRequest(req.id); toast(`You shared your ${CH[req.channel]} with ${p.name}`, 'ok'); }}><Icon name="check" size={15} />Accept & share {CH[req.channel]}</button>
            : <button className="btn ink sm" onClick={() => go('settings')}><Icon name={req.channel} size={15} />Verify {CH[req.channel]} to accept</button>}
          <button className="btn ghost sm" onClick={() => { store.declineRequest(req.id); toast('Request passed', 'warn'); }}>Pass</button>
          <button className="btn ghost sm icon" title="Report" onClick={() => { store.setReturnTo({ name: 'inbox' }); go('report'); }}><Icon name="flag" size={15} /></button>
        </div>
      </div>
    </div>
  );
}
function Inbox() {
  const { store, go } = useNav();
  return (
    <AppFrame title="Requests" actions={<span className="badge neutral">{store.inbox.length} incoming</span>}>
      <p className="muted" style={{ fontSize: 14, marginBottom: 18, maxWidth: 560 }}>People who’d like to trade handles with you. Accepting shares the verified handle you’ve both confirmed — there’s no reply box, and no obligation.</p>
      {store.inbox.length === 0
        ? <EmptyState icon="inbox" title="No requests right now" body="When someone asks to trade handles, it’ll appear here. Keep your profile fresh to get noticed." action="Go to Discover" onAction={() => go('discover')} />
        : <div className="stack" style={{ gap: 14 }}>{store.inbox.map((r) => <InboxCard key={r.id} req={r} />)}</div>}
    </AppFrame>
  );
}

/* ---------------- sent ---------------- */
function SentCard({ req }) {
  const { go } = useNav();
  const p = window.DB.byId(req.to);
  const tint = window.DB.PROFILES.findIndex((x) => x.id === req.to);
  const status = req.status;
  const meta = { pending: ['pending', 'amber', 'Waiting for a response'], accepted: ['verified', 'green', 'Accepted — handle unlocked'], declined: ['neutral', 'muted', 'Passed — no handle shared'] }[status];
  return (
    <div className="card pad row" style={{ gap: 14, justifyContent: 'space-between' }}>
      <div className="row" style={{ gap: 14, minWidth: 0 }}>
        <button onClick={() => go('profile', p.id)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}><Photo label="" tint={tint} ratio="1 / 1" radius="var(--r-md)" style={{ width: 56, height: 56 }} /></button>
        <div className="stack" style={{ gap: 4, minWidth: 0 }}>
          <strong style={{ color: 'var(--ink)' }}>{p.name}, {p.age}</strong>
          <div className="row" style={{ gap: 8 }}><ChannelBadge type={req.channel} /><span className="faint" style={{ fontSize: 12 }}>{req.when} ago</span></div>
        </div>
      </div>
      <div className="stack" style={{ alignItems: 'end', gap: 8 }}>
        <span className={`badge ${meta[0]}`}><span className="dot" style={{ background: `var(--${meta[1] === 'muted' ? 'faint' : meta[1]})` }} />{status[0].toUpperCase() + status.slice(1)}</span>
        {status === 'accepted' && <span className="faint" style={{ fontSize: 12 }}>Handle unlocked on their profile</span>}
      </div>
    </div>
  );
}
function Sent() {
  const { store, go } = useNav();
  return (
    <AppFrame title="Sent">
      {store.sent.length === 0
        ? <EmptyState icon="send" title="No requests sent yet" body="Find someone you’d like to meet and request their verified handle." action="Browse profiles" onAction={() => go('discover')} />
        : <div className="stack" style={{ gap: 12 }}>{store.sent.map((r) => <SentCard key={r.id} req={r} />)}</div>}
    </AppFrame>
  );
}

/* ---------------- connections ---------------- */
function ConnectionCard({ c }) {
  const { toast, go, store } = useNav();
  const p = window.DB.byId(c.who);
  const tint = window.DB.PROFILES.findIndex((x) => x.id === c.who);
  const expired = c.expired || c.daysLeft <= 0;
  const urgent = !expired && c.daysLeft <= 3;
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="row" style={{ gap: 14, padding: 16 }}>
        <button onClick={() => go('profile', p.id)} style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}><Photo label="" tint={tint} ratio="1 / 1" radius="var(--r-md)" style={{ width: 56, height: 56 }} /></button>
        <div className="stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
          <div className="row" style={{ gap: 8 }}><strong style={{ color: 'var(--ink)' }}>{p.name}, {p.age}</strong><VerifiedBadge small /></div>
          <ChannelBadge type={c.channel} />
        </div>
      </div>
      {/* handle reveal */}
      <div style={{ padding: '0 16px 16px' }}>
        {expired
          ? <div className="card" style={{ padding: 14, background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="row" style={{ gap: 8 }}><Icon name="clock" size={16} style={{ color: 'var(--faint)' }} /><span className="muted" style={{ fontSize: 13 }}>Expired from lite.dating. Your chat elsewhere is unaffected.</span></div>
              <button className="btn primary sm" onClick={() => { const res = store.sendRequest({ to: c.who, channel: c.channel, note: '' }); toast(res && res.ok ? `Re-requested ${c.channel === 'instagram' ? 'Instagram' : 'Telegram'} from ${p.name}` : 'Couldn’t re-request right now', res && res.ok ? 'ok' : 'warn'); }}><Icon name="send" size={14} />Re-request</button>
            </div>
          : <div className="card" style={{ padding: 14, background: 'var(--green-w)', border: 'none' }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
                <div className="row" style={{ gap: 10 }}>
                  <Icon name={c.channel} size={18} style={{ color: c.channel === 'instagram' ? 'var(--violet)' : 'var(--cyan)' }} />
                  <span className="mono" style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700 }}>{c.handle}</span>
                </div>
                <button className="btn soft sm" onClick={() => toast('Handle copied', 'ok')}><Icon name="copy" size={14} />Copy</button>
              </div>
              <div className="row" style={{ gap: 7, marginTop: 10 }}>
                <Icon name="clock" size={13} style={{ color: urgent ? 'var(--amber)' : 'var(--faint)' }} />
                <span style={{ fontSize: 12, color: urgent ? 'color-mix(in oklch, var(--amber), black 15%)' : 'var(--muted)' }}>Visible inside lite.dating for <strong>{c.daysLeft} more day{c.daysLeft === 1 ? '' : 's'}</strong> — it never disappears from {c.channel === 'instagram' ? 'Instagram' : 'Telegram'}.</span>
              </div>
            </div>}
      </div>
    </div>
  );
}
function Connections() {
  const { store, go } = useNav();
  return (
    <AppFrame title="Connections">
      <p className="muted" style={{ fontSize: 14, marginBottom: 18, maxWidth: 560 }}>Mutual handle trades. Each stays visible here for 14 days, then expires from lite.dating — your conversations elsewhere keep going.</p>
      {store.connections.length === 0
        ? <EmptyState icon="link" title="No connections yet" body="When a request is mutual, the handle unlocks and appears here." action="Find people" onAction={() => go('discover')} />
        : <div className="disc-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>{store.connections.map((c) => <ConnectionCard key={c.id} c={c} />)}</div>}
    </AppFrame>
  );
}

/* ---------------- favorites ---------------- */
function Favorites() {
  const { store, go } = useNav();
  const favs = window.DB.PROFILES.filter((p) => store.favorites.has(p.id) && !store.isBlocked(p.id) && !p.blockedMe && !p.suspended && !p.deleted);
  const items = [];
  favs.forEach((p, i) => {
    items.push(<ProfileCard key={p.id} p={p} tint={window.DB.PROFILES.findIndex((x) => x.id === p.id)} />);
    if (i >= 6 && (i - 6) % 9 === 0) items.push(<NativeAd key={'ad' + i} />);
  });
  return (
    <AppFrame title="Favorites">
      {favs.length === 0
        ? <EmptyState icon="heart" title="No favorites yet" body="Tap the heart on any profile to save it here. Favoriting is private — they’re never notified." action="Browse profiles" onAction={() => go('discover')} />
        : <>
            <div className="disc-grid">{items}</div>
            <p className="faint tac" style={{ fontSize: 12.5, marginTop: 24, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>Some saved profiles may disappear if they delete their account, block you, or are removed for safety reasons.</p>
          </>}
    </AppFrame>
  );
}

Object.assign(window, { Inbox, Sent, Connections, Favorites, EmptyState });
