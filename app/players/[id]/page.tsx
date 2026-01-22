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
import PlayerImage from "../../../public/player.png";
import GP from "../../../public/GP.png";
import ef_point from "../../../public/image-26.png";
import league from "../../../public/emb_0113.png";
import club from "../../../public/e_000177.png";
import country from "../../../public/204.png";
import { Player } from "../players";
import Papa from "papaparse";
import fs from "fs";
import path from "path";

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

export default async function Page({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <>
            <h1 className="text-4xl p-4">player name + ID : {id}</h1>

            <section
                id="player-card"
                className="w-full self-stretch h-64 px-7 py-2 inline-flex justify-between items-center overflow-hidden"
            >
                <div className="w-20 h-60 p-2.5 inline-flex flex-col justify-between items-center overflow-hidden">
                    <div className="p-1.5 bg-muted/50 rounded outline -outline-offset-1 outline-foreground/50 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                        <Suspense>
                            <Image className="w-9 h-9 relative" src={country} alt="country" />
                        </Suspense>
                    </div>
                    <div className="p-1.5 bg-muted/50 rounded outline -outline-offset-1 outline-foreground/50 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                        <Suspense>
                            <Image className="w-9 h-9 relative" src={club} alt="club" />
                        </Suspense>
                    </div>
                    <div className="p-1.5 bg-muted/50 rounded outline -outline-offset-1 outline-foreground/50 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                        <Suspense>
                            <Image className="w-9 h-9 relative" src={league} alt="league" />
                        </Suspense>
                    </div>
                    <div className="p-1.5 bg-muted/50 rounded outline -outline-offset-1 outline-foreground/50 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                        <Suspense>
                            <Image
                                className="w-9 h-9 relative"
                                src={ef_point}
                                alt="ef_point"
                            />
                        </Suspense>
                    </div>
                </div>
                <Suspense>
                    <Image
                        className="w-40 h-56 relative"
                        src={PlayerImage}
                        alt="Player Image"
                        width={162}
                        height={229}
                    />
                </Suspense>

                <div className="h-56 py-1 inline-flex flex-col justify-between items-center overflow-hidden">
                    <div className="w-20 px-0.75 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 flex flex-col justify-center items-center overflow-hidden">
                        <div className="self-stretch h-3.5 text-center justify-center text-[8px] font-normal font-['Inter']">
                            Height
                        </div>
                        <div className="self-stretch h-4 text-center justify-center text-xs font-extrabold font-['Inter']">
                            180cm
                        </div>
                    </div>
                    <div className="w-20 px-0.75 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 flex flex-col justify-center items-center overflow-hidden">
                        <div className="self-stretch h-3.5 text-center justify-center text-[8px] font-normal font-['Inter']">
                            Weight
                        </div>
                        <div className="self-stretch h-4 text-center justify-center text-xs font-extrabold font-['Inter']">
                            81kg
                        </div>
                    </div>
                    <div className="w-20 px-0.75 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 flex flex-col justify-center items-center overflow-hidden">
                        <div className="self-stretch h-3.5 text-center justify-center text-[8px] font-normal font-['Inter']">
                            Age
                        </div>
                        <div className="self-stretch h-4 text-center justify-center text-xs font-extrabold font-['Inter']">
                            30
                        </div>
                    </div>
                    <div className="w-20 px-0.75 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 flex flex-col justify-center items-center overflow-hidden">
                        <div className="self-stretch h-3.5 text-center justify-center text-[8px] font-normal font-['Inter']">
                            Foot
                        </div>
                        <div className="self-stretch h-4 text-center justify-center text-xs font-extrabold font-['Inter']">
                            Right
                        </div>
                    </div>
                    <div className="w-20 px-0.75 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 flex flex-col justify-center items-center overflow-hidden">
                        <div className="self-stretch h-3.5 text-center justify-center text-[8px] font-normal font-['Inter']">
                            Condition
                        </div>
                        <div className="self-stretch h-4 text-center justify-center text-cyan-400 text-xs font-extrabold font-['Inter']">
                            A
                        </div>
                    </div>
                    <div className="w-20 bg-muted/50 rounded-[3px] outline -outline-offset-1 outline-foreground/50 inline-flex justify-center items-center overflow-hidden">
                        <Image
                            className="w-4 h-4 relative"
                            src={GP}
                            alt="GP"
                            width={18}
                            height={18}
                        />
                        <div className="flex-1 text-center justify-center text-yellow-400 text-xs font-extrabold font-['Inter']">
                            1,800,000
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex gap-2 items-center justify-center p-2">
                <Button>booster1-btn</Button>
                <Currency />
                <Currency />
                <Button>booster2-btn</Button>
            </section>
            <section className="grid grid-cols-2 grid-flow-row-dense gap-4">
                <div>
                    <h2>attacking</h2>
                    <ul>
                        {Object.entries(templateData.attributes.attacking).map(
                            ([name, value], index) => (
                                <li key={index}>
                                    <Item
                                        variant={index % 2 === 0 ? "muted" : "default"}
                                        size="xs"
                                        asChild
                                        className="p-2"
                                    >
                                        <div className="flex justify-between items-center w-full flex-nowrap">
                                            <div>
                                                <p className="font-bold text-xs md:text-base">{name}</p>
                                            </div>
                                            <div
                                                className={`bg-red-400 ${value > 90 ? "bg-cyan-400!" : ""
                                                    } ${value <= 90 && value > 60 ? "bg-emerald-500!" : ""
                                                    } px-2 py-1 rounded-sm`}
                                            >
                                                <p className="font-bold text-xs md:text-base">
                                                    {value}
                                                </p>
                                            </div>
                                        </div>
                                    </Item>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
                <div>
                    <h2>attacking</h2>
                    <ul>
                        {Object.entries(templateData.attributes.attacking).map(
                            ([name, value], index) => (
                                <li key={index}>
                                    <Item
                                        variant={index % 2 === 0 ? "muted" : "default"}
                                        size="xs"
                                        asChild
                                        className="p-2"
                                    >
                                        <div className="flex justify-between items-center w-full flex-nowrap">
                                            <div>
                                                <p className="font-bold text-xs md:text-base">{name}</p>
                                            </div>
                                            <div
                                                className={`bg-red-400 ${value > 90 ? "bg-cyan-400!" : ""
                                                    } ${value <= 90 && value > 60 ? "bg-emerald-500!" : ""
                                                    } px-2 py-1 rounded-sm`}
                                            >
                                                <p className="font-bold text-xs md:text-base">
                                                    {value}
                                                </p>
                                            </div>
                                        </div>
                                    </Item>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
                <div>
                    <h2>attacking</h2>
                    <ul>
                        {Object.entries(templateData.attributes.attacking).map(
                            ([name, value], index) => (
                                <li key={index}>
                                    <Item
                                        variant={index % 2 === 0 ? "muted" : "default"}
                                        size="xs"
                                        asChild
                                        className="p-2"
                                    >
                                        <div className="flex justify-between items-center w-full flex-nowrap">
                                            <div>
                                                <p className="font-bold text-xs md:text-base">{name}</p>
                                            </div>
                                            <div
                                                className={`bg-red-400 ${value > 90 ? "bg-cyan-400!" : ""
                                                    } ${value <= 90 && value > 60 ? "bg-emerald-500!" : ""
                                                    } px-2 py-1 rounded-sm`}
                                            >
                                                <p className="font-bold text-xs md:text-base">
                                                    {value}
                                                </p>
                                            </div>
                                        </div>
                                    </Item>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </section>
        </>
    );
}

const templateData = {
    name: "Omar Richards",
    id: "123456",
    nation: "England",
    league: "Premier League",
    locale: "Fulham FC",
    price: "1,500,000",
    height: "183 cm",
    weight: "75 kg",
    age: "24",
    foot: "Left",
    condition: "A",
    boosters: ["Booster 1", "Booster 2"],
    attributes: {
        attacking: {
            "Attacking Awareness": 110,
            "Ball Control": 70,
            Dribbling: 40,
            "Tight Possession": 107,
            "Low Pass": 90,
            "Lofted Pass": 103,
            Finishing: 82,
            Heading: 56,
            "Place Kicking": 100,
            Curl: 60,
        },
        skills: {
            "double Touch": true,
            "flick up": true,
            "ball roll": false,
            "step over": true,
        },
    },
};
