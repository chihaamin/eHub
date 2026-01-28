import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextResponse } from "next/server";
import { Player } from "@/app/players/players";

interface FilterRange {
  min: number | null;
  max: number | null;
}

interface SearchFilters {
  overall?: FilterRange;
  offensiveAwareness?: FilterRange;
  ballControl?: FilterRange;
  dribbling?: FilterRange;
  finishing?: FilterRange;
  lowPass?: FilterRange;
  loftedPass?: FilterRange;
  defensiveAwareness?: FilterRange;
  ballWinning?: FilterRange;
  speed?: FilterRange;
  acceleration?: FilterRange;
  physicalContact?: FilterRange;
  stamina?: FilterRange;
  position?: string | null;
  strongerFoot?: string | null;
}

// Map filter keys to player properties
const filterKeyToPlayerKey: Record<string, keyof Player> = {
  overall: "Overall",
  offensiveAwareness: "OffensiveAwareness",
  ballControl: "BallControl",
  dribbling: "Dribbling",
  finishing: "Finishing",
  lowPass: "LowPass",
  loftedPass: "LoftedPass",
  defensiveAwareness: "DefensiveAwareness",
  ballWinning: "BallWinning",
  speed: "Speed",
  acceleration: "Acceleration",
  physicalContact: "PhysicalContact",
  stamina: "Stamina",
};

function parseFilters(url: URL): SearchFilters {
  const filters: SearchFilters = {};

  // Parse range filters
  const rangeKeys = [
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
    const minParam = url.searchParams.get(`${key}Min`);
    const maxParam = url.searchParams.get(`${key}Max`);
    if (minParam || maxParam) {
      filters[key as keyof SearchFilters] = {
        min: minParam ? parseInt(minParam) : null,
        max: maxParam ? parseInt(maxParam) : null,
      } as FilterRange;
    }
  });

  // Parse string filters
  const position = url.searchParams.get("position");
  if (position) filters.position = position;

  const strongerFoot = url.searchParams.get("strongerFoot");
  if (strongerFoot) filters.strongerFoot = strongerFoot;

  return filters;
}

function applyFilters(players: Player[], filters: SearchFilters): Player[] {
  return players.filter((player) => {
    // Check range filters
    for (const [filterKey, range] of Object.entries(filters)) {
      if (filterKey === "position" || filterKey === "strongerFoot") continue;

      const playerKey = filterKeyToPlayerKey[filterKey];
      if (!playerKey || !range) continue;

      const value = Number(player[playerKey]);
      const { min, max } = range as FilterRange;

      if (min !== null && value < min) return false;
      if (max !== null && value > max) return false;
    }

    // Check position filter
    if (filters.position) {
      const positionKey = filters.position as keyof Player;
      const positionValue = Number(player[positionKey]);
      // Position values: typically 0 = cannot play, higher = can play
      if (!positionValue || positionValue <= 0) return false;
    }

    // Check stronger foot filter (0 = Left, 1 = Right)
    if (filters.strongerFoot) {
      const playerFoot = String(player.StrongerFoot);
      if (playerFoot !== filters.strongerFoot) return false;
    }

    return true;
  });
}

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
  const filters = parseFilters(url);
  const hasFilters = Object.keys(filters).length > 0;

  const filePath = path.join(process.cwd(), "mock", "player_export.csv");
  const csv = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
  });

  let players = parsed.data as Player[];

  // Apply filters first
  if (hasFilters) {
    players = applyFilters(players, filters);
  }

  // If no query, return paginated list of filtered players
  if (!query || query === "_all") {
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
