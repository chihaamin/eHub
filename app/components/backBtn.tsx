"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackBtn() {
    const router = useRouter();

    return (
        <Button variant="ghost" size="icon-lg" onClick={() => router.back()}>
            <ChevronLeft className="size-5!" />
        </Button>
    );
}
