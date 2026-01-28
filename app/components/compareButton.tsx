"use client";

import { useCompareStore, ComparePlayer } from "@/app/compare/compare-store";
import { Button } from "@/app/components/ui/button";
import { CompareReplaceDialog } from "@/app/components/compareReplaceDialog";
import { GitCompareArrows, Check } from "lucide-react";

interface CompareButtonProps {
    player: ComparePlayer;
    className?: string;
}

export default function CompareButton({ player, className }: CompareButtonProps) {
    const { addPlayer, removePlayer, isInCompare } = useCompareStore();
    const inCompare = isInCompare(player.id);

    const handleToggleCompare = () => {
        if (player.id == null) return;

        if (inCompare) {
            removePlayer(player.id);
        } else {
            addPlayer(player);
        }
    };

    return (
        <>
            <Button
                variant={inCompare ? "secondary" : "outline"}
                onClick={handleToggleCompare}
                className={className}
            >
                {inCompare ? (
                    <>
                        <Check className="size-4" />
                        Added to Compare
                    </>
                ) : (
                    <>
                        <GitCompareArrows className="size-4" />
                        Compare
                    </>
                )}
            </Button>

            <CompareReplaceDialog />
        </>
    );
}
