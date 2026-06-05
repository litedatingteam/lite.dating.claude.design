/* lite.dating — discover feed */

function FavButton({ id, size = 'md' }) {
  const { store } = useNav();
  const on = store.favorites.has(id);
  return (
    <button className={`btn icon ${size === 'sm' ? 'sm' : ''}`} aria-pressed={on} aria-label={on ? 'Remove from favorites' : 'Save to favorites'}
      onClick={(e) => { e.stopPropagation(); store.toggleFav(id); }}
      style={{ background: on ? 'var(--wash-pink)' : 'var(--surface)', borderColor: on ? 'transparent' : 'var(--line)', color: on ? 'var(--pink)' : 'var(--muted)', boxShadow: 'var(--sh-xs)' }}>
      <Icon name={on ? 'heartFill' : 'heart'} size={18} />
    </button>
  );
}

function ProfileCard({ p, tint }) {
  const { go } = useNav();
  const interests = p.interests.slice(0, 3);
  return (
    <div className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s var(--ease), box-shadow .2s var(--ease)', display: 'flex', flexDirection: 'column' }}
      onClick={() => go('profile', p.id)}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(calc(-3px * var(--motion)))'; e.currentTarget.style.boxShadow = 'var(--sh-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ position: 'relative' }}>
        <Photo label={`${p.name.toLowerCase()} · photo`} tint={tint} ratio="4 / 5" radius="0">
          <div style={{ position: 'absolute', top: 10, left: 10 }}><VerifiedBadge small /></div>
          <div style={{ position: 'absolute', top: 10, right: 10 }}><FavButton id={p.id} size="sm" /></div>
          {p.online && <span className="badge" style={{ position: 'absolute', bottom: 10, left: 10, background: 'var(--surface)', fontSize: 11 }}><span className="dot" style={{ background: 'var(--green)' }} />Active now</span>}
          <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 70, background: 'linear-gradient(transparent, oklch(0.2 0.04 320 / 0.18))' }} />
        </Photo>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h3 style={{ fontSize: 17 }}>{p.name}, {p.age}</h3>
          <span className="faint" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.dist} km</span>
        </div>
        <div className="row faint" style={{ gap: 5, fontSize: 12.5, marginTop: -4 }}><Icon name="pin" size={13} />{p.city}</div>
        <div className="row wrap" style={{ gap: 6 }}>
          {interests.map((i) => <Chip key={i} cat={window.DB.tag(i).cat}>{i}</Chip>)}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 'auto', paddingTop: 4 }}>
          <span className="faint" style={{ fontSize: 11.5 }}>Verified:</span>
          {p.channels.instagram.verified && <Icon name="instagram" size={16} style={{ color: 'var(--violet)' }} />}
          {p.channels.telegram.verified && <Icon name="telegram" size={16} style={{ color: 'var(--cyan)' }} />}
          <button className="btn soft sm" style={{ marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); go('profile', p.id); }}>View<Icon name="arrowR" size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function NativeAd() {
  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px dashed var(--line)' }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--line-soft)' }}>
        <span className="ad-label"><Icon name="info" size={12} />Advertisement</span>
        <span className="faint" style={{ fontSize: 11 }}>Google</span>
      </div>
      <div className="ph-stripe" style={{ aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', background: 'var(--surface-2)' }}>
        <span className="ph-label">native ad creative</span>
      </div>
      <div style={{ padding: 14 }}>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Sponsored content appears in its own labeled card — never styled as a profile, and never with profile actions.</p>
        <button className="btn ghost sm" style={{ marginTop: 10 }}>Why this ad?</button>
      </div>
    </div>
  );
}

function FilterBar({ q, setQ }) {
  return (
    <div className="row wrap" style={{ gap: 10, marginBottom: 20 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <Icon name="search" size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }} />
        <input className="input" placeholder="Search interests, city…" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 40, height: 44 }} />
      </div>
      <div className="seg">
        <button className="on">Nearby</button><button>New</button><button>Active</button>
      </div>
      <button className="btn ghost"><Icon name="gear" size={16} />Filters</button>
    </div>
  );
}

function Discover() {
  const [q, setQ] = useState('');
  const all = window.DB.PROFILES;
  const list = q ? all.filter((p) => (p.name + ' ' + p.city + ' ' + p.interests.join(' ')).toLowerCase().includes(q.toLowerCase())) : all;
  // build grid items with ad inserted after 5 cards
  const items = [];
  list.forEach((p, i) => {
    items.push(<ProfileCard key={p.id} p={p} tint={i} />);
    if (i === 4) items.push(<NativeAd key="ad" />);
  });
  return (
    <AppFrame title="Discover" actions={<button className="btn soft sm"><Icon name="sparkle" size={15} />Today’s picks</button>}>
      <FilterBar q={q} setQ={setQ} />
      {list.length === 0
        ? <DiscoverEmpty narrow />
        : <div className="disc-grid">{items}</div>}
      <p className="faint tac" style={{ fontSize: 12.5, marginTop: 28 }}>You’ve reached the end of nearby profiles. Widen your distance in Filters to see more.</p>
    </AppFrame>
  );
}

function DiscoverEmpty({ narrow, framed }) {
  const { go } = useNav();
  const body = (
    <div className="tac stack" style={{ alignItems: 'center', gap: 16, padding: narrow ? '40px 20px' : '80px 20px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ width: 88, height: 88, borderRadius: 26, background: 'var(--grad-soft)', display: 'grid', placeItems: 'center', color: 'var(--violet)' }}><Icon name="compass" size={36} /></div>
      <h2 style={{ fontSize: 24 }}>No one new nearby — yet</h2>
      <p className="muted" style={{ fontSize: 15, lineHeight: 1.55 }}>We didn’t find profiles within your current distance. Try widening your range, or check back soon as more people join.</p>
      <div className="row wrap" style={{ gap: 10, justifyContent: 'center' }}>
        <button className="btn primary">Widen distance</button>
        <button className="btn ghost" onClick={() => go('me')}>Polish your profile</button>
      </div>
    </div>
  );
  if (framed) return <AppFrame title="Discover">{body}</AppFrame>;
  return body;
}

Object.assign(window, { ProfileCard, NativeAd, Discover, DiscoverEmpty, FavButton });
