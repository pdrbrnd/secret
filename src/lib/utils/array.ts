// fisher-yates shuffle
export function shuffle<T>(array: T[]): T[] {
  // copy array to avoid mutating the original
  const arr = [...array];

  // start at the end and move backwards swapping the cursor element with a random element
  let cursor = arr.length - 1;

  while (cursor > 0) {
    const target = Math.floor(Math.random() * (cursor + 1));

    const temp = arr[cursor];
    arr[cursor] = arr[target];
    arr[target] = temp;

    cursor--;
  }

  return arr;
}
