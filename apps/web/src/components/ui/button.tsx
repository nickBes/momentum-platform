import { tv, type VariantProps } from "tailwind-variants";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

const buttonStyles = tv({
  base: "btn transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    variant: {
      default: "btn-primary",
      secondary: "btn-secondary",
      outline: "btn-outline",
      ghost: "btn-ghost",
      destructive: "btn-error",
      link: "btn-link",
    },
    size: {
      default: "btn-md",
      xs: "btn-xs",
      sm: "btn-sm",
      lg: "btn-lg",
      icon: "btn-square btn-md",
      "icon-xs": "btn-square btn-xs",
      "icon-sm": "btn-square btn-sm",
      "icon-lg": "btn-square btn-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof buttonStyles>;

interface ButtonProps extends AriaButtonProps, ButtonVariants {
  className?: string;
}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <AriaButton
      data-slot="button"
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

export { Button, buttonStyles, type ButtonProps, type ButtonVariants };
