"use client";

import { forwardRef, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, orientation = "horizontal", decorative, ...props },
  ref
) {
  // https://github.com/radix-ui/primitives/blob/main/packages/react/separator/src/Separator.tsx
  // `aria-orientation` defaults to `horizontal` so we only need it if `orientation` is vertical
  const ariaOrientation = orientation === "vertical" ? orientation : undefined;
  const semanticProps = decorative
    ? { role: "none" }
    : { "aria-orientation": ariaOrientation, role: "separator" };

  return (
    <div
      ref={ref}
      className={cn(
        "bg-border shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...semanticProps}
      {...props}
    />
  );
});

export { Divider };
