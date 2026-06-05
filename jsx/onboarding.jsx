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
      <Field label="Birth date" hint="You must be 18 or older — earlier dates only.">
        <DatePicker value={data.dob} onChange={(v) => set({ dob: v })} />
      </Field>
      <Field label="Your gender / presentation" hint="Shown on your profile.">
        <GenderPicker value={data.gender} onChange={(v) => set({ gender: v })} />
      </Field>
      <Field label="Interested in" hint="Pick one or more. You’ll only see — and be seen by — people whose preferences match yours both ways.">
        <GenderPicker multi value={data.seeking} onChange={(v) => set({ seeking: v })} />
      </Field>
      <Field label="City" hint="We auto-detect your area, never your exact location. Change it anytime.">
        <CityField value={data.city} onChange={(v) => set({ city: v })} autoDetect />
      </Field>
      <label className="card row" style={{ gap: 12, padding: 14, cursor: 'pointer', background: data.adult ? 'var(--green-w)' : 'var(--surface)', border: data.adult ? 'none' : '1px solid var(--line)', borderRadius: 'var(--r-md)' }} onClick={() => set({ adult: !data.adult })}>
        <CheckBox green on={data.adult} />
        <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>I confirm I am 18 years or older.</span>
      </label>
    </div>
  );
}

function OnbPhotos({ data, set }) {
  const count = data.photoCount;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <Photo label={i === 0 ? 'main · photo' : 'photo'} tint={i} ratio="3 / 4">
              <span className="badge" style={{ position: 'absolute', bottom: 6, left: 6, background: 'var(--surface)', fontSize: 10 }}>{i === 0 ? 'Main' : 'Added'}</span>
              <button className="btn icon" onClick={() => set({ photoCount: count - 1 })} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, minHeight: 0, background: 'var(--glass)' }} aria-label="Remove photo"><Icon name="x" size={13} /></button>
            </Photo>
          </div>
        ))}
        {count < 6 && (
          <button className="ph-stripe" onClick={() => set({ photoCount: count + 1 })} style={{ aspectRatio: '3 / 4', borderRadius: 'var(--r-md)', border: '1.5px dashed var(--line)', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--muted)' }}>
            <span className="stack" style={{ alignItems: 'center', gap: 4 }}><Icon name="plus" size={20} /><span className="ph-label">add photo</span></span>
          </button>
        )}
      </div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted" style={{ fontSize: 13 }}>{count}/6 photos · minimum 3</span>
        <span className="badge" style={{ background: count >= 3 ? 'var(--green-w)' : 'var(--amber-w)', color: count >= 3 ? 'var(--green)' : 'color-mix(in oklch, var(--amber), black 18%)', border: 'none' }}>{count >= 3 ? 'Minimum met' : `Add ${3 - count} more`}</span>
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
  const bioMin = 15, aboutMin = 60;
  const bioShort = data.bio.length > 0 && data.bio.length < bioMin;
  const aboutShort = data.about.length > 0 && data.about.length < aboutMin;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Field label="Short bio" error={bioShort ? `At least ${bioMin} characters (${bioMin - data.bio.length} more)` : null} hint={`${data.bio.length}/80 · min ${bioMin} · the one line people see first`}>
        <input className="input" maxLength={80} placeholder="Architect who collects coffee shops." value={data.bio} onChange={(e) => set({ bio: e.target.value })} />
      </Field>
      <Field label="About you" error={aboutShort ? `At least ${aboutMin} characters (${aboutMin - data.about.length} more)` : null} hint={`${data.about.length}/400 · min ${aboutMin}`}>
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
      <p className="muted" style={{ fontSize: 14 }}>Pick 3 to 8. Shared interests get highlighted on profiles. <strong style={{ color: data.interests.length >= 3 ? 'var(--green)' : 'var(--ink)' }}>{data.interests.length}/8</strong>{data.interests.length < 3 && <span className="faint"> · {3 - data.interests.length} more to continue</span>}</p>
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

/* Instagram: place a code in bio for ≥24h. Telegram: link via our bot/API. */
function ChannelHead({ type, state }) {
  const label = type === 'instagram' ? 'Instagram' : 'Telegram';
  return (
    <div className="row" style={{ gap: 12 }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, background: type === 'instagram' ? 'var(--wash-pink)' : 'var(--wash-cyan)', display: 'grid', placeItems: 'center', color: type === 'instagram' ? 'var(--violet)' : 'var(--cyan)', flex: 'none' }}><Icon name={type} size={20} /></span>
      <div><strong style={{ color: 'var(--ink)' }}>{label}</strong><p className="muted" style={{ fontSize: 13 }}>{state === 'verified' ? 'Verified — you can request this channel' : type === 'instagram' ? 'Confirm with a code in your bio' : 'Connect with a secure one-time link'}</p></div>
    </div>
  );
}

