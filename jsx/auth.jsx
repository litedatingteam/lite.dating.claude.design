/* lite.dating — auth (Google + email code, no passwords) */

function CodeBoxes({ value, onChange }) {
  const refs = useRef([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);
  const setAt = (i, d) => {
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = d; onChange(arr.join('').replace(/ /g, '').slice(0, 6));
    if (d && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  return (
    <div className="row" style={{ gap: 10, justifyContent: 'center' }}>
      {digits.map((d, i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)} className="input" inputMode="numeric" maxLength={1}
          value={d.trim()} onChange={(e) => setAt(i, e.target.value.replace(/\D/g, '').slice(-1))}
          onKeyDown={(e) => { if (e.key === 'Backspace' && !d.trim() && refs.current[i - 1]) refs.current[i - 1].focus(); }}
          style={{ width: 52, height: 60, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: 0, fontFamily: 'var(--font-mono)' }} />
      ))}
    </div>
  );
}

function SignIn() {
  const { go, toast } = useNav();
  const [stage, setStage] = useState('start'); // start | code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [keep, setKeep] = useState(true);
  const [secs, setSecs] = useState(0);
  const valid = /.+@.+\..+/.test(email);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const sendCode = () => { setStage('code'); setSecs(30); };

  return (
    <MeshBg style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 20px' }}>
      <div className="center-col stack" style={{ gap: 22 }}>
        <div className="tac stack" style={{ alignItems: 'center', gap: 14 }}>
          <Logo size={24} onClick={() => go('landing')} />
        </div>
        <div className="card" style={{ padding: 30 }}>
          {stage === 'start' ? (
            <div className="stack" style={{ gap: 16 }}>
              <div className="tac stack" style={{ gap: 6, marginBottom: 4 }}>
                <h1 style={{ fontSize: 25 }}>Join free, or sign in</h1>
                <p className="muted" style={{ fontSize: 14.5 }}>No swiping, no chat to manage, no password.</p>
              </div>
              <button className="btn ghost lg block" onClick={() => { toast('Signing in with Google…'); setTimeout(() => go('signup-legal'), 600); }}>
                <Icon name="google" size={18} /> Continue with Google
              </button>
              <div className="row" style={{ gap: 12, color: 'var(--faint)' }}>
                <span className="hr" style={{ flex: 1 }} /><span className="mono" style={{ fontSize: 11 }}>OR</span><span className="hr" style={{ flex: 1 }} />
              </div>
              <Field label="Email address" hint="We’ll send a one-time code. No password needed.">
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <button className="btn primary lg block" disabled={!valid} onClick={sendCode}>Send code<Icon name="arrowR" /></button>
              <label className="row" style={{ gap: 10, cursor: 'pointer', fontSize: 13.5, color: 'var(--muted)' }}>
                <Switch checked={keep} onChange={setKeep} /> Keep me signed in on this device
              </label>
            </div>
          ) : (
            <div className="stack" style={{ gap: 18 }}>
              <button className="row muted" style={{ gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, alignSelf: 'start', padding: 0 }} onClick={() => setStage('start')}>
                <Icon name="arrowL" size={15} /> Back
              </button>
              <div className="tac stack" style={{ gap: 6 }}>
                <h1 style={{ fontSize: 23 }}>Enter your code</h1>
                <p className="muted" style={{ fontSize: 14 }}>If <strong style={{ color: 'var(--ink)' }}>{email || 'that email'}</strong> can sign in, we sent a 6-digit code.</p>
              </div>
              <CodeBoxes value={code} onChange={setCode} />
              <button className="btn primary lg block" disabled={code.length < 6} onClick={() => { toast('Welcome — let’s confirm a few things', 'ok'); setTimeout(() => go('signup-legal'), 500); }}>Verify & continue</button>
              <div className="tac">
                {secs > 0
                  ? <span className="faint" style={{ fontSize: 13 }}>Resend code in <span className="mono">0:{String(secs).padStart(2, '0')}</span></span>
                  : <button className="btn soft sm" onClick={() => setSecs(30)}>Resend code</button>}
              </div>
            </div>
          )}
        </div>

        {/* reassurance */}
        <div className="card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'start', background: 'var(--surface-2)', border: 'none' }}>
          <Icon name="lock" size={18} style={{ color: 'var(--green)', flex: 'none', marginTop: 1 }} />
          <div>
            <strong style={{ color: 'var(--ink)', fontSize: 13.5 }}>Simple sign-in. Serious account protection.</strong>
            <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginTop: 3 }}>No password to remember. No password for us to store. We only ask for a new code on new devices or sensitive account changes.</p>
          </div>
        </div>
        <p className="faint tac" style={{ fontSize: 11.5, lineHeight: 1.5 }}>By continuing you agree to the Terms and acknowledge the Privacy, GDPR and KVKK notices. You must be 18 or older.</p>
      </div>
    </MeshBg>
  );
}

window.SignIn = SignIn;
