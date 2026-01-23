/* 
this is the player page should be statically generated
at build time for all players in the database
and revalidated every 24 hours 
 */

import { Item } from "@/app/components/ui/item";

import { Player } from "../players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import PlayerCard from "@/app/components/playerCard";
import BackBtn from "@/app/components/backBtn";
import {
    Athleticismfields,
    Attackingfields,
    Defendingfields,
    fieldColor,
} from "./utils";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";

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
            <div className="flex justify-start items-center gap-2 mb-4">
                <BackBtn />
            </div>
            <PlayerCard Player={Player} />

            <Drawer>
                <section className="h-32 bg-muted rounded-md">
                    <DrawerTrigger>
                        <h2 className="text-xl font-semibold">Manager</h2>
                    </DrawerTrigger>
                </section>
                <DrawerContent className="h-6/12 bg-background/50 backdrop-blur-md shadow-md">
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4">
                <StatsDisplayDemo
                    Title="Attacking"
                    Player={Player}
                    fields={Attackingfields}
                />
                <StatsDisplayDemo
                    Title="Defending"
                    Player={Player}
                    fields={Defendingfields}
                />
                <StatsDisplayDemo
                    Title="Athleticism"
                    Player={Player}
                    fields={Athleticismfields}
                />
            </section>
        </>
    );
}

function StatsDisplayDemo({
    Title,
    Player,
    fields,
}: {
    Title: string;
    Player: Player | undefined;
    fields?: { label: string; key: string }[];
}) {
    return (
        <div className="p-4">
            <h2 className="text-2xl py-4 font-black capitalize">{Title}</h2>
            <ul>
                {fields?.map((field, index) => (
                    <li key={index}>
                        <Item
                            variant={index % 2 === 0 ? "muted" : "default"}
                            size="xs"
                            asChild
                            className="p-2"
                        >
                            <div className="flex justify-between items-center mobile:flex-nowrap">
                                <div>
                                    <p className="font-light text-sm font-[inter] md:text-base">
                                        {field.label}
                                    </p>
                                </div>
                                <div
                                    className={`bg-red-400 ${fieldColor(Player?.[field.key as keyof Player] as number)} px-2 py-1 rounded-sm`}
                                >
                                    <p className="font-bold text-sm md:text-base">
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
