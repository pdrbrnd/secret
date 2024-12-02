"use client";

import { cva } from "@/lib/utils";
import type { VariantProps } from "cva";
import { forwardRef } from "react";

const spinnerStyle = cva({
  base: [
    "relative",
    "animate-spin",
    "before:absolute before:left-0 before:top-0 before:block before:size-full before:rounded-full before:border-current before:opacity-40",
    "after:left-0 after:top-0 after:block after:size-full after:rounded-full after:border-transparent after:border-r-current after:border-t-current",
  ],
  variants: {
    size: {
      xs: "size-2 before:border after:border",
      sm: "size-3 before:border-[1.5px] after:border-[1.5px]",
      md: "size-4 before:border-2 after:border-2",
      lg: "size-5 before:border-2 after:border-2",
    },
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerStyle> {}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { className, size = "md", ...props },
  ref
) {
  return (
    <div
      aria-label="loading"
      role="progressbar"
      className={spinnerStyle({ size, className })}
      ref={ref}
      {...props}
    />
  );
});

export { Spinner };
