import { Card } from "../ui/Card";

interface ImpactSectionProps {
  theme?: "light" | "dark";
  title: string;
  description: string;
  items: Array<{
    label: string;
    value: string;
    tone?: "blue" | "emerald" | "amber";
  }>;
}

export const ImpactSection = ({
  theme = "light",
  title,
  description,
  items,
}: ImpactSectionProps) => {
  const isDark = theme === "dark";

  return (
    <Card
      theme={theme}
      className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
          Our impact
        </p>
        <h3
          className={`mt-2 text-2xl font-semibold tracking-tight ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <p
              className={`text-2xl font-bold ${
                item.tone === "emerald"
                  ? "text-emerald-500"
                  : item.tone === "amber"
                    ? "text-amber-500"
                    : "text-blue-500"
              }`}
            >
              {item.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ImpactSection;
