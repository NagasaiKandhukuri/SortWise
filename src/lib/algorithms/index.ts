import type { Algorithm } from "./types";
import { bubbleSort } from "./bubble-sort";
import { selectionSort } from "./selection-sort";
import { insertionSort } from "./insertion-sort";
import { mergeSort } from "./merge-sort";
import { quickSort } from "./quick-sort";
import { heapSort } from "./heap-sort";

export const algorithms: Algorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
];

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find((algo) => algo.id === id);
}
