import type { Algorithm, SortStep } from "./types";

const addStep = (array: number[], highlights: { [index: number]: "compare" | "swap" }, steps: SortStep[], comparisons: number, swaps: number) => {
    steps.push({ array: [...array], highlights: { ...highlights }, comparisons, swaps });
};

const implementation = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    let n = array.length;
    let swapped;
    let comparisons = 0;
    let swaps = 0;

    steps.push({ array: [...array], highlights: {}, comparisons, swaps });

    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            comparisons++;
            addStep(array, { [j]: "compare", [j + 1]: "compare" }, steps, comparisons, swaps);
            
            if (array[j] > array[j + 1]) {
                addStep(array, { [j]: "swap", [j + 1]: "swap" }, steps, comparisons, swaps);
                swaps++;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapped = true;
                addStep(array, { [j]: "swap", [j + 1]: "swap" }, steps, comparisons, swaps);
            }
        }
        
        const currentHighlights = steps[steps.length - 1]?.highlights || {};
        const sortedHighlights = { ...currentHighlights };
        for (let k = n - 1 - i; k < n; k++) {
            sortedHighlights[k] = "sorted";
        }
        steps.push({ array: [...array], highlights: sortedHighlights, comparisons, swaps });


        if (!swapped) {
            break;
        }
    }
    
    const finalHighlights: Record<number, "sorted"> = {};
    for (let i = 0; i < n; i++) {
        finalHighlights[i] = "sorted";
    }
    steps.push({ array: [...array], highlights: finalHighlights, comparisons, swaps });
    return steps;
};

const code = {
    javascript: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap arr[i] and arr[i+1]
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break`,
    cpp: `void bubbleSort(int arr[], int n) {
    bool swapped;
    for (int i = 0; i < n - 1; i++) {
        swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (swapped == false)
            break;
    }
}`,
    java: `class BubbleSort {
    void bubbleSort(int arr[]) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (arr[j] > arr[j + 1]) {
                    // swap arr[j+1] and arr[j]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
    }
}`,
    c: `void swap(int* xp, int* yp)
{
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}
 
void bubbleSort(int arr[], int n)
{
    int i, j;
    for (i = 0; i < n - 1; i++)
        for (j = 0; j < n - i - 1; j++)
            if (arr[j] > arr[j + 1])
                swap(&arr[j], &arr[j + 1]);
}`
};

export const bubbleSort: Algorithm = {
    id: "bubble-sort",
    name: "Bubble Sort",
    overview: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    stable: true,
    complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
    },
    explanation: {
        short: "Bubble Sort is an intuitive algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order, causing larger elements to 'bubble' to the end of the list.",
        long: `Imagine a line of people of different heights. Bubble Sort works by comparing the first two people and swapping them if the first is taller than the second. It then moves to the next pair and does the same. This process continues until the end of the line is reached. After this first "pass," the tallest person is guaranteed to be at the very end of the line.

The algorithm then repeats this entire process, but this time it only needs to go up to the second-to-last person, because the last one is already in place. This continues pass after pass, with the sorted portion of the line growing from the right, until the entire line is sorted. An important optimization is that if a full pass is completed with no swaps, the list must be sorted, and the algorithm can stop early.`,
        strengths: [
            "Simple to understand and implement, making it a great first algorithm to learn.",
            "It's an in-place algorithm, so it doesn't require any extra memory (Space Complexity: O(1)).",
            "It's adaptive. If the list is already sorted, Bubble Sort can detect this and terminate in O(n) time with the optimization."
        ],
        weaknesses: [
            "Extremely inefficient for large lists. Its O(n²) time complexity means that doubling the list size quadruples the sorting time.",
            "Generally outperformed by almost all other sorting algorithms, including Insertion Sort and Selection Sort."
        ],
        detailedComplexity: {
            best: "The best-case scenario is an array that is already sorted. The algorithm performs one full pass, comparing each adjacent pair of elements (n-1 comparisons). Since no swaps are needed, the optimized version recognizes that the array is sorted and terminates. This results in a time complexity of O(n).",
            average: "For a randomly ordered array, the algorithm will likely need to perform close to the maximum number of passes. Each pass involves comparing and potentially swapping elements. The number of comparisons is roughly n²/2, which simplifies to O(n²).",
            worst: "The worst-case scenario is an array sorted in reverse order. To move the smallest element from the end to the beginning, it must be swapped n-1 times. Every element needs to be moved across the entire array, requiring the maximum number of comparisons and swaps. This results in a time complexity of O(n²)."
        },
        pseudocode: `procedure bubbleSort(A : list of sortable items)
  n = length(A)
  repeat
    swapped = false
    for i = 1 to n-1 inclusive do
      if A[i-1] > A[i] then
        swap(A[i-1], A[i])
        swapped = true
      end if
    end for
    n = n - 1
  until not swapped
end procedure`,
        useCases: "Due to its poor performance, Bubble Sort is almost never used in real-world applications. Its primary use is in educational contexts to introduce the concept of sorting algorithms and fundamental programming concepts like loops and comparisons."
    },
    implementation,
    code
};
