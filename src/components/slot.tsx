"use client";

import { cn } from "@/lib/utils";
import { Children, cloneElement, isValidElement } from "react";

const Slot = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
}) => {
  const element = Children.only(children);

  if (isValidElement(element)) {
    return cloneElement(element, {
      ...props,
      ...element.props,
      style: {
        ...props.style,
        ...element.props.style,
      },
      className: cn(props.className, element.props.className),
    });
  }

  throw new Error("Slot needs a valid react element child");
};

type SlottableProps = {
  asChild: boolean;
  child: React.ReactNode;
  children: (child: React.ReactNode) => JSX.Element;
};

/**
 * Slottable is required when you want to use a Slot but render more than one child inside (e.g.: a button with the children + a spinner icon)
 *
 * see https://github.com/radix-ui/primitives/issues/1825
 */
const Slottable = ({ asChild, child, children, ...props }: SlottableProps) => {
  return (
    <>
      {asChild
        ? isValidElement(child)
          ? cloneElement(child, props, children(child.props.children))
          : null
        : children(child)}
    </>
  );
};

export { Slot, Slottable };
