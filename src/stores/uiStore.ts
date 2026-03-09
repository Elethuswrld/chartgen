
import { create } from 'zustand';

interface UiState {
  layoutPreset: string;
  selectedCandle: any | null;
  activeTabs: string[];
  setLayoutPreset: (preset: string) => void;
  setSelectedCandle: (candle: any | null) => void;
  setActiveTabs: (tabs: string[]) => void;
}

export const useUiStore = create<UiState>()(set => ({
  layoutPreset: 'default',
  selectedCandle: null,
  activeTabs: [],
  setLayoutPreset: (preset: string) => set({ layoutPreset: preset }),
  setSelectedCandle: (candle: any | null) => set({ selectedCandle: candle }),
  setActiveTabs: (tabs: string[]) => set({ activeTabs: tabs }),
}));
