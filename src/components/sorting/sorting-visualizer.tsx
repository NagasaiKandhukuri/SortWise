"use client";

import { useState, useMemo, useEffect, useRef, useTransition } from "react";
import type { SortStep, HighlightType } from "@/lib/algorithms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Play,
  Pause,
  RotateCcw,
  StepBack,
  StepForward,
  Shuffle,
  Loader2,
  Info,
  Hash,
  GitCommit,
  ArrowRightLeft,
} from "lucide-react";
import { getAlgorithmById } from "@/lib/algorithms";
import { HighlightLegend, highlightConfig } from "./highlight-legend";
import { cn } from "@/lib/utils";

type Props = {
  algorithmId: string;
  algorithmName: string;
};

const MAX_ARRAY_SIZE = 50;
const MIN_ARRAY_SIZE = 5;
const DEFAULT_SPEED = 50; // value from 0 to 100

function generateRandomArray(size: number, maxVal: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * maxVal) + 1);
}

const getDynamicDescription = (step: SortStep): string => {
    if (!step) return 'Initializing...';
    const highlights = step.highlights;
    const highlightEntries = Object.entries(highlights) as [string, HighlightType][];

    if (highlightEntries.length === 0) {
        if (step.array.every((_, i) => highlights[i] === 'sorted')) {
            return "The array is now fully sorted.";
        }
        return 'The array state after an operation.';
    }

    const mainHighlightType = highlightEntries.find(([_, type]) => type !== 'sorted')?.[1] || highlightEntries[0][1];
    
    switch (mainHighlightType) {
        case 'compare': {
            const compareIndices = highlightEntries.filter(([, type]) => type === 'compare').map(([index]) => parseInt(index, 10));
            if (compareIndices.length >= 2) {
                return `Comparing elements at indices ${compareIndices[0]} and ${compareIndices[1]} (values ${step.array[compareIndices[0]]} and ${step.array[compareIndices[1]]}).`;
            }
            return `Comparing elements.`;
        }
        case 'swap': {
             const swapIndices = highlightEntries.filter(([, type]) => type === 'swap').map(([index]) => parseInt(index, 10));
            if (swapIndices.length >= 2) {
                return `Swapping elements at indices ${swapIndices[0]} and ${swapIndices[1]} (values ${step.array[swapIndices[0]]} and ${step.array[swapIndices[1]]}).`;
            }
            return `Swapping elements.`;
        }
        case 'pivot': {
            const pivotIndex = highlightEntries.find(([, type]) => type === 'pivot')?.[0];
            if (pivotIndex) {
                 return `Element ${step.array[parseInt(pivotIndex, 10)]} at index ${pivotIndex} is selected as the pivot.`;
            }
            return 'Selecting a pivot element.';
        }
        case 'sorted': {
             const indices = highlightEntries.map(([index]) => parseInt(index, 10));
             if (indices.length === step.array.length) {
                return "The array is now fully sorted.";
            }
            const sortedIndices = highlightEntries.filter(([, type]) => type === 'sorted').map(([index]) => parseInt(index, 10));
             const lastSortedIndex = sortedIndices[sortedIndices.length -1];
            return `Element ${step.array[lastSortedIndex]} is now in its final sorted position.`;
        }
        case 'boundary': {
            const indices = highlightEntries.filter(([,type]) => type === 'boundary').map(([index]) => parseInt(index, 10));
            if (indices.length > 1) {
                return `Defining a sub-array boundary from index ${indices[0]} to ${indices[indices.length - 1]}.`;
            }
            return 'Defining a sub-array boundary.';
        }
        case 'special': {
            const specialIndex = highlightEntries.find(([, type]) => type === 'special')?.[0];
            if (specialIndex) {
                 return `Element ${step.array[parseInt(specialIndex, 10)]} is being processed (e.g., as a key or current minimum).`;
            }
            return 'Processing a special element.'
        }
        default:
            return 'Processing step...';
    }
}

