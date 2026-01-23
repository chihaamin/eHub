"use client";

import { useState, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/app/components/ui/input-group";
import { ChevronRightIcon, Search } from "lucide-react";

import { cn } from "@/app/lib/utils";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemMedia,
    ItemTitle,
} from "../ui/item";
import Link from "next/link";
import { SearchFilter } from "./search-filter-btn";
import { useDebounce } from "hooks/use-debounce";

interface SearchResult {
    id: string | number | null;
    Name: string;
    AccentedName?: string;
    JapName?: string;
    Overall?: string | number | null;
}

const COLORS = {
    TOP: "hsl(203, 92%, 48%)",
} as const;

// CVA Variants for SearchForm sizes
const searchFormVariants = cva("relative rounded-md w-full", {
    variants: {
        size: {
            sm: "max-w-xs",
            md: "max-w-sm md:max-w-md",
            lg: "max-w-md md:max-w-lg lg:max-w-2xl",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

// CVA Variants for result text sizes
const resultTextVariants = cva("font-black", {
    variants: {
        size: {
            sm: "text-xs",
            md: "text-sm",
            lg: "text-base",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

// CVA Variants for item title sizes
const itemTitleVariants = cva("text-nowrap font-semibold", {
    variants: {
        size: {
            sm: "text-xs md:text-xs",
            md: "text-xs md:text-lg",
            lg: "text-sm md:text-xl",
        },
    },
    defaultVariants: {
        size: "md",
    },
});

const getOverallColor = (v?: string | number | null): string | undefined => {
    const n = Number(v ?? NaN);
    if (Number.isNaN(n)) return undefined;
    const clamped = Math.max(40, Math.min(100, n));
    if (clamped >= 90) return COLORS.TOP;
    const t = (clamped - 40) / 50;
    const hue = Math.round(t * 120);
    return `hsl(${hue}, 70%, 40%)`;
};

type SearchFormProps = VariantProps<typeof searchFormVariants>;

export function SearchForm({
    size = "md",
    withFilter = false,
}: SearchFormProps & { withFilter?: boolean }) {
    const [value, setValue] = useState("");
    const debounceSearch = useDebounce(value);
    const [player, setPlayer] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const isOpen = isFocused && player.length > 0 && debounceSearch.length > 0;

    useEffect(() => {
        if (!debounceSearch.trim()) {
            return;
        }

        fetch(`/api/public/search/${encodeURIComponent(debounceSearch)}`)
            .then((res) => res.json())
            .then((data) => {
                setPlayer(data ? data : []);
            })
            .catch((err) => {
                console.log("Error fetching search results:", err);
                setPlayer([]);
            });
    }, [debounceSearch]);

    return (
        <div
            ref={wrapperRef}
            className={cn(searchFormVariants({ size }))}
            role="search"
        >
            <InputGroup>
                <InputGroupInput
                    placeholder="Search player..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    id="player-search"
                    aria-label="Search player by name"
                    aria-expanded={isOpen}
                    aria-controls="search-results-list"
                    autoComplete="off"
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                {withFilter && (
                    <InputGroupAddon align="inline-end">
                        <SearchFilter />
                    </InputGroupAddon>
                )}
            </InputGroup>

            {isOpen && (
                <div
                    role="region"
                    aria-label="Search results"
                    id="search-results-list"
                    className="bg-background ring-foreground/30 absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl shadow-lg ring"
                >
                    <ul
                        className="no-scrollbar flex max-h-96 flex-col gap-2 overflow-y-auto p-2"
                        role="listbox"
                        aria-label="Search results list"
                    >
                        {player.map((p) => (
                            <li key={`player-${p.id}`} role="option" aria-selected="false">
                                <Item variant="outline" size="sm" asChild>
                                    <Link href={`/players/${p.id}`}>
                                        <ItemMedia>
                                            <p
                                                className={cn(resultTextVariants({ size }))}
                                                style={{
                                                    color: getOverallColor(p.Overall) || "inherit",
                                                }}
                                                aria-label={`Overall-rating:${p.Overall}`}
                                            >
                                                {p.Overall}
                                            </p>
                                        </ItemMedia>
                                        <ItemContent>
                                            <ItemTitle
                                                className={cn(
                                                    itemTitleVariants({ size }),
                                                    "flex w-full items-baseline justify-between gap-2 text-center",
                                                )}
                                            >
                                                <p>{p.AccentedName}</p>

                                                <small lang="ja">{p.JapName}</small>
                                            </ItemTitle>
                                        </ItemContent>
                                        <ItemActions>
                                            <div>
                                                <ChevronRightIcon className="size-4" />
                                            </div>
                                        </ItemActions>
                                    </Link>
                                </Item>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
