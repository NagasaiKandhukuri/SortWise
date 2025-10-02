import type { Algorithm, SortStep } from "./types";

let comparisons = 0;
let swaps = 0;

const addStep = (array: number[], highlights: { [key: number]: any }, steps: SortStep[]) => {
    steps.push({ array: [...array], highlights: { ...highlights }, comparisons, swaps });
};

const implementation = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const n = array.length;
    comparisons = 0;
    swaps = 0;
    addStep(array, {}, steps);

    function heapify(arr: number[], size: number, i: number) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        const highlights: { [key: number]: any } = { [i]: "pivot" };
        if (left < size) highlights[left] = "compare";
        if (right < size) highlights[right] = "compare";
        addStep(arr, highlights, steps);

        if (left < size) {
            comparisons++;
            if(arr[left] > arr[largest]) {
                largest = left;
            }
        }

        if (right < size) {
            comparisons++;
            if (arr[right] > arr[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            swaps++;
            addStep(arr, { [i]: "swap", [largest]: "swap" }, steps);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            addStep(arr, { [i]: "swap", [largest]: "swap" }, steps);
            heapify(arr, size, largest);
        }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        swaps++;
        addStep(array, { [0]: "swap", [i]: "swap" }, steps);
        [array[0], array[i]] = [array[i], array[0]];
        addStep(array, { [0]: "swap", [i]: "swap", [i]: "sorted" }, steps);

        heapify(array, i, 0);
    }
    
    const finalHighlights: { [key: number]: any } = {};
    for(let i=0; i<n; i++) finalHighlights[i] = "sorted";
    addStep(array, finalHighlights, steps);

    return steps;
};


const code = {
    javascript: `function heapSort(arr) {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Heap sort
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // swap
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]]; // swap
    heapify(arr, n, largest);
  }
}`,
    python: `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
 
    if l < n and arr[i] < arr[l]:
        largest = l
 
    if r < n and arr[largest] < arr[r]:
        largest = r
 
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
 
def heap_sort(arr):
    n = len(arr)
 
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
 
    for i in range(n-1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)`,
    cpp: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
 
    if (l < n && arr[l] > arr[largest])
        largest = l;
 
    if (r < n && arr[r] > arr[largest])
        largest = r;
 
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
 
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
 
    for (int i = n - 1; i > 0; i--) {
        std::swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    java: `public class HeapSort {
    public void sort(int arr[]) {
        int n = arr.length;
 
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
 
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
 
            heapify(arr, i, 0);
        }
    }
 
    void heapify(int arr[], int n, int i) {
        int largest = i; 
        int l = 2 * i + 1; 
        int r = 2 * i + 2; 
 
        if (l < n && arr[l] > arr[largest])
            largest = l;
 
        if (r < n && arr[r] > arr[largest])
            largest = r;
 
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
 
            heapify(arr, n, largest);
        }
    }
}`,
    c: `void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
 
    if (l < n && arr[l] > arr[largest])
        largest = l;
 
    if (r < n && arr[r] > arr[largest])
        largest = r;
 
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}
 
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
 
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}`
};

export const heapSort: Algorithm = {
    id: "heap-sort",
    name: "Heap Sort",
    overview: "A comparison-based sorting technique based on a Binary Heap data structure.",
    stable: false,
    complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(1)",
    },
    explanation: {
        short: "Heap Sort converts the array into a max-heap data structure and then repeatedly extracts the largest element from the heap and places it at the end of the sorted portion of the array.",
        long: `Heap Sort is a two-phase algorithm. It first leverages a binary heap data structure to manage the elements.

1.  **Build Max-Heap**: The first phase is to transform the input array into a max-heap. A max-heap is a complete binary tree where the value of each node is greater than or equal to the value of its children. This property ensures that the largest element in the heap is always at the root. This is efficiently done in-place, starting from the last non-leaf node and working backwards to the root, applying a 'heapify' function to each one.

2.  **Sort by Extraction**: Once the max-heap is built, the sorting begins. The algorithm swaps the root element (the largest) with the last element in the heap. It then "disconnects" this last element, considering it sorted. The heap is now smaller, and the new root may violate the max-heap property. The 'heapify' function is called on the root to restore the property. This process—swap max, disconnect, heapify—is repeated until the heap is empty, leaving a fully sorted array.`,
        strengths: [
            "Guaranteed O(n log n) time complexity in all cases, making it very reliable.",
            "It is an in-place sorting algorithm, requiring only a constant O(1) amount of extra memory.",
            "More efficient than the simpler O(n²) algorithms like Bubble Sort and Selection Sort."
        ],
        weaknesses: [
            "Not a stable sort. It can change the relative order of equal elements.",
            "Although it has the same O(n log n) complexity, it is often slower in practice than a well-implemented Quick Sort due to factors like memory access patterns and cache performance.",
            "The logic, involving concepts like heaps and heapifying, is less intuitive than other algorithms."
        ],
        detailedComplexity: {
            best: "The time complexity of Heap Sort is consistently O(n log n). Building the initial max-heap from an array can be done in O(n) time. The second phase involves n-1 calls to the 'heapify' function. Each heapify operation on a heap of size k takes O(log k) time. Therefore, the total time for this phase is the sum of O(log n) + O(log n-1) + ..., which simplifies to O(n log n). The total complexity is O(n) + O(n log n) = O(n log n).",
            average: "The average-case complexity is also O(n log n). The process of building the heap and extracting elements is not significantly affected by the initial order of the data.",
            worst: "The worst-case complexity remains O(n log n). This is Heap Sort's main advantage over Quick Sort; it does not have a quadratic worst-case scenario, making its performance predictable and reliable for any input."
        },
        pseudocode: `procedure heapSort(A)
  buildMaxHeap(A)
  n = length(A)
  for i = n-1 down to 1 do
    swap(A[0], A[i])
    heapify(A, 0, i)
  end for
end procedure

procedure buildMaxHeap(A)
  n = length(A)
  for i = floor(n/2) down to 0 do
    heapify(A, i, n)
  end for
end procedure

procedure heapify(A, i, n)
  left = 2*i + 1
  right = 2*i + 2
  largest = i
  
  if left < n and A[left] > A[largest] then
    largest = left
  if right < n and A[right] > A[largest] then
    largest = right
  
  if largest != i then
    swap(A[i], A[largest])
    heapify(A, largest, n)
  end if
end procedure`,
        useCases: "Heap sort is an excellent choice when you need an in-place sorting algorithm with a guaranteed O(n log n) time complexity and memory usage is a critical concern. It's often used in embedded systems or other memory-constrained environments. The Linux kernel, for instance, uses Heap Sort. It's also the underlying algorithm for Priority Queues."
    },
    implementation,
    code,
};
