import { tv, type VariantProps } from "tailwind-variants";
import {
  MenuTrigger,
  Separator,
  Section,
  Header,
  SubmenuTrigger,
  type MenuItemProps,
  type SeparatorProps,
} from "react-aria-components";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";

import { Popover, type PopoverProps } from "./popover";
import { Menu, MenuItem, menuStyles, type MenuProps } from "./menu";

const dropdownStyles = tv({
  slots: {
    content: "",
    checkboxItem:
      "flex cursor-default select-none items-center gap-2 rounded-btn px-3 py-2 text-sm outline-none transition-colors data-focused:bg-base-200",
    radioItem:
      "flex cursor-default select-none items-center gap-2 rounded-btn px-3 py-2 text-sm outline-none transition-colors data-focused:bg-base-200",
    subTrigger:
      "flex cursor-default select-none items-center gap-2 rounded-btn px-3 py-2 text-sm outline-none transition-colors data-focused:bg-base-200 data-open:bg-base-200",
    shortcut: "ml-auto text-xs tracking-widest text-base-content/50",
    label: "px-3 py-2 text-xs font-semibold text-base-content/60",
    separator: "divider my-1",
    group: "",
  },
});

const { checkboxItem, radioItem, subTrigger, shortcut, label, separator, group } = dropdownStyles();

// Re-export MenuTrigger for convenience
const DropdownMenu = MenuTrigger;

interface DropdownMenuContentProps extends MenuProps<object> {
  placement?: PopoverProps["placement"];
  offset?: number;
}

function DropdownMenuContent({
  className,
  placement = "bottom start",
  offset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Popover placement={placement} offset={offset} withDialog={false} className="p-0" size="sm">
      <Menu data-slot="dropdown-menu-content" className={className} {...props} />
    </Popover>
  );
}

function DropdownMenuGroup({ className, ...props }: React.ComponentProps<typeof Section>) {
  return <Section data-slot="dropdown-menu-group" className={group({ className })} {...props} />;
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof Header>) {
  return <Header data-slot="dropdown-menu-label" className={label({ className })} {...props} />;
}

type MenuItemVariants = VariantProps<typeof menuStyles>;

interface DropdownMenuItemProps extends MenuItemProps, MenuItemVariants {
  className?: string;
}

function DropdownMenuItem({ className, variant, ...props }: DropdownMenuItemProps) {
  return (
    <MenuItem data-slot="dropdown-menu-item" className={className} variant={variant} {...props} />
  );
}

function DropdownMenuSeparator({ className, ...props }: SeparatorProps & { className?: string }) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={separator({ className })}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={shortcut({ className })} {...props} />;
}

// Submenu support
function DropdownMenuSub({ ...props }: React.ComponentProps<typeof SubmenuTrigger>) {
  return <SubmenuTrigger data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  children,
  ...props
}: Omit<MenuItemProps, "children"> & { className?: string; children?: React.ReactNode }) {
  return (
    <MenuItem
      data-slot="dropdown-menu-sub-trigger"
      className={subTrigger({ className })}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuItem>
  );
}

function DropdownMenuSubContent({ className, ...props }: DropdownMenuContentProps) {
  return (
    <Popover withDialog={false} className="p-0" size="sm">
      <Menu data-slot="dropdown-menu-sub-content" className={className} {...props} />
    </Popover>
  );
}

// Checkbox item with indicator
interface DropdownMenuCheckboxItemProps extends Omit<MenuItemProps, "children"> {
  className?: string;
  checked?: boolean;
  children?: React.ReactNode;
}

function DropdownMenuCheckboxItem({
  className,
  checked,
  children,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuItem
      data-slot="dropdown-menu-checkbox-item"
      className={checkboxItem({ className })}
      {...props}
    >
      <span className="flex size-4 items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </MenuItem>
  );
}

// Radio group and item
function DropdownMenuRadioGroup({ className, ...props }: React.ComponentProps<typeof Section>) {
  return (
    <Section data-slot="dropdown-menu-radio-group" className={group({ className })} {...props} />
  );
}

interface DropdownMenuRadioItemProps extends Omit<MenuItemProps, "children"> {
  className?: string;
  checked?: boolean;
  children?: React.ReactNode;
}

function DropdownMenuRadioItem({
  className,
  checked,
  children,
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <MenuItem data-slot="dropdown-menu-radio-item" className={radioItem({ className })} {...props}>
      <span className="flex size-4 items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </MenuItem>
  );
}

// Export a Portal placeholder (React Aria handles portaling internally)
function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Export a Trigger wrapper for compatibility
function DropdownMenuTrigger({ children }: React.ComponentProps<"button">) {
  // This is just for API compatibility - the actual trigger is handled by MenuTrigger
  return <>{children}</>;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  dropdownStyles,
};
