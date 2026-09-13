import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  theme?: "light" | "dark";
}

export const Input: React.FC<InputProps> = ({
  label,
  theme = "light",
  className = "",
  ...props
}) => {
  const isDark = theme === "dark";

  return (
    <div className="w-full">
      {label && (
        <label
          className={`block mb-1 text-xs font-medium ${
            isDark ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
          isDark
            ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
            : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
        } ${className}`}
      />
    </div>
  );
};

export default Input;
