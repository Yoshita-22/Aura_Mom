import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import MobileNav from '../../components/MobileNav';
import { useApp } from '../../context/AppContext';
import type { UserProfile } from '../../context/AppContext';
import './Profile.css';

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

export default function Profile() {
  const { userProfile, editProfile, deleteAccount } = useApp();
  
  // Local state for the form
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: userProfile?.name ?? '',
    language: userProfile?.language ?? 'English',
    pregnancy_month: userProfile?.pregnancy_month ?? 5,
    occupation: userProfile?.occupation ?? 'Housewife',
    goals: userProfile?.goals ?? [],
    family_members: userProfile?.family_members ?? 3,
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleGoal = (id: string) => {
    setProfile(p => {
      const goals = p.goals ?? [];
      return { ...p, goals: goals.includes(id) ? goals.filter(g => g !== id) : [...goals, id] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await editProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to delete account');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <MobileNav />
        <div className="settings-inner animate-fade-up">
          <div className="settings-header">
            <h1 className="settings-title serif">👤 Your Profile</h1>
            <p className="settings-subtitle">Update your preferences and wellness journey details.</p>
          </div>

          <div className="settings-card glass">
            
            {/* Name */}
            <div className="form-group settings-group">
              <label className="label">Your Name</label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            {/* Pregnancy Month */}
            <div className="form-group settings-group">
              <label className="label">Pregnancy Month</label>
              <div className="settings-month-grid">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(m => (
                  <button
                    key={m}
                    className={`settings-month-btn ${profile.pregnancy_month === m ? 'active' : ''}`}
                    onClick={() => setProfile({ ...profile, pregnancy_month: m })}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {profile.pregnancy_month && (
                <div className="settings-trimester-tag">
                  {profile.pregnancy_month <= 3 ? '🌱 First Trimester' : profile.pregnancy_month <= 6 ? '🌸 Second Trimester' : '🌺 Third Trimester'}
                </div>
              )}
            </div>

            {/* Language */}
            <div className="form-group settings-group">
              <label className="label">Language Preference</label>
              <div className="settings-lang-grid">
                {(['English', 'Telugu', 'Hindi'] as const).map(lang => (
                  <button
                    key={lang}
                    className={`settings-lang-btn ${profile.language === lang ? 'active' : ''}`}
                    onClick={() => setProfile({ ...profile, language: lang })}
                  >
                    {lang === 'English' ? '🇬🇧' : '🇮🇳'} {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Occupation */}
            <div className="form-group settings-group">
              <label className="label">Occupation</label>
              <select 
                className="input settings-select" 
                value={profile.occupation}
                onChange={e => setProfile({ ...profile, occupation: e.target.value as UserProfile['occupation'] })}
              >
                {OCCUPATIONS.map(occ => (
                  <option key={occ.id} value={occ.id}>{occ.label.split(' ')[0]} {occ.id}</option>
                ))}
              </select>
            </div>

            {/* Family Members */}
            <div className="form-group settings-group">
              <label className="label">Family Members (Household Size)</label>
              <div className="settings-household">
                <button
                  className="settings-household-btn"
                  onClick={() => setProfile(p => ({ ...p, family_members: Math.max(1, (p.family_members ?? 1) - 1) }))}
                >−</button>
                <div className="settings-household-num">{profile.family_members}</div>
                <button
                  className="settings-household-btn"
                  onClick={() => setProfile(p => ({ ...p, family_members: Math.min(20, (p.family_members ?? 1) + 1) }))}
                >+</button>
              </div>
            </div>

            {/* Goals */}
            <div className="form-group settings-group">
              <label className="label">Wellness Goals</label>
              <div className="settings-goal-grid">
                {GOALS.map(goal => {
                  const selected = profile.goals?.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      className={`settings-goal-btn ${selected ? 'active' : ''}`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      {selected ? '✓ ' : ''}{goal.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <div className="settings-error">{error}</div>}
            
            <div className="settings-actions">
              <button 
                className="btn btn-primary settings-save-btn" 
                onClick={handleSave} 
                disabled={saving}
              >
                {saving ? <span className="spinner" /> : success ? '✨ Saved Successfully' : 'Save Changes'}
              </button>
            </div>

            <div className="profile-danger-zone" style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #ffcdd2', borderRadius: '12px', background: '#ffebee' }}>
              <h3 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>Danger Zone</h3>
              <p style={{ color: '#c62828', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Once you delete your account, there is no going back. All your data, diet plans, and preferences will be permanently erased.
              </p>
              <button 
                className="btn" 
                style={{ background: confirmDelete ? '#b71c1c' : '#d32f2f', color: '#fff', border: 'none', width: '100%' }}
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? <span className="spinner" /> : confirmDelete ? 'Are you absolutely sure? Click to confirm deletion.' : 'Delete Account Permanently'}
              </button>
              {confirmDelete && (
                <button 
                  className="btn btn-ghost" 
                  style={{ width: '100%', marginTop: '0.5rem', color: '#d32f2f' }}
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </button>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
