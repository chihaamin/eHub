"use client";

import { useEffect, useState } from "react";
import { useCompareStore } from "./compare-store";
import { Player } from "../players/players";
import { Button } from "../components/ui/button";
import { Item } from "../components/ui/item";
import { GitCompare, X, Search, ArrowUp, ArrowDown, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
    Attackingfields,
    Defendingfields,
    Athleticismfields,
    fieldColor,
    conditionColors,
    scaleBy20,
} from "../players/[id]/utils";

export default function ComparePage() {
    const {
        players: comparePlayers,
        removePlayer,
        clearPlayers,
    } = useCompareStore();
    const [player1Data, setPlayer1Data] = useState<Player | null>(null);
    const [player2Data, setPlayer2Data] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlayerData = async () => {
            setIsLoading(true);
            try {
                const [p1, p2] = await Promise.all([
                    comparePlayers[0]?.id
                        ? fetch(`/api/public/players/${comparePlayers[0].id}`).then((r) =>
                            r.json(),
                        )
                        : null,
                    comparePlayers[1]?.id
                        ? fetch(`/api/public/players/${comparePlayers[1].id}`).then((r) =>
                            r.json(),
                        )
                        : null,
                ]);
                setPlayer1Data(p1);
                setPlayer2Data(p2);
            } catch (error) {
                console.error("Error fetching player data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (comparePlayers.length > 0) {
            fetchPlayerData();
        } else {
            setIsLoading(false);
        }
    }, [comparePlayers]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (comparePlayers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <GitCompare className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">No Players to Compare</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Use the search (⌘K) to find players and click the compare icon to add
                    them to comparison.
                </p>
                <Button asChild>
                    <Link href="/players">
                        <Search className="h-4 w-4 mr-2" />
                        Browse Players
                    </Link>
                </Button>
            </div>
        );
    }

    if (comparePlayers.length === 1 && comparePlayers[0]) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <GitCompare className="h-16 w-16 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Add Another Player</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    You have selected{" "}
                    <strong>
                        {comparePlayers[0].AccentedName ?? comparePlayers[0].Name}
                    </strong>
                    . Add one more player to compare.
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            comparePlayers[0] && removePlayer(comparePlayers[0].id)
                        }
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <GitCompare className="h-6 w-6" />
                    Compare Players
                </h1>
                <Button variant="outline" onClick={clearPlayers}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                </Button>
            </div>

            {/* Player Cards Header */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <PlayerCompareCard
                    player={player1Data}
                    onRemove={() =>
                        comparePlayers[0]?.id && removePlayer(comparePlayers[0].id)
                    }
                />
                <PlayerCompareCard
                    player={player2Data}
                    onRemove={() =>
                        comparePlayers[1]?.id && removePlayer(comparePlayers[1].id)
                    }
                />
            </div>

            {/* Stats Comparison */}
            <div className="space-y-8">
                <StatsCompareSection
                    title="Attacking"
                    fields={Attackingfields}
                    player1={player1Data}
                    player2={player2Data}
                />
                <StatsCompareSection
                    title="Defending"
                    fields={Defendingfields}
                    player1={player1Data}
                    player2={player2Data}
                />
                <StatsCompareSection
                    title="Athleticism"
                    fields={Athleticismfields}
                    player1={player1Data}
                    player2={player2Data}
                />
            </div>
        </div>
    );
}

