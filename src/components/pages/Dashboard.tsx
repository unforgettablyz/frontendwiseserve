type Theme = "light" | "dark";

interface DashboardProps {
  theme?: Theme;
  language?: "en" | "bm";
}

import { Card } from "../ui/Card";
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
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

export const Dashboard = ({ theme = "light" }: DashboardProps) => {
  const isDark = theme === "dark";

  const mockMetrics = [
    {
      label: "Weekly Revenue",
      value: "$12,450",
      change: "+4.2%",
      tone: "blue",
    },
    {
      label: "Food Prepared",
      value: "1,240 units",
      change: "This Week",
      tone: "green",
    },
    {
      label: "Food Wasted",
      value: "112 units",
      change: "-1.8% vs last week",
      tone: "amber",
    },
    {
      label: "Waste Value",
      value: "$420.00",
      change: "3.3% of revenue",
      tone: "red",
    },
  ];

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

  const weeklyData = [
    { day: "Mon", sales: 1800, waste: 120 },
    { day: "Tue", sales: 2100, waste: 145 },
    { day: "Wed", sales: 1650, waste: 90 },
    { day: "Thu", sales: 2400, waste: 160 },
    { day: "Fri", sales: 2800, waste: 185 },
    { day: "Sat", sales: 3100, waste: 210 },
    { day: "Sun", sales: 2600, waste: 150 },
  ];

  const revenueTrend = [
    { week: "W1", revenue: 8200, target: 9000 },
    { week: "W2", revenue: 9600, target: 9200 },
    { week: "W3", revenue: 9100, target: 9400 },
    { week: "W4", revenue: 10800, target: 9800 },
    { week: "W5", revenue: 11600, target: 10200 },
    { week: "W6", revenue: 12450, target: 10800 },
  ];

  const wasteBreakdown = [
    {
      name: "Overproduction",
      value: 42,
      lightColor: "#2563eb",
      darkColor: "#60a5fa",
    },
    {
      name: "Expired stock",
      value: 28,
      lightColor: "#d97706",
      darkColor: "#fbbf24",
    },
    {
      name: "Preparation",
      value: 18,
      lightColor: "#059669",
      darkColor: "#34d399",
    },
    {
      name: "Customer returns",
      value: 12,
      lightColor: "#e11d48",
      darkColor: "#fb7185",
    },
  ];

  const profitabilityData = [
    {
      name: "Teriyaki Bento",
      sales: 86,
      margin: 62,
      waste: 34,
      color: "#2563eb",
    },
    {
      name: "Sashimi Plate",
      sales: 54,
      margin: 48,
      waste: 18,
      color: "#f59e0b",
    },
    { name: "Miso Soup", sales: 42, margin: 72, waste: 42, color: "#10b981" },
    {
      name: "Green Tea Ice Cream",
      sales: 68,
      margin: 81,
      waste: 8,
      color: "#8b5cf6",
    },
    {
      name: "Spicy Karaage",
      sales: 78,
      margin: 57,
      waste: 12,
      color: "#e11d48",
    },
  ];

  const recommendations = [
    {
      priority: "Highest impact",
      title: "Reduce Chicken Teriyaki prep by 12 units",
      description:
        "Overproduction is your largest waste source and this item accounts for 34 leftover units.",
      impact: "Save up to $60 this week",
      tone: "blue",
    },
    {
      priority: "Needs attention",
      title: "Review Salmon Sashimi stock rotation",
      description:
        "18 portions were left over. Check delivery timing and prep closer to the dinner service.",
      impact: "Prevent $144 loss",
      tone: "amber",
    },
    {
      priority: "Quick win",
      title: "Promote Miso Soup as a set add-on",
      description:
        "42 portions remain. Pairing it with popular bentos can improve sell-through before closing.",
      impact: "Recover $42 value",
      tone: "green",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockMetrics.map((m, idx) => (
          <Card key={idx} theme={theme} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "text-slate-400" : "text-slate-400"}`}
              >
                {m.label}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${toneClasses[m.tone]}`}
              >
                {m.change}
              </span>
            </div>
            <span
              className={`text-3xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              {m.value}
            </span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card theme={theme} className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3
              className={`font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              Daily Sales vs. Waste Volume
            </h3>
            <span className="text-xs text-slate-400">Mon - Sun</span>
          </div>
          <div
            className={`h-72 rounded-[22px] border p-3 ${
              isDark
                ? "bg-slate-950/70 border-slate-700"
                : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
            }`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke={isDark ? "#334155" : "#e2e8f0"}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  tickFormatter={(value: number) => `$${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: isDark ? "#1e293b" : "#f1f5f9" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === "sales" ? "Sales" : "Waste",
                  ]}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    color: isDark ? "#cbd5e1" : "#475569",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  fill={isDark ? "#93c5fd" : "#2563eb"}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="waste"
                  name="Waste"
                  fill={isDark ? "#fda4af" : "#e11d48"}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card theme={theme} className="flex flex-col gap-4">
          <h3
            className={`font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            Top Wasted Items
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "Chicken Teriyaki Bento", qty: "34 units", loss: "$170" },
              { name: "Salmon Sashimi Plate", qty: "18 units", loss: "$144" },
              { name: "Miso Soup Portion", qty: "42 units", loss: "$42" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-2xl border ${
                  isDark
                    ? "bg-slate-800 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400">{item.qty} leftover</p>
                </div>
                <span className="text-sm font-semibold text-rose-500">
                  -{item.loss}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card theme={theme} className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                Revenue Trend
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Actual revenue against weekly target
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
              +14.8%
            </span>
          </div>
          <div
            className={`h-64 rounded-[22px] border p-3 ${
              isDark
                ? "bg-slate-950/70 border-slate-700"
                : "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
            }`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrend}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isDark ? "#60a5fa" : "#2563eb"}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={isDark ? "#60a5fa" : "#2563eb"}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke={isDark ? "#334155" : "#e2e8f0"}
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  tickFormatter={(value: number) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === "revenue" ? "Revenue" : "Target",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={isDark ? "#60a5fa" : "#2563eb"}
                  strokeWidth={3}
                  fill="url(#revenueFill)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke={isDark ? "#94a3b8" : "#94a3b8"}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card theme={theme} className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              <span className="block">Waste Sources</span>
              <span className="mt-1 block text-xs font-normal text-slate-400">
                How this week&apos;s waste happened
              </span>
            </h3>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                isDark
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              112 units
            </span>
          </div>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  stroke="none"
                >
                  {wasteBreakdown.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={isDark ? entry.darkColor : entry.lightColor}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-2xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                112
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                units wasted
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {wasteBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: isDark
                      ? entry.darkColor
                      : entry.lightColor,
                  }}
                />
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                  {entry.name}
                </span>
                <span className="ml-auto font-semibold text-slate-400">
                  {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card theme={theme} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500">
              Decision view
            </p>
            <h3
              className={`mt-1 text-xl font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              Menu Profitability Matrix
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Find dishes worth promoting, optimizing, or reviewing.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> High
              margin
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div
            className={`h-80 rounded-[22px] border p-3 ${
              isDark
                ? "border-slate-700 bg-slate-950/70"
                : "border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100"
            }`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 12, right: 18, bottom: 12, left: 0 }}
              >
                <CartesianGrid
                  stroke={isDark ? "#334155" : "#e2e8f0"}
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  dataKey="sales"
                  name="Sales index"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  label={{
                    value: "Sales volume",
                    position: "insideBottom",
                    offset: -5,
                    fill: isDark ? "#94a3b8" : "#64748b",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="margin"
                  name="Margin"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }}
                  label={{
                    value: "Margin %",
                    angle: -90,
                    position: "insideLeft",
                    fill: isDark ? "#94a3b8" : "#64748b",
                    fontSize: 11,
                  }}
                />
                <ZAxis
                  type="number"
                  dataKey="waste"
                  range={[80, 420]}
                  name="Waste units"
                />
                <Tooltip
                  cursor={{ strokeDasharray: "4 4" }}
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    color: isDark ? "#f8fafc" : "#0f172a",
                  }}
                  formatter={(value: number, name: string) => [
                    name === "Margin" ? `${value}%` : value,
                    name,
                  ]}
                  labelFormatter={(label) => String(label)}
                />
                <Scatter data={profitabilityData} name="Menu items">
                  {profitabilityData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span>Menu item</span>
              <span>Margin</span>
              <span>Waste</span>
            </div>
            {profitabilityData.map((item) => (
              <div
                key={item.name}
                className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-2xl border px-3 py-3 text-xs ${
                  isDark
                    ? "border-slate-700 bg-slate-800/60"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span
                  className={`truncate font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
                >
                  {item.name}
                </span>
                <span className="font-semibold text-emerald-500">
                  {item.margin}%
                </span>
                <span className="font-semibold text-rose-500">
                  {item.waste}
                </span>
              </div>
            ))}
            <p className="mt-2 text-[11px] leading-5 text-slate-400">
              Bubble size represents leftover units. Prioritize items high on
              the chart and small in size.
            </p>
          </div>
        </div>
      </Card>

      <Card theme={theme} className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Recommended next steps
            </p>
            <h3
              className={`mt-1 text-xl font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              Turn today&apos;s waste data into action
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Prioritized suggestions based on waste volume, item value, and
              sell-through.
            </p>
          </div>
          <div
            className={`rounded-2xl border px-4 py-3 text-right ${
              isDark
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
              Potential recovery
            </p>
            <p className="mt-0.5 text-xl font-bold text-emerald-600">$246</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {recommendations.map((recommendation, index) => {
            const recommendationTone = {
              blue: isDark
                ? "border-blue-400/20 bg-blue-400/10"
                : "border-blue-100 bg-blue-50/70",
              amber: isDark
                ? "border-amber-400/20 bg-amber-400/10"
                : "border-amber-100 bg-amber-50/70",
              green: isDark
                ? "border-emerald-400/20 bg-emerald-400/10"
                : "border-emerald-100 bg-emerald-50/70",
            }[recommendation.tone];

            return (
              <div
                key={recommendation.title}
                className={`flex flex-col justify-between gap-5 rounded-2xl border p-4 ${recommendationTone}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      0{index + 1} / {recommendation.priority}
                    </span>
                    <span className="text-lg" aria-hidden="true">
                      {index === 0 ? "↗" : index === 1 ? "!" : "✓"}
                    </span>
                  </div>
                  <h4
                    className={`mt-3 text-sm font-semibold leading-5 ${isDark ? "text-slate-100" : "text-slate-900"}`}
                  >
                    {recommendation.title}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {recommendation.description}
                  </p>
                </div>
                <div
                  className={`border-t pt-3 text-xs font-semibold ${
                    isDark
                      ? "border-white/10 text-slate-200"
                      : "border-black/5 text-slate-700"
                  }`}
                >
                  {recommendation.impact}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
