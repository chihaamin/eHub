"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { SearchFilter } from "../components/Search-components/search-filter-btn";
import { useFilterStore, SearchFilters, FilterRange } from "../components/Search-components/filter-store";

interface PlayerResult {
    id: string | number | null;
    Name: string;
    AccentedName?: string;
    JapName?: string;
    Overall?: string | number | null;
}

// Hook to safely check if component is mounted (for hydration safety)
const emptySubscribe = () => () => { };
function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export function PlayersGrid({ initialPlayers }: { initialPlayers: (string | number | null)[] }) {
    const [players, setPlayers] = useState<PlayerResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const isMounted = useIsMounted();
    const { filters, hasActiveFilters } = useFilterStore();

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

    // Fetch filtered players
    const fetchFilteredPlayers = useCallback(async () => {
        if (!isMounted) return;

        const filterParams = buildFilterParams(filters);

        // If no filters, show initial players
        if (!hasActiveFilters()) {
            setIsFiltered(false);
            setPlayers([]);
            return;
        }

        setIsLoading(true);
        setIsFiltered(true);

        try {
            const url = `/api/public/search/_all?limit=40${filterParams ? `&${filterParams}` : ""}`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setPlayers(data.players || []);
        } catch (error) {
            console.error("Error fetching filtered players:", error);
            setPlayers([]);
        } finally {
            setIsLoading(false);
        }
    }, [buildFilterParams, filters, hasActiveFilters, isMounted]);

    // Handler for the apply button
    const handleApplyFilters = useCallback(() => {
        fetchFilteredPlayers();
    }, [fetchFilteredPlayers]);

    // Display either filtered players or initial players
    const displayPlayers = isFiltered ? players : initialPlayers.map((id) => ({ id, Name: "" }));

    return (
        <>
            <div className="col-span-2 mb-8 md:col-span-4 lg:col-span-6 xl:col-span-8 flex justify-between items-center">
                <h1 className="text-4xl font-bold">Players</h1>
                <SearchFilter onApply={handleApplyFilters} showApplyButton />
            </div>

            {isLoading ? (
                <div className="col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8 flex justify-center items-center py-12">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            ) : isFiltered && players.length === 0 ? (
                <div className="col-span-2 md:col-span-4 lg:col-span-6 xl:col-span-8 flex justify-center items-center py-12">
                    <p className="text-muted-foreground">No players found matching your filters.</p>
                </div>
            ) : (
                displayPlayers.map((player, index) => {
                    const playerId = player.id;
                    return (
                        <Link key={playerId ? String(playerId) : `player-${index}`} href={`/players/${playerId}`}>
                            <Image
                                src={`https://efootballhub.net/images/efootball24/players/${playerId}_l.webp`}
                                alt={player.Name ? String(player.Name) : `Player ${playerId}`}
                                width={200}
                                height={200}
                                className="cursor-pointer"
                            />
                        </Link>
                    );
                })
            )}
        </>
    );
}
