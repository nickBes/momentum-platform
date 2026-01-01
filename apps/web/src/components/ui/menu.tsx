"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Separator as AriaSeparator,
  Header as AriaHeader,
  Section as AriaSection,
  type MenuProps as AriaMenuProps,
  type MenuItemProps as AriaMenuItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { type ReactNode } from "react";

const menuStyles = tv({
  slots: {
    menu: "flex flex-col w-full bg-base-100 p-2",
    item: "rounded-btn px-3 py-2 cursor-pointer outline-none transition-colors data-focused:bg-base-200 data-disabled:opacity-50 data-disabled:pointer-events-none",
    title: "menu-title px-3 py-2 text-xs font-semibold text-base-content/60",
    separator: "divider my-1",
    group: "",
  },
  variants: {
    size: {
      xs: { menu: "menu-xs" },
      sm: { menu: "menu-sm" },
      default: { menu: "menu-md" },
      lg: { menu: "menu-lg" },
      xl: { menu: "menu-xl" },
    },
    variant: {
      default: { item: "" },
      active: { item: "menu-active bg-primary text-primary-content" },
      focus: { item: "menu-focus" },
      destructive: { item: "text-error data-focused:bg-error/10 data-focused:text-error" },
    },
    direction: {
      vertical: { menu: "menu-vertical" },
      horizontal: { menu: "menu-horizontal" },
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
    direction: "vertical",
  },
});

type MenuStyleVariants = VariantProps<typeof menuStyles>;

// ============================================================================
// Dropdown Menu (uses AriaMenu with ul/li structure)
// ============================================================================

interface MenuProps<T extends object> extends AriaMenuProps<T>, MenuStyleVariants {
  className?: string;
}

function Menu<T extends object>({ className, size, direction, ...props }: MenuProps<T>) {
  const styles = menuStyles({ size, direction });
  return <AriaMenu className={styles.menu({ className })} {...props} />;
}

interface MenuItemProps extends AriaMenuItemProps, MenuStyleVariants {
  className?: string;
}

function MenuItem({ className, variant, ...props }: MenuItemProps) {
  const styles = menuStyles({ variant });
  return <AriaMenuItem className={styles.item({ className })} {...props} />;
}

// ============================================================================
// ListBox Menu (uses AriaListBox for combobox, select, etc.)
// ============================================================================

interface ListBoxMenuProps<T extends object> extends AriaListBoxProps<T>, MenuStyleVariants {
  className?: string;
}

function ListBoxMenu<T extends object>({
  className,
  size,
  direction,
  ...props
}: ListBoxMenuProps<T>) {
  const styles = menuStyles({ size, direction });
  return <AriaListBox className={styles.menu({ className })} {...props} />;
}

interface ListBoxMenuItemProps extends AriaListBoxItemProps, MenuStyleVariants {
  className?: string;
}

function ListBoxMenuItem({ className, variant, ...props }: ListBoxMenuItemProps) {
  const styles = menuStyles({ variant });
  return <AriaListBoxItem className={styles.item({ className })} {...props} />;
}

// ============================================================================
// Shared Components (work with both Menu and ListBox)
// ============================================================================

interface MenuTitleProps {
  className?: string;
  children?: ReactNode;
}

function MenuTitle({ className, children }: MenuTitleProps) {
  const styles = menuStyles();
  return <AriaHeader className={styles.title({ className })}>{children}</AriaHeader>;
}

interface MenuSeparatorProps extends Omit<AriaSeparatorProps, "className"> {
  className?: string;
}

function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  const styles = menuStyles();
  return <AriaSeparator className={styles.separator({ className })} {...props} />;
}

interface MenuGroupProps {
  className?: string;
  children?: ReactNode;
}

function MenuGroup({ className, children }: MenuGroupProps) {
  const styles = menuStyles();
  return <AriaSection className={styles.group({ className })}>{children}</AriaSection>;
}

export {
  Menu,
  MenuItem,
  ListBoxMenu,
  ListBoxMenuItem,
  MenuTitle,
  MenuSeparator,
  MenuGroup,
  menuStyles,
  type MenuProps,
  type MenuItemProps,
  type ListBoxMenuProps,
  type ListBoxMenuItemProps,
  type MenuStyleVariants,
};
