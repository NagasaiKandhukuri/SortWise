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

    function merge(arr: number[], l: number, m: number, r: number) {
        const n1 = m - l + 1;
        const n2 = r - m;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        let i = 0, j = 0, k = l;
        
        addStep(arr, {}, steps);
        while (i < n1 && j < n2) {
            const highlights: { [key: number]: any } = {};
            for(let p=l; p<=r; p++) highlights[p] = "boundary";
            highlights[l+i] = "compare";
            highlights[m+1+j] = "compare";
            addStep(arr, highlights, steps);
            
            comparisons++;
            if (L[i] <= R[j]) {
                swaps++;
                arr[k] = L[i];
                addStep(arr, { [k]: "swap" }, steps);
                i++;
            } else {
                swaps++;
                arr[k] = R[j];
                addStep(arr, { [k]: "swap" }, steps);
                j++;
            }
            k++;
        }

        while (i < n1) {
            swaps++;
            arr[k] = L[i];
            addStep(arr, { [k]: "swap" }, steps);
            i++;
            k++;
        }

        while (j < n2) {
            swaps++;
            arr[k] = R[j];
            addStep(arr, { [k]: "swap" }, steps);
            j++;
            k++;
        }
    }

    function mergeSortRecursive(arr: number[], l: number, r: number) {
        if (l >= r) {
            if (l === r) {
                addStep(arr, { [l]: "boundary" }, steps);
            }
            return;
        }
        const m = l + Math.floor((r - l) / 2);
        
        const highlights: { [key: number]: any } = {};
        for(let p=l; p<=r; p++) highlights[p] = "boundary";
        addStep(arr, highlights, steps);

        mergeSortRecursive(arr, l, m);
        mergeSortRecursive(arr, m + 1, r);
        merge(arr, l, m, r);
    }

    mergeSortRecursive(array, 0, array.length - 1);
    
    const finalHighlights: Record<number, "sorted"> = {};
    for (let i = 0; i < array.length; i++) {
        finalHighlights[i] = "sorted";
    }
    addStep(array, finalHighlights, steps);
    return steps;
};

const code = {
    javascript: `function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let resultArray = [], leftIndex = 0, rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return resultArray
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}`,
    python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]
 
        merge_sort(L)
        merge_sort(R)
 
        i = j = k = 0
 
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
 
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
 
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1`,
    cpp: `void merge(int array[], int const left, int const mid, int const right)
{
    auto const subArrayOne = mid - left + 1;
    auto const subArrayTwo = right - mid;
 
    auto *leftArray = new int[subArrayOne],
         *rightArray = new int[subArrayTwo];
 
    for (auto i = 0; i < subArrayOne; i++)
        leftArray[i] = array[left + i];
    for (auto j = 0; j < subArrayTwo; j++)
        rightArray[j] = array[mid + 1 + j];
 
    auto indexOfSubArrayOne = 0,
        indexOfSubArrayTwo = 0;
    int indexOfMergedArray = left;
 
    while (indexOfSubArrayOne < subArrayOne && indexOfSubArrayTwo < subArrayTwo) {
        if (leftArray[indexOfSubArrayOne] <= rightArray[indexOfSubArrayTwo]) {
            array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
            indexOfSubArrayOne++;
        }
        else {
            array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
            indexOfSubArrayTwo++;
        }
        indexOfMergedArray++;
    }
 
    while (indexOfSubArrayOne < subArrayOne) {
        array[indexOfMergedArray] = leftArray[indexOfSubArrayOne];
        indexOfSubArrayOne++;
        indexOfMergedArray++;
    }
 
    while (indexOfSubArrayTwo < subArrayTwo) {
        array[indexOfMergedArray] = rightArray[indexOfSubArrayTwo];
        indexOfSubArrayTwo++;
        indexOfMergedArray++;
    }
    delete[] leftArray;
    delete[] rightArray;
}
 
