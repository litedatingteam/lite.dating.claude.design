/* lite.dating — profile detail + request modal */

function Gallery({ p, tint }) {
  const [idx, setIdx] = useState(0);
  const n = p.photos || 5;
  return (
    <div className="stack" style={{ gap: 10 }}>
      <div style={{ position: 'relative' }}>
        <Photo label={`${p.name.toLowerCase()} · photo ${idx + 1}`} tint={(tint + idx) % 4} ratio="4 / 5" radius="var(--r-lg)">
          <div style={{ position: 'absolute', top: 12, left: 12 }}><VerifiedBadge /></div>
          <div style={{ position: 'absolute', top: 12, right: 12 }}><FavButton id={p.id} /></div>
          {/* dots */}
          <div className="row" style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', gap: 5 }}>
            {Array.from({ length: n }).map((_, i) => <span key={i} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 999, background: i === idx ? 'white' : 'oklch(1 0 0 / 0.5)', transition: 'width .2s' }} />)}
          </div>
          {idx > 0 && <button className="btn icon" onClick={() => setIdx(idx - 1)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--glass)' }}><Icon name="arrowL" /></button>}
          {idx < n - 1 && <button className="btn icon" onClick={() => setIdx(idx + 1)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'var(--glass)' }}><Icon name="arrowR" /></button>}
        </Photo>
      </div>
      <div className="row" style={{ gap: 8 }}>
        {Array.from({ length: n }).map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ flex: 1, padding: 0, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8, outline: i === idx ? '2px solid var(--violet)' : 'none' }}>
            <Photo label="" tint={(tint + i) % 4} ratio="1 / 1" radius="8px" />
          </button>
        ))}
      </div>
    </div>
  );
}

function RequestModal({ p, channel, onClose }) {
  const { store, toast } = useNav();
  const me = window.DB.ME;
  const [note, setNote] = useState('');
  const meVerified = me.channels[channel].verified;
  const theyVerified = p.channels[channel].verified;
  const eligible = meVerified && theyVerified;
  const already = store.sent.find((s) => s.to === p.id && s.channel === channel && s.status === 'pending');

  const send = () => {
    store.sendRequest({ to: p.id, channel, note });
    toast(`Request sent to ${p.name}`, 'ok');
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between', padding: '18px 22px 0' }}>
          <span className="eyebrow">Request a handle</span>
          <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div style={{ padding: '12px 22px 22px' }} className="stack">
          <div className="row" style={{ gap: 12, marginBottom: 16 }}>
            <Avatar size={48} tint={0} />
            <div><strong style={{ color: 'var(--ink)', fontSize: 16 }}>{p.name}, {p.age}</strong><div className="row" style={{ gap: 7, marginTop: 3 }}><ChannelBadge type={channel} /></div></div>
          </div>

          {/* eligibility check */}
          <div className="card" style={{ padding: 14, background: eligible ? 'var(--green-w)' : 'var(--amber-w)', border: 'none', marginBottom: 16 }}>
            <div className="row" style={{ gap: 8 }}>
              <Icon name={eligible ? 'check' : 'info'} size={16} style={{ color: eligible ? 'var(--green)' : 'var(--amber)', flex: 'none' }} />
              <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>{eligible ? `You’ve both verified ${channel === 'instagram' ? 'Instagram' : 'Telegram'} — you’re eligible to request.` : !meVerified ? `You need to verify your ${channel === 'instagram' ? 'Instagram' : 'Telegram'} before you can request it.` : `${p.name} hasn’t verified this channel.`}</span>
            </div>
          </div>

          <Field label="Add a short intro (optional)" hint={`${note.length}/140 · this is a one-time note, not a chat`}>
            <textarea className="textarea" maxLength={140} style={{ minHeight: 80 }} placeholder={`Say why you’d like to connect with ${p.name}…`} value={note} onChange={(e) => setNote(e.target.value)} disabled={!eligible} />
          </Field>

          <div className="row" style={{ gap: 8, marginTop: 4, color: 'var(--faint)', fontSize: 12 }}>
            <Icon name="info" size={14} style={{ flex: 'none' }} />
            <span>This sends one request. There’s no chat thread and no read receipts. If {p.name} accepts, the handle unlocks for you both.</span>
          </div>

          {already
            ? <button className="btn soft lg block" disabled style={{ marginTop: 18 }}>Request already pending</button>
            : <button className="btn primary lg block" style={{ marginTop: 18 }} disabled={!eligible} onClick={send}><Icon name="send" size={17} />Send request</button>}
          {!meVerified && <button className="btn ghost sm block" style={{ marginTop: 10 }} onClick={onClose}>Verify your channel first</button>}
        </div>
      </div>
    </div>
  );
}

