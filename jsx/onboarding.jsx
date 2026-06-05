/* lite.dating — onboarding flow */

const ONB_STEPS = ['Basics', 'Photos', 'Bio', 'Interests', 'Channels', 'Verify'];

function StepDots({ step }) {
  return (
    <div className="row" style={{ gap: 8 }}>
      {ONB_STEPS.map((label, i) => (
        <div key={label} className="stack" style={{ gap: 6, flex: 1, alignItems: 'center' }}>
          <div style={{ height: 5, width: '100%', borderRadius: 999, background: i <= step ? 'var(--grad)' : 'var(--line)', transition: 'background .3s' }} />
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: i === step ? 'var(--violet)' : 'var(--faint)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function OnbBasics({ data, set }) {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Field label="First name" hint="This is how you’ll appear. No surnames.">
        <input className="input" placeholder="e.g. Mira" value={data.name} onChange={(e) => set({ name: e.target.value })} />
      </Field>
      <div className="row" style={{ gap: 14 }}>
        <Field label="Birth date"><input className="input" type="date" value={data.dob} onChange={(e) => set({ dob: e.target.value })} /></Field>
        <Field label="Gender / presentation" hint="Shown on your profile.">
          <select className="select" value={data.gender} onChange={(e) => set({ gender: e.target.value })}>
            <option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer to self-describe</option>
          </select>
        </Field>
      </div>
      <Field label="City" hint="We show approximate distance, never your exact location.">
        <input className="input" placeholder="e.g. Kadıköy, İstanbul" value={data.city} onChange={(e) => set({ city: e.target.value })} />
      </Field>
      <label className="card row" style={{ gap: 12, padding: 14, cursor: 'pointer', background: data.adult ? 'var(--green-w)' : 'var(--surface)', border: data.adult ? 'none' : '1px solid var(--line)' }} onClick={() => set({ adult: !data.adult })}>
        <span style={{ width: 22, height: 22, borderRadius: 6, border: '2px solid ' + (data.adult ? 'var(--green)' : 'var(--line)'), background: data.adult ? 'var(--green)' : 'transparent', display: 'grid', placeItems: 'center', flex: 'none' }}>{data.adult && <Icon name="checkSm" size={14} style={{ color: 'white' }} />}</span>
        <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>I confirm I am 18 years or older.</span>
      </label>
    </div>
  );
}

function OnbPhotos() {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          i < 2
            ? <Photo key={i} label={i === 0 ? 'main · photo' : 'photo'} tint={i} ratio="3 / 4">
                <span className="badge" style={{ position: 'absolute', bottom: 6, left: 6, background: 'var(--surface)', fontSize: 10 }}>{i === 0 ? 'Main' : 'Added'}</span>
              </Photo>
            : <button key={i} className="ph-stripe" style={{ aspectRatio: '3 / 4', borderRadius: 'var(--r-md)', border: '1.5px dashed var(--line)', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
                <span className="stack" style={{ alignItems: 'center', gap: 4 }}><Icon name="plus" size={20} /><span className="ph-label">add</span></span>
              </button>
        ))}
      </div>
      <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none' }}>
        <strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>Photo tips</strong>
        <ul className="muted" style={{ fontSize: 13, lineHeight: 1.7, margin: '6px 0 0', paddingLeft: 18 }}>
          <li>Add 3–6 clear photos. Your face should be visible in the main one.</li>
          <li>No group-only shots, heavy filters, or contact details in images.</li>
          <li>New photos go through a quick review before they’re public.</li>
        </ul>
      </div>
    </div>
  );
}

function OnbBio({ data, set }) {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Field label="Short bio" hint={`${data.bio.length}/80 · the one line people see first`}>
        <input className="input" maxLength={80} placeholder="Architect who collects coffee shops." value={data.bio} onChange={(e) => set({ bio: e.target.value })} />
      </Field>
      <Field label="About you" hint={`${data.about.length}/400`}>
        <textarea className="textarea" maxLength={400} style={{ minHeight: 120 }} placeholder="What are you into? What kind of person are you hoping to meet?" value={data.about} onChange={(e) => set({ about: e.target.value })} />
      </Field>
      <div className="card pad" style={{ background: 'var(--wash-cyan)', border: 'none', display: 'flex', gap: 10 }}>
        <Icon name="info" size={17} style={{ color: 'var(--cyan)', flex: 'none' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Stay safe:</strong> don’t put your phone number, Instagram, Telegram, or address in your bio. You’ll verify channels in the next step — handles only ever reveal with mutual consent.</p>
      </div>
    </div>
  );
}

function OnbInterests({ data, set }) {
  const { CATEGORIES, INTERESTS } = window.DB;
  const toggle = (name) => {
    const has = data.interests.includes(name);
    if (has) set({ interests: data.interests.filter((x) => x !== name) });
    else if (data.interests.length < 8) set({ interests: [...data.interests, name] });
  };
  return (
    <div className="stack" style={{ gap: 18 }}>
      <p className="muted" style={{ fontSize: 14 }}>Pick up to 8. Shared interests get highlighted on profiles. <strong style={{ color: 'var(--ink)' }}>{data.interests.length}/8</strong></p>
      {Object.entries(CATEGORIES).map(([key, c]) => (
        <div key={key} className="stack" style={{ gap: 9 }}>
          <span className="row" style={{ gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}><span className="dot" style={{ background: `oklch(0.7 0.13 ${c.hue})` }} />{c.label}</span>
          <div className="row wrap" style={{ gap: 8 }}>
            {INTERESTS[key].map((name) => <Chip key={name} tap on={data.interests.includes(name)} cat={key} onClick={() => toggle(name)}>{name}</Chip>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChannelRow({ type, state, onVerify }) {
  const label = type === 'instagram' ? 'Instagram' : 'Telegram';
  return (
    <div className="card pad row" style={{ justifyContent: 'space-between', gap: 14 }}>
      <div className="row" style={{ gap: 12 }}>
        <span style={{ width: 42, height: 42, borderRadius: 12, background: type === 'instagram' ? 'var(--wash-pink)' : 'var(--wash-cyan)', display: 'grid', placeItems: 'center', color: type === 'instagram' ? 'var(--violet)' : 'var(--cyan)', flex: 'none' }}><Icon name={type} size={20} /></span>
        <div><strong style={{ color: 'var(--ink)' }}>{label}</strong><p className="muted" style={{ fontSize: 13 }}>{state === 'verified' ? 'Verified — you can request this channel' : 'Connect to request this channel'}</p></div>
      </div>
      {state === 'verified'
        ? <span className="badge verified"><Icon name="check" />Verified</span>
        : state === 'pending'
        ? <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Checking…</span>
        : <button className="btn soft sm" onClick={onVerify}>Verify</button>}
    </div>
  );
}
function OnbChannels({ data, set }) {
  const verify = (k) => {
    set({ channels: { ...data.channels, [k]: 'pending' } });
    setTimeout(() => set({ channels: { ...data.channels, [k]: 'verified' } }), 1100);
  };
  // read latest via functional pattern not available; use effect-free approach
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>Verify the channels you’re willing to share. <strong style={{ color: 'var(--ink)' }}>You can only ever request a channel you’ve verified yourself</strong> — and the other person must have verified it too.</p>
      <ChannelRow type="instagram" state={data.channels.instagram} onVerify={() => verify('instagram')} />
      <ChannelRow type="telegram" state={data.channels.telegram} onVerify={() => verify('telegram')} />
      <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
        <Icon name="shield" size={17} style={{ color: 'var(--green)', flex: 'none' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Verifying a channel is a safety step, not a paid product. Your handle stays hidden until you both consent to share it.</p>
      </div>
    </div>
  );
}

function OnbVerify({ data, set }) {
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 18, alignItems: 'center' }}>
        <div style={{ width: 120, flex: 'none' }}>
          <Photo label="selfie" ratio="1 / 1" radius="50%" tint={1}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px dashed color-mix(in oklch, var(--violet), white 40%)' }} />
          </Photo>
        </div>
        <div className="stack" style={{ gap: 6 }}>
          <h3 style={{ fontSize: 18 }}>Take a private selfie</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>This confirms a real person is behind the profile. Match the pose shown, in good light.</p>
        </div>
      </div>
      <div className="card pad" style={{ display: 'flex', gap: 10, background: 'var(--green-w)', border: 'none' }}>
        <Icon name="lock" size={17} style={{ color: 'var(--green)', flex: 'none' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Your selfie is private.</strong> It is never shown to other users, never used for ads, and never shared. No government ID is ever required.</p>
      </div>
      <label className="row" style={{ gap: 12, cursor: 'pointer' }} onClick={() => set({ reuse: !data.reuse })}>
        <span style={{ marginTop: 1 }}><Switch checked={data.reuse} onChange={() => set({ reuse: !data.reuse })} /></span>
        <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Keep a reusable reference selfie so I don’t have to re-verify each time. <span className="muted">(Optional — you can choose a one-time check instead.)</span></span>
      </label>
    </div>
  );
}

function Onboarding() {
  const { go, toast } = useNav();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', dob: '', gender: 'Woman', city: '', adult: false,
    bio: '', about: '', interests: [],
    channels: { instagram: 'idle', telegram: 'idle' }, reuse: true,
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const canNext = [
    data.name && data.adult, true, true, data.interests.length >= 1,
    data.channels.instagram === 'verified' || data.channels.telegram === 'verified', true,
  ][step];

  const next = () => {
    if (step < ONB_STEPS.length - 1) setStep(step + 1);
    else { toast('Profile created — welcome!', 'ok'); setTimeout(() => go('discover'), 500); }
  };

  const panels = [
    <OnbBasics data={data} set={set} />, <OnbPhotos />, <OnbBio data={data} set={set} />,
    <OnbInterests data={data} set={set} />, <OnbChannels data={data} set={set} />, <OnbVerify data={data} set={set} />,
  ];
  const titles = ['The basics', 'Add your photos', 'Tell your story', 'What are you into?', 'Verify your channels', 'Quick photo check'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="center-col" style={{ padding: '14px 20px 16px', maxWidth: 560 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <Logo size={19} />
            <button className="btn ghost sm" onClick={() => go('discover')}>Skip for now</button>
          </div>
          <StepDots step={step} />
        </div>
      </div>
      <div className="center-col" style={{ padding: '32px 20px 40px', maxWidth: 560 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>{titles[step]}</h1>
        <p className="muted" style={{ fontSize: 14.5, marginBottom: 24 }}>Step {step + 1} of {ONB_STEPS.length}</p>
        <div className="fade-in" key={step}>{panels[step]}</div>
        <div className="row" style={{ gap: 12, marginTop: 28 }}>
          {step > 0 && <button className="btn ghost lg" onClick={() => setStep(step - 1)}><Icon name="arrowL" />Back</button>}
          <button className="btn primary lg" style={{ flex: 1 }} disabled={!canNext} onClick={next}>{step === ONB_STEPS.length - 1 ? 'Finish & start browsing' : 'Continue'}<Icon name="arrowR" /></button>
        </div>
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
