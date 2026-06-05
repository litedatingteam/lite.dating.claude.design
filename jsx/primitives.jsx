/* lite.dating — primitives & icons */
const { useState, useEffect, useRef, useContext, createContext } = React;

/* ---------------- icons (simple line glyphs) ---------------- */
const ICONS = {
  heart:   'M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z',
  heartFill: 'M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9Z',
  shield:  'M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z',
  check:   'M5 12.5l4.5 4.5L19 7',
  checkSm: 'M4 8.5l3 3 5.5-6',
  x:       'M6 6l12 12M18 6L6 18',
  arrowR:  'M5 12h14M13 6l6 6-6 6',
  arrowL:  'M19 12H5M11 18l-6-6 6-6',
  chevR:   'M9 6l6 6-6 6',
  chevD:   'M6 9l6 6 6-6',
  search:  'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3',
  user:    'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  inbox:   'M3 12h5l2 3h4l2-3h5M5 5h14l2 7v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5l2-7Z',
  send:    'M4 12l16-7-7 16-2-7-7-2Z',
  link:    'M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1',
  gear:    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2l-.4-2.6H8.9l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 4 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2l.4 2.6h6.2l.4-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z',
  bell:    'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM9.5 19a2.5 2.5 0 0 0 5 0',
  flag:    'M5 21V4M5 4h11l-2 4 2 4H5',
  lock:    'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  mail:    'M3 6h18v12H3zM3 7l9 6 9-6',
  google:  'GOOGLE',
  instagram: 'IG',
  telegram:  'TG',
  sparkle: 'M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z',
  pin:     'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  camera:  'M4 8h3l1.5-2h7L17 8h3v11H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  eye:     'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff:  'M3 3l18 18M10.5 10.7a2 2 0 0 0 2.8 2.8M6.5 6.7C4 8.3 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1M9.8 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-2.2 3',
  copy:    'M9 9h10v10H9zM5 15H4V5h10v1',
  clock:   'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  star:    'M12 4l2.3 5 5.5.5-4.1 3.7 1.2 5.3L12 16.8 7.1 18.5l1.2-5.3L4.2 9.5 9.7 9 12 4Z',
  plus:    'M12 5v14M5 12h14',
  info:    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8h.01',
  logout:  'M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 12h12M18 9l3 3-3 3',
  menu:    'M4 7h16M4 12h16M4 17h16',
  grid:    'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
};

function Icon({ name, size = 18, fill = false, stroke = 2, style, className }) {
  if (name === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
        <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.6Z"/>
        <path fill="#34A853" d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22Z"/>
        <path fill="#FBBC05" d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9l3.5-2.5Z"/>
        <path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 3.9 1.5l2.9-2.9A10 10 0 0 0 2.7 7.1l3.5 2.7C7 7.4 9.3 5.9 12 5.9Z"/>
      </svg>
    );
  }
  if (name === 'instagram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" style={style} className={className} aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>
      </svg>
    );
  }
  if (name === 'telegram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style} className={className} aria-hidden="true">
        <path d="M21.8 4.3 18.6 19c-.2 1-.9 1.3-1.8.8l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.3-.1-.5-.6-.2L6.2 12.6 1.3 11c-1-.3-1-1 .2-1.5l19-7.3c.9-.3 1.6.2 1.3 2.1Z"/>
      </svg>
    );
  }
  const d = ICONS[name] || ICONS.info;
  const fillIcons = name === 'heartFill' || name === 'star';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={fill || fillIcons ? 'currentColor' : 'none'}
      stroke={fill || fillIcons ? 'none' : 'currentColor'}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={style} className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------------- logo: wordmark + handle-trade heart glyph ---------------- */
