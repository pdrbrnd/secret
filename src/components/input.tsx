"use client";

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { VariantProps } from "cva";

import { cva, cn } from "@/lib/utils";
import { composeRefs } from "@/lib/utils/react";

const dateTypes = ["date", "datetime-local", "month", "time", "week"];

const inputStyle = cva({
  base: [
    "transition",
    "w-full border h-10 rounded-xl px-4 py-1 text-base font-medium",
    "focus:outline-none focus-visible:border-foreground/20 focus-visible:ring-4 focus-visible:ring-foreground/10 focus-visible:text-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground/80 placeholder:text-foreground/40 data-[invalid]:border-red-500 data-[invalid]:hover:border-red-600 data-[invalid]:focus-visible:border-red-500 data-[invalid]:focus-visible:ring-red-500/20",
  ],
  variants: {
    variant: {
      default:
        "border-border bg-background hover:border-foreground/10 shadow-xs",
      minimal:
        "border-transparent bg-transparent hover:bg-foreground/2 focus-visible:bg-background",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {
  invalid?: boolean;
  variant?: VariantProps<typeof inputStyle>["variant"];
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, variant, ...props },
  ref
) {
  const { prefixWidth, suffixWidth } = useContext(InputGroupContext);

  return (
    <input
      ref={ref}
      data-invalid={invalid}
      aria-invalid={invalid}
      className={cn(
        inputStyle({ variant }),
        prefixWidth > 0 &&
          "pl-[calc(var(--prefix-width)+theme(spacing.3)+theme(spacing[1.5]))]",
        suffixWidth > 0 &&
          "pr-[calc(var(--suffix-width)+theme(spacing.3)+theme(spacing[1.5]))]",
        props.type &&
          dateTypes.includes(props.type) && [
            "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
            "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
            "[&::-webkit-datetime-edit]:inline-flex",
            "[&::-webkit-datetime-edit]:p-0",
            "[&::-webkit-datetime-edit-year-field]:p-0",
            "[&::-webkit-datetime-edit-month-field]:p-0",
            "[&::-webkit-datetime-edit-day-field]:p-0",
            "[&::-webkit-datetime-edit-hour-field]:p-0",
            "[&::-webkit-datetime-edit-minute-field]:p-0",
            "[&::-webkit-datetime-edit-second-field]:p-0",
            "[&::-webkit-datetime-edit-millisecond-field]:p-0",
            "[&::-webkit-datetime-edit-meridiem-field]:p-0",
            "[&::-webkit-calendar-picker-indicator]:hidden",
          ],
        props.type === "number" && [
          "[&::-webkit-inner-spin-button]:hidden",
          "[&::-webkit-outer-spin-button]:hidden",
          "[appearance:textfield]",
        ],
        className
      )}
      {...props}
    />
  );
});

interface InputGroupContextType {
  prefixWidth: number;
  suffixWidth: number;
  setPrefixWidth: (width: number) => void;
  setSuffixWidth: (width: number) => void;
}

const InputGroupContext = createContext<InputGroupContextType>({
  prefixWidth: 0,
  suffixWidth: 0,
  setPrefixWidth: () => {},
  setSuffixWidth: () => {},
});

const InputGroup = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(function InputGroup({ className, style, ...props }, ref) {
  const [prefixWidth, setPrefixWidth] = useState(0);
  const [suffixWidth, setSuffixWidth] = useState(0);

  // check if there are more than one InputPrefix or InputSuffix
  const tooManyPrefixes =
    Children.toArray(props.children).filter(
      (child) => isValidElement(child) && child.type === InputPrefix
    ).length > 1;

  const tooManySuffixes =
    Children.toArray(props.children).filter(
      (child) => isValidElement(child) && child.type === InputSuffix
    ).length > 1;

  if (tooManyPrefixes || tooManySuffixes) {
    throw new Error(
      "InputGroup cannot have more than one InputPrefix or InputSuffix"
    );
  }

  return (
    <InputGroupContext.Provider
      value={{ prefixWidth, suffixWidth, setPrefixWidth, setSuffixWidth }}
    >
      <div
        className={cn("relative", className)}
        ref={ref}
        style={{
          "--prefix-width": `${prefixWidth}px`,
          "--suffix-width": `${suffixWidth}px`,
          ...style,
        }}
        {...props}
      />
    </InputGroupContext.Provider>
  );
});

interface InputPrefixProps extends React.ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
}

const InputPrefix = forwardRef<HTMLDivElement, InputPrefixProps>(
  function InputPrefix(props, ref) {
    const ctx = useContext(InputGroupContext);

    if (!ctx) {
      throw new Error("InputPrefix must be used within an InputGroup");
    }

    const { setPrefixWidth } = ctx;

    return <InputAddon ref={ref} {...props} onSetWidth={setPrefixWidth} />;
  }
);

interface InputSuffixProps extends React.ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
}

const InputSuffix = forwardRef<HTMLDivElement, InputSuffixProps>(
  function InputSuffix(props, ref) {
    const ctx = useContext(InputGroupContext);

    if (!ctx) {
      throw new Error("InputSuffix must be used within an InputGroup");
    }

    const { setSuffixWidth } = ctx;

    return <InputAddon ref={ref} {...props} onSetWidth={setSuffixWidth} />;
  }
);

interface InputAddonProps extends React.ComponentPropsWithoutRef<"div"> {
  onSetWidth?: (width: number) => void;
  interactive?: boolean;
}

const InputAddon = forwardRef<HTMLDivElement, InputAddonProps>(
  function InputAddon({ className, onSetWidth, interactive, ...props }, ref) {
    const internalRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      onSetWidth?.(internalRef.current?.offsetWidth ?? 0);

      const observer = new ResizeObserver(([entry]) => {
        if (entry?.contentRect.width) {
          onSetWidth?.(entry.contentRect.width);
        }
      });

      if (internalRef.current) {
        observer.observe(internalRef.current);
      }

      return () => observer.disconnect();
    }, [onSetWidth]);

    return (
      <div
        data-input-addon
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center justify-center text-base font-medium",
          "first:left-3 last:right-3",
          interactive
            ? "text-foreground hover:text-foreground/50 transition"
            : "text-foreground pointer-events-none",
          className
        )}
        ref={composeRefs(ref, internalRef)}
        {...props}
      />
    );
  }
);

export { Input, inputStyle, InputGroup, InputPrefix, InputSuffix };
