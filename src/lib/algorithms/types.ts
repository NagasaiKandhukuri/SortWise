export type HighlightType = "compare" | "swap" | "pivot" | "sorted" | "boundary" | "special";

export type SortStep = {
  array: number[];
  highlights: { [index: number]: HighlightType };
  description?: string;
  comparisons: number;
  swaps: number;
};

export type Algorithm = {
  id: string;
  name: string;
  overview: string;
  stable: boolean;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  explanation: {
    short: string;
    long: string;
    strengths: string[];
    weaknesses: string[];
    detailedComplexity: {
      best: string;
      average: string;
      worst: string;
    },
    pseudocode: string;
    useCases: string;
  };
  implementation: (array: number[]) => SortStep[];
  code: { [language: string]: string };
};

// Type for client-side usage, without the implementation function
export type ClientAlgorithm = Omit<Algorithm, "implementation">;
