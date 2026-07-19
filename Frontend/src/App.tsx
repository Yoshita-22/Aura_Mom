import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Onboarding from './pages/Onboarding/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import DietPlan from './pages/Diet/DietPlan';
import Meditation from './pages/Meditation/Meditation';
import VisionBoard from './pages/VisionBoard/VisionBoard';
import Affirmations from './pages/Affirmations/Affirmations';
import Profile from './pages/Profile/Profile';
import './index.css';

// ─── Loading splash ─────────────────────────────────────────
function AuthLoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, hsl(340,30%,95%), hsl(25,60%,96%))',
      gap: '1.5rem',
    }}>
      <div style={{ fontSize: '3rem', animation: 'breathe 2s ease-in-out infinite' }}>🌸</div>
      <p style={{ fontFamily: "'Playfair Display', serif", color: 'hsl(340,20%,30%)', fontSize: '1.1rem' }}>
        Loading Aura Mom…
      </p>
    </div>
  );
}

// ─── Route guards ────────────────────────────────────────────
function AppRoutes() {
  const { user, authLoading, onboardingComplete } = useApp();

  // Wait for Supabase to restore session (avoids redirect flash)
  if (authLoading) return <AuthLoadingScreen />;

  // Not authenticated → only allow auth pages
  if (!user) {
    // Prevent React Router from wiping out the Supabase OAuth callback hash or PKCE code
    if (window.location.hash.includes('access_token=') || window.location.search.includes('code=')) {
      return <AuthLoadingScreen />;
    }
    
    return (
      <Routes>
        <Route path="/login"  element={<Login />}  />
        <Route path="/signup" element={<Signup />} />
        <Route path="*"       element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated but hasn't completed onboarding
  if (!onboardingComplete) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*"           element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  // Fully authenticated + onboarded → main app
  return (
    <Routes>
      <Route path="/"             element={<Dashboard />}   />
      <Route path="/diet"         element={<DietPlan />}    />
      <Route path="/meditation"   element={<Meditation />}  />
      <Route path="/vision-board" element={<VisionBoard />} />
      <Route path="/affirmations" element={<Affirmations />} />
      <Route path="/profile"      element={<Profile />} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
