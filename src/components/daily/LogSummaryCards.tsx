import { Card } from "../ui/Card";

interface LogSummaryCardsProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  totalPrepared: number;
  totalSold: number;
  totalRecycle: number;
  totalWasteCost: number;
}

export const LogSummaryCards = ({
  theme = "light",
  language = "en",
  totalPrepared,
  totalSold,
  totalRecycle,
  totalWasteCost,
}: LogSummaryCardsProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card theme={theme}>
        <p
          className={`text-xs font-semibold uppercase ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {isBM ? "JUMLAH PREP" : "TOTAL PREPARED"}
        </p>
        <p
          className={`mt-1 text-2xl font-bold ${
            isDark ? "text-white" : "text-slate-800"
          }`}
        >
          {totalPrepared}{" "}
          <span className="text-xs font-normal text-slate-400">
            {isBM ? "unit" : "units"}
          </span>
        </p>
      </Card>

      <Card theme={theme}>
        <p
          className={`text-xs font-semibold uppercase ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {isBM ? "TERJUAL (POS)" : "TOTAL SOLD (POS)"}
        </p>
        <p className="mt-1 text-2xl font-bold text-emerald-500">
          {totalSold}{" "}
          <span className="text-xs font-normal text-slate-400">
            {isBM ? "unit" : "units"}
          </span>
        </p>
      </Card>

      <Card theme={theme}>
        <p
          className={`text-xs font-semibold uppercase ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {isBM ? "BAKI RECYCLE" : "RECYCLED STOCK"}
        </p>
        <p className="mt-1 text-2xl font-bold text-amber-500">
          {totalRecycle}{" "}
          <span className="text-xs font-normal text-slate-400">
            {isBM ? "unit" : "units"}
          </span>
        </p>
      </Card>

      <Card theme={theme}>
        <p className="text-xs font-semibold uppercase text-rose-500">
          {isBM ? "KOS SISA / BUANG" : "ESTIMATED WASTE COST"}
        </p>
        <p className="mt-1 text-2xl font-bold text-rose-500">
          RM{totalWasteCost.toFixed(2)}
        </p>
      </Card>
    </div>
  );
};

export default LogSummaryCards;
