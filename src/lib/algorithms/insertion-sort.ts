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

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        
        const sortedHighlights: Record<number, "sorted"> = {};
        for(let k=0; k<i; k++) sortedHighlights[k] = "sorted";

        addStep(array, { ...sortedHighlights, [i]: "special" }, steps, comparisons, swaps);

        while (j >= 0 && array[j] > key) {
            comparisons++;
            addStep(array, { ...sortedHighlights, [j]: "compare", [i]: "special" }, steps, comparisons, swaps);
            swaps++;
            array[j + 1] = array[j];
            addStep(array, { ...sortedHighlights, [j+1]: "swap" }, steps, comparisons, swaps);
            j = j - 1;
        }
        if (j >= 0) {
            comparisons++; // Account for the final comparison that breaks the loop
        }
        swaps++;
        array[j + 1] = key;
        const finalSorted = {...sortedHighlights};
        finalSorted[j+1] = "sorted";
        addStep(array, { ...finalSorted }, steps, comparisons, swaps);
    }

    const finalHighlights: Record<number, "sorted"> = {};
    for (let i = 0; i < n; i++) {
        finalHighlights[i] = "sorted";
    }
    addStep(array, finalHighlights, steps, comparisons, swaps);
    return steps;
};

const code = {
    javascript: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    // Choosing the first element in our unsorted subarray
    let current = arr[i];
    // The last element of our sorted subarray
    let j = i - 1;
    while (j > -1 && current < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}`,
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    cpp: `void insertionSort(int arr[], int n) {
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
 
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    java: `class InsertionSort {
    void sort(int arr[]) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
 
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}`,
    c: `void insertionSort(int arr[], int n)
{
    int i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
 
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`
};

export const insertionSort: Algorithm = {
    id: "insertion-sort",
    name: "Insertion Sort",
    overview: "A simple sorting algorithm that builds the final sorted array one item at a time.",
    stable: true,
    complexity: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
    },
    explanation: {
        short: "Insertion sort works like sorting a hand of playing cards, picking one card at a time and inserting it into its correct position in the sorted hand.",
        long: `Insertion Sort divides the array into a sorted and an unsorted part. It iterates through the unsorted part, picking up one element at a time (let's call it the 'key'). It then compares this key with the elements in the sorted part, moving from right to left.

As it traverses the sorted part, it shifts any element that is larger than the key one position to the right. This creates a "gap" for the key to be placed. Once it finds the correct position (either an element smaller than the key, or the beginning of the list), it inserts the key into that gap.

This process is repeated until all elements from the unsorted part have been 'inserted' into their correct positions in the sorted part.`,
        strengths: [
            "Simple implementation and easy to understand.",
            "Very efficient for small datasets.",
            "Adaptive: It's highly efficient for data that is already substantially sorted. If the list is nearly sorted, its complexity approaches O(n).",
            "It is a stable sort, meaning it does not change the relative order of equal elements.",
            "In-place sorting with O(1) additional memory space."
        ],
        weaknesses: [
            "Inefficient for large, random datasets, with a time complexity of O(n²).",
            "Generally slower than more advanced algorithms like Quick Sort or Merge Sort for larger lists."
        ],
        detailedComplexity: {
            best: "The best-case scenario is a pre-sorted array. The outer loop runs n-1 times. For each element, the inner `while` loop condition is immediately false, as the element to its left is never larger. This results in only one comparison per element, giving a linear time complexity of O(n).",
            average: "For a randomly ordered array, each element on average will need to be compared with about half of the elements in the sorted sub-array. The outer loop runs n times, and the inner loop runs roughly i/2 times for the i-th element. This leads to approximately n²/4 comparisons, resulting in a time complexity of O(n²).",
            worst: "The worst-case scenario is a reverse-sorted array. To insert each element, the algorithm must shift all of the already-sorted elements one position to the right. The i-th element will require i comparisons and shifts. The total number of comparisons is the sum of integers from 1 to n-1, which is n(n-1)/2, resulting in a quadratic time complexity of O(n²)."
        },
        pseudocode: `procedure insertionSort(A: list of sortable items)
   n = length(A)
   for i = 1 to n-1 do
      key = A[i]
      j = i - 1
      while j >= 0 and A[j] > key do
         A[j+1] = A[j]
         j = j - 1
      end while
      A[j+1] = key
   end for
end procedure`,
        useCases: "Insertion sort is very practical for small datasets. Because of its excellent performance on nearly-sorted data, it's often used as the final step in more complex algorithms. For example, some Quick Sort implementations switch to Insertion Sort for sub-arrays that are smaller than a certain threshold (e.g., 10-20 elements)."
    },
    implementation,
    code,
};
