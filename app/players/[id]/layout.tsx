import { Button } from "@/app/components/ui/button";
import { Currency } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Player Details",
    description: "View detailed player statistics and information",
};

export default async function PlayerDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main className="h-screen">{children}</main>;
}
