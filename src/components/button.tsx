"use client";

import { cn, cva } from "@/lib/utils";
import { VariantProps } from "cva";
import { forwardRef } from "react";
import { Slot, Slottable } from "./slot";
import { Spinner } from "./spinner";

const buttonStyle = cva({
  base: "relative whitespace-nowrap inline-flex items-center justify-center gap-1.5 font-medium shadow-xs transition focus-visible:outline-none focus-visible:ring-4 enabled:active:scale-[0.98] disabled:opacity-40 enabled:cursor-pointer h-(--button-height)",
  variants: {
    variant: {
      primary: "bg-foreground text-background ring-foreground/10",
      secondary: "border border-border ring-foreground/10",
      destructive: "bg-red-600 text-white ring-red-600/20 hover:bg-red-700",
    },
    size: {
      sm: "rounded-lg px-3 text-sm [--button-height:theme(spacing.8)]",
      md: "rounded-xl px-4 text-base [--button-height:theme(spacing.10)]",
      lg: "rounded-2xl px-5 text-base [--button-height:theme(spacing.12)]",
    },
    square: {
      true: "w-(--button-height) px-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyle> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant,
    asChild = false,
    isLoading,
    size = "md",
    square,
    type = "button",
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonStyle({
          className,
          variant,
          size,
          square,
        }),
        isLoading && "[&>*:not(.button-icon)]:invisible"
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <Slottable asChild={asChild} child={children}>
        {(child) => (
          <>
            {typeof child === "string" ? <span>{child}</span> : child}
            {isLoading && (
              <span
                className={cn(
                  "button-icon",
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                )}
              >
                <Spinner size={size} />
              </span>
            )}
          </>
        )}
      </Slottable>
    </Comp>
  );
});

export { Button, buttonStyle };
