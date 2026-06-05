/* lite.dating — discover feed */

function FavButton({ id, size = 'md' }) {
  const { store, toast } = useNav();
  const on = store.favorites.has(id);
  return (
    <button className={`btn icon ${size === 'sm' ? 'sm' : ''}`} aria-pressed={on} aria-label={on ? 'Remove from favorites' : 'Save to favorites'}
      onClick={(e) => { e.stopPropagation(); store.toggleFav(id); if (!on) toast('Added to favorites'); }}
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
      </div>
    </div>
  );
}

function FiltersModal({ loc, setLoc, dist, setDist, onClose }) {
  const me = window.DB.ME;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Filters</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: '14px 22px 22px' }} className="stack">
          {/* seeked genders — disabled, set from profile */}
          <Field label="Looking for" hint="Set in your profile — changing who you’re shown to keeps matching mutual.">
            <GenderPicker multi disabled value={me.seeking} onChange={() => {}} />
          </Field>
          <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 9, marginTop: 2, marginBottom: 6 }}>
            <Icon name="info" size={15} style={{ color: 'var(--violet)', flex: 'none' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.45 }}>You only ever see — and are seen by — people whose preferences match yours both ways. Edit this in <strong style={{ color: 'var(--ink)' }}>Your profile</strong>.</span>
          </div>
          <div className="hr" />
          <Field label="Location">
            <CityField value={loc} onChange={setLoc} placeholder="Anywhere — set location" compact />
          </Field>
          <Field label={`Maximum distance · ${dist} km`}>
            <input type="range" min="5" max="2500" step="5" value={dist} onChange={(e) => setDist(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--violet)' }} />
          </Field>
          <button className="btn primary lg block" style={{ marginTop: 8 }} onClick={onClose}>Show results</button>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ loc, setLoc, onOpenFilters, tab, setTab, newCount }) {
  const tabs = [['nearby', 'Nearby'], ['new', 'New'], ['active', 'Active']];
  return (
    <div className="row wrap" style={{ gap: 10, marginBottom: 20 }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <CityField value={loc} onChange={setLoc} placeholder="Anywhere — set location" compact />
      </div>
      <div className="seg">
        {tabs.map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)} style={{ position: 'relative' }}>
            {label}
            {k === 'new' && newCount > 0 && <span style={{ display: 'inline-grid', placeItems: 'center', minWidth: 16, height: 16, padding: '0 4px', marginLeft: 6, borderRadius: 999, background: 'var(--pink)', color: 'white', fontSize: 10, fontWeight: 700, verticalAlign: 'middle' }}>{newCount}</span>}
          </button>
        ))}
      </div>
      <button className="btn ghost" onClick={onOpenFilters}><Icon name="gear" size={16} />Filters</button>
    </div>
  );
}

function Discover() {
  const { store } = useNav();
  const [loc, setLoc] = useState('');
  const [dist, setDist] = useState(2500);
  const [tab, setTab] = useState('nearby');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const me = window.DB.ME;
  const all = window.DB.PROFILES;
  const cityToken = (loc || '').split(',')[0].trim().toLowerCase();
  const matched = all.filter((p) => window.DB.mutualGender(me, p) && !store.isBlocked(p.id));
  const newCount = matched.filter((p) => p.newToday).length;
  const list = matched.filter((p) => {
    const matchesLoc = !cityToken || p.city.toLowerCase().includes(cityToken);
    const within = p.dist <= dist;
    const matchesTab = tab === 'new' ? p.newToday : tab === 'active' ? p.online : true;
    return matchesLoc && within && matchesTab;
  });
  if (tab === 'nearby') list.sort((a, b) => a.dist - b.dist);
  // build grid items with the first native ad after ~14 cards (not immediately)
  const items = [];
  list.forEach((p, i) => {
    items.push(<ProfileCard key={p.id} p={p} tint={i} />);
    if (i === 13) items.push(<NativeAd key="ad" />);
  });
  return (
    <AppFrame title="Discover">
      <FilterBar loc={loc} setLoc={setLoc} onOpenFilters={() => setFiltersOpen(true)} tab={tab} setTab={setTab} newCount={newCount} />
      {loc && <p className="muted" style={{ fontSize: 13, marginTop: -8, marginBottom: 16 }}><Icon name="pin" size={13} style={{ verticalAlign: '-2px' }} /> Showing people near <strong style={{ color: 'var(--ink)' }}>{loc}</strong> · <button onClick={() => setLoc('')} style={{ background: 'none', border: 'none', color: 'var(--violet)', cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}>clear</button></p>}
      {list.length === 0
        ? <DiscoverEmpty narrow />
        : <div className="disc-grid">{items}</div>}
      <p className="faint tac" style={{ fontSize: 12.5, marginTop: 28 }}>You’ve reached the end of nearby profiles. Widen your distance in Filters to see more.</p>
      {filtersOpen && <FiltersModal loc={loc} setLoc={setLoc} dist={dist} setDist={setDist} onClose={() => setFiltersOpen(false)} />}
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
