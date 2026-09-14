import { Card } from "../ui/Card";

interface CampaignCardProps {
  theme?: "light" | "dark";
  title: string;
  description: string;
  discount: string;
  category: string;
  period: string;
  active?: boolean;
}

export const CampaignCard = ({
  theme = "light",
  title,
  description,
  discount,
  category,
  period,
  active = false,
}: CampaignCardProps) => {
  const isDark = theme === "dark";

  return (
    <Card theme={theme} className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3
            className={`text-base font-semibold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {title}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            active
              ? isDark
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-emerald-50 text-emerald-700"
              : isDark
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "Active" : "Scheduled"}
        </span>
      </div>

      <p className="text-sm leading-6 text-slate-400">{description}</p>

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span
          className={`rounded-full border px-2 py-1 ${
            isDark
              ? "border-slate-700 bg-slate-800 text-slate-200"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {discount}
        </span>
        <span
          className={`rounded-full border px-2 py-1 ${
            isDark
              ? "border-slate-700 bg-slate-800 text-slate-200"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {category}
        </span>
      </div>

      <p
        className={`text-[11px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        {period}
      </p>
    </Card>
  );
};

export default CampaignCard;
