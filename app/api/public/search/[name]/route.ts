import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextResponse } from "next/server";
import { Player } from "@/app/players/players";

// Returns up to N matching players (name + id) for autocomplete
export async function GET(
  request: Request,
  { params }: { params: { name: string } },
) {
  const { name } = await params;
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const query = String(name || "").trim();

  const filePath = path.join(process.cwd(), "mock", "player_export.csv");
  const csv = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
  });

  const players = parsed.data as Player[];

  // If no query, return paginated list of all players
  if (!query) {
    const paginatedPlayers = players.slice(offset, offset + limit).map((p) => ({
      id: p.PlayerID,
      Name: String(p.Name),
      AccentedName: String(p.AccentedName),
      JapName: String(p.JapName),
      Overall: p.Overall,
    }));

    return NextResponse.json({
      players: paginatedPlayers,
      total: players.length,
      hasMore: offset + limit < players.length,
    });
  }

  const q = query.toLocaleLowerCase();

  const allMatches = players.filter(
    (p) =>
      String(p.Name).toLocaleLowerCase().includes(q) ||
      String(p.AccentedName).toLocaleLowerCase().includes(q) ||
      String(p.JapName).toLocaleLowerCase().includes(q),
  );

  const paginatedMatches = allMatches
    .slice(offset, offset + limit)
    .map((p) => ({
      id: p.PlayerID,
      Name: String(p.Name),
      AccentedName: String(p.AccentedName),
      JapName: String(p.JapName),
      Overall: p.Overall,
    }));

  return NextResponse.json({
    players: paginatedMatches,
    total: allMatches.length,
    hasMore: offset + limit < allMatches.length,
  });
}
