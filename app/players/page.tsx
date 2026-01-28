import { Player } from "./players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { PlayersGrid } from "./players-grid";

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
                <PlayersGrid initialPlayers={players} />
            </div>
        </>
    );
}
