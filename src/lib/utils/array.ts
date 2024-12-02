// fisher-yates shuffle
export function shuffle<T>(array: T[]): T[] {
  // copy array to avoid mutating the original
  const arr = [...array];

  // start at the end
  // we'll store the shuffled elements at the end of the array
  for (let pointer = arr.length - 1; pointer > 0; pointer--) {
    // get the current element at our pointer position
    const current = arr[pointer];

    // get a random index between 0 and the shuffled elements
    const target = Math.floor(Math.random() * (pointer + 1));

    // swap the current element with the target
    arr[pointer] = arr[target]; // move the target to the current position (shuffled)
    arr[target] = current; // move the current (unshuffled) to the position that was just emptied
  }

  return arr;
}
