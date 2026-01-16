/* 
this is the player page should be statically generated
at build time for all players in the database
and revalidated every 24 hours 
 */

import Image from "next/image";
import PlayerImage from "../../../public/Omar.webp";
import { Button } from "@/app/components/ui/button";
import { BadgeCheckIcon, ChevronRightIcon, Currency } from "lucide-react";
import { Suspense } from "react";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "@/app/components/ui/item";

export const revalidate = 86400; // revalidate every 24 hours

export async function generateStaticParams() {
    // this should return a list of all player ids from the database
    return [{ id: "1" }, { id: "2" }];
}

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <>
            <h1 className="text-4xl p-4">player name + ID : {id}</h1>
            <section id="player-card" className="grid grid-cols-3 grid-rows-1 gap-2">
                <div className="flex flex-col justify-around items-center">
                    <div>nation</div>
                    <div>league</div>
                    <div>locale</div>
                    <div>price</div>
                </div>
                <Suspense fallback={<p>Loading..</p>}>
                    <Image
                        src={PlayerImage}
                        alt="Player Image"
                        quality={40}
                        priority={false}
                        width={150}
                        loading="lazy"
                    />
                </Suspense>
                <div className="flex flex-col justify-around items-center">
                    <div>height</div>
                    <div>weight</div>
                    <div>age</div>
                    <div>foot</div>
                    <div>condition</div>
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
                            )
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
                            )
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
                            )
                        )}
                    </ul>
                </div>
            </section>
        </ >
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
