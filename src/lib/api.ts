// ─────────────────────────────────────────────────────────────
//  MedQuiz — Fetch wrappers for FastAPI backend
// ─────────────────────────────────────────────────────────────

import type { AcademicHierarchy, ApiResponse, Question, QuizAttempt } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

// ─── Generic fetch helper ─────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => 'Unknown error');
    throw new Error(`[API ${res.status}] ${path}: ${message}`);
  }

  const json: ApiResponse<T> = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// ─── Catalog / Hierarchy ──────────────────────────────────────

/** Fetch the full 5-tier academic hierarchy for the catalog */
export async function fetchHierarchy(): Promise<AcademicHierarchy> {
  return apiFetch<AcademicHierarchy>('/hierarchy');
}

// ─── Static Quiz (MongoDB) ────────────────────────────────────

/** Fetch a fixed question bank for a course */
export async function fetchStaticQuestions(courseId: string): Promise<Question[]> {
  return apiFetch<Question[]>(`/quiz/static/${courseId}/questions`);
}

// ─── Dynamic / AI Quiz (Groq) ─────────────────────────────────

/** Stream or fetch a freshly generated question from Groq AI */
export async function fetchDynamicQuestion(courseId: string, count = 1): Promise<Question[]> {
  return apiFetch<Question[]>(`/quiz/dynamic/${courseId}/generate?count=${count}`);
}

// ─── User History ─────────────────────────────────────────────

/** Push local guest history to the authenticated account */
export async function syncAttempts(attempts: QuizAttempt[], authToken: string): Promise<void> {
  await apiFetch<null>('/user/history/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ attempts }),
  });
}

/** Fetch the authenticated user's server-side history */
export async function fetchUserHistory(authToken: string): Promise<QuizAttempt[]> {
  return apiFetch<QuizAttempt[]>('/user/history', {
    headers: { Authorization: `Bearer ${authToken}` },
  });
}
