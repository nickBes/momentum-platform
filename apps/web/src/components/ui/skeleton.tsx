import { tv, type VariantProps } from "tailwind-variants";

const skeletonStyles = tv({
  base: "skeleton animate-pulse",
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      text: "h-4 w-full",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type SkeletonVariants = VariantProps<typeof skeletonStyles>;

interface SkeletonProps extends React.ComponentProps<"div">, SkeletonVariants {
  className?: string;
}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return <div data-slot="skeleton" className={skeletonStyles({ variant, className })} {...props} />;
}

export { Skeleton, skeletonStyles, type SkeletonProps, type SkeletonVariants };
