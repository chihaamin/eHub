"use client"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";


export function ModeToggle({ ...props }) {
    const { setTheme, resolvedTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="rounded-full"
            {...props}
        >
            {/* BOTH icons always rendered */}
            <Moon className="hidden dark:block" />
            <Sun className="block dark:hidden" />
        </Button>
    );
}