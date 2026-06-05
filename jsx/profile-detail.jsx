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
          <div className="card" style={{ padding: 14, background: eligible ? 'var(--green-w)' : 'var(--amber-w)', border: 'none', marginBottom: 12 }}>
            <div className="row" style={{ gap: 8 }}>
              <Icon name={eligible ? 'check' : 'info'} size={16} style={{ color: eligible ? 'var(--green)' : 'var(--amber)', flex: 'none' }} />
              <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>{eligible ? `You’ve both verified ${channel === 'instagram' ? 'Instagram' : 'Telegram'} — you’re eligible to request.` : !meVerified ? `You need to verify your ${channel === 'instagram' ? 'Instagram' : 'Telegram'} before you can request it.` : `${p.name} hasn’t verified this channel.`}</span>
            </div>
          </div>

          {/* daily request budget */}
          <div className="stack" style={{ gap: 8, marginBottom: 16, padding: '0 2px' }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <span className="row" style={{ gap: 7, fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap' }}><Icon name="clock" size={14} /><strong style={{ color: store.requestsLeft <= 2 ? 'var(--amber)' : 'var(--ink)' }}>{store.requestsLeft} of {store.requestLimit}</strong> left · rolling 24h</span>
              <span className="row" style={{ gap: 3 }}>{Array.from({ length: store.requestLimit }).map((_, i) => <span key={i} style={{ width: 5, height: 14, borderRadius: 2, background: i < store.requestsLeft ? 'var(--violet)' : 'var(--line)' }} />)}</span>
            </div>
          </div>

          <Field label="Add a short intro (optional)" hint={`${note.length}/140 · this is a one-time note, not a chat`}>
            <textarea className="textarea" maxLength={140} style={{ minHeight: 80 }} placeholder={`Say why you’d like to connect with ${p.name}…`} value={note} onChange={(e) => setNote(e.target.value)} disabled={!eligible} />
          </Field>

          <div className="row" style={{ gap: 8, marginTop: 4, color: 'var(--faint)', fontSize: 12 }}>
            <Icon name="info" size={14} style={{ flex: 'none' }} />
            <span>This sends one request. There’s no chat thread and no read receipts. If {p.name} accepts, the handle unlocks for you both. Verified accounts can send up to {store.requestLimit} successful handle requests per rolling 24 hours; safety systems may lower this for suspicious activity.</span>
          </div>

          {already
            ? <button className="btn soft lg block" disabled style={{ marginTop: 18 }}>Request already pending</button>
            : store.requestsLeft <= 0
            ? <button className="btn soft lg block" disabled style={{ marginTop: 18 }}>Daily request limit reached</button>
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
  const [blockOpen, setBlockOpen] = useState(false);
  const tint = Math.max(0, window.DB.PROFILES.findIndex((x) => x.id === id));
  if (!p) return <AppFrame title="Profile"><p className="muted">Profile not found.</p></AppFrame>;

  const mutual = new Set(store.interests);
  const CH = { instagram: 'Instagram', telegram: 'Telegram' };

  // ---- per-channel relationship state (keyed by user_id + channel) ----
  const channelState = (ch) => {
    const meV = me.channels[ch].verified;
    const theyV = p.channels[ch].verified;
    const incoming = store.inbox.find((r) => r.from === p.id && r.channel === ch);
    const conn = store.connections.find((c) => c.who === p.id && c.channel === ch);
    const sent = store.sent.find((s) => s.to === p.id && s.channel === ch);
    let state = 'unavailable';
    if (conn && (conn.expired || conn.daysLeft <= 0)) state = 'expired';
    else if (conn) state = 'unlocked';
    else if (incoming) state = 'incoming';
    else if (sent && sent.status === 'pending') state = 'pending';
    else if (sent && sent.status === 'declined') state = 'declined';
    else if (sent && sent.status === 'accepted') state = 'unlocked';
    else if (meV && theyV) state = 'available';
    else state = 'unavailable';
    return { meV, theyV, incoming, conn, sent, state };
  };

  const ChannelRow = ({ ch }) => {
    const s = channelState(ch);
    const handle = s.conn ? s.conn.handle : window.DB.handleFor(p.id, ch);
    const tone = { unlocked: 'verified', incoming: 'ig', pending: 'pending', declined: 'neutral', expired: 'neutral', available: 'neutral', unavailable: 'neutral' }[s.state];
    const stateLabel = { unlocked: 'Unlocked', incoming: 'Wants to trade', pending: 'Request sent', declined: 'Declined', expired: 'Expired here', available: 'Available to request', unavailable: !s.theyV ? 'They haven’t verified' : 'You haven’t verified' }[s.state];
    return (
      <div className="card" style={{ padding: 14, border: 'none', background: 'var(--surface)' }}>
        <div className="row" style={{ justifyContent: 'space-between', gap: 10, marginBottom: s.state === 'unlocked' ? 12 : 10 }}>
          <div className="row" style={{ gap: 10 }}>
            <Icon name={ch} size={18} style={{ color: ch === 'instagram' ? 'var(--violet)' : 'var(--cyan)' }} />
            <strong style={{ color: 'var(--ink)', fontSize: 14.5 }}>{CH[ch]}</strong>
          </div>
          <span className={`badge ${tone}`}>{s.state === 'unlocked' && <Icon name="check" size={12} />}{stateLabel}</span>
        </div>

        {/* unlocked → show handle + per-channel window + copy */}
        {s.state === 'unlocked' && (
          <div className="card" style={{ padding: 12, background: 'var(--green-w)', border: 'none' }}>
            <div className="row" style={{ justifyContent: 'space-between', gap: 10 }}>
              <span className="mono" style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700 }}>{handle}</span>
              <button className="btn soft sm" onClick={() => toast('Handle copied', 'ok')}><Icon name="copy" size={14} />Copy</button>
            </div>
            {s.conn && <div className="row" style={{ gap: 7, marginTop: 8 }}><Icon name="clock" size={12} style={{ color: 'var(--muted)' }} /><span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Visible here for {s.conn.daysLeft} more day{s.conn.daysLeft === 1 ? '' : 's'} · never disappears from {CH[ch]}.</span></div>}
          </div>
        )}

        {/* incoming → accept (gated by own verification) / pass */}
        {s.state === 'incoming' && (
          <div className="stack" style={{ gap: 8 }}>
            <span className="muted" style={{ fontSize: 12.5 }}>{p.name} asked to trade {CH[ch]}.</span>
            <div className="row wrap" style={{ gap: 8 }}>
              {s.meV
                ? <button className="btn primary sm" onClick={() => { store.acceptRequest(s.incoming.id); toast(`You shared your ${CH[ch]} with ${p.name}`, 'ok'); }}><Icon name="check" size={14} />Accept & share</button>
                : <button className="btn ink sm" onClick={() => go('settings')}><Icon name={ch} size={14} />Verify {CH[ch]} to accept</button>}
              <button className="btn ghost sm" onClick={() => { store.declineRequest(s.incoming.id); toast('Request passed', 'warn'); }}>Pass</button>
            </div>
          </div>
        )}

        {/* pending → cancel */}
        {s.state === 'pending' && (
          <div className="row wrap" style={{ gap: 8 }}><button className="btn ghost sm" onClick={() => go('sent')}>View sent</button><button className="btn danger sm" onClick={() => { store.cancelRequest(p.id, ch); toast('Request cancelled', 'warn'); }}><Icon name="x" size={13} />Cancel request</button></div>
        )}

        {/* declined */}
        {s.state === 'declined' && <span className="muted" style={{ fontSize: 12.5 }}>You can’t send another {CH[ch]} request to {p.name}.</span>}

        {/* expired → re-request */}
        {s.state === 'expired' && <button className="btn soft sm" onClick={() => setModal(ch)}><Icon name="arrowR" size={13} />Re-request {CH[ch]}</button>}

        {/* available → request */}
        {s.state === 'available' && <button className={`btn ${ch === 'instagram' ? 'primary' : 'ink'} sm`} onClick={() => setModal(ch)}><Icon name={ch} size={14} />Request {CH[ch]}</button>}

        {/* unavailable → verify-your-own CTA or info */}
        {s.state === 'unavailable' && (
          !s.meV
            ? <button className="btn soft sm" onClick={() => go('settings')}><Icon name={ch} size={13} />Verify your {CH[ch]}</button>
            : <span className="muted" style={{ fontSize: 12.5 }}>{p.name} hasn’t verified {CH[ch]} yet.</span>
        )}
      </div>
    );
  };

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

          {/* per-channel contact panel */}
          <div className="card pad" style={{ background: 'var(--grad-soft)', border: 'none' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ color: 'var(--ink)' }}>Contact channels</strong>
              <span className="faint" style={{ fontSize: 12 }}>Mutual consent unlocks each</span>
            </div>
            <div className="stack" style={{ gap: 10 }}>
              <ChannelRow ch="instagram" />
              <ChannelRow ch="telegram" />
            </div>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>No chat box here by design. Each channel is requested and unlocked on its own — if {p.name} agrees, you continue the conversation where it already lives.</p>
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
            <button className="btn ghost sm" onClick={() => { store.setReturnTo({ name: 'profile', param: p.id }); go('report'); }}><Icon name="flag" size={15} />Report</button>
            <button className="btn ghost sm" onClick={() => setBlockOpen(true)}><Icon name="x" size={15} />Block</button>
          </div>
        </div>
      </div>
      {modal && <RequestModal p={p} channel={modal} onClose={() => setModal(null)} />}
      {blockOpen && <BlockModal name={p.name} onClose={() => setBlockOpen(false)} onConfirm={(report) => { store.block(p.id); toast(report ? `${p.name} blocked & reported — you won’t see each other` : `${p.name} blocked — you won’t see each other`, 'warn'); go('discover'); }} />}
    </AppFrame>
  );
}

Object.assign(window, { ProfileDetail, RequestModal, Gallery });
