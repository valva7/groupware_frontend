import { toast } from "react-toastify";

export const notify = {
  success: (msg: string) =>
      toast.success(msg, { position: "top-right", autoClose: 3000 }),

  error: (msg: string) =>
      toast.error(msg, { position: "top-right", autoClose: 5000 }),

  info: (msg: string) =>
      toast.info(msg, { position: "bottom-right", autoClose: 3000 }),
};
