"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ComparePlayer {
  id: string | number | null;
  Name: string;
  AccentedName?: string | undefined;
  JapName?: string | undefined;
  Overall?: string | number | null | undefined;
}

interface CompareStore {
  players: ComparePlayer[];
  addPlayer: (player: ComparePlayer) => void;
  removePlayer: (playerId: string | number | null) => void;
  clearPlayers: () => void;
  isInCompare: (playerId: string | number | null) => boolean;
}

const MAX_COMPARE_PLAYERS = 2;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      players: [],
      addPlayer: (player: ComparePlayer) => {
        const { players, isInCompare } = get();
        if (isInCompare(player.id)) return;
        if (players.length >= MAX_COMPARE_PLAYERS) {
          // Replace the oldest player (keep the second one, add new)
          const secondPlayer = players[1];
          if (secondPlayer) {
            set({ players: [secondPlayer, player] });
          } else {
            set({ players: [player] });
          }
        } else {
          set({ players: [...players, player] });
        }
      },
      removePlayer: (playerId: string | number | null) => {
        set((state: CompareStore) => ({
          players: state.players.filter(
            (p: ComparePlayer) => p.id !== playerId,
          ),
        }));
      },
      clearPlayers: () => set({ players: [] }),
      isInCompare: (playerId: string | number | null) => {
        return get().players.some((p: ComparePlayer) => p.id === playerId);
      },
    }),
    {
      name: "compare-players",
    },
  ),
);