function InstagramVerify({ state, set }) {
  const { toast } = useNav();
  const [code] = useState(() => 'lite-' + Math.random().toString(36).slice(2, 6).toUpperCase());
  const [handle, setHandle] = useState('');
  const open = state === 'code' || state === 'checking' || state === 'pending';
  return (
    <div className="card pad stack" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
        <ChannelHead type="instagram" state={state} />
        {state === 'verified'
          ? <span className="badge verified"><Icon name="check" />Verified</span>
          : state === 'checking'
          ? <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Checking bio…</span>
          : state === 'pending'
          ? <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Pending 24h</span>
          : !open && <button className="btn soft sm" onClick={() => set('code')}>Verify</button>}
      </div>

      {open && (
        <div className="stack" style={{ gap: 12 }}>
          <div className="hr" />
          <div className="stack" style={{ gap: 7 }}>
            <span className="eyebrow">Step 1 · Add this code to your bio</span>
            <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
              <div className="row" style={{ gap: 10, flex: 1, minWidth: 180, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '12px 14px', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.04em' }}>{code}</span>
                <button className="btn ghost sm" onClick={() => toast('Code copied', 'ok')}><Icon name="copy" size={14} />Copy</button>
              </div>
            </div>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Paste it anywhere in your Instagram bio and <strong style={{ color: 'var(--ink)' }}>keep it there for at least 24 hours</strong> so we can confirm you own the account. You can remove it afterwards.</p>
          </div>
          <div className="stack" style={{ gap: 7 }}>
            <span className="eyebrow">Step 2 · Your Instagram handle</span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}>@</span>
              <input className="input" style={{ paddingLeft: 26 }} placeholder="yourhandle" value={handle} onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9._]/gi, ''))} />
            </div>
          </div>
          {state === 'pending'
            ? <div className="card pad stack" style={{ gap: 10, background: 'var(--amber-w)', border: 'none' }}>
                <div className="row" style={{ gap: 9 }}><Icon name="clock" size={16} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Code found. Keep it in your bio — verification confirms after the 24-hour hold.</span></div>
                <button className="btn soft sm" style={{ alignSelf: 'flex-start' }} onClick={() => { set('verified'); toast('Instagram verified', 'ok'); }}>Simulate 24h elapsed</button>
              </div>
            : state === 'checking'
            ? <div className="row" style={{ gap: 10, justifyContent: 'center', padding: 4 }}><span className="spinner" /><span className="muted" style={{ fontSize: 13 }}>Looking for your code…</span></div>
            : <div className="row" style={{ gap: 10 }}>
                <button className="btn ghost sm" onClick={() => set('idle')}>Cancel</button>
                <button className="btn primary sm" style={{ flex: 1 }} disabled={!handle} onClick={() => { set('checking'); setTimeout(() => set('pending'), 1400); }}>I added the code — check now</button>
              </div>}
          <div className="card pad" style={{ background: 'var(--amber-w)', border: 'none', display: 'flex', gap: 9, padding: 12 }}>
            <Icon name="clock" size={15} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} />
            <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.45 }}>We re-check periodically. The code must stay in your bio for a full 24 hours for verification to stick.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function TelegramVerify({ state, set }) {
  const { toast } = useNav();
  // states: idle | link | waiting | verified | expired | taken
  const [token] = useState(() => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6));
  const open = state === 'link' || state === 'waiting' || state === 'expired' || state === 'taken';
  const url = `https://t.me/litedating_bot?start=${token}`;
  return (
    <div className="card pad stack" style={{ gap: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
        <ChannelHead type="telegram" state={state} />
        {state === 'verified'
          ? <span className="badge verified"><Icon name="check" />Verified</span>
          : state === 'waiting'
          ? <span className="badge pending"><span className="dot" style={{ background: 'var(--amber)' }} />Waiting for Telegram…</span>
          : !open && <button className="btn soft sm" onClick={() => set('link')}>Verify</button>}
      </div>

      {open && (
        <div className="stack" style={{ gap: 12 }}>
          <div className="hr" />
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Telegram verification uses a <strong style={{ color: 'var(--ink)' }}>secure one-time link</strong>. The link connects your Telegram account to your lite.dating account — your verified identity is bound to your Telegram <strong style={{ color: 'var(--ink)' }}>account</strong>, not just your @username (which can change).</p>

          {state === 'expired' ? (
            <div className="card pad stack" style={{ gap: 10, background: 'var(--red-w)', border: 'none' }}>
              <div className="row" style={{ gap: 9 }}><Icon name="clock" size={16} style={{ color: 'var(--red)', flex: 'none' }} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>This link expired before it was confirmed. Generate a fresh one to try again.</span></div>
              <button className="btn ink sm" style={{ alignSelf: 'flex-start' }} onClick={() => set('link')}><Icon name="link" size={14} />Generate new secure link</button>
            </div>
          ) : state === 'taken' ? (
            <div className="card pad stack" style={{ gap: 10, background: 'var(--red-w)', border: 'none' }}>
              <div className="row" style={{ gap: 9 }}><Icon name="info" size={16} style={{ color: 'var(--red)', flex: 'none' }} /><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>This Telegram account is already linked to another lite.dating account. Each account can verify only one Telegram identity.</span></div>
              <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => set('idle')}>Use a different account</button>
            </div>
          ) : state === 'waiting' ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="row" style={{ gap: 10, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)', padding: '10px 12px', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>t.me/litedating_bot?start=…</span>
                <button className="btn ghost sm" onClick={() => toast('Secure link copied', 'ok')}><Icon name="copy" size={14} />Copy</button>
              </div>
              <div className="row" style={{ gap: 10, justifyContent: 'center', padding: 4 }}><span className="spinner" /><span className="muted" style={{ fontSize: 13 }}>Waiting for the bot to confirm your account…</span></div>
              <div className="row" style={{ gap: 8 }}>
                {/* demo: let tester drive each terminal state */}
                <button className="btn primary sm" style={{ flex: 1 }} onClick={() => { set('verified'); toast('Telegram verified', 'ok'); }}>Simulate confirmed</button>
                <button className="btn ghost sm" onClick={() => set('expired')}>Link expired</button>
                <button className="btn ghost sm" onClick={() => set('taken')}>Already used</button>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: 10 }}>
              <span className="eyebrow">Step 1 · Open your secure link</span>
              <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>Opens <span className="mono" style={{ color: 'var(--ink)' }}>@litedating_bot</span> and tap <strong style={{ color: 'var(--ink)' }}>Start</strong>. The bot confirms your account — no code to keep in your profile.</p>
              <div className="row" style={{ gap: 10 }}>
                <button className="btn ghost sm" onClick={() => set('idle')}>Cancel</button>
                <button className="btn ink sm" style={{ flex: 1 }} onClick={() => set('waiting')}><Icon name="telegram" size={15} />Open secure Telegram link</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OnbChannels({ data, set }) {
  const setCh = (k, v) => set({ channels: { ...data.channels, [k]: v } });
  return (
    <div className="stack" style={{ gap: 14 }}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>Verify the channels you’re willing to share. <strong style={{ color: 'var(--ink)' }}>You can only ever request a channel you’ve verified yourself</strong> — and the other person must have verified it too.</p>
      <InstagramVerify state={data.channels.instagram} set={(v) => setCh('instagram', v)} />
      <TelegramVerify state={data.channels.telegram} set={(v) => setCh('telegram', v)} />
      <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none', display: 'flex', gap: 10 }}>
        <Icon name="shield" size={17} style={{ color: 'var(--green)', flex: 'none' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>Verifying a channel is a safety step, not a paid product. Your handle stays hidden until you both consent to share it.</p>
      </div>
    </div>
  );
}

function OnbVerify({ data, set }) {
  const submitted = data.verifyStatus === 'submitted';
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ gap: 18, alignItems: 'center' }}>
        <div style={{ width: 104, flex: 'none', position: 'relative' }}>
          <div className="ph-stripe" style={{ aspectRatio: '3 / 4', borderRadius: 'var(--r-md)', border: '2px dashed color-mix(in oklch, var(--violet), white 40%)', display: 'grid', placeItems: 'center', backgroundColor: 'oklch(0.95 0.03 300)' }}>
            <span className="stack" style={{ alignItems: 'center', gap: 5, opacity: 0.85 }}><Icon name={submitted ? 'check' : 'user'} size={22} style={{ color: submitted ? 'var(--green)' : 'var(--muted)' }} /><span className="ph-label">{submitted ? 'uploaded' : 'selfie'}</span></span>
          </div>
          {submitted && <span style={{ position: 'absolute', right: -6, top: -6, width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', border: '3px solid var(--surface)', display: 'grid', placeItems: 'center', color: 'white' }}><Icon name="clock" size={14} /></span>}
        </div>
        <div className="stack" style={{ gap: 6 }}>
          <h3 style={{ fontSize: 18 }}>Upload a private selfie</h3>
          <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>This confirms a real person is behind the profile. Take a clear photo in good light following the pose below, then upload it.</p>
        </div>
      </div>

      <div className="card pad" style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--grad-soft)', border: 'none' }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--violet)', flex: 'none' }}><Icon name="user" size={20} /></span>
        <div className="stack" style={{ gap: 2 }}>
          <span className="eyebrow">Your pose for this check</span>
          <strong style={{ color: 'var(--ink)', fontSize: 14.5, lineHeight: 1.35 }}>Show the open palm of your left or right hand under your chin — without covering your face.</strong>
          <span className="muted" style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 4 }}>Please remove glasses, hats, masks or anything else that hides your face.</span>
        </div>
      </div>

      <div className="card pad" style={{ display: 'flex', gap: 10, background: 'var(--green-w)', border: 'none' }}>
        <Icon name="lock" size={17} style={{ color: 'var(--green)', flex: 'none' }} />
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong>Your selfie is private.</strong> It is never shown to other users, never used for ads, and never shared. <strong>No government ID is ever required.</strong> The pose is a quick liveness check so we know it’s a real, live person — not a saved photo.</p>
      </div>

      {/* consent — required one-time processing + optional reusable storage */}
      <label className="card pad row" style={{ gap: 12, cursor: 'pointer', alignItems: 'flex-start', borderColor: data.selfieConsent ? 'var(--green)' : 'var(--line)' }} onClick={() => set({ selfieConsent: !data.selfieConsent })}>
        <span style={{ marginTop: 1 }}><CheckBox green on={data.selfieConsent} /></span>
        <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong style={{ color: 'var(--ink)' }}>Required ·</strong> I understand that this private selfie will be processed for one-time verification review. No government ID is required — it’s never shown to other users and never used for ads.</span>
      </label>
      <label className="card pad row" style={{ gap: 12, cursor: 'pointer', alignItems: 'flex-start' }} onClick={() => set({ reuseSelfie: !data.reuseSelfie })}>
        <span style={{ marginTop: 1 }}><CheckBox on={data.reuseSelfie} /></span>
        <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}><strong style={{ color: 'var(--ink)' }}>Optional ·</strong> Keep a reusable private reference selfie so future photo changes can be reviewed faster. Off by default — you can change this later in Consent settings.</span>
      </label>

      {submitted
        ? <div className="card pad row" style={{ gap: 10, background: 'var(--amber-w)', border: 'none', justifyContent: 'space-between' }}>
            <div className="row" style={{ gap: 10 }}><Icon name="clock" size={17} style={{ color: 'color-mix(in oklch, var(--amber), black 18%)', flex: 'none' }} /><span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>Selfie submitted — verification in review. You can continue.</span></div>
            <button className="btn ghost sm" onClick={() => set({ verifyStatus: 'idle' })}>Replace</button>
          </div>
        : <button className="btn primary block" disabled={!data.selfieConsent} onClick={() => set({ verifyStatus: 'submitted' })}><Icon name="camera" size={17} />{data.selfieConsent ? 'Upload private selfie' : 'Confirm the required consent to upload'}</button>}
    </div>
  );
}

