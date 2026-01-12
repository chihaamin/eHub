import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Player Details",
    description: "View detailed player statistics and information",
};

export default function PlayerDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="h-screen">
            {children}
        </main>
    );
}
