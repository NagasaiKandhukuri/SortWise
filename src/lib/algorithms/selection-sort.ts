import type { Algorithm, SortStep } from "./types";

const addStep = (array: number[], highlights: { [key: number]: any }, steps: SortStep[], comparisons: number, swaps: number) => {
    steps.push({ array: [...array], highlights: { ...highlights }, comparisons, swaps });
};

const implementation = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    let n = array.length;
    let comparisons = 0;
    let swaps = 0;

    steps.push({ array: [...array], highlights: {}, comparisons, swaps });

    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        const currentHighlights: { [key: number]: any } = {};
        for(let k=0; k<i; k++) currentHighlights[k] = "sorted";

        addStep(array, { ...currentHighlights, [min_idx]: "special" }, steps, comparisons, swaps);
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            addStep(array, { ...currentHighlights, [min_idx]: "special", [j]: "compare" }, steps, comparisons, swaps);
            if (array[j] < array[min_idx]) {
                min_idx = j;
                addStep(array, { ...currentHighlights, [min_idx]: "special" }, steps, comparisons, swaps);
            }
        }
        if (min_idx !== i) {
            swaps++;
            addStep(array, { ...currentHighlights, [i]: "swap", [min_idx]: "swap" }, steps, comparisons, swaps);
            [array[i], array[min_idx]] = [array[min_idx], array[i]];
            addStep(array, { ...currentHighlights, [i]: "sorted", [min_idx]: "swap" }, steps, comparisons, swaps);
        } else {
            addStep(array, { ...currentHighlights, [i]: "sorted" }, steps, comparisons, swaps);
        }
    }
    
    const finalHighlights: Record<number, "sorted"> = {};
    for (let i = 0; i < n; i++) {
        finalHighlights[i] = "sorted";
    }
    addStep(array, finalHighlights, steps, comparisons, swaps);
    return steps;
};

const code = {
    javascript: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in unsorted array
    let min_idx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx]) {
        min_idx = j;
      }
    }
    // Swap the found minimum element with the first element
    [arr[min_idx], arr[i]] = [arr[i], arr[min_idx]];
  }
  return arr;
}`,
    python: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[min_idx] > arr[j]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    cpp: `void selectionSort(int arr[], int n) {
    int i, j, min_idx;
 
    for (i = 0; i < n - 1; i++) {
        min_idx = i;
        for (j = i + 1; j < n; j++)
            if (arr[j] < arr[min_idx])
                min_idx = j;
 
        std::swap(arr[min_idx], arr[i]);
    }
}`,
    java: `class SelectionSort {
    void sort(int arr[]) {
        int n = arr.length;
 
        for (int i = 0; i < n-1; i++) {
            int min_idx = i;
            for (int j = i+1; j < n; j++)
                if (arr[j] < arr[min_idx])
                    min_idx = j;
 
            int temp = arr[min_idx];
            arr[min_idx] = arr[i];
            arr[i] = temp;
        }
    }
}`,
    c: `void swap(int *xp, int *yp)
{
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
}
 
void selectionSort(int arr[], int n)
{
    int i, j, min_idx;
 
    for (i = 0; i < n-1; i++)
    {
        min_idx = i;
        for (j = i+1; j < n; j++)
          if (arr[j] < arr[min_idx])
            min_idx = j;
 
        swap(&arr[min_idx], &arr[i]);
    }
}`
};

export const selectionSort: Algorithm = {
    id: "selection-sort",
    name: "Selection Sort",
    overview: "An in-place comparison sorting algorithm that divides the list into a sorted and an unsorted sublist.",
    stable: false,
    complexity: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
    },
    explanation: {
        short: "Selection sort repeatedly 'selects' the smallest remaining element and moves it to its correct sorted position.",
        long: `Selection Sort works by dividing the array into two parts: a sorted sub-array on the left and an unsorted sub-array on the right. Initially, the sorted sub-array is empty.

The algorithm iterates through the array. In the first pass, it scans the entire unsorted sub-array to find the smallest element. It then swaps this smallest element with the element at the first position. Now, the first element is sorted and becomes part of the sorted sub-array.

In the second pass, it scans the remaining unsorted sub-array (from the second element onwards) to find the next smallest element. It swaps this element with the second element in the array. This process continues, with the sorted sub-array growing one element at a time, until the entire array is sorted.`,
        strengths: [
            "Simple and easy to understand.",
            "It's an in-place algorithm, requiring only O(1) extra space.",
            "Performs the minimum possible number of swaps, which is exactly n-1 in the worst case. This can be an advantage if writing to memory is a very expensive operation."
        ],
        weaknesses: [
            "Very inefficient for large lists, with a consistent O(n²) time complexity regardless of the input data.",
            "It is not a stable sort, as it can change the relative order of equal elements during swaps.",
            "Its performance is not affected by the initial order of the elements; it will always make the same number of comparisons even if the array is already sorted."
        ],
        detailedComplexity: {
            best: "The best-case complexity is O(n²). Even if the array is already sorted, the algorithm has no way of knowing this. It must still scan the entire remaining list in each pass to find the minimum element. The number of comparisons is fixed at n(n-1)/2, which simplifies to O(n²).",
            average: "The average-case complexity is also O(n²). The number of comparisons is not dependent on the initial order of the elements, so the performance remains consistent for random data.",
            worst: "The worst-case complexity is, once again, O(n²). A reverse-sorted array does not change the algorithm's execution path. It will perform the same number of comparisons and swaps as it would for a sorted or random array."
        },
        pseudocode: `procedure selectionSort(A: list of sortable items)
   n = length(A)
   for i = 0 to n-2 do
      min_idx = i
      for j = i+1 to n-1 do
         if A[j] < A[min_idx] then
            min_idx = j
         end if
      end for
      swap(A[i], A[min_idx])
   end for
end procedure`,
        useCases: "Similar to Bubble Sort, Selection Sort is primarily used for educational purposes. Its one practical advantage is minimizing swaps. It might be considered in niche scenarios where write operations are extremely costly, such as with certain types of flash memory, but even then, other algorithms are usually preferred."
    },
    implementation,
    code,
};
