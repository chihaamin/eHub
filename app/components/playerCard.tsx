import { Suspense } from "react";
import Image from "next/image";
import { Player } from "../players/players";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { BoosterIcon } from "./boosterIcon";
import { cn } from "../lib/utils";
import { conditionColors, scaleBy20 } from "../players/[id]/utils";

export default function PlayerCard({ Player }: { Player: Player | undefined }) {
    const iconSize = 36;

    return (
        <section
            id="player-card"
            className="w-full md:w-3/4 lg:w-1/2 grid grid-cols-4 grid-rows-4 gap-4 p-4 justify-self-center "
        >
            <h1 className="col-span-3 gap-2 text-[clamp(0.75rem,7cqw,2rem)] font-bold font-['Inter'] whitespace-nowrap p-4">
                {Player?.Name}
            </h1>

            <h2
                className={`text-4xl font-bold font-['Inter'] whitespace-nowrap p-4 place-self-end justify-self-center ${conditionColors(scaleBy20(Number(Player?.Overall)))}`}
            >
                {Player?.Overall}
            </h2>
            <div className="row-span-3 flex flex-col justify-evenly items-center gap-4">
                <div className="">
                    <Suspense>
                        <Image
                            src={`https://efootballhub.net/images/efootball23/nationality/${Player?.Country}.png`}
                            alt="country"
                            width={iconSize}
                            height={iconSize}
                            loading="eager"
                        />
                    </Suspense>
                </div>
                <div className="">
                    <Suspense>
                        <Image
                            src={`https://efootballhub.net/images/efootball23/emblem/e_${String(Player?.Club).padStart(6, "0")}.png`}
                            alt="team"
                            width={iconSize}
                            height={iconSize}
                            loading="eager"
                        />
                    </Suspense>
                </div>
                <div className="">
                    <Suspense>
                        <Image
                            src={`https://efootballhub.net/images/efootball23/leagues/emb_${String(Player?.LeagueID).padStart(4, "0")}.png`}
                            alt="leagues"
                            width={iconSize}
                            height={iconSize}
                            loading="eager"
                        />
                    </Suspense>
                </div>

                <div className="flex justify-between items-center gap-2 flex-col">
                    <Suspense>
                        <Image
                            src={`https://efootballhub.net/images/icons/CmnIconPointSmall_Gp.png`}
                            alt="GP"
                            width={iconSize}
                            height={iconSize}
                            loading="eager"
                        />
                    </Suspense>
                    <div className="font-medium">{Player?.MarketValue}</div>
                </div>
            </div>
            <Suspense fallback={<div>Loading image...</div>}>
                <Image
                    src={`https://efootballhub.net/images/efootball24/players/${Player?.PlayerID}_l.webp`}
                    alt={`Player ${Player?.Name}`}
                    height={200}
                    width={200}
                    className="row-span-3 col-span-2 object-fill place-self-center h-auto"
                    loading="eager"
                />
            </Suspense>

            <div className="row-span-3 flex flex-col justify-evenly items-center gap-4 text-sm font-bold">
                <div className="bg-accent-foreground/10 border-2 max-w-2/3 md:max-w-2/4  w-full  rounded-md flex flex-col justify-center items-center">
                    <div className="font-light text-xs">Height</div>
                    <div className="">{Player?.Height}cm</div>
                </div>
                <div className="bg-accent-foreground/10 border-2 max-w-2/3 md:max-w-2/4  w-full  rounded-md flex flex-col justify-center items-center">
                    <div className="font-light text-xs">Weight</div>
                    <div className="">{Player?.Weight}kg</div>
                </div>
                <div className="bg-accent-foreground/10 border-2 max-w-2/3 md:max-w-2/4  w-full  rounded-md flex flex-col justify-center items-center">
                    <div className="font-light text-xs">Age</div>
                    <div className="">{Player?.Age}</div>
                </div>
                <div className="bg-accent-foreground/10 border-2 max-w-2/3 md:max-w-2/4  w-full  rounded-md flex flex-col justify-center items-center">
                    <div className="font-light text-xs">Foot</div>
                    <div className="">{Player?.StrongerFoot == 1 ? "Right" : "Left"}</div>
                </div>
                <div className="bg-accent-foreground/10 border-2 max-w-2/3 md:max-w-2/4  w-full  rounded-md flex flex-col justify-center items-center">
                    <div className="font-light text-xs">Condition</div>
                    <div className={conditionColors(Player?.Condition)}>
                        {conditionToLetter(Player?.Condition)}
                    </div>
                </div>
            </div>
            <div className="col-span-4 grid grid-cols-4 justify-items-center items-center">
                <Booster data={BoosterOptions} />
                <BoosterIcon className="fill-cyan-300 border-foreground dark:fill-cyan-300" />

                <BoosterIcon />
                <Booster data={BoosterOptions} />
            </div>
        </section>
    );
}

const Booster = ({
    data,
    className,
}: {
    data: BoosterOption[];
    className?: string;
}) => {
    return (
        <Select defaultValue="No booster">
            <SelectTrigger>
                <SelectValue placeholder="Booster" className={cn("w-45", className)} />
            </SelectTrigger>
            <SelectContent>
                {data.map((booster: BoosterOption) => (
                    <SelectItem key={booster.value} value={booster.value}>
                        {booster.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

interface BoosterOption {
    label: string;
    value: string;
}

const BoosterOptions = [
    { label: "No Booster", value: "No booster" },
    { label: "Booster 1", value: "booster1" },
    { label: "Booster 2", value: "booster2" },
    { label: "Booster 3", value: "booster3" },
];

const conditionToLetter = (condition: string | number | null | undefined) => {
    switch (Number(condition)) {
        case 0:
            return "E";
        case 1:
            return "D";
        case 2:
            return "C";
        case 3:
            return "B";
        case 4:
            return "A";
        default:
            return "E";
    }
};
