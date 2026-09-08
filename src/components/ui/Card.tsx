import type { ReactNode } from "react";

type Theme = "light" | "dark";

interface CardProps {
  children: ReactNode;
  className?: string;
  theme?: Theme;
}

export const Card = ({
  children,
  className = "",
  theme = "light",
}: CardProps) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-[24px] border p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition-colors duration-300 ${
        isDark
          ? "border-slate-700 bg-slate-900/90 text-slate-100 shadow-[0_18px_40px_rgba(2,6,23,0.55)]"
          : "border-slate-200/80 bg-white/90 text-slate-800"
      } ${className}`}
    >
      {children}
    </div>
  );
};
