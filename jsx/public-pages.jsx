/* lite.dating — secondary public pages */

function PageHead({ eyebrow, title, sub }) {
  return (
    <div className="stack" style={{ gap: 12, maxWidth: 640, marginBottom: 40 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1.05 }}>{title}</h1>
      {sub && <p className="muted" style={{ fontSize: 18, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function HowItWorks() {
  const { go } = useNav();
  const steps = [
    ['Browse real profiles', 'Every profile is photo-verified. Browse a grid — never a swipe deck. See interests, distance and which channels someone has verified.', 'compass'],
    ['Verify your own channels', 'Connect the Instagram or Telegram you’re happy to share. You can only request a channel you’ve verified yourself, and they must have verified it too.', 'shield'],
    ['Send a request, not a DM', 'Pick a channel and optionally add a short intro note. It’s a one-time request — there is no chat thread, no read receipts, no pressure.', 'send'],
    ['Mutual consent unlocks the handle', 'If they accept, the handle appears for both of you. It stays visible inside lite.dating for 14 days, then expires here — your accounts are untouched.', 'link'],
  ];
  return (
    <div className="pub-page section">
      <PageHead eyebrow="How it works" title="Request, don’t DM." sub="A consent-first way to meet: you trade verified handles only when you both say yes." />
      <div className="stack" style={{ gap: 16 }}>
        {steps.map(([t, d, icon], i) => (
          <div key={t} className="card" style={{ padding: 24, display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--grad-soft)', display: 'grid', placeItems: 'center', color: 'var(--violet)', position: 'relative' }}>
              <Icon name={icon} size={26} />
              <span className="mono" style={{ position: 'absolute', top: -8, left: -8, background: 'var(--ink)', color: 'white', fontSize: 11, width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{i + 1}</span>
            </div>
            <div className="stack" style={{ gap: 6 }}>
              <h3 style={{ fontSize: 19 }}>{t}</h3>
              <p className="muted" style={{ fontSize: 15, lineHeight: 1.55 }}>{d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card pad" style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', background: 'var(--grad-soft)', border: 'none' }}>
        <Icon name="clock" size={22} style={{ color: 'var(--violet)', flex: 'none' }} />
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)' }}><strong>The 14-day window only affects lite.dating.</strong> A handle expires from <em>our</em> connections list after two weeks — it never disappears from Instagram or Telegram. Move the conversation over whenever you’re ready.</p>
      </div>
      <div className="tac" style={{ marginTop: 36 }}><button className="btn primary lg" onClick={() => go('signin')}>Join free<Icon name="arrowR" /></button></div>
    </div>
  );
}

function Safety() {
  return (
    <div className="pub-page section">
      <PageHead eyebrow="Safety & privacy" title="Calm, clear, and on your side." sub="Reporting is serious but never scary. Here’s what protects you." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="how-grid">
        {[
          ['shield', 'Your verification selfie is private', 'A quick selfie confirms a real person is behind the profile. It is never shown to other users, never used for ads, and never shared. You can choose a one-time check instead of a reusable reference.'],
          ['lock', 'Simple sign-in, serious protection', 'No password to remember, and no password for us to store. We ask for a fresh code only on new devices or sensitive account changes.'],
          ['heart', 'Consent is structural', 'Handles only reveal on mutual consent. You can pass on any request, and block or report at any time — including off-platform harm.'],
          ['flag', 'Reports protect users', 'False reports harm users. We review both. Decisions come with a clear reason, and you can always appeal.'],
          ['eye', 'You control your data', 'Export your data or delete your account from the Safety center. Deletion removes your profile and pending requests.'],
          ['info', 'Ads stay out of safety', 'You will never see an ad inside a request, an accept screen, verification, reporting, or appeals. Ever.'],
          ['lock', 'Ad consent is separate from signup', 'Ad and cookie choices are handled by Google’s certified consent system where required. Joining is never conditional on personalized ad consent — decline and still use everything.'],
        ].map(([icon, t, d]) => (
          <div key={t} className="card pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)' }}><Icon name={icon} size={20} /></span>
            <strong style={{ color: 'var(--ink)', fontSize: 16 }}>{t}</strong>
            <span className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>{d}</span>
          </div>
        ))}
      </div>
      <div className="card pad tac" style={{ marginTop: 24, background: 'var(--ink)', color: 'white', border: 'none' }}>
        <p style={{ fontSize: 18, color: 'white', maxWidth: 560, margin: '0 auto', fontWeight: 500 }}>“Reports protect users. False reports harm users. We review both.”</p>
      </div>
    </div>
  );
}

function WhyFree() {
  return (
    <div className="pub-page section">
      <PageHead eyebrow="It’s free" title="Ad-supported, and honest about it." sub="No subscriptions, no premium tiers, no paid verification — clearly labeled ads keep it free." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="how-grid">
        <div className="stack" style={{ gap: 14 }}>
          {[
            ['No paywalls, ever', 'Every core feature — browsing, requesting, unlocking handles — is free. There is nothing to unlock with money.'],
            ['Shown across browsing', 'You’ll see ads while you discover and browse profiles and favorites — the same surfaces that make the app free to run.'],
            ['Always clearly labeled', 'Ads are always marked “Advertisement” or “Sponsored”, and never dressed up to look like a profile or a button.'],
            ['Kept away from actions', 'Ads never appear in a request, accept/decline, handle unlock, verification, reporting, appeals, or any private connection detail.'],
            ['Consent stays separate', 'Ad-personalization consent is handled through a certified consent system — and signup never depends on it.'],
          ].map(([t, d]) => (
            <div key={t} className="row" style={{ gap: 12, alignItems: 'start' }}>
              <Icon name="check" size={18} style={{ color: 'var(--green)', flex: 'none', marginTop: 2 }} />
              <div><strong style={{ color: 'var(--ink)', fontSize: 15.5 }}>{t}</strong><p className="muted" style={{ fontSize: 14, lineHeight: 1.5, marginTop: 3 }}>{d}</p></div>
            </div>
          ))}
        </div>
        <div className="card pad">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="ad-label"><Icon name="info" size={12} /> Sponsored links</span>
            <span className="badge neutral">Google-certified CMP</span>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            {[0, 1].map((i) => (
              <div key={i} className="ad-frame" style={{ height: 72, display: 'grid', placeItems: 'center' }}><span className="ph-label">ad slot</span></div>
            ))}
          </div>
          <p className="faint" style={{ fontSize: 12, marginTop: 12 }}>This is what an ad placement looks like — separate, framed, and labeled. You can manage personalization in Settings.</p>
        </div>
      </div>
      <div className="card pad" style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--grad-soft)', border: 'none' }}>
        <Icon name="shield" size={22} style={{ color: 'var(--violet)', flex: 'none', marginTop: 2 }} />
        <div className="stack" style={{ gap: 6 }}>
          <strong style={{ color: 'var(--ink)', fontSize: 15.5 }}>Ad consent is separate from your account</strong>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>Ad choices are managed through Google’s certified consent system where required (EEA, UK and Switzerland). <strong>Account signup is not conditional on personalized ad consent</strong> — if you decline, you can still join and use everything. Ads only ever render once ad eligibility and your consent state both allow it.</p>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="pub-page section">
      <PageHead eyebrow="About" title="A smaller, calmer way to meet." sub="lite.dating started from a simple frustration: the apps turned meeting people into a game." />
      <div style={{ maxWidth: 680 }} className="stack">
        <p className="muted" style={{ fontSize: 17, lineHeight: 1.7 }}>
          Most dating apps keep you swiping, keep you chatting in their inbox, and keep the good parts behind a subscription. lite.dating does the opposite. You browse real, verified profiles, and when there’s genuine interest on both sides, you trade the handle you already use — and take it from there.
        </p>
        <p className="muted" style={{ fontSize: 17, lineHeight: 1.7, marginTop: 16 }}>
          No swipe mechanic. No in-app DMs to babysit. No password for anyone to leak. Just a respectful, consent-first introduction, with privacy and safety built into the foundation rather than bolted on later.
        </p>
        <div className="card pad" style={{ marginTop: 28 }}>
          <p style={{ color: 'var(--ink)', fontWeight: 500 }}>lite.dating is operated by Halit Turan ARICAN as an individual operator based in Türkiye.</p>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const aliases = [
    ['support@lite.dating', 'General help', 'mail'],
    ['privacy@lite.dating', 'Privacy & data requests', 'lock'],
    ['legal@lite.dating', 'Legal notices', 'info'],
    ['safety@lite.dating', 'Safety concerns', 'shield'],
    ['abuse@lite.dating', 'Report abuse', 'flag'],
    ['dsa@lite.dating', 'DSA / regulator contact', 'info'],
  ];
  return (
    <div className="pub-page section">
      <PageHead eyebrow="Contact" title="Reach the right desk." sub="We keep separate inboxes so your message gets to the people who can help." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="how-grid">
        {aliases.map(([email, desc, icon]) => (
          <div key={email} className="card pad row" style={{ gap: 14 }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={19} /></span>
            <div><div style={{ fontWeight: 600, color: 'var(--ink)' }} className="mono">{email}</div><div className="muted" style={{ fontSize: 13.5 }}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div className="card pad" style={{ marginTop: 20 }}><p className="muted" style={{ fontSize: 14 }}>lite.dating is operated by Halit Turan ARICAN as an individual operator based in Türkiye. For privacy reasons we don’t publish a home address; written notice can be requested via <span className="mono" style={{ color: 'var(--ink)' }}>legal@lite.dating</span>.</p></div>
    </div>
  );
}

function LegalPlaceholder() {
  const { go } = useNav();
  const docs = [['Privacy Policy', 'How we collect, use, and protect your data.'], ['Terms of Service', 'The agreement between you and lite.dating.'], ['GDPR Notice', 'Your rights under EU data protection law.'], ['KVKK Aydınlatma Metni', 'Türkiye data protection disclosure.']];
  return (
    <div className="pub-page section">
      <PageHead eyebrow="Legal" title="Plain-language summaries, full text on file." sub="Short summaries here; the complete documents are linked from each." />
      <div className="stack" style={{ gap: 12 }}>
        {docs.map(([t, d]) => (
          <div key={t} className="card pad row" style={{ justifyContent: 'space-between', gap: 16 }}>
            <div className="row" style={{ gap: 14 }}>
              <Icon name="info" size={20} style={{ color: 'var(--violet)' }} />
              <div><strong style={{ color: 'var(--ink)' }}>{t}</strong><p className="muted" style={{ fontSize: 13.5 }}>{d}</p></div>
            </div>
            <button className="btn ghost sm">Read full text<Icon name="arrowR" /></button>
          </div>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 13, marginTop: 20 }}>Placeholder pages — full legal copy is maintained separately and surfaced through the legal update gate after sign-in. <a onClick={() => go('contact')} style={{ color: 'var(--violet)', cursor: 'pointer' }}>Contact legal@lite.dating</a>.</p>
    </div>
  );
}

Object.assign(window, { HowItWorks, Safety, WhyFree, About, Contact, LegalPlaceholder, PageHead });
