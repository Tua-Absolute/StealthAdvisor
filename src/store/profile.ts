import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RiskProfile } from '@/lib/advisor/types';

interface ProfileState {
  profile: RiskProfile;
  answers: Record<string, number>;
  takenQuiz: boolean;
  setResult: (profile: RiskProfile, answers: Record<string, number>) => void;
  setProfile: (profile: RiskProfile) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: 'balanced',
      answers: {},
      takenQuiz: false,
      setResult: (profile, answers) => set({ profile, answers, takenQuiz: true }),
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'stealth-advisor-profile' }
  )
);