function Logo({ size = 22, mono = false, onClick }) {
  const h = size * 1.15;
  return (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.42, cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}>
      <span style={{ display: 'inline-flex', width: h, height: h, position: 'relative' }} aria-hidden="true">
        <svg width={h} height={h} viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="lgGrad" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--pink)"/><stop offset="0.55" stopColor="var(--violet)"/><stop offset="1" stopColor="var(--cyan)"/>
            </linearGradient>
          </defs>
          {/* two arrows trading, forming a heart */}
          <path d="M16 27C16 27 5 20.5 5 12.5C5 8.4 8.1 5.5 11.6 5.5C13.6 5.5 15.2 6.6 16 8.2C16.8 6.6 18.4 5.5 20.4 5.5C23.9 5.5 27 8.4 27 12.5C27 20.5 16 27 16 27Z"
            fill={mono ? 'var(--ink)' : 'url(#lgGrad)'}/>
          <path d="M12.5 13.5h7M17 11l2.5 2.5L17 16" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.92"/>
          <path d="M19.5 17.5h-7M15 20l-2.5-2.5L15 15" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
        </svg>
      </span>
      <span style={{ fontWeight: 600, fontSize: size, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
        lite<span style={{ color: 'var(--muted)', fontWeight: 500 }}>.dating</span>
      </span>
    </span>
  );
}

/* ---------------- striped photo placeholder ---------------- */
function Photo({ label = 'photo', ratio = '3 / 4', radius = 'var(--r-md)', tint = 0, style, children }) {
  const hue = [330, 300, 220, 30][tint % 4];
  return (
    <div className="ph-stripe" style={{
      aspectRatio: ratio, borderRadius: radius, width: '100%',
      display: 'grid', placeItems: 'center',
      backgroundColor: `oklch(0.95 0.03 ${hue})`,
      ...style,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.85, padding: 12, textAlign: 'center' }}>
        <Icon name="camera" size={20} style={{ color: 'var(--muted)' }} />
        <span className="ph-label">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* ---------------- small building blocks ---------------- */
function Badge({ kind, icon, children }) {
  return <span className={`badge ${kind || ''}`}>{icon && <Icon name={icon} />}{children}</span>;
}
function VerifiedBadge({ small }) {
  return <span className="badge verified" title="Photo & channel verified"><Icon name="check" />{!small && 'Verified'}</span>;
}
function ChannelBadge({ type, verified = true }) {
  return <span className={`badge ${type === 'instagram' ? 'ig' : 'tg'}`}><Icon name={type} />{type === 'instagram' ? 'Instagram' : 'Telegram'}{verified ? '' : ' · unverified'}</span>;
}
function Chip({ children, on, mutual, tap, onClick, cat }) {
  const hue = cat && window.DB.CATEGORIES[cat] ? window.DB.CATEGORIES[cat].hue : null;
  const style = hue != null && !on && !mutual ? { borderColor: `oklch(0.9 0.04 ${hue})` } : undefined;
  return (
    <span className={`chip ${tap ? 'tap' : ''} ${on ? 'on' : ''} ${mutual ? 'mutual' : ''}`} onClick={onClick} style={style} role={tap ? 'button' : undefined} tabIndex={tap ? 0 : undefined}
      onKeyDown={tap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick && onClick(); } } : undefined}>
      {hue != null && <span className="dot" style={{ background: `oklch(0.7 0.13 ${hue})` }} />}
      {children}
      {mutual && <Icon name="sparkle" size={12} />}
    </span>
  );
}
function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} />
      <span className="track" /><span className="thumb" />
    </label>
  );
}
function Field({ label, hint, error, children }) {
  return (
    <div className={`field ${error ? 'err' : ''}`}>
      {label && <label>{label}</label>}
      {children}
      {error && <span className="err-msg"><Icon name="info" size={13} />{error}</span>}
      {hint && !error && <span className="hint">{hint}</span>}
    </div>
  );
}

/* avatar from a striped square */
function Avatar({ size = 44, label = '', tint = 0, online = false }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none' }}>
      <Photo label="" ratio="1 / 1" radius="50%" tint={tint} style={{ width: size, height: size }} />
      {online && <span style={{ position: 'absolute', right: 0, bottom: 0, width: size * 0.26, height: size * 0.26, borderRadius: '50%', background: 'var(--green)', border: '2.5px solid var(--surface)' }} />}
    </span>
  );
}

Object.assign(window, { Icon, Logo, Photo, Badge, VerifiedBadge, ChannelBadge, Chip, Switch, Field, Avatar });
