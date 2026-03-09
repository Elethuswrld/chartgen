
import { create } from 'zustand';

interface AiState {
  hoverExplainPayload: any | null;
  setHoverExplainPayload: (payload: any | null) => void;
}

export const useAiStore = create<AiState>()(set => ({
  hoverExplainPayload: null,
  setHoverExplainPayload: (payload: any | null) => set({ hoverExplainPayload: payload }),
}));
