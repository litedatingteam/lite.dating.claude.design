/* lite.dating — your profile, edit, settings */

/* labeled ad slot for own profile / edit profile — separated from sensitive actions */
function ProfileAd() {
  return (
    <div className="card" style={{ marginTop: 24, overflow: 'hidden', border: '1px dashed var(--line)', maxWidth: 560 }}>
      <div className="row" style={{ justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--line-soft)' }}>
        <span className="ad-label"><Icon name="info" size={12} />Advertisement</span>
        <span className="faint" style={{ fontSize: 11 }}>Sponsored</span>
      </div>
      <div className="ad-frame" style={{ height: 90, display: 'grid', placeItems: 'center', borderRadius: 0, border: 'none', background: 'var(--surface-2)' }}><span className="ph-label">ad</span></div>
    </div>
  );
}

function YourProfile() {
  const { go, store, toast } = useNav();
  const me = window.DB.ME;
  const [tg, setTg] = useState(me.channels.telegram.verified ? 'verified' : 'idle');
  const [tgModal, setTgModal] = useState(false);
  return (
    <AppFrame title="Your profile" actions={<button className="btn primary sm" onClick={() => go('edit')}><Icon name="user" size={15} />Edit profile</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1fr', gap: 32, alignItems: 'start' }} className="profile-grid">
        <div className="stack" style={{ gap: 10 }}>
          <Photo label="you · main photo" tint={1} ratio="4 / 5" radius="var(--r-lg)">
            <div style={{ position: 'absolute', top: 12, left: 12 }}><VerifiedBadge /></div>
          </Photo>
          <div className="row" style={{ gap: 8 }}>
            {[0, 1, 2].map((i) => <Photo key={i} label="" tint={i} ratio="1 / 1" radius="10px" />)}
          </div>
        </div>
        <div className="stack" style={{ gap: 22 }}>
          {/* completeness */}
          <div className="card pad" style={{ background: 'var(--grad-soft)', border: 'none' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}><strong style={{ color: 'var(--ink)' }}>Profile strength</strong><span className="badge verified">Strong</span></div>
            <div style={{ height: 8, borderRadius: 999, background: 'var(--surface)', overflow: 'hidden' }}><div style={{ width: '82%', height: '100%', background: 'var(--grad)' }} /></div>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 8 }}>Add one more photo and verify Telegram to reach 100%.</p>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <div className="row wrap" style={{ gap: 10, alignItems: 'center' }}><h1 style={{ fontSize: 28, whiteSpace: 'nowrap' }}>{me.name}, {me.age}</h1><VerifiedBadge /></div>
            <div className="row muted" style={{ gap: 8, fontSize: 14.5 }}><Icon name="pin" size={15} />{me.city} · {me.gender}</div>
            <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>{me.bio}</p>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Looking for</span>
            <div className="row wrap" style={{ gap: 8 }}>{me.seeking.map((g) => <Chip key={g}>{g}</Chip>)}</div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Interests</span>
            <div className="row wrap" style={{ gap: 8 }}>{store.interests.map((i) => <Chip key={i} cat={window.DB.tag(i).cat}>{i}</Chip>)}</div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Your verified channels</span>
            <div className="stack" style={{ gap: 10 }}>
              <div className="card pad row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 10 }}><Icon name="instagram" size={18} style={{ color: 'var(--violet)' }} /><span className="mono" style={{ color: 'var(--ink)' }}>{me.channels.instagram.handle}</span></div>
                <span className="badge verified"><Icon name="check" />Verified</span>
              </div>
              <div className="card pad row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 10 }}><Icon name="telegram" size={18} style={{ color: 'var(--cyan)' }} /><span className={tg === 'verified' ? 'mono' : 'muted'} style={tg === 'verified' ? { color: 'var(--ink)' } : undefined}>{tg === 'verified' ? '@you_tg' : 'Telegram not verified'}</span></div>
                {tg === 'verified'
                  ? <span className="badge verified"><Icon name="check" />Verified</span>
                  : tg === 'checking'
                  ? <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Linking…</span>
                  : <button className="btn soft sm" onClick={() => setTgModal(true)}>Verify</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProfileAd />
      {tgModal && <TelegramVerifyModal onClose={() => setTgModal(false)} onVerified={() => { setTg('verified'); me.channels.telegram.verified = true; me.channels.telegram.handle = '@you_tg'; toast('Telegram verified', 'ok'); setTgModal(false); }} />}
    </AppFrame>
  );
}

/* secure one-time Telegram link verification (reused from onboarding flow) */
function TelegramVerifyModal({ onClose, onVerified }) {
  const { toast } = useNav();
  const [state, setState] = useState('link'); // link | waiting | expired | taken
  const [token] = useState(() => Math.random().toString(36).slice(2, 12));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Verify Telegram</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: '12px 22px 22px' }} className="stack">
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Telegram verification uses a <strong style={{ color: 'var(--ink)' }}>secure one-time link</strong> that connects your Telegram account to your lite.dating account — your identity is bound to your Telegram <strong style={{ color: 'var(--ink)' }}>account</strong>, not just your @username.</p>
          {state === 'expired' ? (
            <div className="card pad stack" style={{ gap: 10, background: 'var(--red-w)', border: 'none' }}>
              <div className="row" style={{ gap: 9 }}><Icon name="clock" size={16} style={{ color: 'var(--red)', flex: 'none' }} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>This link expired before confirmation. Generate a fresh one.</span></div>
              <button className="btn ink sm" style={{ alignSelf: 'flex-start' }} onClick={() => setState('link')}><Icon name="link" size={14} />Generate new secure link</button>
            </div>
          ) : state === 'taken' ? (
            <div className="card pad stack" style={{ gap: 10, background: 'var(--red-w)', border: 'none' }}>
              <div className="row" style={{ gap: 9 }}><Icon name="info" size={16} style={{ color: 'var(--red)', flex: 'none' }} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>This Telegram account is already linked to another lite.dating account.</span></div>
              <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={onClose}>Use a different account</button>
            </div>
          ) : state === 'waiting' ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="row" style={{ gap: 10, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '10px 12px', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink)' }}>t.me/litedating_bot?start=…</span>
                <button className="btn ghost sm" onClick={() => toast('Secure link copied', 'ok')}><Icon name="copy" size={14} />Copy</button>
              </div>
              <div className="row" style={{ gap: 10, justifyContent: 'center', padding: 4 }}><span className="spinner" /><span className="muted" style={{ fontSize: 13 }}>Waiting for the bot to confirm…</span></div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn primary sm" style={{ flex: 1 }} onClick={onVerified}>Simulate confirmed</button>
                <button className="btn ghost sm" onClick={() => setState('expired')}>Link expired</button>
                <button className="btn ghost sm" onClick={() => setState('taken')}>Already used</button>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              <span className="eyebrow">Open your secure link</span>
              <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Opens <span className="mono" style={{ color: 'var(--ink)' }}>@litedating_bot</span> and tap <strong style={{ color: 'var(--ink)' }}>Start</strong>. No code to keep in your profile.</p>
              <button className="btn ink" onClick={() => setState('waiting')}><Icon name="telegram" size={15} />Open secure Telegram link</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditProfile() {
  const { go, toast, store } = useNav();
  const me = window.DB.ME;
  const [bio, setBio] = useState(me.bio);
  const [city, setCity] = useState(me.city);
  const [gender, setGender] = useState(me.gender);
  const [seeking, setSeeking] = useState(me.seeking);
  const [intModal, setIntModal] = useState(false);
  const [about, setAbout] = useState('Designer who likes long walks and short emails. Looking for someone curious and a little stubborn.');
  const bioMin = 15, aboutMin = 60;
  const bioShort = bio.length < bioMin, aboutShort = about.length < aboutMin;
  return (
    <AppFrame title="Edit profile" actions={<div className="row" style={{ gap: 8 }}><button className="btn ghost sm" onClick={() => go('me')}>Cancel</button><button className="btn primary sm" disabled={bioShort || aboutShort || seeking.length === 0} onClick={() => { Object.assign(me, { bio, city, gender, seeking }); toast('Profile saved', 'ok'); go('me'); }}>Save changes</button></div>}>
      <div className="center-col stack" style={{ gap: 22, maxWidth: 560, margin: '0 auto' }}>
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">Photos</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => <Photo key={i} label={i < 3 ? 'photo' : 'add'} tint={i} ratio="3 / 4" />)}
          </div>
        </div>
        <Field label="Short bio" error={bioShort ? `At least ${bioMin} characters` : null} hint={`${bio.length}/80 · min ${bioMin}`}><input className="input" value={bio} maxLength={80} onChange={(e) => setBio(e.target.value)} /></Field>
        <Field label="About" error={aboutShort ? `At least ${aboutMin} characters` : null} hint={`${about.length}/400 · min ${aboutMin}`}><textarea className="textarea" maxLength={400} value={about} onChange={(e) => setAbout(e.target.value)} /></Field>
        <div className="row" style={{ gap: 14 }}>
          <Field label="Gender / presentation"><GenderPicker value={gender} onChange={setGender} /></Field>
        </div>
        <Field label="Interested in" error={seeking.length === 0 ? 'Pick at least one' : null} hint="You’ll only see — and be seen by — matching people, both ways."><GenderPicker multi value={seeking} onChange={setSeeking} /></Field>
        <Field label="City" hint="We auto-detect your area. Set on its own line."><CityField value={city} onChange={setCity} /></Field>
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">Interests · {store.interests.length}/8</span>
          <div className="row wrap" style={{ gap: 8 }}>
            {store.interests.map((i) => <Chip key={i} tap on cat={window.DB.tag(i).cat} onClick={() => store.setInterests(store.interests.filter((x) => x !== i))}>{i} ✕</Chip>)}
            <Chip tap onClick={() => setIntModal(true)}><Icon name="plus" size={14} />Add</Chip>
          </div>
        </div>
      </div>
      {intModal && <InterestsModal onClose={() => setIntModal(false)} />}
      <ProfileAd />
    </AppFrame>
  );
}

function InterestsModal({ onClose }) {
  const { store, toast } = useNav();
  const { CATEGORIES, INTERESTS } = window.DB;
  const toggle = (name) => {
    const has = store.interests.includes(name);
    if (has) store.setInterests(store.interests.filter((x) => x !== name));
    else if (store.interests.length < 8) store.setInterests([...store.interests, name]);
    else toast('Up to 8 interests', 'warn');
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Edit interests · {store.interests.length}/8</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: '14px 22px 22px' }} className="stack">
          {Object.entries(CATEGORIES).map(([key, c]) => (
            <div key={key} className="stack" style={{ gap: 9, marginBottom: 6 }}>
              <span className="row" style={{ gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}><span className="dot" style={{ background: `oklch(0.7 0.13 ${c.hue})` }} />{c.label}</span>
              <div className="row wrap" style={{ gap: 8 }}>
                {INTERESTS[key].map((name) => <Chip key={name} tap on={store.interests.includes(name)} cat={key} onClick={() => toggle(name)}>{name}</Chip>)}
              </div>
            </div>
          ))}
          <button className="btn primary lg block" style={{ marginTop: 6 }} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, desc, children, onClick, danger }) {
  return (
    <div className="card pad row" style={{ justifyContent: 'space-between', gap: 14, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="row" style={{ gap: 12, minWidth: 0 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: danger ? 'var(--red-w)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: danger ? 'var(--red)' : 'var(--violet)', flex: 'none' }}><Icon name={icon} size={18} /></span>
        <div style={{ minWidth: 0 }}><strong style={{ color: danger ? 'var(--red)' : 'var(--ink)', fontSize: 14.5 }}>{title}</strong><p className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{desc}</p></div>
      </div>
      {children || (onClick && <Icon name="chevR" size={18} style={{ color: 'var(--faint)', flex: 'none' }} />)}
    </div>
  );
}

function Settings() {
  const { go, toast } = useNav();
  const [notif, setNotif] = useState({ requests: true, connections: true, tips: false });
  const [ads, setAds] = useState(true);
  const [del, setDel] = useState(false);
  return (
    <AppFrame title="Settings">
      <div className="center-col stack" style={{ gap: 26, maxWidth: 600, margin: '0 auto' }}>
        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Account</span>
          <SettingRow icon="mail" title="Email & sign-in" desc="you@example.com · signed in with a code" />
          <SettingRow icon="user" title="Edit profile" desc="Photos, bio, interests, channels" onClick={() => go('edit')} />
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Notifications</span>
          <SettingRow icon="bell" title="New requests" desc="When someone requests your handle"><Switch checked={notif.requests} onChange={(v) => setNotif({ ...notif, requests: v })} /></SettingRow>
          <SettingRow icon="link" title="Connections" desc="When a request becomes mutual"><Switch checked={notif.connections} onChange={(v) => setNotif({ ...notif, connections: v })} /></SettingRow>
          <SettingRow icon="sparkle" title="Tips & product news" desc="Occasional, never spammy"><Switch checked={notif.tips} onChange={(v) => setNotif({ ...notif, tips: v })} /></SettingRow>
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Requests</span>
          <SettingRow icon="send" title="Daily request limit" desc="Up to 13 successful handle requests per rolling 24 hours"><span className="badge neutral">13 / 24h</span></SettingRow>
          <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
            <Icon name="info" size={16} style={{ color: 'var(--violet)', flex: 'none' }} />
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Requests are limited to keep things calm and reduce spam. Only successful Instagram or Telegram requests count — failed eligibility checks, duplicate pending requests, and accepting or declining don’t. Safety systems may temporarily lower the limit for suspicious activity.</p>
          </div>
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Ads & privacy</span>
          <SettingRow icon="eye" title="Ad experience" desc="See how ads work, and manage personalization consent" onClick={() => go('ad-experience')} />
          <SettingRow icon="info" title="Personalized ads" desc="Managed through the certified consent system. Open consent options." onClick={() => go('ad-experience')}><Icon name="chevR" size={18} style={{ color: 'var(--faint)' }} /></SettingRow>
          <SettingRow icon="shield" title="Safety center" desc="Report, block, appeals, data export" onClick={() => go('safety-center')} />
          <SettingRow icon="eye" title="Data export" desc="Download a copy of your data" onClick={() => go('data-export')} />
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Danger zone</span>
          <SettingRow icon="logout" title="Sign out" desc="On this device" onClick={() => go('landing')} />
          <SettingRow icon="x" title="Delete account" desc="Removes your profile and pending requests" danger onClick={() => setDel(true)} />
        </div>
      </div>

      {del && (
        <div className="overlay" onClick={() => setDel(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div style={{ padding: 26 }} className="stack">
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--red-w)', display: 'grid', placeItems: 'center', color: 'var(--red)', marginBottom: 14 }}><Icon name="x" size={22} /></div>
              <h2 style={{ fontSize: 21 }}>Delete your account?</h2>
              <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55, marginTop: 8 }}>This permanently removes your profile, photos, verified channels, and any pending requests. Existing connections will no longer see your handle here. This can’t be undone.</p>
              <div className="row" style={{ gap: 10, marginTop: 22 }}>
                <button className="btn ghost lg" style={{ flex: 1 }} onClick={() => setDel(false)}>Keep my account</button>
                <button className="btn danger lg" style={{ flex: 1 }} onClick={() => { setDel(false); toast('Account scheduled for deletion', 'warn'); go('landing'); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppFrame>
  );
}

Object.assign(window, { YourProfile, EditProfile, Settings, SettingRow });
