
import { create } from 'zustand';
import { GenesisScoreData } from '../types';

interface MasterDashboardState {
  genesisScoreData: GenesisScoreData | null;
  fetchGenesisScoreData: () => void;
}

export const useMasterDashboardStore = create<MasterDashboardState>((set) => ({
  genesisScoreData: null,
  fetchGenesisScoreData: async () => {
    try {
      const response = await fetch('/api/genesis-score');
      if (!response.ok) {
        throw new Error('Failed to fetch Genesis Score data');
      }
      const data = await response.json();
      set({ genesisScoreData: data });
    } catch (error) {
      console.error(error);
      // Handle the error appropriately in a real application
    }
  },
}));
