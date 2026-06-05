/* lite.dating — your profile, edit, settings */

function YourProfile() {
  const { go } = useNav();
  const me = window.DB.ME;
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
            <div className="row muted" style={{ gap: 8, fontSize: 14.5 }}><Icon name="pin" size={15} />{me.city}</div>
            <p style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>{me.bio}</p>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Interests</span>
            <div className="row wrap" style={{ gap: 8 }}>{me.interests.map((i) => <Chip key={i} cat={window.DB.tag(i).cat}>{i}</Chip>)}</div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Your verified channels</span>
            <div className="stack" style={{ gap: 10 }}>
              <div className="card pad row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 10 }}><Icon name="instagram" size={18} style={{ color: 'var(--violet)' }} /><span className="mono" style={{ color: 'var(--ink)' }}>{me.channels.instagram.handle}</span></div>
                <span className="badge verified"><Icon name="check" />Verified</span>
              </div>
              <div className="card pad row" style={{ justifyContent: 'space-between' }}>
                <div className="row" style={{ gap: 10 }}><Icon name="telegram" size={18} style={{ color: 'var(--cyan)' }} /><span className="muted">Telegram not verified</span></div>
                <button className="btn soft sm" onClick={() => go('edit')}>Verify</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function EditProfile() {
  const { go, toast } = useNav();
  const me = window.DB.ME;
  const [bio, setBio] = useState(me.bio);
  return (
    <AppFrame title="Edit profile" actions={<div className="row" style={{ gap: 8 }}><button className="btn ghost sm" onClick={() => go('me')}>Cancel</button><button className="btn primary sm" onClick={() => { toast('Profile saved', 'ok'); go('me'); }}>Save changes</button></div>}>
      <div className="center-col stack" style={{ gap: 22, maxWidth: 560, margin: '0 auto' }}>
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">Photos</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => <Photo key={i} label={i < 3 ? 'photo' : 'add'} tint={i} ratio="3 / 4" />)}
          </div>
        </div>
        <Field label="Short bio"><input className="input" value={bio} maxLength={80} onChange={(e) => setBio(e.target.value)} /></Field>
        <Field label="About"><textarea className="textarea" defaultValue="Designer who likes long walks and short emails. Looking for someone curious." /></Field>
        <div className="stack" style={{ gap: 10 }}>
          <span className="eyebrow">Interests</span>
          <div className="row wrap" style={{ gap: 8 }}>{me.interests.map((i) => <Chip key={i} tap on cat={window.DB.tag(i).cat}>{i} ✕</Chip>)}<Chip tap><Icon name="plus" size={14} />Add</Chip></div>
        </div>
      </div>
    </AppFrame>
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
          <SettingRow icon="mail" title="Email & sign-in" desc="you@example.com · signed in with a code" onClick={() => toast('Account settings')} />
          <SettingRow icon="user" title="Edit profile" desc="Photos, bio, interests, channels" onClick={() => go('edit')} />
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Notifications</span>
          <SettingRow icon="bell" title="New requests" desc="When someone requests your handle"><Switch checked={notif.requests} onChange={(v) => setNotif({ ...notif, requests: v })} /></SettingRow>
          <SettingRow icon="link" title="Connections" desc="When a request becomes mutual"><Switch checked={notif.connections} onChange={(v) => setNotif({ ...notif, connections: v })} /></SettingRow>
          <SettingRow icon="sparkle" title="Tips & product news" desc="Occasional, never spammy"><Switch checked={notif.tips} onChange={(v) => setNotif({ ...notif, tips: v })} /></SettingRow>
        </div>

        <div className="stack" style={{ gap: 12 }}>
          <span className="eyebrow">Ads & privacy</span>
          <SettingRow icon="info" title="Personalized ads" desc="Managed via Google’s certified consent. Turn off for non-personalized ads."><Switch checked={ads} onChange={setAds} /></SettingRow>
          <SettingRow icon="shield" title="Safety center" desc="Report, block, appeals, data export" onClick={() => toast('Safety center is part of the next build pass')} />
          <SettingRow icon="eye" title="Data export" desc="Download a copy of your data" onClick={() => toast('Data export requested', 'ok')} />
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
