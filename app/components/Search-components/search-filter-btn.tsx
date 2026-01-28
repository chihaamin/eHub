"use client";
import { useState, useCallback, useSyncExternalStore } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/app/components/ui/popover";
import { Input } from "@/app/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";
import {
    useFilterStore,
    FilterRange,
    POSITIONS,
    STRONGER_FOOT,
    SearchFilters,
} from "./filter-store";

interface RangeInputProps {
    label: string;
    filterKey: keyof SearchFilters;
    value: FilterRange;
}

function RangeInput({ label, filterKey, value }: RangeInputProps) {
    const { setRangeFilter } = useFilterStore();

    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value === "" ? null : parseInt(e.target.value);
            setRangeFilter(filterKey, "min", val);
        },
        [filterKey, setRangeFilter]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value === "" ? null : parseInt(e.target.value);
            setRangeFilter(filterKey, "max", val);
        },
        [filterKey, setRangeFilter]
    );

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{label}</label>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Min"
                    min={1}
                    max={99}
                    value={value.min ?? ""}
                    onChange={handleMinChange}
                    className="h-8 text-xs"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    type="number"
                    placeholder="Max"
                    min={1}
                    max={99}
                    value={value.max ?? ""}
                    onChange={handleMaxChange}
                    className="h-8 text-xs"
                />
            </div>
        </div>
    );
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border pb-3 last:border-b-0 last:pb-0">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-semibold hover:text-foreground/80 transition-colors"
            >
                {title}
                {isOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                )}
            </button>
            {isOpen && <div className="space-y-3 pt-1">{children}</div>}
        </div>
    );
}

// Hook to safely check if component is mounted (for hydration safety)
const emptySubscribe = () => () => { };
function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

interface SearchFilterProps {
    onApply?: () => void;
    showApplyButton?: boolean;
}

export function SearchFilter({ onApply, showApplyButton = false }: SearchFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const isMounted = useIsMounted();
    const { filters, setFilter, resetFilters, hasActiveFilters } =
        useFilterStore();

    const isActive = isMounted && hasActiveFilters();

    const handleApply = useCallback(() => {
        onApply?.();
        setIsOpen(false);
    }, [onApply]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant={isActive ? "secondary" : "ghost"}
                    aria-label="Open search filters"
                    aria-expanded={isOpen}
                    className="relative"
                >
                    <SlidersHorizontal className="size-5" />
                    {isActive && (
                        <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className="w-80 max-h-[70vh] overflow-y-auto"
                role="dialog"
                aria-label="Search filter options"
                align="end"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm leading-none font-semibold">
                            Filter Players
                        </h3>
                        {isActive && (
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={resetFilters}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <RotateCcw className="size-3 mr-1" />
                                Reset
                            </Button>
                        )}
                    </div>

                    {/* Overall Rating */}
                    <FilterSection title="Overall Rating" defaultOpen>
                        <RangeInput
                            label="Overall (OVR)"
                            filterKey="overall"
                            value={filters.overall}
                        />
                    </FilterSection>

                    {/* Position & Foot */}
                    <FilterSection title="Position & Foot" defaultOpen>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Position
                                </label>
                                <Select
                                    value={filters.position ?? "all"}
                                    onValueChange={(val) =>
                                        setFilter("position", val === "all" ? null : val)
                                    }
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Any position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any position</SelectItem>
                                        {POSITIONS.map((pos) => (
                                            <SelectItem key={pos.value} value={pos.value}>
                                                {pos.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Stronger Foot
                                </label>
                                <Select
                                    value={filters.strongerFoot ?? "all"}
                                    onValueChange={(val) =>
                                        setFilter("strongerFoot", val === "all" ? null : val)
                                    }
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Any foot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any foot</SelectItem>
                                        {STRONGER_FOOT.map((foot) => (
                                            <SelectItem key={foot.value} value={foot.value}>
                                                {foot.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </FilterSection>

                    {/* Attacking Stats */}
                    <FilterSection title="Attacking">
                        <RangeInput
                            label="Offensive Awareness"
                            filterKey="offensiveAwareness"
                            value={filters.offensiveAwareness}
                        />
                        <RangeInput
                            label="Ball Control"
                            filterKey="ballControl"
                            value={filters.ballControl}
                        />
                        <RangeInput
                            label="Dribbling"
                            filterKey="dribbling"
                            value={filters.dribbling}
                        />
                        <RangeInput
                            label="Finishing"
                            filterKey="finishing"
                            value={filters.finishing}
                        />
                        <RangeInput
                            label="Low Pass"
                            filterKey="lowPass"
                            value={filters.lowPass}
                        />
                        <RangeInput
                            label="Lofted Pass"
                            filterKey="loftedPass"
                            value={filters.loftedPass}
                        />
                    </FilterSection>

                    {/* Defending Stats */}
                    <FilterSection title="Defending">
                        <RangeInput
                            label="Defensive Awareness"
                            filterKey="defensiveAwareness"
                            value={filters.defensiveAwareness}
                        />
                        <RangeInput
                            label="Ball Winning"
                            filterKey="ballWinning"
                            value={filters.ballWinning}
                        />
                    </FilterSection>

                    {/* Physical Stats */}
                    <FilterSection title="Physical">
                        <RangeInput
                            label="Speed"
                            filterKey="speed"
                            value={filters.speed}
                        />
                        <RangeInput
                            label="Acceleration"
                            filterKey="acceleration"
                            value={filters.acceleration}
                        />
                        <RangeInput
                            label="Physical Contact"
                            filterKey="physicalContact"
                            value={filters.physicalContact}
                        />
                        <RangeInput
                            label="Stamina"
                            filterKey="stamina"
                            value={filters.stamina}
                        />
                    </FilterSection>

                    {/* Apply Button */}
                    {showApplyButton && isActive && (
                        <Button
                            onClick={handleApply}
                            className="w-full"
                            size="sm"
                        >
                            <RefreshCw className="size-4 mr-2" />
                            Apply Filters
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
