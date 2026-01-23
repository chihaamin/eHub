'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface PlayerSummary {
  id: string | number;
  name: string;
  accentedName: string;
  overall: number;
  position: string;
  playingStyle: string;
  country: string;
}

interface PlayersResponse {
  players: PlayerSummary[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

interface FilterParams {
  search?: string;
  position?: string;
  minRating?: number;
  maxRating?: number;
  playingStyle?: string;
}

interface UsePlayers {
  players: PlayerSummary[];
  allPlayers: PlayerSummary[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  loadMore: () => void;
  setFilters: (filters: FilterParams) => void;
  filters: FilterParams;
  refetch: () => void;
}

const LIMIT = 20;

export function usePlayers(): UsePlayers {
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFiltersState] = useState<FilterParams>({});

  const isFetching = useRef(false);

  const buildQueryString = useCallback(
    (pageNum: number, includeAll = false) => {
      const params = new URLSearchParams();
      params.set('page', String(pageNum));
      params.set('limit', String(LIMIT));

      if (includeAll) {
        params.set('all', 'true');
      }

      if (filters.search) params.set('search', filters.search);
      if (filters.position) params.set('position', filters.position);
      if (filters.minRating) params.set('minRating', String(filters.minRating));
      if (filters.maxRating) params.set('maxRating', String(filters.maxRating));
      if (filters.playingStyle)
        params.set('playingStyle', filters.playingStyle);

      return params.toString();
    },
    [filters],
  );

  // Fetch all players for caching (used for filtering on client side)
  const fetchAllPlayers = useCallback(async () => {
    try {
      const response = await fetch(`/api/players?all=true`);
      if (!response.ok) throw new Error('Failed to fetch all players');
      const data: PlayersResponse = await response.json();
      setAllPlayers(data.players);
    } catch (err) {
      console.error('Error fetching all players:', err);
    }
  }, []);

  // Fetch paginated players
  const fetchPlayers = useCallback(
    async (pageNum: number, reset = false) => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        if (reset) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }
        setError(null);

        const queryString = buildQueryString(pageNum);
        const response = await fetch(`/api/players?${queryString}`);

        if (!response.ok) throw new Error('Failed to fetch players');

        const data: PlayersResponse = await response.json();

        if (reset) {
          setPlayers(data.players);
        } else {
          setPlayers((prev) => [...prev, ...data.players]);
        }

        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isFetching.current = false;
      }
    },
    [buildQueryString],
  );

  // Initial fetch
  useEffect(() => {
    fetchPlayers(1, true);
    fetchAllPlayers();
  }, [fetchPlayers, fetchAllPlayers]);

  // Refetch when filters change
  useEffect(() => {
    setPage(1);
    fetchPlayers(1, true);
  }, [filters, fetchPlayers]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchPlayers(page + 1);
    }
  }, [fetchPlayers, hasMore, isLoadingMore, page]);

  const setFilters = useCallback((newFilters: FilterParams) => {
    setFiltersState(newFilters);
  }, []);

  const refetch = useCallback(() => {
    setPage(1);
    fetchPlayers(1, true);
  }, [fetchPlayers]);

  return {
    players,
    allPlayers,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    loadMore,
    setFilters,
    filters,
    refetch,
  };
}
