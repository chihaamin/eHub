import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const searchParams = request.nextUrl.searchParams;
  const playersAmount = parseInt(searchParams.get("players_amount") || "20");
  const { id } = await params;
  console.log(`Fetching player with ID: ${id}`);
  console.log(`Fetching ${playersAmount} players`);
  // TODO: Replace with actual database query
  // This is mock data for now
  const mockPlayers = Array.from({ length: playersAmount }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
    position: ["Forward", "Midfielder", "Defender", "Goalkeeper"][i % 4],
    rating: Math.floor(Math.random() * 40) + 60,
  }));

  return NextResponse.json({ players: mockPlayers });
}
