/**
 * api.ts — Centralized API client for the FastAPI backend.
 *
 * Every request automatically attaches the Supabase JWT so FastAPI
 * can verify identity using `supabase.auth.getUser(token)` or the
 * `fastapi-jwt-auth` / `supabase-py` helper on the server side.
 *
 * Usage:
 *   import { api } from '../lib/api';
 *   const profile = await api.get('/users/profile');
 *   await api.post('/users/onboarding', profileData);
 */

import { supabase } from './supabase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? `API error ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)               => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown) => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown) => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body: unknown) => request<T>('PATCH',  path, body),
  delete: <T>(path: string)               => request<T>('DELETE',  path),
};

// ─── Typed API endpoints (add as your teammate builds them) ───

/** POST /profile/ — save onboarding profile to Supabase via FastAPI */
export async function saveOnboardingProfile(profile: object) {
  return api.post('/profile/', profile);
}

/** PUT /profile/ — update current user's profile */
export async function updateUserProfile(profile: object) {
  return api.put('/profile/', profile);
}

/** GET /profile/ — fetch current user's profile from Supabase via FastAPI */
export async function fetchUserProfile() {
  return api.get('/profile/');
}

/** GET /diet-plan/today — today's personalized diet plan */
export async function fetchDietPlan() {
  return api.get('/diet-plan/today');
}

/** GET /affirmations/today — date-seeded affirmation from backend */
export async function fetchTodayAffirmation() {
  return api.get('/affirmations/today');
}

/** DELETE /profile/ — permanently delete the user's account and data */
export async function deleteAccount() {
  return api.delete('/profile/');
}

export async function generateMeditation(feeling: string, bothers: string[], pregnancy_month: number) {
  return api.post('/meditation/generate', {
    feeling, bothers, pregnancy_month
  });
}
