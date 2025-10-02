"use client";

import { useEffect, useState, useTransition } from "react";
import type { SortStep, HighlightType } from "@/lib/algorithms/types";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAlgorithmById } from "@/lib/algorithms";
import { HighlightLegend, highlightConfig } from "./highlight-legend";

type Props = {
  algorithmId: string;
};

// A small, fixed array for a consistent dry run demonstration.
const DRY_RUN_ARRAY = [44, 75, 23, 43, 55, 12, 64, 21];

const getDynamicDescription = (step: SortStep): string => {
    const highlights = step.highlights;
    const highlightEntries = Object.entries(highlights) as [string, HighlightType][];

    if (highlightEntries.length === 0) {
        if (step.array.every((_, i) => highlights[i] === 'sorted')) {
            return "The array is now fully sorted.";
        }
        return 'The array state after an operation.';
    }

    const mainHighlightType = highlightEntries[0][1];
    const indices = highlightEntries.map(([index]) => parseInt(index, 10));

    switch (mainHighlightType) {
        case 'compare':
            if (indices.length >= 2) {
                return `Comparing elements at indices ${indices[0]} and ${indices[1]} (values ${step.array[indices[0]]} and ${step.array[indices[1]]}).`;
            }
            return `Comparing elements.`;
        case 'swap':
            if (indices.length >= 2) {
                return `Swapping elements at indices ${indices[0]} and ${indices[1]} (values ${step.array[indices[0]]} and ${step.array[indices[1]]}).`;
            }
            return `Swapping elements.`;
        case 'pivot':
            return `Element ${step.array[indices[0]]} at index ${indices[0]} is selected as the pivot.`;
        case 'sorted':
             if (indices.length === step.array.length) {
                return "The array is now fully sorted.";
            }
            return `Element ${step.array[indices[0]]} is now in its final sorted position.`;
        case 'boundary':
            if (indices.length > 1) {
                return `Defining a sub-array boundary from index ${indices[0]} to ${indices[indices.length - 1]}.`;
            }
            return 'Defining a sub-array boundary.';
        case 'special':
            return `Element ${step.array[indices[0]]} is being processed (e.g., as a key or current minimum).`;
        default:
            return 'Processing step...';
    }
}

export function DryRunVisualizer({ algorithmId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [steps, setSteps] = useState<SortStep[]>([]);

  useEffect(() => {
    const algorithm = getAlgorithmById(algorithmId);
    if (!algorithm) return;

    startTransition(() => {
        // Generate the raw steps without descriptions on initial load
        const rawSteps = algorithm.implementation([...DRY_RUN_ARRAY]);
        const stepsWithDescriptions = rawSteps.map(step => ({
            ...step,
            description: getDynamicDescription(step),
        }));
        setSteps(stepsWithDescriptions);
    });
  }, [algorithmId]);


  if (isPending || steps.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Generating Dry Run...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Initial Array:</p>
        <div className="flex gap-1">
          {DRY_RUN_ARRAY.map((val, i) => (
            <div key={i} className="flex h-8 w-8 items-center justify-center rounded bg-muted font-code text-sm">
              {val}
            </div>
          ))}
        </div>
      </div>
      
      <HighlightLegend />

      <div className="space-y-4 divide-y divide-border">
        {steps.map((step, stepIndex) => (
          <div key={stepIndex} className="pt-4 first:pt-0">
            <p className="font-medium text-sm mb-2">Step {stepIndex + 1}</p>
            {step.description && (
              <p className="text-sm text-foreground/80 mb-3">{step.description}</p>
            )}
            <div className="flex gap-1 flex-wrap">
              {step.array.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-md border bg-card font-code transition-colors",
                    step.highlights[index] && highlightConfig[step.highlights[index]].color
                  )}
                >
                  {value}
                   {step.highlights[index] && (
                     <span className="absolute -top-2 -right-2 text-xs capitalize bg-card border rounded-full px-1.5 py-0.5 leading-none">
                       {step.highlights[index]}
                     </span>
                   )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
