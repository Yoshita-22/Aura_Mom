import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserProfile } from '../../context/AppContext';

import './Onboarding.css';

const TOTAL_STEPS = 5;

const GOALS = [
  { id: 'Nurture My Baby', label: '🌱 Nurture my baby', desc: 'Support baby development' },
  { id: 'Reduce Stress', label: '🧘 Stress relief', desc: 'Find calm & peace' },
  { id: 'Healthy Diet', label: '🥗 Healthy diet', desc: 'Proper nutrition guidance' },
  { id: 'Guided Meditation', label: '🌸 Guided meditation', desc: 'Mindfulness for you and baby' },
  { id: 'Reduce Loneliness', label: '💕 Community & connection', desc: 'Feel supported & less alone' },
  { id: 'Positive Affirmations', label: '✨ Positive affirmations', desc: 'Build confidence' },
];

const OCCUPATIONS = [
  { id: 'Housewife', label: '🏠 Housewife', desc: 'Managing home & family' },
  { id: 'Employee', label: '💼 Employee', desc: 'Working professional' },
  { id: 'Student', label: '📚 Student', desc: 'Studying' },
  { id: 'Business', label: '📊 Business', desc: 'Running a business' },
  { id: 'Other', label: '💻 Other', desc: 'Other occupations' },
];

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    language: 'English', pregnancy_month: 5, goals: [], family_members: 3,
  });
  const [animating, setAnimating] = useState(false);
  const [saving, setSaving] = useState(false);

  const next = () => {
    if (step < TOTAL_STEPS) {
      setAnimating(true);
      setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 300);
    } else {
      setSaving(true);
      completeOnboarding(profile as UserProfile).finally(() => {
        setSaving(false);
        navigate('/');
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return !!profile.name?.trim();
    if (step === 2) return !!profile.pregnancy_month;
    if (step === 3) return !!profile.occupation;
    if (step === 4) return (profile.goals?.length ?? 0) > 0;
    return true;
  };

  const toggleGoal = (id: string) => {
    setProfile(p => {
      const goals = p.goals ?? [];
      return { ...p, goals: goals.includes(id) ? goals.filter(g => g !== id) : [...goals, id] };
    });
  };

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="onboarding-layout">
      {/* Ambient background */}
      <div className="ob-bg">
        <div className="blob" style={{ width: 500, height: 500, background: 'var(--terracotta)', top: '-150px', left: '-150px' }} />
        <div className="blob" style={{ width: 400, height: 400, background: 'var(--sand-beige)', bottom: '-100px', right: '-100px' }} />
        <div className="blob" style={{ width: 300, height: 300, background: 'var(--olive-green)', top: '40%', left: '30%' }} />
        {particles.map(i => (
          <div key={i} className="ob-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}>✿</div>
        ))}
      </div>

      {/* Progress */}
      <div className="ob-progress">
        <div className="ob-progress-bar" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      <div className={`ob-card glass ${animating ? 'ob-exit' : 'animate-fade-up'}`}>
        {/* Step counter */}
        <div className="ob-step-counter">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`ob-dot ${i + 1 <= step ? 'ob-dot-active' : ''}`} />
          ))}
        </div>

        {/* STEP 1: Name & Language */}
        {step === 1 && (
          <div className="ob-step">
            <div className="ob-icon">👋</div>
            <h2 className="ob-title serif">Hello, beautiful mama!</h2>
            <p className="ob-subtitle">Let's personalize your experience. What should we call you?</p>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="label">Your name</label>
              <input
                id="ob-name"
                type="text"
                className="input"
                placeholder="Enter your name..."
                value={profile.name ?? ''}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="label">Language preference</label>
              <div className="ob-language-grid">
                {(['English', 'Telugu', 'Hindi'] as const).map(lang => (
                  <button
                    key={lang}
                    id={`lang-${lang}`}
                    className={`ob-lang-btn ${profile.language === lang ? 'active' : ''}`}
                    onClick={() => setProfile(p => ({ ...p, language: lang }))}
                  >
                    <span className="ob-lang-flag">
                      {lang === 'English' ? '🇬🇧' : lang === 'Telugu' ? '🇮🇳' : '🇮🇳'}
                    </span>
                    <span>{lang}</span>
                    <span className="ob-lang-note">
                      {lang === 'English' ? 'Full support' : 'Coming soon'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Pregnancy month */}
        {step === 2 && (
          <div className="ob-step">
            <div className="ob-icon">🌙</div>
            <h2 className="ob-title serif">Which month are you in?</h2>
            <p className="ob-subtitle">We'll tailor your diet and wellness plan to your trimester</p>
            <div className="ob-month-grid">
              {Array.from({ length: 9 }, (_, i) => i + 1).map(m => (
                <button
                  key={m}
                  id={`month-${m}`}
                  className={`ob-month-btn ${profile.pregnancy_month === m ? 'active' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, pregnancy_month: m }))}
                >
                  <span className="ob-month-num">{m}</span>
                  <span className="ob-month-label">
                    {m <= 3 ? '1st Tri' : m <= 6 ? '2nd Tri' : '3rd Tri'}
                  </span>
                </button>
              ))}
            </div>
            {profile.pregnancy_month && (
              <div className="ob-trimester-info animate-fade-in">
                <span className="badge badge-rose">
                  {profile.pregnancy_month <= 3 ? '🌱 First Trimester' :
                   profile.pregnancy_month <= 6 ? '🌸 Second Trimester' : '🌺 Third Trimester'}
                </span>
                <p>
                  {profile.pregnancy_month <= 3
                    ? 'Early growth phase — folic acid & rest are key'
                    : profile.pregnancy_month <= 6
                    ? 'Active development — iron, calcium & movement'
                    : 'Final stretch — extra calories, omega-3 & deep rest'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Occupation */}
        {step === 3 && (
          <div className="ob-step">
            <div className="ob-icon">💫</div>
            <h2 className="ob-title serif">What do you do?</h2>
            <p className="ob-subtitle">This helps us schedule wellness activities around your day</p>
            <div className="ob-option-grid">
              {OCCUPATIONS.map(occ => (
                <button
                  key={occ.id}
                  id={`occ-${occ.id}`}
                  className={`ob-option-btn ${profile.occupation === occ.id ? 'active' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, occupation: occ.id as any }))}
                >
                  <span className="ob-option-emoji">{occ.label.split(' ')[0]}</span>
                  <span className="ob-option-title">{occ.label.slice(3)}</span>
                  <span className="ob-option-desc">{occ.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Goals */}
        {step === 4 && (
          <div className="ob-step">
            <div className="ob-icon">🎯</div>
            <h2 className="ob-title serif">Why are you here?</h2>
            <p className="ob-subtitle">Select all that resonate with you (multiple OK)</p>
            <div className="ob-goal-grid">
              {GOALS.map(goal => {
                const selected = profile.goals?.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    id={`goal-${goal.id}`}
                    className={`ob-goal-btn ${selected ? 'active' : ''}`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <span className="ob-goal-emoji">{goal.label.split(' ')[0]}</span>
                    <div>
                      <div className="ob-goal-title">{goal.label.slice(2)}</div>
                      <div className="ob-goal-desc">{goal.desc}</div>
                    </div>
                    {selected && <span className="ob-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Household size */}
        {step === 5 && (
          <div className="ob-step">
            <div className="ob-icon">🏡</div>
            <h2 className="ob-title serif">How many are in your home?</h2>
            <p className="ob-subtitle">
              {profile.name ? `${profile.name}, knowing your support circle helps us guide you better` : 'Knowing your support circle helps us guide you better'}
            </p>
            <div className="ob-household">
              <div className="ob-household-display">
                <button
                  id="household-minus"
                  className="ob-household-btn"
                  onClick={() => setProfile(p => ({ ...p, family_members: Math.max(1, (p.family_members ?? 1) - 1) }))}
                >−</button>
                <div className="ob-household-num">
                  <span className="ob-household-val">{profile.family_members}</span>
                  <span className="ob-household-label">people</span>
                </div>
                <button
                  id="household-plus"
                  className="ob-household-btn"
                  onClick={() => setProfile(p => ({ ...p, family_members: Math.min(20, (p.family_members ?? 1) + 1) }))}
                >+</button>
              </div>
              <div className="ob-household-icons">
                {Array.from({ length: Math.min(profile.family_members ?? 1, 10) }, (_, i) => (
                  <span key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    {i === 0 ? '🤰' : '👤'}
                  </span>
                ))}
                {(profile.family_members ?? 1) > 10 && <span style={{ color: 'var(--mauve-soft)' }}>+{(profile.family_members ?? 1) - 10}</span>}
              </div>
              <p className="ob-household-tip">
                {(profile.family_members ?? 1) === 1
                  ? "💕 You're not alone — we're here with you every step"
                  : (profile.family_members ?? 1) <= 3
                  ? '🌸 A cozy home — beautiful for nurturing new life'
                  : "🌺 A big, loving family — your baby will feel so much love!"}
              </p>
            </div>
          </div>
        )}

        <div className="ob-actions">
          {step > 1 && (
            <button
              id="ob-back"
              className="btn btn-ghost"
              onClick={() => setStep(s => s - 1)}
            >← Back</button>
          )}
          <button
            id="ob-next"
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={next}
            disabled={!canProceed() || saving}
          >
            {saving
              ? <span className="spinner" />
              : step === TOTAL_STEPS ? '✨ Enter Aura Mom' : 'Continue →'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
