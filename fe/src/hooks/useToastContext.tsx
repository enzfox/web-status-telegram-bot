import ToastContext from "../context/ToastContext.tsx";
import { useContext } from "react";

export const useToast = () => useContext(ToastContext);
