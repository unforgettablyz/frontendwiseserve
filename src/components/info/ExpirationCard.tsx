import { Card } from "../ui/Card";

interface ExpirationCardProps {
  theme?: "light" | "dark";
  name: string;
  amount: string;
  expiresIn: string;
  preparedAt: string;
  isDark?: boolean;
}

export const ExpirationCard = ({
  theme = "light",
  name,
  amount,
  expiresIn,
  preparedAt,
}: ExpirationCardProps) => {
  const isDark = theme === "dark";

  return (
    <Card theme={theme} className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isDark
              ? "bg-slate-800 text-slate-200"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          ⏰
        </div>
        <div>
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {name}
          </h3>
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Prepared {preparedAt}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`text-xl font-bold ${
            isDark ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {amount}
        </p>
        <p className="text-xs text-amber-500">Expires in {expiresIn}</p>
      </div>
    </Card>
  );
};

export default ExpirationCard;
