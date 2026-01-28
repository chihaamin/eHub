"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "hooks/use-debounce";
import { useHotkeys } from "@mantine/hooks";
import {
    CommandDialog,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { CommandGroup } from "cmdk";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { Search, Loader2, History, GitCompare, X, Check, SlidersHorizontal } from "lucide-react";
import { conditionColors, scaleBy20 } from "@/app/players/[id]/utils";
import { useCompareStore, ComparePlayer } from "@/app/compare/compare-store";
import { CompareReplaceDialog } from "@/app/components/compareReplaceDialog";
import { useFilterStore, SearchFilters, FilterRange } from "./filter-store";
import { SearchFilter } from "./search-filter-btn";

const HISTORY_KEY = "search-history";
const MAX_HISTORY = 3;

interface SearchResult {
    id: string | number | null;
    Name: string;
    AccentedName?: string;
    JapName?: string;
    Overall?: string | number | null;
}

interface SearchResponse {
    players: SearchResult[];
    total: number;
    hasMore: boolean;
}

const ITEMS_PER_PAGE = 20;

// Global cache for all fetched players
let cachedPlayers: SearchResult[] = [];

// Get search history from localStorage
function getSearchHistory(): SearchResult[] {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Save player to search history
function addToSearchHistory(player: SearchResult): void {
    if (typeof window === "undefined" || player.id == null) return;
    try {
        const history = getSearchHistory();
        // Remove if already exists
        const filtered = history.filter((p) => p.id !== player.id);
        // Add to front and limit to MAX_HISTORY
        const updated = [player, ...filtered].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch {
        // Ignore localStorage errors
    }
}

export function SearchCommand() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [displayedPlayers, setDisplayedPlayers] = useState<SearchResult[]>([]);
    const [filteredFromCache, setFilteredFromCache] = useState<SearchResult[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const debouncedSearch = useDebounce(value, 300);
    const listRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [searchHistory, setSearchHistory] = useState<SearchResult[]>([]);

    // Compare store
    const { players: comparePlayers, addPlayer, removePlayer, isInCompare } = useCompareStore();

    // Filter store
    const { filters, hasActiveFilters, getActiveFilterCount } = useFilterStore();

    // Keyboard shortcut to toggle search
    useHotkeys([["mod+k", () => setOpen((o) => !o)]]);

    // Build filter query params
    const buildFilterParams = useCallback((currentFilters: SearchFilters): string => {
        const params = new URLSearchParams();

        const rangeKeys: (keyof SearchFilters)[] = [
            "overall",
            "offensiveAwareness",
            "ballControl",
            "dribbling",
            "finishing",
            "lowPass",
            "loftedPass",
            "defensiveAwareness",
            "ballWinning",
            "speed",
            "acceleration",
            "physicalContact",
            "stamina",
        ];

        rangeKeys.forEach((key) => {
            const range = currentFilters[key] as FilterRange;
            if (range?.min !== null && range?.min !== undefined) {
                params.append(`${key}Min`, String(range.min));
            }
            if (range?.max !== null && range?.max !== undefined) {
                params.append(`${key}Max`, String(range.max));
            }
        });

        if (currentFilters.position) {
            params.append("position", currentFilters.position);
        }
        if (currentFilters.strongerFoot) {
            params.append("strongerFoot", currentFilters.strongerFoot);
        }

        return params.toString();
    }, []);

    // Filter cached players based on search term
    const filterCachedPlayers = useCallback(
        (searchTerm: string): SearchResult[] => {
            if (!searchTerm.trim()) return cachedPlayers;
            const q = searchTerm.toLowerCase();
            return cachedPlayers.filter(
                (p) =>
                    String(p.Name).toLowerCase().includes(q) ||
                    String(p.AccentedName || "")
                        .toLowerCase()
                        .includes(q) ||
                    String(p.JapName || "")
                        .toLowerCase()
                        .includes(q),
            );
        },
        [],
    );

    // Fetch players from API
    const fetchPlayers = useCallback(
        async (
            searchTerm: string,
            currentOffset: number,
            append: boolean = false,
            currentFilters: SearchFilters = filters,
        ) => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            const loadingState = append ? setIsLoadingMore : setIsLoading;
            loadingState(true);

            try {
                const encodedSearch = encodeURIComponent(searchTerm.trim() || "_all");
                const filterParams = buildFilterParams(currentFilters);
                const url = `/api/public/search/${encodedSearch}?limit=${ITEMS_PER_PAGE}&offset=${currentOffset}${filterParams ? `&${filterParams}` : ""}`;

                const res = await fetch(url, {
                    signal: abortControllerRef.current.signal,
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data: SearchResponse = await res.json();

                // Only cache if no filters are active
                if (!hasActiveFilters()) {
                    const existingIds = new Set(cachedPlayers.map((p) => p.id));
                    const newPlayers = data.players.filter((p) => !existingIds.has(p.id));
                    cachedPlayers = [...cachedPlayers, ...newPlayers];
                }

                // Update displayed players
                if (append) {
                    setDisplayedPlayers((prev) => [...prev, ...data.players]);
                } else {
                    setDisplayedPlayers(data.players);
                }

                setHasMore(data.hasMore);
                setOffset(currentOffset + ITEMS_PER_PAGE);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }
                console.error("Error fetching search results:", err);
            } finally {
                loadingState(false);
            }
        },
        [buildFilterParams, filters, hasActiveFilters],
    );

    // Load search history when dialog opens
    useEffect(() => {
        if (open) {
            setSearchHistory(getSearchHistory());
        }
    }, [open]);

    // Initial fetch when dialog opens
    useEffect(() => {
        if (open && cachedPlayers.length === 0) {
            fetchPlayers("", 0, false);
        } else if (open && cachedPlayers.length > 0 && !value.trim() && !hasActiveFilters()) {
            // Show cached players when opening (only if no filters)
            setDisplayedPlayers(cachedPlayers.slice(0, ITEMS_PER_PAGE));
            setHasMore(cachedPlayers.length > ITEMS_PER_PAGE);
            setOffset(ITEMS_PER_PAGE);
        } else if (open && hasActiveFilters()) {
            // Fetch with filters
            fetchPlayers(value.trim(), 0, false);
        }
    }, [open, fetchPlayers, value, hasActiveFilters]);

    // Re-fetch when filters change
    useEffect(() => {
        if (open) {
            setOffset(0);
            fetchPlayers(debouncedSearch.trim(), 0, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    // Handle search term changes
    useEffect(() => {
        const trimmedSearch = debouncedSearch.trim();

        // Filter from cache immediately (only if no filters active)
        const filtered = !hasActiveFilters() ? filterCachedPlayers(trimmedSearch) : [];
        setFilteredFromCache(filtered);

        // Reset offset for new search
        setOffset(0);

        // If no search term and no filters, show initial cached players
        if (!trimmedSearch && !hasActiveFilters()) {
            setDisplayedPlayers(cachedPlayers.slice(0, ITEMS_PER_PAGE));
            setHasMore(cachedPlayers.length > ITEMS_PER_PAGE);
            setOffset(ITEMS_PER_PAGE);
            return;
        }

        // Show filtered results from cache first (if no filters), then fetch fresh data
        if (filtered.length > 0 && !hasActiveFilters()) {
            setDisplayedPlayers(filtered.slice(0, ITEMS_PER_PAGE));
        }

        // Fetch from API for fresh/complete results
        fetchPlayers(trimmedSearch, 0, false);
    }, [debouncedSearch, filterCachedPlayers, fetchPlayers, hasActiveFilters]);

    // Handle scroll for infinite loading
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const target = e.currentTarget;
            const scrolledToBottom =
                target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

            if (scrolledToBottom && hasMore && !isLoading && !isLoadingMore) {
                fetchPlayers(debouncedSearch.trim(), offset, true);
            }
        },
        [hasMore, isLoading, isLoadingMore, offset, debouncedSearch, fetchPlayers],
    );

    // Reset state when dialog closes
    const handleOpenChange = useCallback((newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setValue("");
            setDisplayedPlayers([]);
            setFilteredFromCache([]);
            setOffset(0);
            setHasMore(true);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        }
    }, []);

    // Navigate to player and close dialog
    const handleSelectPlayer = useCallback(
        (player: SearchResult) => {
            if (player.id == null) return;
            // Add to search history
            addToSearchHistory(player);
            setSearchHistory(getSearchHistory());
            setOpen(false);
            router.push(`/players/${player.id}`);
        },
        [router],
    );

    // Toggle player in compare list
    const handleToggleCompare = useCallback(
        (e: React.MouseEvent, player: SearchResult) => {
            e.stopPropagation();
            if (player.id == null) return;

            const comparePlayer: ComparePlayer = {
                id: player.id,
                Name: player.Name,
                AccentedName: player.AccentedName,
                JapName: player.JapName,
                Overall: player.Overall,
            };

            if (isInCompare(player.id)) {
                removePlayer(player.id);
            } else {
                addPlayer(comparePlayer);
            }
        },
        [addPlayer, removePlayer, isInCompare],
    );

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search players...</span>
                <Kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </Kbd>
            </Button>

            <CommandDialog
                open={open}
                onOpenChange={handleOpenChange}
                className="max-w-sm rounded-lg border h-auto flex justify-center items-center"
                title="Search player"
            >
                <div className="flex items-center gap-2 border-b pr-8 pl-2">
                    <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        placeholder="Search players..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex-1 h-11 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <SearchFilter />
                </div>
                <CommandList
                    ref={listRef}
                    onScroll={handleScroll}
                    className="max-h-[300px] overflow-y-auto"
                >
                    {/* Search history */}
                    {!value.trim() && searchHistory.length > 0 && (
                        <CommandGroup heading="Recent">
                            {searchHistory.map((p) => (
                                <CommandItem
                                    key={`history-player-${p.id}`}
                                    value={`history-${p.AccentedName ?? p.Name}`}
                                    onSelect={() => handleSelectPlayer(p)}
                                    className="flex items-center gap-2"
                                >
                                    <History className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <div className="flex justify-between items-center w-full min-w-0">
                                        <span className="flex items-center gap-2 truncate">
                                            <p className="font-medium truncate">{p.AccentedName ?? p.Name}</p>
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {p.Overall && (
                                                <span
                                                    className={`text-sm ${conditionColors(scaleBy20(Number(p.Overall)))}`}
                                                >
                                                    {p.Overall}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => handleToggleCompare(e, p)}
                                                className={`p-1 rounded-md transition-colors ${isInCompare(p.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                    }`}
                                                title={isInCompare(p.id) ? "Remove from compare" : "Add to compare"}
                                            >
                                                {isInCompare(p.id) ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <GitCompare className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {/* Compare players */}
                    {!value.trim() && comparePlayers.length > 0 && (
                        <CommandGroup heading="Compare">
                            {comparePlayers.map((p) => (
                                <CommandItem
                                    key={`compare-player-${p.id}`}
                                    value={`compare-${p.AccentedName ?? p.Name}`}
                                    onSelect={() => {
                                        setOpen(false);
                                        router.push(`/players/${p.id}`);
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <GitCompare className="h-4 w-4 shrink-0 text-primary" />
                                    <div className="flex justify-between items-center w-full min-w-0">
                                        <span className="flex items-center gap-2 truncate">
                                            <p className="font-medium truncate">{p.AccentedName ?? p.Name}</p>
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {p.Overall && (
                                                <span
                                                    className={`text-sm ${conditionColors(scaleBy20(Number(p.Overall)))}`}
                                                >
                                                    {p.Overall}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removePlayer(p.id);
                                                }}
                                                className="p-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                title="Remove from compare"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                            {comparePlayers.length === 2 && (
                                <CommandItem
                                    value="go-to-compare"
                                    onSelect={() => {
                                        setOpen(false);
                                        router.push("/compare");
                                    }}
                                    className="justify-center text-primary font-medium"
                                >
                                    <GitCompare className="h-4 w-4 mr-2" />
                                    Compare Players
                                </CommandItem>
                            )}
                        </CommandGroup>
                    )}

                    {/* Initial loading state */}
                    {isLoading && displayedPlayers.length === 0 && (
                        <div className="py-6 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* No results found */}
                    {!isLoading &&
                        debouncedSearch.trim() &&
                        displayedPlayers.length === 0 &&
                        filteredFromCache.length === 0 && (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No players found.
                            </div>
                        )}

                    {/* Player list */}
                    {displayedPlayers.length > 0 && (
                        <CommandGroup heading="Players">
                            {displayedPlayers.map((p) => (
                                <CommandItem
                                    key={`kbd-player-${p.id}`}
                                    value={p.AccentedName ?? p.Name}
                                    onSelect={() => handleSelectPlayer(p)}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex justify-between items-center w-full min-w-0">
                                        <span className="flex items-center gap-2 truncate">
                                            <p className="font-medium truncate">{p.AccentedName ?? p.Name}</p>
                                            <span className="text-muted-foreground">|</span>
                                            <p className="font-light text-muted-foreground truncate">{p.JapName}</p>
                                        </span>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {p.Overall && (
                                                <span
                                                    className={`text-sm ${conditionColors(scaleBy20(Number(p.Overall)))}`}
                                                >
                                                    {p.Overall}
                                                </span>
                                            )}
                                            <button
                                                onClick={(e) => handleToggleCompare(e, p)}
                                                className={`p-1 rounded-md transition-colors ${isInCompare(p.id)
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                                    }`}
                                                title={isInCompare(p.id) ? "Remove from compare" : "Add to compare"}
                                            >
                                                {isInCompare(p.id) ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <GitCompare className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {/* Loading more indicator */}
                    {(isLoadingMore || (isLoading && displayedPlayers.length > 0)) && (
                        <div className="py-4 flex justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {/* End of list indicator */}
                    {!hasMore &&
                        displayedPlayers.length > 0 &&
                        !isLoading &&
                        !isLoadingMore && (
                            <div className="py-2 text-center text-xs text-muted-foreground">
                                No more players
                            </div>
                        )}
                </CommandList>
            </CommandDialog>

            <CompareReplaceDialog />
        </>
    );
}
