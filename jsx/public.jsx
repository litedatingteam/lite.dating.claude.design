/* lite.dating — public pages */

function MeshBg({ children, style }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: '-20% -10% auto', height: '120%', zIndex: 0, pointerEvents: 'none',
        background:
          'radial-gradient(40% 50% at 18% 12%, color-mix(in oklch, var(--pink), transparent 55%), transparent 70%),' +
          'radial-gradient(38% 48% at 82% 8%, color-mix(in oklch, var(--cyan), transparent 58%), transparent 70%),' +
          'radial-gradient(44% 52% at 60% 38%, color-mix(in oklch, var(--violet), transparent 62%), transparent 72%)',
        filter: 'blur(8px)', opacity: 'calc(0.5 + var(--grad-mix) * 0.7)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* floating mini profile card for the hero */
function MiniCard({ name, age, city, tint, channels, lift = 0, online }) {
  return (
    <div className="card" style={{ padding: 12, width: 188, transform: `translateY(${lift}px)`, boxShadow: 'var(--sh-md)' }}>
      <Photo label={`${name.toLowerCase()} · photo`} tint={tint} ratio="4 / 5" radius="var(--r-sm)">
        <div style={{ position: 'absolute', top: 8, left: 8 }}><VerifiedBadge small /></div>
      </Photo>
      <div className="row" style={{ justifyContent: 'space-between', marginTop: 10 }}>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14.5, whiteSpace: 'nowrap' }}>{name}, {age}</div>
          <div className="faint" style={{ fontSize: 11.5, whiteSpace: 'nowrap' }}>{city}</div>
        </div>
        {online && <span className="dot" style={{ background: 'var(--green)', width: 8, height: 8 }} />}
      </div>
      <div className="row" style={{ gap: 6, marginTop: 8 }}>
        {channels.map((c) => <Icon key={c} name={c} size={15} style={{ color: c === 'instagram' ? 'var(--violet)' : 'var(--cyan)' }} />)}
        <span className="faint" style={{ fontSize: 11, marginLeft: 'auto' }}>request to unlock</span>
      </div>
    </div>
  );
}