function Onboarding() {
  const { go, toast } = useNav();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', dob: '', gender: 'Woman', seeking: [], city: '', adult: false,
    photoCount: 0, bio: '', about: '', interests: [],
    channels: { instagram: 'idle', telegram: 'idle' }, verifyStatus: 'idle', selfieConsent: false, reuseSelfie: false,
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const canNext = [
    data.name && data.dob && data.adult && data.seeking.length >= 1,
    data.photoCount >= 3,
    data.bio.length >= 15 && data.about.length >= 60,
    data.interests.length >= 3,
    data.channels.instagram === 'verified' || data.channels.telegram === 'verified',
    data.verifyStatus === 'submitted',
  ][step];

  const next = () => {
    if (step < ONB_STEPS.length - 1) setStep(step + 1);
    else { toast('Profile created — welcome!', 'ok'); setTimeout(() => go('discover'), 500); }
  };

  const panels = [
    <OnbBasics data={data} set={set} />, <OnbPhotos data={data} set={set} />, <OnbBio data={data} set={set} />,
    <OnbInterests data={data} set={set} />, <OnbChannels data={data} set={set} />, <OnbVerify data={data} set={set} />,
  ];
  const titles = ['The basics', 'Add your photos', 'Tell your story', 'What are you into?', 'Verify your channels', 'Quick photo check'];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--glass)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="center-col" style={{ padding: '14px 20px 16px', maxWidth: 560 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
            <Logo size={19} />
            <span className="badge neutral"><Icon name="lock" size={12} />Setup required</span>
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
