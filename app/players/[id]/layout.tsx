import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Player Details",
    description: "View detailed player statistics and information",
};

export default async function PlayerDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="h-max lg:container lg:mx-auto lg:p-2">{children}</main>;
}
