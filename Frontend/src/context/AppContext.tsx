import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { saveOnboardingProfile } from '../lib/api';


// ─── Types ────────────────────────────────────────────────────
export interface UserProfile {
  name: string;
  language: 'English' | 'Hindi' | 'Telugu';
  pregnancy_month: number;
  occupation: 'Housewife' | 'Employee' | 'Student' | 'Business' | 'Other';
  goals: string[];
  family_members: number;
}

interface AppContextType {
  /** Supabase user object — null while loading or not logged in */
  user: User | null;
  /** Supabase session (contains access_token forwarded to FastAPI) */
  session: Session | null;
  /** True once we know auth state (avoids flash-of-wrong-page) */
  authLoading: boolean;
  /** True after onboarding wizard is completed */
  onboardingComplete: boolean;
  /** Merged profile from onboarding */
  userProfile: UserProfile | null;
  /** Sign in with email + password (Supabase) */
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Sign up with email + password (Supabase) */
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  /** Sign in with Google OAuth (Supabase) */
  signInWithGoogle: () => Promise<{ error: string | null }>;
  /** Sign out from Supabase */
  signOut: () => Promise<void>;
  /** Called when onboarding wizard is finished */
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  /** Update existing profile */
  editProfile: (updates: Partial<UserProfile>) => Promise<void>;
  /** Delete the user account permanently */
  deleteAccount: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── Provider ────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser]                         = useState<User | null>(null);
  const [session, setSession]                   = useState<Session | null>(null);
  const [authLoading, setAuthLoading]           = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [userProfile, setUserProfile]           = useState<UserProfile | null>(null);

  // ── Bootstrap: restore session & listen to auth changes ──
  useEffect(() => {
    // 1. Load existing session
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) console.error("Supabase Auth Error:", error);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadProfile(session.user.id);
      }
      setAuthLoading(false);
    }).catch((err) => {
      console.error("Auth Exception:", err);
      setAuthLoading(false);
    });

    // 2. Subscribe to auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setUserProfile(null);
          setOnboardingComplete(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Load profile from Supabase user_metadata (set during onboarding).
   * Falls back to localStorage for offline / before backend is ready.
   */
  const loadProfile = useCallback(async (userId: string) => {
    // Check Supabase user_metadata first
    const { data: { user } } = await supabase.auth.getUser();
    const meta = user?.user_metadata as UserProfile | undefined;
    // Google Auth automatically sets `name` and `full_name`. 
    // We must check for an Aura Mom specific field like `pregnancy_month` to know if they actually finished our onboarding.
    if (meta?.pregnancy_month) {
      setUserProfile(meta);
      setOnboardingComplete(true);
      return;
    }
    // Fallback: localStorage (used during development)
    const cached = localStorage.getItem(`aura_profile_${userId}`);
    if (cached) {
      const profile = JSON.parse(cached) as UserProfile;
      setUserProfile(profile);
      setOnboardingComplete(true);
    }
  }, []);

  // ── Auth actions ─────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  /**
   * Save onboarding profile:
   *  1. Persist to Supabase user_metadata (survives across devices)
   *  2. Also send to FastAPI /users/onboarding (backend will store in Supabase DB)
   *  3. Fallback to localStorage if API not yet available
   */
  const completeOnboarding = useCallback(async (profile: UserProfile) => {
    // 1. Update Supabase user metadata
    const { error } = await supabase.auth.updateUser({
      data: profile,
    });
    if (error) throw error;
    
    // 2. Also save to backend (if running)
    try {
      await saveOnboardingProfile(profile);
    } catch (e) {
      console.warn("Backend not running, falling back to local storage", e);
      localStorage.setItem(`aura_profile_${user?.id}`, JSON.stringify(profile));
    }

    setUserProfile(profile);
    setOnboardingComplete(true);
  }, [user]);

  const editProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    const newProfile = { ...userProfile, ...updates } as UserProfile;
    
    const { error } = await supabase.auth.updateUser({ data: newProfile });
    if (error) throw error;

    try {
      await import('../lib/api').then(m => m.updateUserProfile(newProfile));
    } catch (e) {
      console.warn("Backend update failed, falling back to local storage", e);
      localStorage.setItem(`aura_profile_${user.id}`, JSON.stringify(newProfile));
    }

    setUserProfile(newProfile);
  }, [user, userProfile]);

  const deleteAccount = useCallback(async () => {
    try {
      await import('../lib/api').then(m => m.deleteAccount());
    } catch (e) {
      console.warn("Backend deletion failed or offline", e);
    }
    // Also clear from local storage and sign out from Supabase
    if (user) {
      localStorage.removeItem(`aura_profile_${user.id}`);
    }
    await signOut();
  }, [user, signOut]);

  return (
    <AppContext.Provider value={{
      user, session, authLoading,
      onboardingComplete, userProfile,
      signIn, signUp, signInWithGoogle, signOut, completeOnboarding, editProfile, deleteAccount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
