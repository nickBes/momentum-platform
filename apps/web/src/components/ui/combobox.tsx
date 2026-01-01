"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {
  ComboBox as AriaComboBox,
  Input as AriaInput,
  type ComboBoxProps as AriaComboBoxProps,
} from "react-aria-components";
import { type ReactNode } from "react";
import { Popover } from "./popover";
import { ListBoxMenu, ListBoxMenuItem } from "./menu";

const comboBoxStyles = tv({
  slots: {
    root: "flex flex-col gap-1",
    inputWrapper: "relative flex items-center",
    input:
      "input input-bordered w-full pr-8 transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
    button:
      "absolute right-2 flex h-6 w-6 items-center justify-center rounded text-base-content/50 hover:text-base-content",
    emptyState: "px-3 py-2 text-base-content/50 text-sm",
  },
  variants: {
    size: {
      sm: {
        input: "input-sm",
      },
      default: {
        input: "input-md",
      },
      lg: {
        input: "input-lg",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ComboBoxVariants = VariantProps<typeof comboBoxStyles>;

interface ComboBoxItemType {
  id: string;
  name: string;
}

interface ComboBoxProps<T extends ComboBoxItemType>
  extends Omit<AriaComboBoxProps<T>, "children">, ComboBoxVariants {
  items: T[];
  placeholder?: string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  label?: string;
  children?: (item: T) => ReactNode;
}

function ComboBox<T extends ComboBoxItemType>({
  items,
  placeholder,
  isLoading,
  emptyMessage = "No results found",
  className,
  size,
  label,
  children,
  ...props
}: ComboBoxProps<T>) {
  const styles = comboBoxStyles({ size });

  return (
    <AriaComboBox className={styles.root({ className })} {...props}>
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className={styles.inputWrapper()}>
        <AriaInput className={styles.input()} placeholder={placeholder} />
        {isLoading && (
          <span className={styles.button()}>
            <span className="loading loading-spinner loading-xs" />
          </span>
        )}
      </div>
      <Popover withDialog={false} className="w-(--trigger-width) overflow-hidden p-0">
        <ListBoxMenu className="max-h-60 overflow-y-auto" items={items}>
          {(item) =>
            children ? (
              children(item)
            ) : (
              <ComboBoxItem key={item.id} id={item.id}>
                {item.name}
              </ComboBoxItem>
            )
          }
        </ListBoxMenu>
        {!isLoading && items.length === 0 && (
          <div className={styles.emptyState()}>{emptyMessage}</div>
        )}
      </Popover>
    </AriaComboBox>
  );
}

interface ComboBoxItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

function ComboBoxItem({ id, children, className }: ComboBoxItemProps) {
  return (
    <ListBoxMenuItem id={id} className={className}>
      {children}
    </ListBoxMenuItem>
  );
}

export { ComboBox, ComboBoxItem, comboBoxStyles, type ComboBoxProps, type ComboBoxItemType };
