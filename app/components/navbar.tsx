/* eslint-disable @next/next/no-html-link-for-pages */

import { Menu, X } from "lucide-react";
import { ModeToggle } from "./themeToggle";
import { SearchCommand } from "./Search-components/search-form";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "./ui/drawer";
export default function Navbar({
    props,
}: {
    props?: React.ComponentProps<"header">;
}) {
    return (
        <header
            {...props}
            className="rounded-b-md sticky top-0 bg-background/90 backdrop-blur-md z-10 shadow-md dark:shadow-white/5 border-b"
        >
            <nav
                aria-label="Primary navigation"
                className="flex gap-2 justify-between p-4 items-center"
            >
                <NavbarMobile />
                <a href="/">
                    <p className="font-bold text-2xl">eFootballHub</p>
                </a>
                <ul className="gap-2 justify-evenly w-1/2 hidden md:flex">
                    <li>
                        <a href="/players">
                            <p className="font-medium">Players</p>
                        </a>
                    </li>
                    <li>
                        <a href="/compare">
                            <p className="font-medium">Compare</p>
                        </a>
                    </li>
                    <li>
                        <a href="/search">
                            <p className="font-medium">Search</p>
                        </a>
                    </li>
                </ul>
                <div className="flex items-center gap-2">
                    <SearchCommand />
                    <ModeToggle />
                </div>
            </nav>
        </header>
    );
}

function NavbarMobile() {
    return (
        <Drawer modal direction="left">
            <DrawerTrigger className="md:hidden">
                <Menu />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex w-full justify-between items-center">
                        <a href="/">
                            <p className="font-bold text-2xl">eFootballHub</p>
                        </a>
                        <DrawerClose>
                            <X />
                        </DrawerClose>
                    </DrawerTitle>
                </DrawerHeader>

                <ul className="gap-2 justify-evenly w-1/2 md:hidden flex flex-col p-4 font-medium text-2xl">
                    <li>
                        <a href="/players">
                            <p>Players</p>
                        </a>
                    </li>
                    <li>
                        <a href="/compare">
                            <p>Compare</p>
                        </a>
                    </li>
                    <li>
                        <a href="/search">
                            <p>Search</p>
                        </a>
                    </li>
                </ul>
                <DrawerFooter>Register / login</DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
