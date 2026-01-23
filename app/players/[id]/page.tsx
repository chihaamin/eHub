/* 
this is the player page should be statically generated
at build time for all players in the database
and revalidated every 24 hours 
 */

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Currency } from "lucide-react";
import { Suspense } from "react";
import { Item } from "@/app/components/ui/item";

import { Player } from "../players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import PlayerCard from "@/app/components/playerCard";

export const revalidate = 86400; // revalidate every 24 hours

export async function generateStaticParams() {
    try {
        const filePath = path.join(process.cwd(), "mock", "player_export.csv");
        const csv = fs.readFileSync(filePath, "utf8");
        const parsed = Papa.parse(csv, {
            header: true,
            dynamicTyping: true,
        });

        const allPlayers = parsed.data as Player[];
        const playerIds = allPlayers.map((p) => p.PlayerID).filter(Boolean);
        console.log(`Generating static params for ${playerIds.length} players`);

        return playerIds.map((id) => ({ id: String(id) }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;


    // Use an absolute URL so build-time fetch works in Node
    const baseUrl =
        process.env["NEXT_PUBLIC_APP_URL"] ??
        (process.env["VERCEL_URL"]
            ? `https://${process.env["VERCEL_URL"]}`
            : "http://localhost:3000");

    const Player: Player | undefined = await fetch(
        `${baseUrl}/api/public/players/${id}`,
        {
            cache: "force-cache",
            next: { revalidate },
        },
    ).then((res) => res.json());

    return (
        <>
            <PlayerCard Player={Player} />


            <section className="grid grid-cols-2 grid-flow-row-dense gap-4">
                <StatsDisplayDemo Player={Player} />
            </section>
        </>
    );
}

const Attackingfields = [
    { label: "Offensive Awareness", key: "OffensiveAwareness" },
    { label: "Ball Control", key: "BallControl" },
    { label: "Dribbling", key: "Dribbling" },
    { label: "Tight Possession", key: "TightPossession" },
    { label: "Low Pass", key: "LowPass" },
    { label: "Lofted Pass", key: "LoftedPass" },
    { label: "Finishing", key: "Finishing" },
    { label: "Heading", key: "Heading" },
    { label: "Place Kicking", key: "PlaceKicking" },
    { label: "Curl", key: "Curl" },
    { label: "Stamina", key: "Stamina" },
];

const fieldColor = (value: number) => {
    switch (true) {
        case value > 30 && value <= 60:
            return "bg-red-400!";
        case value <= 80 && value > 60:
            return "bg-yellow-500!";
        case value <= 90 && value > 80:
            return "bg-green-400!";
        case value > 90:
            return "bg-cyan-400!";
        default:
            return "bg-red-400";
    }
};



function StatsDisplayDemo({ Player }: { Player: Player | undefined }) {
    return (
        <div className="p-4">
            <h2 className="text-xl font-black capitalize">attacking</h2>
            <ul>
                {Attackingfields.map((field, index) => (
                    <li key={index}>
                        <Item
                            variant={index % 2 === 0 ? "muted" : "default"}
                            size="xs"
                            asChild
                            className="p-2"
                        >
                            <div className="flex justify-between items-center w-full flex-nowrap">
                                <div>
                                    <p className="font-bold text-xs md:text-base">
                                        {field.label}
                                    </p>
                                </div>
                                <div
                                    className={`bg-red-400 ${fieldColor(Player?.[field.key as keyof Player] as number)} px-2 py-1 rounded-sm`}
                                >
                                    <p className="font-bold text-xs md:text-base">
                                        {Player?.[field.key as keyof Player]}
                                    </p>
                                </div>
                            </div>
                        </Item>
                    </li>
                ))}
            </ul>
        </div>
    );
}
