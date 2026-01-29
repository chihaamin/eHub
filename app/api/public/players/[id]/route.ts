import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { NextResponse } from "next/server";
import { Player } from "@/app/players/players";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), "mock", "player_export.csv");
  const csv = fs.readFileSync(filePath, "utf8");

  const parsed = Papa.parse(csv, {
    header: true,
    dynamicTyping: true,
  });
  const players = parsed.data as Player[];
  // Find the one player with matching id
  const player = players.find((p) => Number(p.PlayerID) === Number(id));
  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({ ...player });
}
