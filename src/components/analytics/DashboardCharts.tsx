import type { Dispatch, SetStateAction } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { AnalyticsChartSection } from "./AnalyticsChartSection";

type Theme = "light" | "dark";

export interface DashboardWeeklyDatum {
  day: string;
  sales: number;
  waste: number;
}

export interface DashboardTrendDatum {
  week: string;
  revenue: number;
  target: number;
}

export interface DashboardWasteDatum {
  name: string;
  value: number;
  lightColor: string;
  darkColor: string;
}

export interface DashboardProfitabilityDatum {
  name: string;
  sales: number;
  margin: number;
  waste: number;
  color: string;
}

interface OperationalChartDatum {
  name: string;
  preparedQuantity: number;
  wastedQuantity: number;
}

const OperationalTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload as OperationalChartDatum;
  const wastePercentage = item.preparedQuantity
    ? (item.wastedQuantity / item.preparedQuantity) * 100
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </p>
      <p className="mt-1 text-emerald-600 dark:text-emerald-300">
        Prepared: {item.preparedQuantity} units
      </p>
      <p className="text-rose-600 dark:text-rose-300">
        Wasted: {item.wastedQuantity} units
      </p>
      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Waste rate: {wastePercentage.toFixed(1)}%
      </p>
    </div>
  );
};

interface DashboardChartsProps {
  theme?: Theme;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  visibleWeeklyData: DashboardWeeklyDatum[];
  wasteBreakdown: DashboardWasteDatum[];
  profitabilityData: DashboardProfitabilityDatum[];
  wasteReason: string;
  onWasteReasonChange: (value: string) => void;
  menuItem: string;
  onMenuItemChange: (value: string) => void;
  highWasteOnly: boolean;
  onHighWasteOnlyChange: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCharts = ({
  theme = "light",
  dateRange,
  onDateRangeChange,
  visibleWeeklyData,
  wasteBreakdown,
  profitabilityData,
  wasteReason,
  onWasteReasonChange,
  menuItem,
  onMenuItemChange,
  highWasteOnly,
  onHighWasteOnlyChange,
}: DashboardChartsProps) => {
  const isDark = theme === "dark";
  const chartTooltipStyle = {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    borderColor: isDark ? "#334155" : "#e2e8f0",
    borderRadius: 16,
  };
  const axisColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#cbd5e1";
  const operationalData: OperationalChartDatum[] = profitabilityData.map(
    (item) => ({
      name: item.name,
      preparedQuantity: item.sales,
      wastedQuantity: item.waste,
    }),
  );

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AnalyticsChartSection
          theme={theme}
          title="Revenue vs Waste"
          subtitle="Daily performance snapshot"
          rightContent={
            <select
              value={dateRange}
              onChange={(event) => onDateRangeChange(event.target.value)}
              className={`rounded-xl border px-3 py-1.5 text-xs outline-none ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100"
                  : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleWeeklyData}>
                <defs>
                  <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  fill="url(#salesFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsChartSection>

        <AnalyticsChartSection
          theme={theme}
          title="Waste Breakdown"
          subtitle="Root causes this week"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={74}
                  paddingAngle={3}
                >
                  {wasteBreakdown.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={isDark ? entry.darkColor : entry.lightColor}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsChartSection>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
        <AnalyticsChartSection
          theme={theme}
          title="Waste Insights"
          subtitle="Filter by reason and dish"
        >
          <div className="space-y-3 text-xs">
            <label
              className={`block ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Waste reason
              <select
                value={wasteReason}
                onChange={(event) => onWasteReasonChange(event.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <option value="all">All reasons</option>
                <option value="overproduction">Overproduction</option>
                <option value="expired">Expired stock</option>
                <option value="returns">Customer returns</option>
              </select>
            </label>

            <label
              className={`block ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Menu item
              <select
                value={menuItem}
                onChange={(event) => onMenuItemChange(event.target.value)}
                className={`mt-1 w-full rounded-xl border px-3 py-2 outline-none ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100"
                    : "border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <option value="all">All items</option>
                <option value="teriyaki">Teriyaki Bento</option>
                <option value="sashimi">Sashimi Plate</option>
                <option value="soup">Miso Soup</option>
              </select>
            </label>

            <label className="inline-flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={highWasteOnly}
                onChange={(event) =>
                  onHighWasteOnlyChange(event.target.checked)
                }
                className="accent-blue-600"
              />
              <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                Show only high-waste items
              </span>
            </label>
          </div>
        </AnalyticsChartSection>

        <AnalyticsChartSection
          theme={theme}
          title="Sales vs Margin by Dish"
          subtitle="Operational profitability heatmap"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend />
                <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="margin" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsChartSection>
      </div>

      <AnalyticsChartSection
        theme={theme}
        title="Top Waste vs. Sales by Menu Item"
        subtitle="Comparison of wasted units vs. total prepared items"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={operationalData}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={axisColor}
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={52}
              />
              <YAxis
                stroke={axisColor}
                label={{
                  value: "Units",
                  angle: -90,
                  position: "insideLeft",
                  fill: axisColor,
                  fontSize: 11,
                }}
              />
              <Tooltip content={<OperationalTooltip />} />
              <Legend />
              <Bar
                dataKey="preparedQuantity"
                name="Prepared Quantity"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="wastedQuantity"
                name="Wasted Quantity"
                fill={isDark ? "#fb7185" : "#e11d48"}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsChartSection>
    </>
  );
};

export default DashboardCharts;
