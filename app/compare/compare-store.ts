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
  pendingPlayer: ComparePlayer | null;
  addPlayer: (player: ComparePlayer) => void;
  removePlayer: (playerId: string | number | null) => void;
  clearPlayers: () => void;
  isInCompare: (playerId: string | number | null) => boolean;
  isFull: () => boolean;
  setPendingPlayer: (player: ComparePlayer | null) => void;
  replacePlayer: (playerIdToReplace: string | number | null) => void;
}

const MAX_COMPARE_PLAYERS = 2;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      players: [],
      pendingPlayer: null,
      addPlayer: (player: ComparePlayer) => {
        const { players, isInCompare } = get();
        if (isInCompare(player.id)) return;
        if (players.length >= MAX_COMPARE_PLAYERS) {
          // Set pending player instead of auto-replacing
          set({ pendingPlayer: player });
          return;
        }
        set({ players: [...players, player] });
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
      isFull: () => {
        return get().players.length >= MAX_COMPARE_PLAYERS;
      },
      setPendingPlayer: (player: ComparePlayer | null) => {
        set({ pendingPlayer: player });
      },
      replacePlayer: (playerIdToReplace: string | number | null) => {
        const { players, pendingPlayer } = get();
        if (!pendingPlayer) return;

        const newPlayers = players
          .filter((p: ComparePlayer) => p.id !== playerIdToReplace)
          .concat(pendingPlayer);

        set({ players: newPlayers, pendingPlayer: null });
      },
    }),
    {
      name: "compare-players",
      partialize: (state) => ({ players: state.players }), // Don't persist pendingPlayer
    },
  ),
);
