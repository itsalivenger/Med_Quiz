'use client';
// ─────────────────────────────────────────────────────────────
//  useUserStore — guest/auth session + localStorage persistence
// ─────────────────────────────────────────────────────────────
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { syncAttempts } from '@/lib/api';
import type { QuizAttempt } from '@/lib/types';

interface UserState {
  isGuest:        boolean;
  guestSessionId: string;
  authToken?:     string;
  displayName?:   string;
  history:        QuizAttempt[];

  addAttempt:           (attempt: QuizAttempt) => void;
  clearHistory:         () => void;
  migrateGuestToAccount: (params: { authToken: string; displayName: string }) => Promise<void>;
  signOut:              () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isGuest:        true,
      guestSessionId: uuidv4(),
      authToken:      undefined,
      displayName:    undefined,
      history:        [],

      addAttempt(attempt) {
        set(s => ({ history: [attempt, ...s.history] }));
      },

      clearHistory() { set({ history: [] }); },

      async migrateGuestToAccount({ authToken, displayName }) {
        const { history } = get();
        try {
          if (history.length > 0) await syncAttempts(history, authToken);
        } catch (err) {
          console.warn('[MedQuiz] History sync failed — local data preserved:', err);
        }
        set({ isGuest: false, authToken, displayName });
      },

      signOut() {
        set({ isGuest: true, authToken: undefined, displayName: undefined, guestSessionId: uuidv4() });
      },
    }),
    {
      name:    'medquiz-user',
      storage: createJSONStorage(() => localStorage),
      // authToken intentionally excluded — use httpOnly cookie in production
      partialize: s => ({
        guestSessionId: s.guestSessionId,
        isGuest:        s.isGuest,
        displayName:    s.displayName,
        history:        s.history,
      }),
    },
  ),
);
