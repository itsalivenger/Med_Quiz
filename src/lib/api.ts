// ─────────────────────────────────────────────────────────────
//  MedQuiz — Unified API Client (Next.js App Router Backend)
// ─────────────────────────────────────────────────────────────

import type { AcademicHierarchy, ApiResponse, Question, QuizAttempt } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api';

// ─── Generic fetch helper ─────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const fullUrl = path.startsWith('/api') || path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(fullUrl, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = json.error || `[API ${res.status}] Erreur de communication`;
    throw new Error(errorMsg);
  }

  return (json.data !== undefined ? json.data : json) as T;
}

// ─── Student Authentication ───────────────────────────────────

export interface StudentAuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    year?: string;
    faculty?: string;
    role: string;
  };
}

export async function loginStudent(email: string, password: string): Promise<StudentAuthResponse> {
  return apiFetch<StudentAuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signupStudent(payload: {
  name: string;
  email: string;
  password: string;
  year?: string;
  faculty?: string;
}): Promise<StudentAuthResponse> {
  return apiFetch<StudentAuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchCurrentSession(): Promise<{ authenticated: boolean; user?: StudentAuthResponse['user'] }> {
  return apiFetch('/api/auth/me');
}

export async function logoutUser(): Promise<{ success: boolean }> {
  return apiFetch('/api/auth/logout', { method: 'POST' });
}

// ─── Student Dashboard & Progress ─────────────────────────────

export interface StudentDashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    year: string;
    faculty: string;
  };
  stats: {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    accuracy: number;
    todayQuestionsSolved: number;
    streakDays: number;
  };
  recentAttempts: Array<{
    id: string;
    courseId: string;
    score: number;
    total: number;
    mode: 'static' | 'dynamic';
    createdAt: string;
  }>;
}

export async function fetchStudentDashboard(authToken?: string): Promise<StudentDashboardData> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await apiFetch<any>('/api/student/dashboard', { headers });
  return (res?.data !== undefined ? res.data : res) as StudentDashboardData;
}

export async function recordStudentAttempt(
  attempt: { courseId: string; score: number; total: number; mode: 'static' | 'dynamic' },
  authToken?: string
): Promise<void> {
  const headers: Record<string, string> = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  await apiFetch('/api/student/attempts', {
    method: 'POST',
    headers,
    body: JSON.stringify(attempt),
  });
}

/** Push local guest history to the authenticated account in MongoDB */
export async function syncAttempts(attempts: QuizAttempt[], authToken: string): Promise<void> {
  await apiFetch('/api/student/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ attempts }),
  });
}

/** Fetch user's server-side history from MongoDB */
export async function fetchUserHistory(authToken: string): Promise<QuizAttempt[]> {
  const res = await apiFetch<any>('/api/student/attempts', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Array.isArray(res) ? res : res?.data || [];
}

// ─── Admin Authentication & Operations ─────────────────────────

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function loginAdmin(payload: {
  email?: string;
  password?: string;
  securityKey?: string;
}): Promise<AdminLoginResponse> {
  return apiFetch<AdminLoginResponse>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface AdminStats {
  totalStudents: number;
  totalQuestions: number;
  pendingReview: number;
  totalAttempts: number;
  openTickets: number;
  uptime: string;
  databaseStatus: string;
}

export async function fetchAdminStats(adminToken?: string): Promise<AdminStats> {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  const res = await apiFetch<any>('/api/admin/stats', { headers });
  return (res?.stats !== undefined ? res.stats : res) as AdminStats;
}

export async function fetchAdminQuestions(): Promise<Array<{
  id: string;
  itemCode: string;
  year: string;
  matter: string;
  vignette: string;
  status: 'valid' | 'review';
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  author: string;
  createdAt: string;
}>> {
  const res = await apiFetch<any>('/api/admin/questions');
  return Array.isArray(res) ? res : res?.data || [];
}

export async function createAdminQuestion(
  question: {
    itemCode: string;
    year: string;
    matter: string;
    vignette: string;
    difficulty: string;
    author: string;
    status: 'valid' | 'review';
  },
  adminToken?: string
): Promise<void> {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  await apiFetch('/api/admin/questions', {
    method: 'POST',
    headers,
    body: JSON.stringify(question),
  });
}

export async function deleteAdminQuestion(id: string, adminToken?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  await apiFetch(`/api/admin/questions?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers,
  });
}

export async function fetchAdminTickets(adminToken?: string): Promise<Array<{
  id: string;
  date: string;
  student: string;
  subject: string;
  item: string;
  status: 'open' | 'resolved';
}>> {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  const res = await apiFetch<any>('/api/admin/tickets', { headers });
  return Array.isArray(res) ? res : res?.data || [];
}

export async function updateAdminTicket(id: string, status: 'open' | 'resolved', adminToken?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (adminToken) headers['Authorization'] = `Bearer ${adminToken}`;
  await apiFetch('/api/admin/tickets', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ id, status }),
  });
}

// ─── Catalog / Hierarchy ──────────────────────────────────────

export async function fetchHierarchy(): Promise<AcademicHierarchy> {
  return apiFetch<AcademicHierarchy>('/hierarchy');
}

export async function fetchStaticQuestions(courseId: string): Promise<Question[]> {
  return apiFetch<Question[]>(`/quiz/static/${courseId}/questions`);
}

export async function fetchDynamicQuestion(courseId: string, count = 1): Promise<Question[]> {
  return apiFetch<Question[]>(`/quiz/dynamic/${courseId}/generate?count=${count}`);
}
