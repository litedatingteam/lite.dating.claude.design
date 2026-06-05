/* lite.dating — legal pages (Privacy / Terms / GDPR / KVKK) */

const LEGAL = {
  privacy: {
    title: 'Privacy Policy', short: 'Privacy', version: 'v1.0', updated: '5 Jun 2026', contact: 'privacy@lite.dating',
    intro: 'This summary explains, in plain language, what we collect and why. The full text below is the binding version.',
    points: [
      ['user', 'What we collect', 'Your email, profile details (name, age, city, photos, interests), the channels you verify, and basic device/usage data needed to run the service and keep it safe.'],
      ['lock', 'Your verification selfie is private', 'It is used only to confirm a real person is behind the profile. It is never shown to other users, never used for advertising, and never sold.'],
      ['eye', 'Ads & consent', 'Ads are served by Google. Ad and cookie consent is collected through Google’s certified consent system where required — and signup never depends on it.'],
      ['shield', 'We don’t sell your data', 'We never sell personal data. We share the minimum necessary with processors (e.g. hosting, Google ads) under contract.'],
      ['clock', 'Retention & control', 'You can export your data or delete your account anytime. Deleting removes your profile and pending requests; some records are kept only as long as the law requires.'],
    ],
    sections: ['Introduction & scope', 'Information we collect', 'How we use information', 'Photo verification data', 'Advertising, cookies & consent', 'Who we share data with', 'International transfers', 'Data retention periods', 'Your rights & choices', 'Children (18+ only service)', 'Changes to this policy', 'How to contact us'],
  },
  terms: {
    title: 'Terms of Service', short: 'Terms', version: 'v1.0', updated: '5 Jun 2026', contact: 'legal@lite.dating',
    intro: 'These are the rules for using lite.dating. By creating an account you accept them. Here’s the short version.',
    points: [
      ['user', '18+ only', 'You must be at least 18 years old to create an account or use any part of the service.'],
      ['link', 'How handle trading works', 'You can request a verified Instagram or Telegram handle only on channels you’ve verified yourself. Handles reveal on mutual consent and stay visible here for 14 days.'],
      ['heart', 'Be a decent human', 'No harassment, impersonation, spam, solicitation, or anything illegal. Consent and respect are non-negotiable.'],
      ['flag', 'Reports & false reports', 'Reports protect users; knowingly false or malicious reports may restrict your own account. We review both sides.'],
      ['info', 'Free & ad-supported', 'The service is free. There are no subscriptions, paid verification, or premium tiers. We may change features over time.'],
    ],
    sections: ['Eligibility (18+)', 'Your account & sign-in', 'The service & how it works', 'Handle requests & 14-day window', 'Acceptable use & community rules', 'Verification & authenticity', 'Reporting, appeals & enforcement', 'Ads & no-payment model', 'Intellectual property', 'Disclaimers & limitation of liability', 'Suspension & termination', 'Governing law & changes'],
  },
  gdpr: {
    title: 'GDPR Notice', short: 'GDPR', version: 'v1.0', updated: '5 Jun 2026', contact: 'dsa@lite.dating',
    intro: 'For users in the EEA, UK and Switzerland: your rights under the GDPR and how to exercise them.',
    points: [
      ['info', 'Lawful bases', 'We process data under contract (to provide the service), legitimate interests (safety, anti-abuse), consent (personalized ads), and legal obligation.'],
      ['user', 'Your rights', 'Access, rectification, erasure, restriction, portability, and objection. You can also withdraw consent for personalized ads at any time.'],
      ['shield', 'Safety processing', 'Some processing (e.g. verification, moderation, abuse prevention) relies on legitimate interests and is essential to keep users safe.'],
      ['mail', 'Contact & complaints', 'Reach us at dsa@lite.dating. You also have the right to lodge a complaint with your local supervisory authority.'],
    ],
    sections: ['Controller & contact', 'Lawful bases for processing', 'Categories of data', 'Purposes of processing', 'Data subject rights', 'Withdrawing consent', 'International transfers & safeguards', 'Retention', 'Supervisory authority & complaints'],
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni', short: 'KVKK', version: 'v1.0', updated: '5 Jun 2026', contact: 'privacy@lite.dating',
    intro: 'Türkiye’deki kullanıcılar için 6698 sayılı KVKK kapsamında aydınlatma. A plain-language summary follows, in line with Turkish data-protection law.',
    points: [
      ['user', 'Veri sorumlusu', 'lite.dating, Halit Turan ARICAN tarafından bireysel olarak Türkiye’den işletilmektedir. The data controller is the individual operator.'],
      ['info', 'İşlenen veriler', 'Hesap, profil, doğrulama ve kullanım verileri hizmeti sunmak ve güvenliği sağlamak için işlenir.'],
      ['lock', 'Doğrulama selfie’si gizli', 'Doğrulama selfie’niz yalnızca kimlik teyidi içindir; başkalarıyla paylaşılmaz, reklamda kullanılmaz.'],
      ['shield', 'Haklarınız', 'KVKK madde 11 kapsamında bilgi talep etme, düzeltme, silme ve itiraz haklarına sahipsiniz.'],
    ],
    sections: ['Veri sorumlusunun kimliği', 'İşlenen kişisel veriler', 'İşleme amaçları', 'Hukuki sebepler', 'Aktarım & yurt dışı', 'Saklama süreleri', 'KVKK md. 11 haklarınız', 'Başvuru yöntemi & iletişim'],
  },
};

