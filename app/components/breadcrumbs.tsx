'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Player } from "@/app/players/players";

interface BreadcrumbSegment {
    label: string;
    href: string;
    playerId?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [];

    // Always add home
    breadcrumbs.push({ label: "Home", href: "/" });

    let currentPath = "";
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // Check if previous segment is "players" and current segment is a number (player ID)
        if (index > 0 && segments[index - 1] === "players" && !isNaN(Number(segment))) {
            breadcrumbs.push({ label: "Loading...", href: currentPath, playerId: segment });
            return;
        }

        // Skip if this is a numeric segment that follows "players" (already handled above)
        if (index > 0 && segments[index - 1] === "players" && !isNaN(Number(segment))) {
            return;
        }

        // Format label: "players" -> "Players", "admin-settings" -> "Admin Settings"
        const label = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        breadcrumbs.push({ label, href: currentPath });
    });

    return breadcrumbs;
}

function PlayerBreadcrumbItem({ segment, isLast }: { segment: BreadcrumbSegment; isLast: boolean }) {
    const [playerName, setPlayerName] = useState<string>(segment.label);

    useEffect(() => {
        if (segment.playerId) {
            const fetchPlayerName = async () => {
                try {
                    const response = await fetch(`/api/public/players/${segment.playerId}`);
                    if (response.ok) {
                        const player: Player = await response.json();
                        setPlayerName(player.Name as string);
                    }
                } catch (error) {
                    console.error("Failed to fetch player name:", error);
                }
            };

            fetchPlayerName();
        }
    }, [segment.playerId]);

    return (
        <BreadcrumbItem>
            {isLast ? (
                <BreadcrumbPage className="font-medium">{playerName}</BreadcrumbPage>
            ) : (
                <BreadcrumbLink asChild>
                    <Link href={segment.href}>
                        {playerName}
                    </Link>
                </BreadcrumbLink>
            )}
        </BreadcrumbItem>
    );
}

export default function BreadcrumbNav() {
    const pathname = usePathname();
    const breadcrumbs = generateBreadcrumbs(pathname);

    // Don't show breadcrumb on home page
    if (pathname === "/" || breadcrumbs.length <= 1) {
        return null;
    }

    return (
        <Breadcrumb className="my-4">
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div key={breadcrumb.href} className="flex items-center gap-1.5">
                            {breadcrumb.playerId ? (
                                <PlayerBreadcrumbItem segment={breadcrumb} isLast={isLast} />
                            ) : (
                                <BreadcrumbItem>
                                    {isLast ? (
                                        <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink asChild>
                                            <Link href={breadcrumb.href}>
                                                {breadcrumb.label}
                                            </Link>
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            )}
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
