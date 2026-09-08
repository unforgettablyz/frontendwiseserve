import type { InputHTMLAttributes } from "react";

type Theme = "light" | "dark";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  theme?: Theme;
}

export const Input = ({
  label,
  className = "",
  theme = "light",
  ...props
}: InputProps) => {
  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          className={`text-xs font-semibold tracking-[0.08em] uppercase pl-1 ${
            isDark ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </label>
      )}
      <input
        className={`rounded-2xl px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm ${
          isDark
            ? "bg-slate-800 border border-slate-700 focus:border-blue-400 focus:bg-slate-900 text-slate-100 placeholder:text-slate-500"
            : "bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
        } ${className}`}
        {...props}
      />
    </div>
  );
};
