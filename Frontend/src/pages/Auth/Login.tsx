import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import heroImg from '../../assets/hero.png';
import './Auth.css';

export default function Login() {
  const { signIn, signInWithGoogle } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error);
    }
    // Navigation handled automatically by auth state change in AppContext
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setError(error); setGoogleLoading(false); }
    // On success, Supabase redirects back and onAuthStateChange fires
  };

  return (
    <div className="auth-layout">
      {/* Visual Panel */}
      <div className="auth-visual">
        <div className="auth-blobs">
          <div className="blob" style={{ width: 400, height: 400, background: 'var(--terracotta)', top: '-100px', left: '-100px' }} />
          <div className="blob" style={{ width: 300, height: 300, background: 'var(--sand-beige)',  bottom: '-50px', right: '-80px' }} />
          <div className="blob" style={{ width: 200, height: 200, background: 'var(--olive-green)', top: '40%',     right: '10%'  }} />
        </div>
        <div className="auth-visual-content animate-fade-up">
          <img src={heroImg} alt="Aura Mom" className="auth-hero-img animate-float" />
          <div className="auth-visual-text">
            <h2 className="serif">Nurture from within 🌸</h2>
            <p>Every moment matters. Your baby feels your peace, your joy, and your love.</p>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner animate-fade-up">
          <div className="auth-logo">
            <span className="auth-logo-icon">🌸</span>
            <span className="auth-logo-text serif">Aura Mom</span>
          </div>
          <h1 className="auth-title serif">Welcome back</h1>
          <p className="auth-subtitle">Your daily wellness journey awaits</p>

          {/* Error banner */}
          {error && (
            <div className="auth-error animate-fade-in">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="input-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="auth-forgot">
              <button type="button" className="auth-link" onClick={async () => {
                if (!email) { setError('Enter your email above first'); return; }
                await import('../../lib/supabase').then(({ supabase }) =>
                  supabase.auth.resetPasswordForEmail(email)
                );
                setError(null);
                alert('Password reset link sent to your email!');
              }}>
                Forgot password?
              </button>
            </div>
            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <button
            id="google-login"
            className="btn btn-google w-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading
              ? <span className="spinner spinner-dark" />
              : <><GoogleIcon /> Sign in with Google</>
            }
          </button>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Create one</Link>
          </p>

          {/* Supabase badge */}
          <div className="auth-powered">
            <span>🔐 Secured by Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );
}
