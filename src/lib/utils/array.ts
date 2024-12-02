// fisher-yates shuffle
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const index = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }

  return arr;
}
