"use client";

import { tv } from "tailwind-variants";
import {
  UNSTABLE_ToastRegion as ToastRegion,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  Button,
  Text,
} from "react-aria-components";
import type { QueuedToast } from "react-aria-components";
import { CircleCheckIcon, InfoIcon, OctagonXIcon, TriangleAlertIcon, XIcon } from "lucide-react";

// Toast content type
interface ToastData {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
}

// Create a global toast queue
export const toastQueue = new ToastQueue<ToastData>({
  maxVisibleToasts: 5,
});

// Helper functions to add toasts (replaces sonner's toast.success, etc.)
export const toast = {
  success: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "success" }, { timeout: 5000 }),
  error: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "error" }, { timeout: 5000 }),
  warning: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "warning" }, { timeout: 5000 }),
  info: (title: string, description?: string) =>
    toastQueue.add({ title, description, type: "info" }, { timeout: 5000 }),
  message: (title: string, description?: string) =>
    toastQueue.add({ title, description }, { timeout: 5000 }),
};

const toastStyles = tv({
  slots: {
    region: "fixed bottom-4 right-4 z-50 flex flex-col gap-2 outline-none",
    toast: "alert shadow-lg animate-in slide-in-from-right-full fade-in duration-300",
    content: "flex-1",
    title: "font-medium",
    description: "text-sm opacity-80",
    closeButton: "btn btn-ghost btn-sm btn-circle",
  },
  variants: {
    type: {
      success: {
        toast: "alert-success",
      },
      error: {
        toast: "alert-error",
      },
      warning: {
        toast: "alert-warning",
      },
      info: {
        toast: "alert-info",
      },
      default: {
        toast: "",
      },
    },
  },
  defaultVariants: {
    type: "default",
  },
});

const { region, toast: toastClass, content, title, description, closeButton } = toastStyles();

const ToastIcon = ({ type }: { type?: ToastData["type"] }) => {
  const iconClass = "size-5";
  switch (type) {
    case "success":
      return <CircleCheckIcon className={iconClass} />;
    case "error":
      return <OctagonXIcon className={iconClass} />;
    case "warning":
      return <TriangleAlertIcon className={iconClass} />;
    case "info":
      return <InfoIcon className={iconClass} />;
    default:
      return null;
  }
};

export function Toaster() {
  return (
    <ToastRegion queue={toastQueue} className={region()}>
      {({ toast: t }: { toast: QueuedToast<ToastData> }) => (
        <AriaToast toast={t} className={toastClass({ type: t.content.type || "default" })}>
          <ToastIcon type={t.content.type} />
          <ToastContent className={content()}>
            <Text slot="title" className={title()}>
              {t.content.title}
            </Text>
            {t.content.description && (
              <Text slot="description" className={description()}>
                {t.content.description}
              </Text>
            )}
          </ToastContent>
          <Button slot="close" className={closeButton()}>
            <XIcon className="size-4" />
          </Button>
        </AriaToast>
      )}
    </ToastRegion>
  );
}

export { toastStyles };
