import { Player } from "./players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = "force-static";

export default async function Page() {
    const player_amount = 20;

    try {
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
            <div className="grid grid-cols-4 gap-4 p-4">
                {players.map((player) => (
                    <div
                        key={player}
                        className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition"
                    >
                        {player}
                    </div>
                ))}
            </div>
        );
    } catch (error) {
        console.error("Error fetching players:", error);
        return <div>Error loading players</div>;
    }
}
