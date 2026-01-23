'use client';
import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/app/components/ui/popover';

export function SearchFilter() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className="transition-transform duration-150 hover:scale-105 active:scale-95">
                    <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Open search filters"
                        aria-expanded={isOpen}
                    >
                        <span
                            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                            aria-hidden="true"
                        >
                            <SlidersHorizontal className="size-5" />
                        </span>
                    </Button>
                </div>
            </PopoverTrigger>

            {isOpen && (
                <PopoverContent
                    className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
                    role="dialog"
                    aria-label="Search filter options"
                >
                    <div className="space-y-4">
                        <h3 className="text-sm leading-none font-semibold">
                            Filter Options
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            Advanced filters coming soon
                        </p>
                    </div>
                </PopoverContent>
            )}
        </Popover>
    );
}
