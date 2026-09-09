import type { ButtonHTMLAttributes, ReactNode } from "react";

type Theme = "light" | "dark";
type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  theme?: Theme;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  theme = "light",
  ...props
}: ButtonProps) => {
  const isDark = theme === "dark";

  const variants: Record<Variant, string> = {
    primary: isDark
      ? "bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.4)]"
      : "bg-slate-900 hover:bg-slate-800 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]",
    secondary: isDark
      ? "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600"
      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    danger: isDark
      ? "bg-red-500/15 text-red-300 hover:bg-red-500/20 border border-red-500/30"
      : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-4 py-2.5 text-sm rounded-2xl",
    lg: "px-5 py-3 text-base rounded-2xl",
  };

  return (
    <button
      className={`font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
