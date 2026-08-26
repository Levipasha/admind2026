import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, KeyRound, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

export default function Login() {
  const { loginAdmin, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState('');
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await loginWithGoogle(idToken);
      navigate('/');
    } catch (err) {
      console.error('Admin Google sign-in failed:', err);
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid admin password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Shield size={22} color="black" />
        </div>
        <div className="login-title">Admin Terminal</div>
        <div className="login-sub">
          Sign in with your authorized Google administrator email to access the control panel.
        </div>

        {error && (
          <div className="error-msg" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Primary Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontWeight: 700,
            fontSize: 13,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
          }}
        >
          {googleLoading ? (
            <>
              <div className="spinner" style={{ width: 14, height: 14, borderColor: '#000', borderTopColor: 'transparent' }} />
              Verifying Permissions...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.704H24v9.192h13.22c-.584 3.024-2.3 5.588-4.872 7.316v6.024h7.876c4.612-4.248 7.308-10.52 7.308-17.828z" fill="#4285F4"/>
                <path d="M24 48c6.612 0 12.168-2.196 16.224-5.948l-7.876-6.024c-2.196 1.468-4.996 2.34-8.348 2.34-6.42 0-11.856-4.336-13.796-10.16H2.044v6.22C6.084 42.864 14.452 48 24 48z" fill="#34A853"/>
                <path d="M10.204 28.208A14.46 14.46 0 0 1 9.6 24c0-1.46.252-2.876.604-4.208V13.572H2.044A23.988 23.988 0 0 0 0 24c0 3.876.936 7.548 2.044 10.428l8.16-6.22z" fill="#FBBC05"/>
                <path d="M24 9.636c3.62 0 6.868 1.244 9.42 3.676l7.02-7.02C36.168 2.392 30.612 0 24 0 14.452 0 6.084 5.136 2.044 13.572l8.16 6.22C12.144 13.972 17.58 9.636 24 9.636z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {/* Secondary Divider / Password toggle */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => setShowPasswordLogin(v => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 11,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {showPasswordLogin ? 'Hide Password Access' : 'Or use Security Password'}
          </button>
        </div>

        {showPasswordLogin && (
          <form className="login-form" onSubmit={handlePasswordLogin} style={{ marginTop: 16 }}>
            <div className="input-group">
              <label className="label">Security Password</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input"
                  type="password"
                  placeholder="Enter password (e.g., admin)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 32 }}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', marginTop: 4 }}
            >
              {loading ? 'Verifying...' : 'Authenticate with Password'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 10, color: 'var(--text-muted)' }}>
          DESIGNATHON 2026 · Restricted Access
        </div>
      </div>
    </div>
  );
}
