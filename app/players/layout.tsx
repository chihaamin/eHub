import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Players",
    description: "Browse all elite football players",
};

export default function PlayersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
