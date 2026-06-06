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
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}><span className="badge" style={{ background: 'var(--surface)', fontSize: 11, padding: '5px 8px' }} title={p.gender}>{p.gender === 'Woman' ? '♀' : p.gender === 'Man' ? '♂' : '⚧'}</span><VerifiedBadge small /></div>
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
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--line-soft)' }}>
        <span className="ad-label"><Icon name="info" size={12} />Advertisement</span>
        <span className="faint" style={{ fontSize: 11 }}>Sponsored</span>
      </div>
      <div className="ph-stripe" style={{ aspectRatio: '4 / 3', display: 'grid', placeItems: 'center', background: 'var(--surface-2)' }}>
        <span className="ph-label">ad</span>
      </div>
    </div>
  );
}

function FiltersModal({ draft, setDraft, onApply, onClear, onClose }) {
  const me = window.DB.ME;
  const noChannel = !draft.ig && !draft.tg;
  const ageBad = draft.ageMin > draft.ageMax;
  const canApply = !noChannel && !ageBad;
  const Check = ({ on, label, icon, onToggle }) => (
    <label className="card pad row" style={{ gap: 10, cursor: 'pointer', alignItems: 'center', borderColor: on ? 'var(--violet)' : 'var(--line)', flex: 1 }} onClick={onToggle}>
      <CheckBox on={on} /><Icon name={icon} size={16} style={{ color: icon === 'instagram' ? 'var(--violet)' : 'var(--cyan)' }} /><span style={{ fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
    </label>
  );
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Filters</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 22px 22px' }}>
          <Field label="Looking for" hint="Set in your profile — changing who you’re shown to keeps matching mutual.">
            <GenderPicker multi disabled value={me.seeking} onChange={() => {}} />
          </Field>
          <Field label="Verified channels" error={noChannel ? 'Choose at least one verified channel.' : null} hint={noChannel ? null : draft.ig && draft.tg ? 'Showing people who verified both.' : draft.ig ? 'Showing people with Instagram verified.' : 'Showing people with Telegram verified.'}>
            <div className="row" style={{ gap: 10 }}>
              <Check on={draft.ig} label="Instagram verified" icon="instagram" onToggle={() => setDraft({ ...draft, ig: !draft.ig })} />
              <Check on={draft.tg} label="Telegram verified" icon="telegram" onToggle={() => setDraft({ ...draft, tg: !draft.tg })} />
            </div>
          </Field>
          <Field label="Age range" error={ageBad ? 'Minimum must be at or below maximum.' : null}>
            <div className="row" style={{ gap: 10, alignItems: 'center' }}>
              <input className="input" type="number" min="18" max="99" value={draft.ageMin} onChange={(e) => setDraft({ ...draft, ageMin: Number(e.target.value) })} style={{ width: 80 }} />
              <span className="muted">to</span>
              <input className="input" type="number" min="18" max="99" value={draft.ageMax} onChange={(e) => setDraft({ ...draft, ageMax: Number(e.target.value) })} style={{ width: 80 }} />
            </div>
          </Field>
          <Field label="Location">
            <CityField value={draft.loc} onChange={(v) => setDraft({ ...draft, loc: v })} placeholder="Anywhere — set location" compact />
          </Field>
          <Field label={`Maximum distance · ${draft.dist >= 3000 ? 'Global 🌍' : draft.dist + ' km'}`}>
            <input type="range" min="25" max="3000" step="25" value={draft.dist} onChange={(e) => setDraft({ ...draft, dist: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--violet)' }} />
            <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
              <span className="faint" style={{ fontSize: 11 }}> </span>
              <button type="button" className="btn ghost sm" style={{ height: 28, fontSize: 12, padding: '0 10px', borderColor: draft.dist >= 3000 ? 'var(--violet)' : 'var(--line)', color: draft.dist >= 3000 ? 'var(--violet)' : 'var(--muted)' }} onClick={() => setDraft({ ...draft, dist: draft.dist >= 3000 ? 500 : 3000 })}>🌍 Global</button>
            </div>
          </Field>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <button className="btn ghost" onClick={onClear}>Clear filters</button>
            <button className="btn primary" style={{ flex: 1 }} disabled={!canApply} onClick={onApply}>{canApply ? 'Apply filters' : noChannel ? 'Choose a channel' : 'Fix age range'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBar({ loc, onClearLoc, onOpenFilters, tab, setTab, newCount }) {
  const tabs = [['nearby', 'Nearby'], ['new', 'New'], ['active', 'Active']];
  return (
    <div className="row wrap" style={{ gap: 10, marginBottom: 20 }}>
      {loc
        ? <div className="badge neutral" style={{ flex: 1, minWidth: 160, justifyContent: 'space-between', padding: '0 6px 0 12px', height: 44 }}><span className="row" style={{ gap: 7 }}><Icon name="pin" size={14} />{loc}</span><button className="btn icon sm ghost" onClick={onClearLoc} title="Clear location"><Icon name="x" size={14} /></button></div>
        : <button className="btn ghost" style={{ flex: 1, minWidth: 160, height: 44, justifyContent: 'flex-start' }} onClick={onOpenFilters}><Icon name="pin" size={16} />Anywhere — set location</button>}
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
  const [tab, setTab] = useState('nearby');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const DEFAULTS = { ig: true, tg: true, ageMin: 18, ageMax: 99, loc: '', dist: 500 };
  const [applied, setApplied] = useState(DEFAULTS);
  const [draft, setDraft] = useState(DEFAULTS);
  const me = window.DB.ME;
  const all = window.DB.PROFILES;
  const cityToken = (applied.loc || '').split(',')[0].trim().toLowerCase();
  const matched = all.filter((p) => window.DB.mutualGender(me, p) && !store.isBlocked(p.id));
  const newCount = matched.filter((p) => p.newToday).length;
  const list = matched.filter((p) => {
    const matchesLoc = !cityToken || p.city.toLowerCase().includes(cityToken);
    const within = applied.dist >= 3000 || p.dist <= applied.dist;
    const matchesTab = tab === 'new' ? p.newToday : tab === 'active' ? p.online : true;
    const matchesAge = p.age >= applied.ageMin && p.age <= applied.ageMax;
    const matchesCh = (!applied.ig || p.channels.instagram.verified) && (!applied.tg || p.channels.telegram.verified);
    return matchesLoc && within && matchesTab && matchesAge && matchesCh;
  });
  if (tab === 'nearby') list.sort((a, b) => a.dist - b.dist);
  // build grid items: first ad after 19 profile cards, then every 13 (ads not counted as cards)
  const items = [];
  list.forEach((p, i) => {
    items.push(<ProfileCard key={p.id} p={p} tint={i} />);
    if (i >= 18 && (i - 18) % 13 === 0) items.push(<NativeAd key={'ad' + i} />);
  });
  const nonDefault = applied.loc || applied.dist !== 500 || !applied.ig || !applied.tg || applied.ageMin !== 18 || applied.ageMax !== 99;
  const openFilters = () => { setDraft(applied); setFiltersOpen(true); };
  const apply = () => { setApplied(draft); setFiltersOpen(false); };
  const clear = () => { setDraft(DEFAULTS); setApplied(DEFAULTS); };
  return (
    <AppFrame title="Discover">
      <FilterBar loc={applied.loc} onClearLoc={() => setApplied({ ...applied, loc: '' })} onOpenFilters={openFilters} tab={tab} setTab={setTab} newCount={newCount} />
      {nonDefault && (
        <div className="row wrap" style={{ gap: 8, marginTop: -8, marginBottom: 16, alignItems: 'center' }}>
          <span className="faint" style={{ fontSize: 12 }}>Active filters:</span>
          {applied.ig && <span className="badge ig" style={{ fontSize: 11 }}><Icon name="instagram" />IG verified</span>}
          {applied.tg && <span className="badge tg" style={{ fontSize: 11 }}><Icon name="telegram" />TG verified</span>}
          {(applied.ageMin !== 18 || applied.ageMax !== 99) && <span className="badge neutral" style={{ fontSize: 11 }}>{applied.ageMin}–{applied.ageMax}</span>}
          {applied.loc && <span className="badge neutral" style={{ fontSize: 11 }}><Icon name="pin" size={11} />{applied.loc}</span>}
          {applied.dist !== 500 && <span className="badge neutral" style={{ fontSize: 11 }}>{applied.dist >= 3000 ? '🌍 Global' : '≤' + applied.dist + ' km'}</span>}
          <button onClick={clear} style={{ background: 'none', border: 'none', color: 'var(--violet)', cursor: 'pointer', fontWeight: 600, fontSize: 12, padding: 0 }}>Clear</button>
        </div>
      )}
      {list.length === 0
        ? <DiscoverEmpty narrow />
        : <div className="disc-grid">{items}</div>}
      <p className="faint tac" style={{ fontSize: 12.5, marginTop: 28 }}>You’ve reached the end of nearby profiles. Widen your distance in Filters to see more.</p>
      {filtersOpen && <FiltersModal draft={draft} setDraft={setDraft} onApply={apply} onClear={clear} onClose={() => setFiltersOpen(false)} />}
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
        <button className="btn primary" onClick={() => go('discover')}>Widen distance</button>
        <button className="btn ghost" onClick={() => go('me')}>Change your profile settings</button>
      </div>
    </div>
  );
  if (framed) return <AppFrame title="Discover">{body}</AppFrame>;
  return body;
}

Object.assign(window, { ProfileCard, NativeAd, Discover, DiscoverEmpty, FavButton });
