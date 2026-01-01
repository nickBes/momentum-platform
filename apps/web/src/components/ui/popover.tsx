"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {
  DialogTrigger,
  Popover as AriaPopover,
  Dialog as AriaDialog,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { type ReactNode } from "react";

// Base popover styles shared across components
const popoverBaseStyles =
  "rounded-box border border-base-300 bg-base-100 shadow-lg outline-none entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95";

const popoverStyles = tv({
  base: `${popoverBaseStyles} p-4`,
  variants: {
    size: {
      sm: "w-64",
      default: "w-80",
      lg: "w-96",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type PopoverVariants = VariantProps<typeof popoverStyles>;

interface PopoverProps extends Omit<AriaPopoverProps, "children">, PopoverVariants {
  children: ReactNode;
  className?: string;
  /** Whether to wrap content in a Dialog for focus management. Set to false for menus. Defaults to true. */
  withDialog?: boolean;
}

function Popover({ children, className, size, withDialog = true, ...props }: PopoverProps) {
  return (
    <AriaPopover className={popoverStyles({ size, className })} {...props}>
      {withDialog ? <AriaDialog className="outline-none">{children}</AriaDialog> : children}
    </AriaPopover>
  );
}

export {
  DialogTrigger as PopoverTrigger,
  Popover,
  popoverStyles,
  popoverBaseStyles,
  type PopoverProps,
};
