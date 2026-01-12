/* eslint-disable @next/next/no-html-link-for-pages */

import { ModeToggle } from "./themeToggle";

export default function Navbar({
    props,
}: {
    props?: React.ComponentProps<"header">;
}) {
    return (
        <header {...props}>
            <nav
                aria-label="Primary navigation"
                className="flex gap-2 justify-between p-4"
            >
                <a href="/">Brand</a>
                <ul className="flex gap-2 justify-evenly w-1/2 ">
                    <li>
                        <a href="/players">Players</a>
                    </li>
                    <li>
                        <a href="/compare">Compare</a>
                    </li>
                    <li>
                        <a href="/players/1">Search</a>
                    </li>
                </ul>
                <span>
                    <ModeToggle />
                </span>
            </nav>
        </header>
    );
}
