import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

const DEFAULT_DURATION = 4000;

// Main function
export function showToast(
  type: ToastType,
  message: string,
  description?: string,
  duration: number = DEFAULT_DURATION
) {
  const options = { description, duration };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;

    case "error":
      toast.error(message, options);
      break;

    case "warning":
      toast.warning(message, options);
      break;

    case "info":
      toast.info(message, options);
      break;

    default:
      toast(message, options);
      break;
  }
}

// Convenience helpers
export const toastSuccess = (msg: string, desc?: string, duration?: number) =>
  showToast("success", msg, desc, duration);

export const toastError = (msg: string, desc?: string, duration?: number) =>
  showToast("error", msg, desc, duration);

export const toastInfo = (msg: string, desc?: string, duration?: number) =>
  showToast("info", msg, desc, duration);

export const toastWarning = (msg: string, desc?: string, duration?: number) =>
  showToast("warning", msg, desc, duration);

// Loading toasts are persistent by default (no auto-dismiss)
export const toastLoading = (msg: string) =>
  toast.loading(msg);