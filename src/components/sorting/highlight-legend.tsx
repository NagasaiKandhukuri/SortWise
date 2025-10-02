"use client";

import { cn } from "@/lib/utils";
import type { HighlightType } from "@/lib/algorithms/types";

export const highlightConfig: Record<HighlightType, { color: string; label: string }> = {
    compare: { color: "bg-accent/30 border-accent", label: "Comparing" },
    swap: { color: "bg-destructive/30 border-destructive", label: "Swapping" },
    pivot: { color: "bg-emerald-500/30 border-emerald-500", label: "Pivot Element" },
    sorted: { color: "bg-blue-500/30 border-blue-500", label: "Sorted Element" },
    boundary: { color: "bg-violet-500/30 border-violet-500", label: "Sub-array Boundary" },
    special: { color: "bg-yellow-500/30 border-yellow-500", label: "Special (e.g., Min/Key)" },
};

export function HighlightLegend() {
    return (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {Object.entries(highlightConfig).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded-sm border", color.split(' ')[0], color.split(' ')[1])} />
                    <span>{label}</span>
                </div>
            ))}
        </div>
    );
}
