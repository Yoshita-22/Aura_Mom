import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import heroImg from '../../assets/hero.png';
import './Auth.css';

export default function Signup() {
  const { signUp, signInWithGoogle } = useApp();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8)  score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['', '#E76F51', '#F4A261', '#57CC99', '#38A3A5'][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (passwordStrength < 2)  { setError('Please use a stronger password'); return; }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      // Supabase sends a confirmation email.
      // If email confirmations are OFF in Supabase, onAuthStateChange fires and
      // App.tsx will redirect to /onboarding automatically.
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();
    if (error) { setError(error); setGoogleLoading(false); }
  };

  if (success) {
    return (
      <div className="auth-layout">
        <div className="auth-visual" style={{ background: 'linear-gradient(145deg, hsl(155,35%,20%), hsl(155,30%,30%))' }}>
          <div className="auth-blobs">
          <div className="blob" style={{ width: 350, height: 350, background: 'var(--terracotta)', top: '-80px', left: '-80px' }} />
          </div>
          <div className="auth-visual-content animate-fade-up">
            <img src={heroImg} alt="Aura Mom" className="auth-hero-img animate-float" />
            <div className="auth-visual-text">
              <h2 className="serif">You're almost in! 🌱</h2>
              <p>Check your email and click the confirmation link to start your journey.</p>
            </div>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-form-inner animate-fade-up" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📬</div>
            <h2 className="serif" style={{ fontSize: '1.75rem', color: 'var(--mauve)', marginBottom: '0.75rem' }}>
              Confirm your email
            </h2>
            <p style={{ color: 'var(--mauve-soft)', lineHeight: 1.7 }}>
              We sent a confirmation link to <strong>{email}</strong>.<br />
              Click it to activate your account and begin your wellness journey.
            </p>
            <div style={{ margin: '2rem 0' }}>
              <div className="auth-powered">🔐 Powered by Supabase Auth</div>
            </div>
            <Link to="/login" className="btn btn-outline w-full" style={{ justifyContent: 'center' }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-visual" style={{ background: 'linear-gradient(145deg, hsl(155,25%,18%), hsl(340,25%,22%))' }}>
        <div className="auth-blobs">
          <div className="blob" style={{ width: 400, height: 400, background: 'var(--olive-green)', top: '-100px', left: '-100px' }} />
          <div className="blob" style={{ width: 300, height: 300, background: 'var(--terracotta)', bottom: '-50px', right: '-80px' }} />
          <div className="blob" style={{ width: 200, height: 200, background: 'var(--warm-clay)',  top: '40%',     right: '10%'  }} />
        </div>
        <div className="auth-visual-content animate-fade-up">
          <img src={heroImg} alt="Aura Mom" className="auth-hero-img animate-float" />
          <div className="auth-visual-text">
            <h2 className="serif">Begin your journey 🌱</h2>
            <p>Join thousands of mothers nurturing healthy, happy babies through mindful living.</p>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner animate-fade-up">
          <div className="auth-logo">
            <span className="auth-logo-icon">🌸</span>
            <span className="auth-logo-text serif">Aura Mom</span>
          </div>
          <h1 className="auth-title serif">Create your account</h1>
          <p className="auth-subtitle">Your baby's wellness starts here</p>

          {error && <div className="auth-error animate-fade-in">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="label" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
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
              <label className="label" htmlFor="signup-password">Password</label>
              <div className="input-wrapper">
                <input
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  className="input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="input-eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="password-strength animate-fade-in">
                  <div className="strength-bars">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="strength-bar" style={{ background: i <= passwordStrength ? strengthColor : 'var(--cream-dark)' }} />
                    ))}
                  </div>
                  <span style={{ color: strengthColor, fontSize: '0.75rem', fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="label" htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                className={`input ${confirm && confirm !== password ? 'input-error' : ''}`}
                placeholder="Re-enter password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
              {confirm && confirm !== password && (
                <span className="input-hint-error">Passwords don't match</span>
              )}
            </div>
            <button
              id="signup-submit"
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>
          <button
            id="google-signup"
            className="btn btn-google w-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading
              ? <span className="spinner spinner-dark" />
              : <><GoogleIcon /> Sign up with Google</>
            }
          </button>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
          <div className="auth-powered">🔐 Secured by Supabase Auth</div>
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
