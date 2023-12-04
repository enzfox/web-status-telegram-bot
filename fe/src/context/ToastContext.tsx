import { createContext, FC, ReactNode, useRef } from "react";
import { Toast } from "primereact/toast";

type ToastContextType = {
  showToast: (toastData: ToastData) => void;
};

type ToastData = {
  severity: "success" | "info" | "warn" | "error" | undefined;
  summary: string;
  detail: string;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showToast = ({ severity, summary, detail }: ToastData) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
