import { Player } from "@/app/players/players";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const playersAmount = parseInt(searchParams.get("players_amount") || "20");

    console.log(`Fetching ${playersAmount} players`);

    const filePath = path.join(process.cwd(), "mock", "player_export.csv");
    const csv = fs.readFileSync(filePath, "utf8");
    const parsed = Papa.parse(csv, {
      header: true,
      dynamicTyping: true,
    });

    const allPlayers = parsed.data as Player[];

    // If playersAmount is -1, return all player IDs
    const playerIdsToReturn =
      playersAmount === -1
        ? allPlayers.map((p) => p.PlayerID)
        : allPlayers.slice(0, playersAmount).map((p) => p.PlayerID);

    if (!playerIdsToReturn || playerIdsToReturn.length === 0) {
      return NextResponse.json({ error: "Players not found" }, { status: 404 });
    }

    console.log(`Returning ${playerIdsToReturn.length} player IDs`);
    return NextResponse.json({ players: playerIdsToReturn });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 },
    );
  }
}
