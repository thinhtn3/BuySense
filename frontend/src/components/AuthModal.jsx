import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [tab,      setTab]      = useState('signin');  // 'signin' | 'signup'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'signup') {
        await signUp(email, password);
        setSuccess(true);
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await signInWithGoogle();
      // redirect handled by Supabase OAuth flow
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="am-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="am-panel" role="dialog" aria-modal="true" aria-label="Sign in to BuySense">
        <button className="am-close" onClick={onClose} aria-label="Close">✕</button>

        <h2 className="am-title">BuySense</h2>
        <p className="am-subtitle">Save listings and track deals</p>

        {/* Tabs */}
        <div className="am-tabs">
          <button
            className={`am-tab${tab === 'signin' ? ' am-tab--active' : ''}`}
            onClick={() => { setTab('signin'); setError(null); setSuccess(false); }}
          >
            Sign in
          </button>
          <button
            className={`am-tab${tab === 'signup' ? ' am-tab--active' : ''}`}
            onClick={() => { setTab('signup'); setError(null); setSuccess(false); }}
          >
            Create account
          </button>
        </div>

        {success ? (
          <div className="am-success">
            <p>Check your email to confirm your account, then sign in.</p>
            <button className="am-btn am-btn--primary" onClick={() => { setSuccess(false); setTab('signin'); }}>
              Go to Sign in
            </button>
          </div>
        ) : (
          <form className="am-form" onSubmit={handleSubmit} noValidate>
            <label className="am-label">
              Email
              <input
                className="am-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="am-label">
              Password
              <input
                className="am-input"
                type="password"
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </label>

            {error && <p className="am-error">{error}</p>}

            <button
              className="am-btn am-btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Please wait…' : tab === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>
        )}

        <div className="am-divider"><span>or</span></div>

        <button className="am-btn am-btn--google" onClick={handleGoogle} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </>
  );
}
