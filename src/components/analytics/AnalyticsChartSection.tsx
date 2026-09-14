import type { ReactNode } from "react";
import { Card } from "../ui/Card";

interface AnalyticsChartSectionProps {
  theme?: "light" | "dark";
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const AnalyticsChartSection = ({
  theme = "light",
  title,
  subtitle,
  rightContent,
  children,
  className = "",
}: AnalyticsChartSectionProps) => {
  const isDark = theme === "dark";

  return (
    <Card theme={theme} className={`p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3
            className={`text-sm font-bold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {rightContent}
      </div>
      {children}
    </Card>
  );
};

export default AnalyticsChartSection;