function PlayerCompareCard({
    player,
    onRemove,
}: {
    player: Player | null;
    onRemove: () => void;
}) {
    if (!player) return null;

    const iconSize = 24;

    return (
        <div className="bg-card rounded-lg border p-2 md:p-4">
            {/* Mobile Layout */}
            <div className="flex flex-col gap-2 md:hidden">
                {/* Header: Name + Overall + Close */}
                <div className="flex items-center justify-between gap-2">
                    <Link
                        href={`/players/${player.PlayerID}`}
                        className="hover:underline w-full"
                    >
                        <h2 className="text-sm font-bold ">
                            {player.AccentedName ?? player.Name}
                        </h2>
                    </Link>
                    <p
                        className={`text-xl font-bold shrink-0 ${conditionColors(scaleBy20(Number(player.Overall)))}`}
                    >
                        {player.Overall}
                    </p>
                    <button
                        onClick={onRemove}
                        className="p-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0"
                        title="Remove from compare"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Player image + icons + info */}
                <div className="flex items-center w-full justify-center p-4">
                    <Image
                        src={`https://efootballhub.net/images/efootball24/players/${player.PlayerID}_l.webp`}
                        alt={`${player.Name}`}
                        height={80}
                        width={80}
                        className="object-contain shrink-0"
                    />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-4 grid-rows-4 gap-2">
                {/* Row 1: Name + Overall + Close */}
                <Link
                    href={`/players/${player.PlayerID}`}
                    className="col-span-3 hover:underline flex items-center"
                >
                    <h2 className="text-base lg:text-lg font-bold font-['Inter'] truncate">
                        {player.AccentedName ?? player.Name}
                    </h2>
                </Link>
                <span className="col-span-1 flex">
                    <p
                        className={`w-full text-2xl lg:text-3xl font-bold font-['Inter'] text-center self-center ${conditionColors(scaleBy20(Number(player.Overall)))}`}
                    >
                        {player.Overall}
                    </p>
                    <button
                        onClick={onRemove}
                        className="p-1 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors  self-start"
                        title="Remove from compare"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </span>

                <div className="row-span-3 flex flex-col justify-evenly items-center gap-1">
                    <Image
                        src={`https://efootballhub.net/images/efootball23/nationality/${player.Country}.png`}
                        alt="country"
                        width={iconSize}
                        height={iconSize}
                    />
                    <Image
                        src={`https://efootballhub.net/images/efootball23/emblem/e_${String(player.Club).padStart(6, "0")}.png`}
                        alt="team"
                        width={iconSize}
                        height={iconSize}
                    />
                    <Image
                        src={`https://efootballhub.net/images/efootball23/leagues/emb_${String(player.LeagueID).padStart(4, "0")}.png`}
                        alt="leagues"
                        width={iconSize}
                        height={iconSize}
                    />
                    <div className="flex flex-col items-center">
                        <Image
                            src={`https://efootballhub.net/images/icons/CmnIconPointSmall_Gp.png`}
                            alt="GP"
                            width={iconSize}
                            height={iconSize}
                        />
                        <span className="text-[10px] font-medium">
                            {player.MarketValue}
                        </span>
                    </div>
                </div>

                {/* Center - Player image */}
                <Image
                    src={`https://efootballhub.net/images/efootball24/players/${player.PlayerID}_l.webp`}
                    alt={`${player.Name}`}
                    height={120}
                    width={120}
                    className="row-span-3 col-span-2 object-contain place-self-center h-auto"
                />

                {/* Right column - Stats */}
                <div className="row-span-3 flex flex-col justify-evenly items-center gap-1 text-[10px] lg:text-xs font-bold">
                    <div className="bg-accent-foreground/10 border w-full rounded flex flex-col justify-center items-center py-0.5">
                        <div className="font-light text-[8px] lg:text-[10px]">Height</div>
                        <div>{player.Height}cm</div>
                    </div>
                    <div className="bg-accent-foreground/10 border w-full rounded flex flex-col justify-center items-center py-0.5">
                        <div className="font-light text-[8px] lg:text-[10px]">Weight</div>
                        <div>{player.Weight}kg</div>
                    </div>
                    <div className="bg-accent-foreground/10 border w-full rounded flex flex-col justify-center items-center py-0.5">
                        <div className="font-light text-[8px] lg:text-[10px]">Age</div>
                        <div>{player.Age}</div>
                    </div>
                    <div className="bg-accent-foreground/10 border w-full rounded flex flex-col justify-center items-center py-0.5">
                        <div className="font-light text-[8px] lg:text-[10px]">Foot</div>
                        <div>{player.StrongerFoot == 1 ? "R" : "L"}</div>
                    </div>
                    <div className="bg-accent-foreground/10 border w-full rounded flex flex-col justify-center items-center py-0.5">
                        <div className="font-light text-[8px] lg:text-[10px]">Pos</div>
                        <div>{player.RegisteredPosition}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCompareSection({
    title,
    fields,
    player1,
    player2,
}: {
    title: string;
    fields: { label: string; key: string }[];
    player1: Player | null;
    player2: Player | null;
}) {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="space-y-1">
                {fields.map((field, index) => {
                    const val1 = Number(player1?.[field.key as keyof Player]) || 0;
                    const val2 = Number(player2?.[field.key as keyof Player]) || 0;
                    const diff = val1 - val2;

                    return (
                        <Item
                            key={field.key}
                            variant={index % 2 === 0 ? "muted" : "default"}
                            size="xs"
                            className="p-2"
                        >
                            <div className="grid grid-cols-5 gap-2 items-center w-full">
                                {/* Player 1 stat */}
                                <div className="flex items-center justify-start gap-2">
                                    <span
                                        className={`px-2 py-1 rounded-sm font-bold text-sm ${fieldColor(val1)}`}
                                    >
                                        {val1}
                                    </span>
                                    {diff > 0 && <ArrowUp className="h-4 w-4 text-green-500" />}
                                    {diff < 0 && <ArrowDown className="h-4 w-4 text-red-500" />}
                                    {diff === 0 && (
                                        <Minus className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Stat label */}
                                <div className="col-span-3 text-center">
                                    <p className="text-sm font-medium">{field.label}</p>
                                </div>

                                {/* Player 2 stat */}
                                <div className="flex items-center justify-end gap-2">
                                    {diff < 0 && <ArrowUp className="h-4 w-4 text-green-500" />}
                                    {diff > 0 && <ArrowDown className="h-4 w-4 text-red-500" />}
                                    {diff === 0 && (
                                        <Minus className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span
                                        className={`px-2 py-1 rounded-sm font-bold text-sm ${fieldColor(val2)}`}
                                    >
                                        {val2}
                                    </span>
                                </div>
                            </div>
                        </Item>
                    );
                })}
            </div>
        </section>
    );
}
