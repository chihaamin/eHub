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

  const query = String(name || "").trim();

  const filePath = path.join(process.cwd(), "mock", "player_export.csv");
  const csv = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
  });

  const players = parsed.data as Player[];

  if (!query) {
    return NextResponse.json([]);
  }

  const q = query.toLocaleLowerCase();

  const matches = players
    .filter(
      (p) =>
        String(p.Name).toLocaleLowerCase().includes(q) ||
        String(p.AccentedName).toLocaleLowerCase().includes(q) ||
        String(p.JapName).toLocaleLowerCase().includes(q),
    )
    .slice(0, 12)
    .map((p) => ({
      id: p.PlayerID,
      Name: String(p.Name),
      AccentedName: String(p.AccentedName),
      JapName: String(p.JapName),
      Overall: p.Overall,
    }));
  console.log(matches);
  return NextResponse.json(matches);
}
