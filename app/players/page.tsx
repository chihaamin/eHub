import { Player } from "./players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { SearchFilter } from "../components/Search-components/search-filter-btn";
import { SearchCommand } from "../components/Search-components/search-form";


export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static";

export default async function Page() {
    const player_amount = 20;

    const filePath = path.join(process.cwd(), "mock", "player_export.csv");
    const csv = fs.readFileSync(filePath, "utf8");
    const parsed = Papa.parse(csv, {
        header: true,
        dynamicTyping: true,
    });

    const allPlayers = parsed.data as Player[];
    const players = allPlayers
        .slice(0, player_amount)
        .map((p) => p.PlayerID)
        .filter(Boolean);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 p-4">
                <div className="col-span-2 mb-8 md:col-span-4 lg:col-span-6 xl:col-span-8 flex justify-between items-center">
                    <h1 className="text-4xl font-bold">Players</h1>
                    <SearchCommand />
                    <SearchFilter />
                </div>
                {players.map((player) => (
                    <Link key={player} href={`/players/${player}`}>
                        <Image
                            src={`https://efootballhub.net/images/efootball24/players/${player}_l.webp`}
                            alt={`Player ${player}`}
                            width={200}
                            height={200}
                            className="cursor-pointer"
                        />
                    </Link>
                ))}
            </div>
        </>
    );
}