function LegalDoc({ docKey }) {
  const { go } = useNav();
  const doc = LEGAL[docKey];
  const [tab, setTab] = useState('summary');
  if (!doc) return null;
  return (
    <div className="pub-page section">
      <button className="row muted" style={{ gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, padding: 0, marginBottom: 18, whiteSpace: 'nowrap' }} onClick={() => go('legal')}>
        <Icon name="arrowL" size={15} /> All legal documents
      </button>
      <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
        <div className="row wrap" style={{ gap: 10, alignItems: 'center' }}>
          <h1 style={{ fontSize: 'clamp(30px,5vw,46px)' }}>{doc.title}</h1>
          <span className="badge neutral mono">{doc.version}</span>
        </div>
        <div className="row wrap muted" style={{ gap: 14, fontSize: 13 }}>
          <span className="row" style={{ gap: 6 }}><Icon name="clock" size={14} />Last updated {doc.updated}</span>
          <span className="row" style={{ gap: 6 }}><Icon name="mail" size={14} /><span className="mono">{doc.contact}</span></span>
        </div>
        <p className="muted" style={{ fontSize: 16, lineHeight: 1.55 }}>{doc.intro}</p>
        <div className="seg" style={{ alignSelf: 'start', marginTop: 4 }}>
          <button className={tab === 'summary' ? 'on' : ''} onClick={() => setTab('summary')}>Summary</button>
          <button className={tab === 'full' ? 'on' : ''} onClick={() => setTab('full')}>Full text</button>
        </div>
      </div>

      <div className="fade-in" key={tab} style={{ maxWidth: 760, marginTop: 26 }}>
        {tab === 'summary' ? (
          <div className="stack" style={{ gap: 14 }}>
            {doc.points.map(([icon, h, body]) => (
              <div key={h} className="card pad row" style={{ gap: 16, alignItems: 'flex-start' }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name={icon} size={19} /></span>
                <div className="stack" style={{ gap: 4 }}><strong style={{ color: 'var(--ink)', fontSize: 15.5 }}>{h}</strong><p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>{body}</p></div>
              </div>
            ))}
            <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
              <Icon name="info" size={17} style={{ color: 'var(--violet)', flex: 'none' }} />
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>This summary is for clarity. The <button onClick={() => setTab('full')} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--violet)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>full text</button> is the legally binding version.</p>
            </div>
          </div>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 10, marginBottom: 12 }}>
              <Icon name="info" size={17} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} />
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Placeholder.</strong> The structure below shows the sections of the final document. The binding legal language is being finalized with counsel.</p>
            </div>
            {doc.sections.map((s, i) => (
              <div key={s} className="stack" style={{ gap: 8, padding: '14px 0', borderBottom: i < doc.sections.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
                <h3 style={{ fontSize: 17 }}><span className="mono faint" style={{ fontSize: 14, marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>{s}</h3>
                <div className="stack" style={{ gap: 6 }}>
                  <div className="skeleton" style={{ height: 11, width: '100%' }} />
                  <div className="skeleton" style={{ height: 11, width: '92%' }} />
                  <div className="skeleton" style={{ height: 11, width: '64%' }} />
                </div>
              </div>
            ))}
            <p className="faint" style={{ fontSize: 13, marginTop: 14 }}>Questions about this document? Contact <span className="mono" style={{ color: 'var(--violet)' }}>{doc.contact}</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LegalIndex() {
  const { go } = useNav();
  return (
    <div className="pub-page section">
      <PageHead eyebrow="Legal" title="Plain-language summaries, full text on file." sub="Open any document for a clear summary and the full-text structure." />
      <div className="stack" style={{ gap: 12, maxWidth: 760 }}>
        {Object.entries(LEGAL).map(([key, d]) => (
          <div key={key} className="card pad row" style={{ justifyContent: 'space-between', gap: 16, cursor: 'pointer' }} onClick={() => go(key)}>
            <div className="row" style={{ gap: 14 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--grad-soft)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name="info" size={19} /></span>
              <div><div className="row" style={{ gap: 8, alignItems: 'center' }}><strong style={{ color: 'var(--ink)' }}>{d.title}</strong><span className="badge neutral mono" style={{ fontSize: 10.5 }}>{d.version}</span></div><p className="muted" style={{ fontSize: 13, marginTop: 2 }}>Updated {d.updated} · {d.contact}</p></div>
            </div>
            <Icon name="chevR" size={18} style={{ color: 'var(--faint)', flex: 'none' }} />
          </div>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 13, marginTop: 20, maxWidth: 760 }}>When any of these change, signed-in users see the legal update gate before continuing. <a onClick={() => go('contact')} style={{ color: 'var(--violet)', cursor: 'pointer' }}>Contact legal@lite.dating</a> with questions.</p>
    </div>
  );
}

/* compact doc shown over the legal gate ("Read full text") */
const RULES_DOC = {
  title: 'Community Guidelines', version: 'v1.0', updated: '5 Jun 2026', contact: 'safety@lite.dating',
  intro: 'The rules that keep lite.dating a calm, consent-first place to meet people.',
  points: [
    ['check', 'Be real & kind', 'Use your own recent photos and honest details. Treat people with respect — a pass is a complete answer.'],
    ['link', 'Consent first', 'Only request channels you’ve verified. Handles reveal only when you both agree.'],
    ['x', 'Zero tolerance', 'No harassment, impersonation, spam, sexual harassment, or anything involving minors (18+ service).'],
    ['shield', 'Off-platform too', 'Harm that continues on Instagram or Telegram after a trade is still our concern.'],
  ],
  sections: ['Who this applies to', 'Being authentic', 'Respect & consent', 'Prohibited behavior', 'Off-platform conduct', 'Enforcement & appeals'],
};

function LegalDocModal({ docKey, onClose }) {
  const doc = LEGAL[docKey] || (docKey === 'rules' ? RULES_DOC : null);
  if (!doc) return null;
  return (
    <div className="overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ position: 'sticky', top: 0, background: 'var(--surface)', padding: '20px 24px 14px', borderBottom: '1px solid var(--line-soft)', zIndex: 1 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div className="row" style={{ gap: 8, alignItems: 'center' }}><h2 style={{ fontSize: 20 }}>{doc.title}</h2><span className="badge neutral mono" style={{ fontSize: 10.5 }}>{doc.version}</span></div>
              <p className="faint" style={{ fontSize: 12, marginTop: 4 }}>Updated {doc.updated} · {doc.contact}</p>
            </div>
            <button className="btn icon sm ghost" onClick={onClose}><Icon name="x" size={16} /></button>
          </div>
        </div>
        <div style={{ padding: '18px 24px 24px' }} className="stack">
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginBottom: 4 }}>{doc.intro}</p>
          <span className="eyebrow">Key points</span>
          <div className="stack" style={{ gap: 10, marginTop: 6 }}>
            {doc.points.map(([icon, h, body]) => (
              <div key={h} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                <Icon name={icon} size={17} style={{ color: 'var(--violet)', flex: 'none', marginTop: 2 }} />
                <div><strong style={{ color: 'var(--ink)', fontSize: 14 }}>{h}</strong><p className="muted" style={{ fontSize: 13, lineHeight: 1.5, marginTop: 2 }}>{body}</p></div>
              </div>
            ))}
          </div>
          <div className="hr" style={{ margin: '16px 0 4px' }} />
          <span className="eyebrow">Full text · sections</span>
          <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 9, marginTop: 6 }}>
            <Icon name="info" size={15} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} />
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Placeholder structure — binding legal language is being finalized with counsel.</p>
          </div>
          <div className="stack" style={{ gap: 0, marginTop: 8 }}>
            {doc.sections.map((s, i) => (
              <div key={s} className="row" style={{ gap: 12, padding: '10px 0', borderBottom: i < doc.sections.length - 1 ? '1px solid var(--line-soft)' : 'none' }}>
                <span className="mono faint" style={{ fontSize: 12, width: 22, flex: 'none' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LEGAL, LegalDoc, LegalIndex, LegalDocModal });