export function SortingVisualizer({ algorithmId, algorithmName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [arraySize, setArraySize] = useState(20);
  const [arrayString, setArrayString] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<SortStep[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    handleRandomize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const array = useMemo(() => {
    try {
      if (arrayString.trim() === '') return [];
      const parsed = arrayString.split(",").map((s) => parseInt(s.trim())).filter(n => !isNaN(n));
      if(parsed.length > MAX_ARRAY_SIZE) {
        setError(`Max array size is ${MAX_ARRAY_SIZE}.`);
        return [];
      }
      if(parsed.length < MIN_ARRAY_SIZE) {
        setError(`Min array size is ${MIN_ARRAY_SIZE}.`);
        return [];
      }
      setError(null);
      return parsed;
    } catch (e) {
      setError("Invalid array format. Please use comma-separated numbers.");
      return [];
    }
  }, [arrayString]);

  useEffect(() => {
    const algorithm = getAlgorithmById(algorithmId);
    if (!algorithm || array.length === 0) {
        setSteps([]);
        return;
    };
    handleReset();
    
    startTransition(() => {
      const newSteps = algorithm.implementation([...array]);
      const stepsWithDescriptions = newSteps.map(step => ({
        ...step,
        description: getDynamicDescription(step),
      }));
      setSteps(stepsWithDescriptions);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [array, algorithmId]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timeoutDuration = 2005 - (speed * 20);
      timerRef.current = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, timeoutDuration);
    } else if (currentStep >= steps.length - 1 && steps.length > 0) {
      setIsPlaying(false);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed]);
  
  useEffect(() => {
    const newArray = generateRandomArray(arraySize, 100);
    setArrayString(newArray.join(", "));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithmId]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1 && steps.length > 0) {
      handleReset();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };
  
  const handleRandomize = () => {
    handleReset();
    setArrayString(generateRandomArray(arraySize, 100).join(", "));
  }

  const step = steps[currentStep] || { array: array, highlights: {}, comparisons: 0, swaps: 0 };
  const maxVal = Math.max(...(step.array || []), 1);
  const isSorted = currentStep === steps.length - 1 && steps.length > 1;

  const getBarColor = (index: number): string => {
    if (isSorted) return "hsl(var(--primary))";
    const highlight = step.highlights[index];
    if (highlight) {
      switch (highlight) {
        case "compare": return "hsl(var(--accent))";
        case "swap": return "hsl(var(--destructive))";
        case "pivot": return "hsl(142.1 76.2% 36.3%)"; // Emerald Green
        case "sorted": return "hsl(215.8 88.9% 65.5%)"; // Blue 500
        case "boundary": return "hsl(255 75% 65%)"; // Violet 500
        case "special": return "hsl(47.9 95.8% 53.1%)"; // Yellow 400
      }
    }
    return "hsl(var(--primary))";
  };
  
  const description = useMemo(() => {
    if (steps.length === 0) return 'Generating steps...';
    return steps[currentStep]?.description || 'Step details will appear here.';
  }, [steps, currentStep]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            <CardDescription>Watch {algorithmName} in action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-80 bg-muted rounded-lg flex items-end justify-center gap-px p-2">
              {isPending ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                (step.array || []).map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-sm transition-all duration-150 flex justify-center pt-2"
                    style={{
                      height: `${(value / maxVal) * 100}%`,
                      backgroundColor: getBarColor(index)
                    }}
                    title={`Value: ${value}`}
                  >
                    {array.length <= 30 && (
                      <span className="text-xs font-medium text-primary-foreground/80">{value}</span>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4">
              <Slider
                min={0}
                max={steps.length > 0 ? steps.length - 1 : 0}
                value={[currentStep]}
                onValueChange={([val]) => {
                  setIsPlaying(false);
                  setCurrentStep(val);
                }}
                disabled={steps.length === 0 || isPending}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Step: {steps.length > 0 ? currentStep + 1 : 0} / {steps.length || 0}</span>
                <div className="flex gap-4">
                    <span>Comparisons: {step.comparisons}</span>
                    <span>Swaps: {step.swaps}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isSorted && (
            <Card>
                <CardHeader>
                    <CardTitle>Sort Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <Hash className="h-6 w-6 mb-2 text-primary"/>
                        <p className="text-2xl font-bold">{step.array.length}</p>
                        <p className="text-sm text-muted-foreground">Array Size</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <GitCommit className="h-6 w-6 mb-2 text-primary"/>
                        <p className="text-2xl font-bold">{steps.length}</p>
                        <p className="text-sm text-muted-foreground">Total Steps</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <Info className="h-6 w-6 mb-2 text-primary"/>
                        <p className="text-2xl font-bold">{step.comparisons}</p>
                        <p className="text-sm text-muted-foreground">Comparisons</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                        <ArrowRightLeft className="h-6 w-6 mb-2 text-primary"/>
                        <p className="text-2xl font-bold">{step.swaps}</p>
                        <p className="text-sm text-muted-foreground">Swaps</p>
                    </div>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl">Current Step Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-2 rounded-lg border bg-card p-3 text-sm min-h-[60px]">
                    <Info className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <p className="text-foreground/80">{description}</p>
                </div>
                
                <HighlightLegend />

                <div className="flex gap-1 flex-wrap">
                    {(step.array || []).map((value, index) => (
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
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handlePlayPause} disabled={steps.length === 0 || isPending}>
                {isPlaying ? <Pause /> : (isSorted ? <RotateCcw /> : <Play />)}
                <span className="ml-2">{isPlaying ? "Pause" : (isSorted ? "Replay" : "Play")}</span>
              </Button>
               <Button onClick={handleReset} variant="outline" disabled={steps.length === 0 || isPending}>
                <RotateCcw />
                <span className="ml-2">Reset</span>
              </Button>
              <Button onClick={() => setCurrentStep(s => Math.max(0, s-1))} variant="outline" disabled={isPlaying || currentStep === 0 || isPending}>
                <StepBack />
                <span className="ml-2">Prev</span>
              </Button>
               <Button onClick={() => setCurrentStep(s => Math.min(steps.length-1, s+1))} variant="outline" disabled={isPlaying || currentStep === steps.length-1 || isPending}>
                <StepForward />
                <span className="ml-2">Next</span>
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="speed">Speed</Label>
              <Slider
                id="speed"
                min={0}
                max={99}
                value={[speed]}
                onValueChange={([val]) => setSpeed(val)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Customize Array</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="array-input">Array values (comma-separated)</Label>
                    <Input id="array-input" value={arrayString} onChange={e => setArrayString(e.target.value)} disabled={isPlaying || isPending} />
                    {error && <p className="text-destructive text-xs mt-1">{error}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="size">Random Array Size: {arraySize}</Label>
                    <Slider
                        id="size"
                        min={MIN_ARRAY_SIZE}
                        max={MAX_ARRAY_SIZE}
                        value={[arraySize]}
                        onValueChange={([val]) => setArraySize(val)}
                        onValueCommit={handleRandomize}
                        disabled={isPlaying || isPending}
                    />
                </div>
                <Button onClick={handleRandomize} variant="secondary" className="w-full" disabled={isPlaying || isPending}>
                  <Shuffle />
                  <span className="ml-2">New Random Array</span>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
