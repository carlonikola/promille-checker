function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'login') {
      const { data, error } = await signIn(email, password);
      if (error) setError(error.message);
      else onLogin(data.user);
    } else {
      const { data, error } = await signUp(email, password, name);
      if (error) setError(error.message);
      else {
        const { data: loginData, error: loginError } = await signIn(email, password);
        if (!loginError) onLogin(loginData.user);
      }
    }
    setLoading(false);
  }

  function guestMode() {
    localStorage.setItem('pt_guest_mode', 'true');
    onLogin(null);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0b10',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        background: '#12141e',
        border: '1px solid #1e2132',
        borderRadius: 24,
        padding: '32px 28px',
        margin: 'auto 0',
        flexShrink: 0
      }}>
        <div style={{textAlign: 'center', marginBottom: 28}}>
          <div style={{fontSize: 48, marginBottom: 8}}>🍺</div>
          <div style={{fontSize: 22, fontWeight: 700, color: '#e8eaf0'}}>PromilleTracker</div>
          <div style={{fontSize: 12, color: '#555', marginTop: 4}}>Track smart. Drink safe.</div>
        </div>

        <div style={{
          display: 'flex',
          background: '#0d0f17',
          borderRadius: 12,
          padding: 4,
          marginBottom: 24
        }}>
          {['login', 'register'].map(m => (
            <div
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: mode === m ? '#2563eb' : 'transparent',
                color: mode === m ? '#fff' : '#555',
                transition: 'all 0.2s'
              }}
            >
              {m === 'login' ? 'Anmelden' : 'Registrieren'}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{marginBottom: 16}}>
              <label style={{display: 'block', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1}}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Max Mustermann"
                required={mode === 'register'}
                style={{
                  width: '100%',
                  background: '#0d0f17',
                  border: '1px solid #222638',
                  borderRadius: 10,
                  padding: '12px 14px',
                  color: '#e8eaf0',
                  fontSize: 14,
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div style={{marginBottom: 16}}>
            <label style={{display: 'block', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1}}>
              E-Mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              required
              style={{
                width: '100%',
                background: '#0d0f17',
                border: '1px solid #222638',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#e8eaf0',
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          <div style={{marginBottom: 20}}>
            <label style={{display: 'block', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1}}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={{
                width: '100%',
                background: '#0d0f17',
                border: '1px solid #222638',
                borderRadius: 10,
                padding: '12px 14px',
                color: '#e8eaf0',
                fontSize: 14,
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#1a0c0c',
              border: '1px solid #f8717130',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: 12,
              color: '#f87171'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#1e3a8a' : '#2563eb',
              border: 'none',
              borderRadius: 12,
              padding: '14px',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginBottom: 16
            }}
          >
            {loading ? 'Bitte warten...' : mode === 'login' ? 'Anmelden →' : 'Konto erstellen'}
          </button>
        </form>

        <div 
          onClick={guestMode}
          style={{
            fontSize: 12,
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
            textAlign: 'center',
            padding: '8px 0'
          }}
        >
          Ohne Login fortfahren (Gast-Modus)
        </div>
      </div>
    </div>
  );
}
