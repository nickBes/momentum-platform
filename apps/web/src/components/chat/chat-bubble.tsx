import { tv, type VariantProps } from "tailwind-variants";

const chatBubbleStyles = tv({
  slots: {
    container: "chat",
    image: "chat-image avatar",
    header: "chat-header",
    bubble: "chat-bubble",
    footer: "chat-footer opacity-50",
  },
  variants: {
    placement: {
      start: {
        container: "chat-start",
      },
      end: {
        container: "chat-end",
      },
    },
    color: {
      default: {
        bubble: "",
      },
      neutral: {
        bubble: "chat-bubble-neutral",
      },
      primary: {
        bubble: "chat-bubble-primary",
      },
      secondary: {
        bubble: "chat-bubble-secondary",
      },
      accent: {
        bubble: "chat-bubble-accent",
      },
      info: {
        bubble: "chat-bubble-info",
      },
      success: {
        bubble: "chat-bubble-success",
      },
      warning: {
        bubble: "chat-bubble-warning",
      },
      error: {
        bubble: "chat-bubble-error",
      },
    },
  },
  defaultVariants: {
    placement: "start",
    color: "default",
  },
});

type ChatBubbleVariants = VariantProps<typeof chatBubbleStyles>;

interface ChatBubbleProps extends ChatBubbleVariants {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  avatar?: React.ReactNode;
}

function ChatBubble({
  children,
  className,
  placement,
  color,
  header,
  footer,
  avatar,
}: ChatBubbleProps) {
  const styles = chatBubbleStyles({ placement, color });

  return (
    <div className={styles.container({ className })} role="listitem">
      {avatar && <div className={styles.image()}>{avatar}</div>}
      {header && <div className={styles.header()}>{header}</div>}
      <div className={styles.bubble()}>{children}</div>
      {footer && <div className={styles.footer()}>{footer}</div>}
    </div>
  );
}

export { ChatBubble, chatBubbleStyles, type ChatBubbleProps, type ChatBubbleVariants };