function ProfileDetail({ id }) {
  const { go, store, toast } = useNav();
  const p = window.DB.byId(id);
  const me = window.DB.ME;
  const [modal, setModal] = useState(null); // channel string
  const tint = Math.max(0, window.DB.PROFILES.findIndex((x) => x.id === id));
  if (!p) return <AppFrame title="Profile"><p className="muted">Profile not found.</p></AppFrame>;

  const mutual = new Set(me.interests);
  const sent = store.sent.find((s) => s.to === p.id && s.status === 'pending');

  return (
    <AppFrame title="Profile" actions={<button className="btn ghost sm" onClick={() => go('discover')}><Icon name="arrowL" size={15} />Back to Discover</button>}>
      <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr', gap: 32, alignItems: 'start' }} className="profile-grid">
        <div style={{ position: 'sticky', top: 90 }}><Gallery p={p} tint={tint} /></div>
        <div className="stack" style={{ gap: 22 }}>
          <div className="stack" style={{ gap: 8 }}>
            <div className="row wrap" style={{ gap: 10, alignItems: 'center' }}>
              <h1 style={{ fontSize: 30, whiteSpace: 'nowrap' }}>{p.name}, {p.age}</h1>
              <VerifiedBadge />
              {p.online && <span className="badge"><span className="dot" style={{ background: 'var(--green)' }} />Active now</span>}
            </div>
            <div className="row muted" style={{ gap: 8, fontSize: 14.5 }}><Icon name="pin" size={15} />{p.city} · {p.dist} km away · {p.gender}</div>
            <p style={{ fontSize: 16.5, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>{p.bio}</p>
          </div>

          {/* request actions */}
          <div className="card pad" style={{ background: 'var(--grad-soft)', border: 'none' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ color: 'var(--ink)' }}>Trade handles</strong>
              <span className="faint" style={{ fontSize: 12 }}>Mutual consent unlocks it</span>
            </div>
            {sent
              ? <div className="row" style={{ gap: 10 }}><span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Request pending · {sent.channel === 'instagram' ? 'Instagram' : 'Telegram'}</span><button className="btn ghost sm" onClick={() => go('sent')}>View sent</button></div>
              : <div className="row wrap" style={{ gap: 10 }}>
                  {p.channels.instagram.verified && <button className="btn primary" onClick={() => setModal('instagram')}><Icon name="instagram" size={17} />Request Instagram</button>}
                  {p.channels.telegram.verified && <button className="btn ink" onClick={() => setModal('telegram')}><Icon name="telegram" size={17} />Request Telegram</button>}
                </div>}
            <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>No chat box here by design. You request a verified handle; if {p.name} agrees, you continue the conversation where it already lives.</p>
          </div>

          {/* about */}
          <div className="stack" style={{ gap: 8 }}>
            <span className="eyebrow">About</span>
            <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{p.about}</p>
          </div>

          {/* interests with mutual highlight */}
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Interests · <span style={{ color: 'var(--pink)' }}>shared with you highlighted</span></span>
            <div className="row wrap" style={{ gap: 8 }}>
              {p.interests.map((i) => <Chip key={i} mutual={mutual.has(i)} cat={window.DB.tag(i).cat}>{i}</Chip>)}
            </div>
          </div>

          {/* channel availability */}
          <div className="stack" style={{ gap: 10 }}>
            <span className="eyebrow">Verified channels</span>
            <div className="row wrap" style={{ gap: 10 }}>
              <span className={`badge ${p.channels.instagram.verified ? 'ig' : 'neutral'}`}><Icon name="instagram" />Instagram {p.channels.instagram.verified ? '· verified' : '· not added'}</span>
              <span className={`badge ${p.channels.telegram.verified ? 'tg' : 'neutral'}`}><Icon name="telegram" />Telegram {p.channels.telegram.verified ? '· verified' : '· not added'}</span>
            </div>
          </div>

          <div className="hr" />
          <div className="row" style={{ gap: 10 }}>
            <button className="btn ghost sm" onClick={() => toast('Report flow would open here', 'warn')}><Icon name="flag" size={15} />Report</button>
            <button className="btn ghost sm" onClick={() => toast(`You blocked ${p.name}`, 'warn')}><Icon name="x" size={15} />Block</button>
          </div>
        </div>
      </div>
      {modal && <RequestModal p={p} channel={modal} onClose={() => setModal(null)} />}
    </AppFrame>
  );
}

Object.assign(window, { ProfileDetail, RequestModal, Gallery });
