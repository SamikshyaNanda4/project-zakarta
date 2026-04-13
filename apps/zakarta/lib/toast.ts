import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

// Main function
export function showToast(
  type: ToastType,
  message: string,
  description?: string
) {
  switch (type) {
    case "success":
      toast.success(message, { description });
      break;

    case "error":
      toast.error(message, { description });
      break;

    case "warning":
      toast.warning(message, { description });
      break;

    case "info":
      toast.info(message, { description }); 
      break;
  }
}

// Easy-to-use functions

export const toastSuccess = (msg: string, desc?: string) =>
  showToast("success", msg, desc);

export const toastError = (msg: string, desc?: string) =>
  showToast("error", msg, desc);

export const toastInfo = (msg: string, desc?: string) =>
  showToast("info", msg, desc);

export const toastWarning = (msg: string, desc?: string) =>
  showToast("warning", msg, desc);

export const toastLoading = (msg: string) =>
  toast.loading(msg);