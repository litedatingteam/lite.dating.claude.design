/* lite.dating — shared form inputs: Dropdown, DatePicker (18+), CityField (Google-style) */

function useClickOutside(ref, onOut) {
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onOut(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
}

/* ---------- custom dropdown (styled select) ---------- */
function Dropdown({ value, onChange, options, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="input dd-trigger" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span style={{ color: value ? 'var(--ink)' : 'var(--faint)' }}>{value || placeholder}</span>
        <Icon name="chevD" size={16} style={{ color: 'var(--faint)', transition: 'transform .18s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div className="dd-pop" role="listbox">
          {options.map((o) => (
            <div key={o} className={`dd-opt ${value === o ? 'on' : ''}`} role="option" aria-selected={value === o} onClick={() => { onChange(o); setOpen(false); }}>
              {o}{value === o && <Icon name="check" size={15} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- date picker with 18+ enforcement ---------- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function DatePicker({ value, onChange, placeholder = 'Select your birth date' }) {
  const today = new Date();
  const maxY = today.getFullYear() - 18, maxM = today.getMonth(), maxDate = new Date(maxY, maxM, today.getDate());
  const minY = 1940;
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  const parsed = value ? value.split('-').map(Number) : null; // [y, m(1-12), d]
  const [view, setView] = useState(() => parsed ? { y: parsed[0], m: parsed[1] - 1 } : { y: maxY, m: maxM });

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const firstDow = new Date(view.y, view.m, 1).getDay();
  const dayDisabled = (d) => new Date(view.y, view.m, d) > maxDate;
  const atMaxMonth = view.y === maxY && view.m === maxM;
  const atMin = view.y === minY && view.m === 0;
  const years = []; for (let y = maxY; y >= minY; y--) years.push(y);
  const pick = (d) => { if (dayDisabled(d)) return; onChange(`${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`); setOpen(false); };
  const shift = (delta) => { let m = view.m + delta, y = view.y; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } if (y > maxY || (y === maxY && m > maxM)) return; if (y < minY) return; setView({ y, m }); };
  const setMonth = (m) => setView((v) => ({ ...v, m: (v.y === maxY && m > maxM) ? maxM : m }));
  const label = value ? new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : placeholder;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" className="input dd-trigger" onClick={() => setOpen((o) => !o)}>
        <span style={{ color: value ? 'var(--ink)' : 'var(--faint)' }}>{label}</span>
        <Icon name="clock" size={16} style={{ color: 'var(--faint)' }} />
      </button>
      {open && (
        <div className="cal">
          <div className="cal-head">
            <button className="cal-nav" type="button" onClick={() => shift(-1)} disabled={atMin} aria-label="Previous month"><Icon name="arrowL" size={15} /></button>
            <select value={view.m} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((mn, i) => <option key={mn} value={i} disabled={view.y === maxY && i > maxM}>{mn}</option>)}
            </select>
            <select value={view.y} onChange={(e) => setView((v) => ({ ...v, y: Number(e.target.value), m: (Number(e.target.value) === maxY && v.m > maxM) ? maxM : v.m }))}>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <button className="cal-nav" type="button" onClick={() => shift(1)} disabled={atMaxMonth} aria-label="Next month"><Icon name="arrowR" size={15} /></button>
          </div>
          <div className="cal-grid">
            {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
            {Array.from({ length: firstDow }).map((_, i) => <div key={'e' + i} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const sel = parsed && parsed[0] === view.y && parsed[1] - 1 === view.m && parsed[2] === d;
              return <button key={d} type="button" className={`cal-day ${sel ? 'sel' : ''}`} disabled={dayDisabled(d)} onClick={() => pick(d)}>{d}</button>;
            })}
          </div>
          <div className="dd-foot" style={{ justifyContent: 'flex-start', paddingTop: 8 }}>You must be 18 or older to join.</div>
        </div>
      )}
    </div>
  );
}

/* ---------- city field (Google-style autocomplete + geolocation) ---------- */
function CityField({ value, onChange, placeholder = 'Search your city', autoDetect = false, compact = false }) {
  const [q, setQ] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const ref = useRef(null);
  const CITIES = window.DB.CITIES;
  useClickOutside(ref, () => setOpen(false));
  useEffect(() => { if (value !== undefined && value !== q) setQ(value || ''); }, [value]);

  const detect = () => {
    setDetecting(true); setOpen(false);
    const finish = (city) => { setQ(city); onChange(city); setDetecting(false); };
    // try the real geolocation permission, but always resolve to a place (no API key in prototype)
    let done = false;
    const fallback = setTimeout(() => { if (!done) { done = true; finish('Kadıköy, İstanbul'); } }, 1300);
    try {
      navigator.geolocation && navigator.geolocation.getCurrentPosition(
        () => { if (!done) { done = true; clearTimeout(fallback); finish('Kadıköy, İstanbul'); } },
        () => { if (!done) { done = true; clearTimeout(fallback); finish('Kadıköy, İstanbul'); } },
        { timeout: 1200 }
      );
    } catch (e) { /* fallback handles it */ }
  };
  useEffect(() => { if (autoDetect && !value) detect(); }, []);

  const sugg = (q && open) ? CITIES.filter((c) => c.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const choose = (c) => { setQ(c); onChange(c); setOpen(false); };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <button type="button" title={q ? 'Clear location' : 'Use my current location'}
          onClick={() => { if (detecting) return; if (q) { setQ(''); onChange(''); setOpen(false); } else { detect(); } }}
          style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: 8, border: 'none', background: q ? 'var(--surface-2)' : 'transparent', display: 'grid', placeItems: 'center', cursor: 'pointer', color: q ? 'var(--violet)' : 'var(--faint)' }}>
          {detecting ? <span className="spinner" style={{ width: 16, height: 16 }} /> : q ? <Icon name="x" size={16} /> : <Icon name="compass" size={16} />}
        </button>
        <input className="input" style={{ paddingLeft: 44, paddingRight: 14, height: compact ? 44 : undefined }}
          placeholder={detecting ? 'Detecting your location…' : placeholder} value={q}
          onChange={(e) => { setQ(e.target.value); onChange(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      </div>
      {open && (
        <div className="dd-pop">
          <div className="dd-opt" onClick={detect}><span className="row" style={{ gap: 9 }}><Icon name="compass" size={15} style={{ color: 'var(--violet)' }} />Use my current location</span></div>
          {sugg.map((c) => <div key={c} className="dd-opt" onClick={() => choose(c)}><span className="row" style={{ gap: 9 }}><Icon name="pin" size={14} style={{ color: 'var(--faint)' }} />{c}</span></div>)}
          {q && sugg.length === 0 && <div className="dd-opt" style={{ color: 'var(--faint)', cursor: 'default' }}>No matches — type to search</div>}
          <div className="dd-foot"><Icon name="search" size={11} /> Powered by Google</div>
        </div>
      )}
    </div>
  );
}

/* ---------- gender picker — nice checkable chips (single or multi) ---------- */
const GENDERS = ['Woman', 'Man', 'Non-binary'];
const GENDER_ICON = { Woman: 'user', Man: 'user', 'Non-binary': 'user' };
function GenderPicker({ value, onChange, multi = false, disabled = false }) {
  const sel = multi ? (Array.isArray(value) ? value : []) : value;
  const isOn = (g) => multi ? sel.includes(g) : sel === g;
  const toggle = (g) => {
    if (disabled) return;
    if (multi) onChange(sel.includes(g) ? sel.filter((x) => x !== g) : [...sel, g]);
    else onChange(g);
  };
  return (
    <div className="gp-row" role={multi ? 'group' : 'radiogroup'}>
      {GENDERS.map((g) => {
        const on = isOn(g);
        return (
          <button key={g} type="button" disabled={disabled} aria-pressed={on}
            className={`gp-chip ${on ? 'on' : ''} ${disabled ? 'dis' : ''}`} onClick={() => toggle(g)}>
            <span className={`gp-box ${multi ? '' : 'round'} ${on ? 'on' : ''}`}>{on && <Icon name="checkSm" size={13} style={{ color: 'white' }} />}</span>
            {g}
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Dropdown, DatePicker, CityField, GenderPicker });
