import { MutableRefObject, RefCallback, RefObject } from "react";

type Ref<T> = RefCallback<T> | RefObject<T> | null;

export function composeRefs<T>(...refs: Ref<T>[]): RefCallback<T> {
  return (instance: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref !== null && typeof ref === "object" && "current" in ref) {
        (ref as MutableRefObject<T>).current = instance;
      }
    });
  };
}