function Landing() {
  const { go } = useNav();
  return (
    <div>
      <MeshBg>
        <section className="pub-page" style={{ paddingTop: 64, paddingBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center' }} className="hero-grid">
            <div className="stack" style={{ gap: 26 }}>
              <span className="badge" style={{ alignSelf: 'start', background: 'var(--surface)', boxShadow: 'var(--sh-xs)', whiteSpace: 'nowrap' }}>
                <span className="dot" style={{ background: 'var(--green)' }} /> Free · ad-supported · consent-first
              </span>
              <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', lineHeight: 1.02, letterSpacing: '-0.035em' }}>
                Skip the swiping.<br />Skip the chat.<br /><span className="gradient-text">Just trade handles.</span>
              </h1>
              <p style={{ fontSize: 19, color: 'var(--muted)', maxWidth: 460, lineHeight: 1.5 }}>
                Browse real, verified profiles for free. Request to share Instagram or Telegram — when it’s mutual, the handle unlocks and the conversation moves where it already lives.
              </p>
              <div className="row wrap" style={{ gap: 12 }}>
                <button className="btn primary lg" onClick={() => go('signin')}>Join free<Icon name="arrowR" /></button>
                <button className="btn ghost lg" onClick={() => go('how')}>See how it works</button>
              </div>
              <div className="row wrap" style={{ gap: 18, marginTop: 4 }}>
                {['No swiping', 'No in-app DMs', 'No paywalls', 'No passwords'].map((t) => (
                  <span key={t} className="row muted" style={{ gap: 6, fontSize: 13.5, fontWeight: 500 }}><Icon name="check" size={15} style={{ color: 'var(--green)' }} />{t}</span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', height: 440 }} className="hero-cards">
              <div style={{ position: 'absolute', top: 0, left: '6%' }}><MiniCard name="Mira" age={27} city="Kadıköy" tint={0} channels={['instagram', 'telegram']} online /></div>
              <div style={{ position: 'absolute', top: 70, right: '2%' }}><MiniCard name="Arda" age={33} city="İzmir" tint={2} channels={['instagram', 'telegram']} lift={0} /></div>
              <div style={{ position: 'absolute', bottom: 0, left: '20%' }}><MiniCard name="Sena" age={28} city="Moda" tint={3} channels={['instagram']} /></div>
            </div>
          </div>
        </section>
      </MeshBg>

      {/* how it works strip */}
      <section className="pub-page section">
        <div className="tac stack" style={{ gap: 10, alignItems: 'center', marginBottom: 40 }}>
          <span className="eyebrow">Three steps, no games</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>Request, don’t DM.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }} className="how-grid">
          {[
            ['compass', 'Browse real profiles', 'Verified photos and channels. Filter by interests and distance. No swipe deck, no scores — just people.'],
            ['send', 'Request a handle', 'Ask to share the Instagram or Telegram you’ve both verified. Add a short note if you like. It is not a chat.'],
            ['link', 'Mutual consent unlocks it', 'When they accept, the handle appears for both of you and stays visible here for 14 days. Talk where you already are.'],
          ].map(([icon, t, d], i) => (
            <div key={t} className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="row" style={{ gap: 10 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--grad-soft)', color: 'var(--violet)' }}><Icon name={icon} size={20} /></span>
                <span className="mono faint" style={{ fontSize: 13 }}>0{i + 1}</span>
              </div>
              <h3 style={{ fontSize: 18 }}>{t}</h3>
              <p className="muted" style={{ fontSize: 14.5, lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* value band */}
      <section className="pub-page">
        <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--grad)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }} className="band-grid">
            <div style={{ padding: '44px 40px', color: 'var(--ink)' }}>
              <h2 style={{ fontSize: 30, color: 'var(--ink)' }}>Free, because it’s honestly ad-supported.</h2>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 14, lineHeight: 1.55, maxWidth: 420 }}>
                No paywalls. No premium boosts. No paid verification. We show clearly labeled ads across the browsing experience — and never inside a request, an accept screen, verification, reporting or appeals.
              </p>
              <button className="btn ink" style={{ marginTop: 22 }} onClick={() => go('free')}>How ads work here<Icon name="arrowR" /></button>
            </div>
            <div style={{ padding: '44px 40px', display: 'grid', placeItems: 'center' }}>
              <div className="card" style={{ width: '100%', maxWidth: 320, padding: 16 }}>
                <div className="ad-label" style={{ marginBottom: 8 }}><Icon name="info" size={12} /> Advertisement</div>
                <div className="ad-frame" style={{ height: 96, display: 'grid', placeItems: 'center' }}><span className="ph-label">ad slot</span></div>
                <p className="faint" style={{ fontSize: 11.5, marginTop: 10 }}>Ads are always labeled and kept clear of any profile action.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* safety strip */}
      <section className="pub-page section">
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 36, alignItems: 'center' }} className="how-grid">
          <div className="stack" style={{ gap: 16 }}>
            <span className="eyebrow">Simple on top, serious underneath</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,36px)' }}>Consent, privacy and safety are the product — not an afterthought.</h2>
            <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.6 }}>Your verification selfie is private and never shown to other users or used for ads. Handles only ever appear with both people’s consent. Reporting and appeals are clear and human.</p>
            <button className="btn ghost" style={{ alignSelf: 'start' }} onClick={() => go('safety')}>Visit the Safety center<Icon name="arrowR" /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              ['shield', 'Private verification', 'A quick selfie confirms it’s you. Not public, not for ads, not shared.'],
              ['lock', 'No password to leak', 'Sign in with Google or a one-time email code. Nothing to store, nothing to steal.'],
              ['heart', 'Mutual by design', 'A handle never appears unless you both agreed to the same channel.'],
              ['flag', 'Clear reporting', 'Report or block in a tap. Appeals are accessible and reasoned.'],
            ].map(([icon, t, d]) => (
              <div key={t} className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Icon name={icon} size={20} style={{ color: 'var(--violet)' }} />
                <strong style={{ color: 'var(--ink)', fontSize: 15 }}>{t}</strong>
                <span className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* final cta */}
      <MeshBg>
        <section className="pub-page tac" style={{ padding: '72px 24px' }}>
          <h2 style={{ fontSize: 'clamp(30px,4.5vw,46px)', maxWidth: 620, margin: '0 auto' }}>Meet people without playing the game.</h2>
          <p className="muted" style={{ fontSize: 17, marginTop: 14 }}>Free to join. Nothing to download. No password to remember.</p>
          <button className="btn primary lg" style={{ marginTop: 24 }} onClick={() => go('signin')}>Join lite.dating<Icon name="arrowR" /></button>
        </section>
      </MeshBg>
    </div>
  );
}

window.Landing = Landing;
window.MeshBg = MeshBg;
