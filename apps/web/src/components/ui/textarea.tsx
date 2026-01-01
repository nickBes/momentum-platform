"use client";

import { tv, type VariantProps } from "tailwind-variants";
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";
import TextareaAutosize, { type TextareaAutosizeProps } from "react-textarea-autosize";
import { forwardRef, useId } from "react";

const textareaStyles = tv({
  base: "textarea transition-all outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed resize-none scrollbar-none",
  variants: {
    variant: {
      default: "textarea-bordered",
      ghost: "textarea-ghost",
      primary: "textarea-primary",
      secondary: "textarea-secondary",
      accent: "textarea-accent",
      info: "textarea-info",
      success: "textarea-success",
      warning: "textarea-warning",
      error: "textarea-error",
    },
    size: {
      xs: "textarea-xs",
      sm: "textarea-sm",
      default: "textarea-md",
      lg: "textarea-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type TextAreaVariants = VariantProps<typeof textareaStyles>;

interface TextAreaFieldProps
  extends
    Omit<AriaTextFieldProps, "children">,
    TextAreaVariants,
    Pick<TextareaAutosizeProps, "minRows" | "maxRows" | "onHeightChange" | "cacheMeasurements"> {
  className?: string;
  textAreaClassName?: string;
  placeholder?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      className,
      textAreaClassName,
      variant,
      size,
      placeholder,
      minRows = 1,
      maxRows,
      onHeightChange,
      cacheMeasurements,
      onKeyDown,
      value,
      onChange,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    const textareaId = useId();

    return (
      <AriaTextField
        className={className}
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        {...props}
      >
        <TextareaAutosize
          ref={ref}
          id={textareaId}
          className={textareaStyles({ variant, size, className: textAreaClassName })}
          placeholder={placeholder}
          minRows={minRows}
          maxRows={maxRows}
          onHeightChange={onHeightChange}
          cacheMeasurements={cacheMeasurements}
          onKeyDown={onKeyDown}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={isDisabled}
          aria-label={props["aria-label"]}
        />
      </AriaTextField>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export { TextAreaField, textareaStyles, type TextAreaFieldProps, type TextAreaVariants };
