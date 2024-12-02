"use client";

import {
  createContext,
  FC,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingOptions,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from "@floating-ui/react";
import { cva, VariantProps } from "cva";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { Slot } from "./slot";

interface UseDialogOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpenChange?: UseFloatingOptions["onOpenChange"];
}

const useDialog = ({
  initialOpen = false,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
}: UseDialogOptions) => {
  const [internalOpen, setInternalOpen] = useState(initialOpen ?? false);
  const [labelId, setLabelId] = useState<string | undefined>(undefined);
  const [descriptionId, setDescriptionId] = useState<string | undefined>(
    undefined
  );

  const open = propsOpen ?? internalOpen;

  const setOpen = useCallback<NonNullable<UseFloatingOptions["onOpenChange"]>>(
    (open, event, reason) => {
      setInternalOpen(open);
      propsOnOpenChange?.(open, event, reason);
    },
    [propsOnOpenChange]
  );

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const context = floating.context;

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePressEvent: "mousedown" }); // so that touch events become lazy and do not fall through the backdrop, as the default behavior is eager
  const role = useRole(context, { role: "dialog" });

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [
      open,
      setOpen,
      interactions,
      floating,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    ]
  );
};

type ContextType = ReturnType<typeof useDialog> | null;

const DialogContext = createContext<ContextType>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (context == null) {
    throw new Error("Dialog components must be wrapped in <Dialog />");
  }

  return context;
};

interface DialogProps extends UseDialogOptions {
  children: React.ReactNode;
}

/**
 * Dialog allows you to create modal dialogs that overlay the main content.
 *
 * @example
 * ```
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open Dialog</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogTitle>Dialog Title</DialogTitle>
 *     <DialogDescription>This is a description of the dialog.</DialogDescription>
 *     <DialogActions>
 *       <DialogClose>
 *         <Button>Close</Button>
 *       </DialogClose>
 *     </DialogActions>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
const Dialog: FC<DialogProps> = ({ children, ...options }) => {
  const dialog = useDialog(options);

  return (
    <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>
  );
};

interface DialogTriggerProps extends React.HTMLProps<HTMLElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * Will open the dialog when clicked.
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <DialogTrigger asChild>
 *   <Button>Open Dialog</Button>
 * </DialogTrigger>
 *
 * <DialogTrigger>
 *   Open Dialog
 * </DialogTrigger>
 * ```
 */
const DialogTrigger = forwardRef<HTMLElement, DialogTriggerProps>(
  function DialogTrigger(
    { children, asChild = false, ...props },
    forwardedRef
  ) {
    const context = useDialogContext();
    const Comp = asChild ? Slot : FallbackButton;

    const ref = useMergeRefs([context.refs.setReference, forwardedRef]);

    return (
      <Comp
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        {...context.getReferenceProps(props)}
      >
        {children}
      </Comp>
    );
  }
);