void mergeSort(int array[], int const begin, int const end)
{
    if (begin >= end)
        return;
 
    auto mid = begin + (end - begin) / 2;
    mergeSort(array, begin, mid);
    mergeSort(array, mid + 1, end);
    merge(array, begin, mid, end);
}`,
    java: `class MergeSort {
    void merge(int arr[], int l, int m, int r) {
        int n1 = m - l + 1;
        int n2 = r - m;

        int L[] = new int[n1];
        int R[] = new int[n2];

        for (int i = 0; i < n1; ++i)
            L[i] = arr[l + i];
        for (int j = 0; j < n2; ++j)
            R[j] = arr[m + 1 + j];

        int i = 0, j = 0;
        int k = l;
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }

    void sort(int arr[], int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
}`,
    c: `void merge(int arr[], int l, int m, int r)
{
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;
 
    int L[n1], R[n2];
 
    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];
 
    i = 0; 
    j = 0; 
    k = l; 
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        }
        else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
 
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
 
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}
 
void mergeSort(int arr[], int l, int r)
{
    if (l < r) {
        int m = l + (r - l) / 2;
 
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
 
        merge(arr, l, m, r);
    }
}`
};


export const mergeSort: Algorithm = {
    id: "merge-sort",
    name: "Merge Sort",
    overview: "An efficient, stable, comparison-based sorting algorithm that uses a divide and conquer strategy.",
    stable: true,
    complexity: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
    },
    explanation: {
        short: "Merge Sort follows the 'divide and conquer' paradigm: it breaks the list down into single-element sublists and then repeatedly merges them back together in sorted order.",
        long: `Merge Sort is a perfect example of a 'divide and conquer' algorithm. Its strategy is to:

1.  **Divide**: Recursively split the array in half until you are left with arrays that contain only one element. A single-element array is inherently sorted.
2.  **Conquer (Merge)**: Take the divided arrays and merge them back together in pairs. When merging two sorted arrays (even single-element ones), you create a new, larger sorted array. This is done by comparing the first element of each array, adding the smaller one to the result, and repeating this until all elements are merged.

This process of merging and sorting continues up the chain of recursion until all the single-element arrays have been merged back into one final, completely sorted array.`,
        strengths: [
            "Extremely predictable and reliable performance. Its time complexity is O(n log n) in all cases (best, average, and worst).",
            "It is a stable sort, meaning it preserves the original order of equal elements.",
            "Excellent for sorting large datasets.",
            "The divide-and-conquer approach is well-suited for parallel processing."
        ],
        weaknesses: [
            "Requires extra memory. The standard implementation is not in-place and needs O(n) auxiliary space to store the merged sub-arrays.",
            "For small datasets, the overhead from recursion and the extra space requirement can make it less efficient than simpler algorithms like Insertion Sort."
        ],
        detailedComplexity: {
            best: "The time complexity is always O(n log n). The 'divide' step, where the array is repeatedly halved, creates a recursion tree of depth log n. The 'merge' step at each level of the tree involves processing all n elements. Therefore, the total work done is n * log n. This holds true even if the array is already sorted.",
            average: "For an average, randomly ordered array, the performance remains consistently O(n log n). The number of divisions and the work done during merging are dictated by the array's size, not its initial order.",
            worst: "The worst-case performance is also O(n log n). Unlike algorithms like Quick Sort, there is no specific input (like a reverse-sorted array) that degrades Merge Sort's performance. Its efficiency is its greatest strength."
        },
        pseudocode: `procedure mergeSort(A: list of items)
  if length(A) <= 1 then
    return A
  
  mid = floor(length(A) / 2)
  left = mergeSort(A[0...mid])
  right = mergeSort(A[mid...end])
  
  return merge(left, right)
end procedure

procedure merge(left, right)
  result = new list
  while left is not empty and right is not empty do
    if first(left) <= first(right) then
      append first(left) to result
      remove first from left
    else
      append first(right) to result
      remove first from right
    end if
  end while
  
  while left is not empty do
    append first(left) to result
    remove first from left
  end while
  
  while right is not empty do
    append first(right) to result
    remove first from right
  end while
  
  return result
end procedure`,
        useCases: "Merge sort is widely used in real-world applications where performance and stability are critical. It's an excellent choice for sorting linked lists (as it doesn't rely on random access) and is a key component of external sorting, where data is too large to fit into memory. Many standard library sort functions are implementations or hybrids of Merge Sort."
    },
    implementation,
    code
};
