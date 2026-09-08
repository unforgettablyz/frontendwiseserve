import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type Theme = "light" | "dark";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  theme?: Theme;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  theme = "light",
}: ModalProps) => {
  if (!isOpen) return null;

  const isDark = theme === "dark";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/30 p-4 backdrop-blur-md"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`my-4 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[28px] border p-6 shadow-[0_28px_80px_rgba(15,23,42,0.2)] transition-colors duration-300 ${
          isDark
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200/80 text-slate-800"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 id="modal-title" className="text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`p-1.5 rounded-full transition-colors ${
              isDark
                ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
