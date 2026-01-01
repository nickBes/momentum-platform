import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "react-aria-components";
import { type ReactNode } from "react";

const badgeStyles = tv({
  base: "badge gap-1",
  variants: {
    color: {
      default: "badge-neutral",
      primary: "badge-primary",
      secondary: "badge-secondary",
      accent: "badge-accent",
      info: "badge-info",
      success: "badge-success",
      warning: "badge-warning",
      error: "badge-error",
      ghost: "badge-ghost",
    },
    variant: {
      default: "",
      outline: "badge-outline",
      dash: "badge-dash",
      soft: "badge-soft",
    },
    size: {
      xs: "badge-xs",
      sm: "badge-sm",
      default: "badge-md",
      lg: "badge-lg",
      xl: "badge-xl",
    },
  },
  defaultVariants: {
    color: "default",
    variant: "default",
    size: "default",
  },
});

type BadgeVariants = VariantProps<typeof badgeStyles>;

interface BadgeProps extends BadgeVariants {
  children: ReactNode;
  className?: string;
  onRemove?: () => void;
}

function Badge({ children, className, color, variant, size, onRemove }: BadgeProps) {
  return (
    <span className={badgeStyles({ color, variant, size, className })}>
      {children}
      {onRemove && (
        <Button
          onPress={onRemove}
          className="hover:bg-base-content/20 rounded-full p-0.5 transition-colors outline-none"
          aria-label="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}
    </span>
  );
}

export { Badge, badgeStyles, type BadgeProps, type BadgeVariants };
