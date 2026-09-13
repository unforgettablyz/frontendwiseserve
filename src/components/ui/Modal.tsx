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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/35 p-4 backdrop-blur-md"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`my-4 max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[28px] border p-5 shadow-[0_28px_80px_rgba(15,23,42,0.18)] transition-colors duration-300 ${
          isDark
            ? "border-slate-700 bg-slate-900 text-slate-100"
            : "border-[#BFE7E8] bg-[#F1FCFC] text-slate-800"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold ${
                isDark
                  ? "bg-slate-800 text-cyan-300"
                  : "bg-[#DDF7F4] text-[#0EA5A4]"
              }`}
            >
              ✦
            </div>
            <h3
              id="modal-title"
              className="text-lg font-semibold tracking-[-0.03em]"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`rounded-full p-1.5 transition-colors ${
              isDark
                ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                : "text-slate-500 hover:bg-[#DDF7F4] hover:text-[#0F172A]"
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

export default Modal;
