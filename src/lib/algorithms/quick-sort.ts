import type { Algorithm, SortStep } from "./types";

let comparisons = 0;
let swaps = 0;

const addStep = (array: number[], highlights: { [key: number]: any }, steps: SortStep[]) => {
    steps.push({ array: [...array], highlights: { ...highlights }, comparisons, swaps });
};

const implementation = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    comparisons = 0;
    swaps = 0;
    addStep(array, {}, steps);

    function partition(arr: number[], low: number, high: number) {
        const pivot = arr[high];
        let i = low - 1;

        const highlights: { [key: number]: any } = { [high]: "pivot" };
        for(let k=low; k<high; k++) highlights[k] = "boundary";
        addStep(arr, highlights, steps);

        for (let j = low; j < high; j++) {
            comparisons++;
            addStep(arr, { ...highlights, [j]: "compare", [i+1]: "special" }, steps);
            if (arr[j] < pivot) {
                i++;
                swaps++;
                addStep(arr, { ...highlights, [i]: "swap", [j]: "swap" }, steps);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                addStep(arr, { ...highlights, [i]: "swap", [j]: "swap" }, steps);
            }
        }
        
        swaps++;
        addStep(arr, { [i + 1]: "swap", [high]: "swap" }, steps);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        addStep(arr, { [i + 1]: "sorted" }, steps);
        
        return i + 1;
    }

    function quickSortRecursive(arr: number[], low: number, high: number) {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        } else if (low === high) {
            addStep(arr, {[low]: "sorted"}, steps);
        }
    }

    quickSortRecursive(array, 0, array.length - 1);

    const finalHighlights: Record<number, "sorted"> = {};
    for (let i = 0; i < array.length; i++) {
        finalHighlights[i] = "sorted";
    }
    addStep(array, finalHighlights, steps);
    return steps;
};

const code = {
    javascript: `function quickSort(arr, low, high) {
  if (low < high) {
    // pi is partitioning index, arr[pi] is now at right place
    let pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);  // Before pi
    quickSort(arr, pi + 1, high); // After pi
  }
}

function partition(arr, low, high) {
  // pivot (Element to be placed at right position)
  let pivot = arr[high];  
  
  let i = (low - 1);  // Index of smaller element

  for (let j = low; j <= high- 1; j++) {
    // If current element is smaller than the pivot
    if (arr[j] < pivot) {
      i++;    // increment index of smaller element
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return (i + 1);
}`,
    python: `def partition(array, low, high):
    pivot = array[high]
    i = low - 1
 
    for j in range(low, high):
        if array[j] <= pivot:
            i = i + 1
            (array[i], array[j]) = (array[j], array[i])
 
    (array[i + 1], array[high]) = (array[high], array[i + 1])
    return i + 1
 
def quick_sort(array, low, high):
    if low < high:
        pi = partition(array, low, high)
        quick_sort(array, low, pi - 1)
        quick_sort(array, high, pi + 1)`,
    cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
 
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}
 
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    java: `class QuickSort {
    static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);

        for (int j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return (i + 1);
    }

    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
}`,
    c: `void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition (int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
 
    for (int j = low; j <= high- 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}
 
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`
};

export const quickSort: Algorithm = {
    id: "quick-sort",
    name: "Quick Sort",
    overview: "An efficient sorting algorithm that uses a divide and conquer strategy by partitioning the array around a pivot element.",
    stable: false,
    complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
    },
    explanation: {
        short: "Quick Sort is a highly efficient 'divide and conquer' algorithm that works by selecting a 'pivot' element and partitioning the array around it.",
        long: `Quick Sort's main operation is the 'partition' scheme. Here's the process:

1.  **Select a Pivot**: An element is chosen from the array as the pivot. Common strategies include picking the first, last, or a random element. (This implementation uses the last element).
2.  **Partition**: The array is reordered so that all elements smaller than the pivot are moved to its left, and all elements larger are moved to its right. After this step, the pivot is in its final, sorted position.
3.  **Recurse**: The algorithm then recursively applies the above steps to the two sub-arrays of elements on the left and right of the pivot.

This process continues until the sub-arrays are empty or contain only one element, at which point the entire array is sorted.`,
        strengths: [
            "Extremely fast in practice. Its average-case time complexity of O(n log n) comes with smaller constant factors than many other sorting algorithms.",
            "It is an in-place sorting algorithm, requiring only O(log n) space for the recursion call stack.",
            "Often outperforms Merge Sort and Heap Sort in real-world scenarios."
        ],
        weaknesses: [
            "Its worst-case performance is a quadratic O(n²), which can be a significant issue in applications that require guaranteed performance.",
            "It is not a stable sort, meaning the relative order of equal elements can change.",
            "Can be complex to implement correctly, with the choice of pivot and partitioning scheme being critical for performance."
        ],
        detailedComplexity: {
            best: "The best case occurs when the partition process always selects the median element as the pivot. This ensures the array is split into two perfectly equal-sized sub-arrays. The recurrence relation is T(n) = 2T(n/2) + O(n), which resolves to O(n log n). The O(n) part is the work done to partition the array.",
            average: "On average, even with a random pivot, the partitions will be reasonably balanced. This means the recursion depth will still be logarithmic (log n), and the total time complexity remains O(n log n), making it highly efficient for random data.",
            worst: "The worst case happens when the pivot selection is consistently poor. If the smallest or largest element is always chosen as the pivot (e.g., in an already-sorted array when picking the last element), the partitioning step splits the array into one sub-array of size n-1 and an empty one. The recurrence becomes T(n) = T(n-1) + O(n), which resolves to a quadratic O(n²)."
        },
        pseudocode: `procedure quickSort(A, low, high)
  if low < high then
    pi = partition(A, low, high)
    quickSort(A, low, pi - 1)
    quickSort(A, pi + 1, high)
  end if
end procedure

procedure partition(A, low, high)
  pivot = A[high]
  i = low - 1
  for j = low to high - 1 do
    if A[j] < pivot then
      i = i + 1
      swap(A[i], A[j])
    end if
  end for
  swap(A[i+1], A[high])
  return i + 1
end procedure`,
        useCases: "Quick Sort is one of the most popular and widely used sorting algorithms due to its speed. It's often the default, built-in sort in many programming languages and systems. However, because of its O(n²) worst case, it's not always suitable for mission-critical applications where performance must be guaranteed. Strategies like randomizing the pivot or using a 'median-of-three' pivot can help mitigate the risk of the worst-case scenario."
    },
    implementation,
    code
};