const dialogOverlayStyle = cva({
  base: "z-50 flex max-h-screen overflow-y-auto overscroll-contain bg-black/20 p-4 backdrop-blur-sm transition-all duration-100 ease-in-out data-[state=closed]:bg-black/0 data-[state=closed]:backdrop-blur-none",
  variants: {
    align: {
      center: "items-center justify-center",
      top: "items-start justify-center pt-16",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

interface DialogContentProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  wrapperClassName?: string;
  align?: VariantProps<typeof dialogOverlayStyle>["align"];
}

/**
 * Will render the dialog content.
 *
 * @example
 * ```
 * <DialogContent>
 *   <p>Dialog Content</p>
 * </DialogContent>
 * ```
 */
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(
    { children, className, wrapperClassName, align, ...props },
    forwardedRef
  ) {
    const { context, labelId, descriptionId, getFloatingProps } =
      useDialogContext();

    const ref = useMergeRefs([context.refs.setFloating, forwardedRef]);

    const { isMounted, status } = useTransitionStatus(context, {
      duration: 150, // unmount after 150
    });

    const state = ["open", "initial"].includes(status) ? "open" : "closed";

    if (!isMounted) return null;

    return (
      <FloatingPortal>
        <FloatingOverlay
          lockScroll
          data-state={state}
          className={cn(dialogOverlayStyle({ align }), wrapperClassName)}
        >
          <FloatingFocusManager context={context}>
            <div
              aria-labelledby={labelId}
              aria-describedby={descriptionId}
              ref={ref}
              data-state={state}
              {...getFloatingProps(props)}
              className={cn(
                "bg-background w-full max-w-md rounded-3xl p-4 shadow-lg border border-border",
                "max-h-[calc(100vh-2rem)] overflow-y-auto",
                "ease-out-quart transition-all",
                "data-[state=closed]:translate-y-2 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:duration-150 data-[state=open]:translate-y-0 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=open]:duration-300",
                className
              )}
            >
              {children}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      </FloatingPortal>
    );
  }
);

interface DialogTitleProps extends React.HTMLProps<HTMLHeadingElement> {
  children: React.ReactNode;
}

/**
 * Renders the title of the dialog.
 *
 * This component automatically sets the `aria-labelledby` attribute on the dialog element,
 * ensuring proper accessibility by connecting the title to the dialog content.
 *
 * @example
 * ```
 * <DialogTitle>Dialog Title</DialogTitle>
 * ```
 */
const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ children, className, ...props }, forwardedRef) {
    const { setLabelId } = useDialogContext();

    const generatedId = useId();
    const id = props.id ?? generatedId;

    useLayoutEffect(() => {
      setLabelId(id);
      return () => setLabelId(undefined);
    }, [id, setLabelId]);

    return (
      <h2
        {...props}
        ref={forwardedRef}
        id={id}
        className={cn("pb-2 font-semibold", className)}
      >
        {children}
      </h2>
    );
  }
);

interface DialogDescriptionProps extends React.HTMLProps<HTMLParagraphElement> {
  children: React.ReactNode;
}

/**
 * Renders a description for the dialog.
 *
 * This component automatically sets the `aria-describedby` attribute on the dialog element,
 * ensuring proper accessibility by connecting the description to the dialog content.
 *
 * @example
 * ```
 * <DialogDescription>This is a description of the dialog.</DialogDescription>
 * ```
 */
const DialogDescription = forwardRef<HTMLDivElement, DialogDescriptionProps>(
  function DialogDescription({ children, className, ...props }, forwardedRef) {
    const { setDescriptionId } = useDialogContext();

    const generatedId = useId();
    const id = props.id ?? generatedId;

    useLayoutEffect(() => {
      setDescriptionId(id);
      return () => setDescriptionId(undefined);
    }, [id, setDescriptionId]);

    return (
      <p
        {...props}
        ref={forwardedRef}
        id={id}
        className={cn("text-foreground", className)}
      >
        {children}
      </p>
    );
  }
);

/**
 * Renders a container for dialog action buttons.
 *
 * This component is designed to be placed at the bottom of the dialog content,
 * providing a consistent layout for action buttons such as "Cancel" and "Confirm".
 *
 * @example
 * ```
 * <DialogActions>
 *   <DialogClose asChild>
 *     <Button variant="secondary">Cancel</Button>
 *   </DialogClose>
 *   <Button>Confirm</Button>
 * </DialogActions>
 * ```
 */

const DialogActions = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-2 pt-4 sm:flex-row sm:justify-start",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
DialogActions.displayName = "DialogActions";

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

/**
 * Will close the dialog when clicked.
 *
 * Useful to dismiss the dialog from within (e.g.: dialog with a form and a cancel button).
 *
 * Use `asChild` to render as your child element.
 *
 * @example
 * ```
 * <DialogClose asChild>
 *   <Button>Cancel</Button>
 * </DialogClose>
 * ```
 */
const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ asChild = false, children, ...props }, forwardedRef) {
    const { setOpen } = useDialogContext();
    const Comp = asChild ? Slot : FallbackButton;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      setOpen(false);
    };

    return (
      <Comp ref={forwardedRef} {...props} onClick={handleClick}>
        {children}
      </Comp>
    );
  }
);

const FallbackButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(function FallbackButton({ children, ...props }, forwardedRef) {
  return (
    <Button type="button" variant="secondary" ref={forwardedRef} {...props}>
      {children}
    </Button>
  );
});

export {
  useDialogContext,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogActions,
  DialogClose,
};
