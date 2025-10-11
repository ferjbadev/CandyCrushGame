import { create } from "zustand";

type HighScore = {
  name: string;
  score: number;
};

type HighScoresState = {
  scores: HighScore[];
  addScore: (name: string, score: number) => void;
  clearScores: () => void;
};

export const useHighScoresStore = create<HighScoresState>((set) => ({
  scores: [],
  addScore: (name, score) =>
    set((state) => ({
      scores: [...state.scores, { name, score }].sort((a, b) => b.score - a.score).slice(0, 10),
    })),
  clearScores: () => set({ scores: [] }),
}));
