import { Card } from "../ui/Card";

type MetricCardProps = {
  theme?: "light" | "dark";
  title: string;
  value: string;
  subtitle?: string;
  tone?: "blue" | "green" | "amber" | "red";
  valueClassName?: string;
};

export const MetricCard = ({
  theme = "light",
  title,
  value,
  subtitle,
  tone = "blue",
  valueClassName,
}: MetricCardProps) => {
  const isDark = theme === "dark";

  const toneClasses: Record<string, string> = {
    blue: isDark ? "bg-blue-500/10 text-blue-300" : "bg-blue-50 text-blue-600",
    green: isDark
      ? "bg-emerald-500/10 text-emerald-300"
      : "bg-emerald-50 text-emerald-600",
    amber: isDark
      ? "bg-amber-500/10 text-amber-300"
      : "bg-amber-50 text-amber-600",
    red: isDark ? "bg-rose-500/10 text-rose-300" : "bg-rose-50 text-rose-600",
  };

  return (
    <Card theme={theme} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </p>
          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-slate-900"
            } ${valueClassName ?? ""}`}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={`mt-1 text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${toneClasses[tone]}`}
        >
          {subtitle ?? ""}
        </span>
      </div>
    </Card>
  );
};

export default MetricCard;
