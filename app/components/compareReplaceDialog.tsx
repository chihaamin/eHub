"use client";

import { useCompareStore } from "@/app/compare/compare-store";
import { Button } from "@/app/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";

export function CompareReplaceDialog() {
    const { players, pendingPlayer, setPendingPlayer, replacePlayer } =
        useCompareStore();

    const handleReplacePlayer = (playerIdToReplace: string | number | null) => {
        replacePlayer(playerIdToReplace);
    };

    const handleCancelReplace = () => {
        setPendingPlayer(null);
    };

    return (
        <Dialog
            open={!!pendingPlayer}
            onOpenChange={(open) => !open && handleCancelReplace()}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Replace Player</DialogTitle>
                    <DialogDescription>
                        You can only compare 2 players at a time. Select which player to
                        replace with{" "}
                        <span className="font-semibold text-foreground">
                            {pendingPlayer?.Name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-4">
                    {players.map((p) => (
                        <Button
                            key={String(p.id)}
                            variant="outline"
                            className="justify-start h-auto py-3"
                            onClick={() => handleReplacePlayer(p.id)}
                        >
                            <div className="flex flex-col items-start">
                                <span className="font-semibold">{p.Name}</span>

                                <span className="text-xs text-muted-foreground">
                                    {p.JapName}
                                </span>
                            </div>
                            {p.Overall && (
                                <span className="ml-auto text-sm font-medium text-muted-foreground">
                                    OVR {p.Overall}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={handleCancelReplace}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
