/* 
this is the player page should be statically generated
at build time for all players in the database
and revalidated every 24 hours 
 */

import Image from "next/image";
import PlayerImage from "../../../public/Omar.webp";
import { Button } from "@/app/components/ui/button";
import { Currency } from "lucide-react";



export const revalidate = 86400 // revalidate every 24 hours

export async function generateStaticParams() {
    // this should return a list of all player ids from the database
    return [{ id: '1' }, { id: '2' }];
}


export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <>
            <h1 className="text-4xl p-4">player name + ID : {id}</h1>
            <section id="player-card" className="grid grid-cols-3 grid-rows-1 gap-2">
                <div>player nation</div>
                <Image
                    src={PlayerImage}
                    alt="Player Image"
                    quality={40}
                    priority={false}
                    loading="lazy"
                    placeholder="empty"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div>player physical</div>
            </section>
            <section className="flex gap-2 items-center justify-center p-2">
                <Button>booster1-btn</Button>
                <Currency />
                <Currency />
                <Button>booster2-btn</Button>
            </section>
            <section className="grid grid-cols-2 grid-flow-row-dense gap-2 p-2">
                <div>
                    <h2>attacking</h2>
                </div>
                <div>
                    <h2>attacking</h2>
                </div>
            </section>
        </>
    );
}
