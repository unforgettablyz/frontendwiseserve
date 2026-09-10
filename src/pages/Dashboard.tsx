type Theme = "light" | "dark";

interface DashboardProps {
  theme?: Theme;
  language?: "en" | "bm";
  companyName?: string;
}

import { useState } from "react";
import { Card } from "../components/ui/Card";
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

export const Dashboard = ({ theme = "light", companyName }: DashboardProps) => {
  const isDark = theme === "dark";
  const [dateRange, setDateRange] = useState("7");
  const [wasteReason, setWasteReason] = useState("all");
  const [menuItem, setMenuItem] = useState("all");
  const [highWasteOnly, setHighWasteOnly] = useState(false);

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

  const visibleWeeklyData =
    dateRange === "30"
      ? [...weeklyData, ...weeklyData.slice(0, 2)]
      : weeklyData;

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockMetrics.map((metric) => (
          <Card key={metric.label} theme={theme} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {metric.label}
                </p>
                <p
                  className={`mt-2 text-2xl font-bold tracking-tight ${
                    isDark ? "text-slate-100" : "text-slate-900"
                  }`}
                >
                  {metric.value}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${toneClasses[metric.tone]}`}
              >
                {metric.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card theme={theme} className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Revenue vs Waste
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Daily performance snapshot
              </p>
            </div>
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value)}
              className={`rounded-xl border px-3 py-1.5 text-xs outline-none ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100"
                  : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleWeeklyData}>
                <defs>
                  <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#cbd5e1"} />
                <XAxis dataKey="day" stroke={isDark ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                    borderRadius: 16,
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card theme={theme} className="p-4">
          <div className="mb-4">
            <h3
              className={`text-sm font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Waste Breakdown
            </h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Root causes this week
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={wasteBreakdown} dataKey="value" nameKey="name" innerRadius={48} outerRadius={74} paddingAngle={3}>
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
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                    borderRadius: 16,
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
        <Card theme={theme} className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3
                className={`text-sm font-bold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}
              >
                Waste Insights
              </h3>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Filter by reason and dish
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className={`block ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Waste reason
              <select
                value={wasteReason}
                onChange={(event) => setWasteReason(event.target.value)}
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

            <label className={`block ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Menu item
              <select
                value={menuItem}
                onChange={(event) => setMenuItem(event.target.value)}
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
                onChange={(event) => setHighWasteOnly(event.target.checked)}
                className="accent-blue-600"
              />
              <span className={isDark ? "text-slate-300" : "text-slate-600"}>
                Show only high-waste items
              </span>
            </label>
          </div>
        </Card>

        <Card theme={theme} className="p-4">
          <div className="mb-4">
            <h3
              className={`text-sm font-bold ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Sales vs Margin by Dish
            </h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Operational profitability heatmap
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#cbd5e1"} />
                <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                    borderRadius: 16,
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="margin" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card theme={theme} className="p-4">
        <div className="mb-4">
          <h3
            className={`text-sm font-bold ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Productivity Lens
          </h3>
          <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Distribution of waste and margin efficiency
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#cbd5e1"} />
              <XAxis type="number" dataKey="sales" name="Sales" stroke={isDark ? "#94a3b8" : "#64748b"} />
              <YAxis type="number" dataKey="waste" name="Waste" stroke={isDark ? "#94a3b8" : "#64748b"} />
              <ZAxis range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: 16,
                }}
              />
              <Scatter name="Dish Efficiency" data={profitabilityData} fill="#8b5cf6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="text-xs text-slate-400">
        {companyName ? `Current outlet: ${companyName}` : "No outlet selected"}
      </div>
    </div>
  );
};