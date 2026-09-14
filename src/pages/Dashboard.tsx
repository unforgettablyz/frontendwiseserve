type Theme = "light" | "dark";

interface DashboardProps {
  theme?: Theme;
  language?: "en" | "bm";
  companyName?: string;
}

import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { AnalyticsChartSection } from "../components/analytics/AnalyticsChartSection";
import { MetricCard } from "../components/analytics/MetricCard";
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

  const handleExportPdf = () => {
    const reportWindow = window.open("", "_blank", "width=1000,height=800");

    if (!reportWindow) {
      return;
    }

    const renderTable = (
      title: string,
      headers: string[],
      rows: Array<Array<string | number>>,
    ) => `
      <section style="margin-bottom: 24px;">
        <h3 style="margin:0 0 12px; font-size:18px; color:#0f172a;">${title}</h3>
        <table style="width:100%; border-collapse:collapse; font-family:Arial, sans-serif; font-size:12px;">
          <thead>
            <tr>
              ${headers
                .map(
                  (header) =>
                    `<th style="border:1px solid #cbd5e1; padding:8px; background:#f8fafc; text-align:left;">${header}</th>`,
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) =>
                  `<tr>
                    ${row
                      .map(
                        (cell) =>
                          `<td style="border:1px solid #cbd5e1; padding:8px;">${cell}</td>`,
                      )
                      .join("")}
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </section>
    `;

    const htmlContent = `
      <!doctype html>
      <html>
        <head>
          <title>WiseServe Dashboard Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; }
            h1 { margin-bottom: 24px; font-size: 28px; }
            p { margin: 6px 0; font-size: 12px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>WiseServe Dashboard Analysis Report</h1>
          <p><strong>Company:</strong> ${companyName ?? "WiseServe"}</p>
          <p><strong>Date Range:</strong> ${dateRange === "30" ? "Last 30 days" : "Last 7 days"}</p>
          <p><strong>Waste Reason:</strong> ${wasteReason}</p>
          <p><strong>Menu Item:</strong> ${menuItem}</p>
          <p><strong>High Waste Only:</strong> ${highWasteOnly ? "Yes" : "No"}</p>

          ${renderTable(
            "Summary Metrics",
            ["Metric", "Value", "Change"],
            mockMetrics.map((metric) => [
              metric.label,
              metric.value,
              metric.change,
            ]),
          )}

          ${renderTable(
            "Revenue vs Waste",
            ["Day", "Sales", "Waste"],
            visibleWeeklyData.map((row) => [row.day, row.sales, row.waste]),
          )}

          ${renderTable(
            "Revenue Trend",
            ["Week", "Revenue", "Target"],
            revenueTrend.map((row) => [row.week, row.revenue, row.target]),
          )}

          ${renderTable(
            "Waste Breakdown",
            ["Category", "Value"],
            wasteBreakdown.map((row) => [row.name, row.value]),
          )}

          ${renderTable(
            "Profitability Data",
            ["Item", "Sales", "Margin", "Waste"],
            profitabilityData.map((row) => [
              row.name,
              row.sales,
              row.margin,
              row.waste,
            ]),
          )}
        </body>
      </html>
    `;

    reportWindow.document.open();
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  };

  const handleExportExcel = () => {
    const csvRows: Array<Array<string>> = [
      ["Dashboard Analysis Export"],
      ["Date Range", dateRange === "30" ? "Last 30 days" : "Last 7 days"],
      ["Waste Reason", wasteReason],
      ["Menu Item", menuItem],
      ["High Waste Only", highWasteOnly ? "Yes" : "No"],
      [],
      ["Summary Metrics", "Value", "Change"],
      ...mockMetrics.map((metric) => [
        metric.label,
        metric.value,
        metric.change,
      ]),
      [],
      ["Revenue vs Waste", "Sales", "Waste"],
      ...visibleWeeklyData.map((row) => [
        row.day,
        String(row.sales),
        String(row.waste),
      ]),
      [],
      ["Revenue Trend", "Revenue", "Target"],
      ...revenueTrend.map((row) => [
        row.week,
        String(row.revenue),
        String(row.target),
      ]),
      [],
      ["Waste Breakdown", "Value"],
      ...wasteBreakdown.map((row) => [row.name, String(row.value)]),
      [],
      ["Profitability Data", "Sales", "Margin", "Waste"],
      ...profitabilityData.map((row) => [
        row.name,
        String(row.sales),
        String(row.margin),
        String(row.waste),
      ]),
    ];

    const csvContent = csvRows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wiseserve-dashboard-analysis.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button theme={theme} variant="secondary" onClick={handleExportExcel}>
            Export Excel
          </Button>
          <Button theme={theme} onClick={handleExportPdf}>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            theme={theme}
            title={metric.label}
            value={metric.value}
            subtitle={metric.change}
            tone={metric.tone as "blue" | "green" | "amber" | "red"}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <AnalyticsChartSection
          theme={theme}
          title="Revenue vs Waste"
          subtitle="Daily performance snapshot"
          rightContent={
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#334155" : "#cbd5e1"}
                />
                <XAxis dataKey="day" stroke={isDark ? "#94a3b8" : "#64748b"} />
                <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#0f172a" : "#ffffff",
                    borderColor: isDark ? "#334155" : "#e2e8f0",
                    borderRadius: 16,
                  }}
                />
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

            <label
              className={`block ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
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
        </AnalyticsChartSection>

        <AnalyticsChartSection
          theme={theme}
          title="Sales vs Margin by Dish"
          subtitle="Operational profitability heatmap"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#334155" : "#cbd5e1"}
                />
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
        </AnalyticsChartSection>
      </div>

      <AnalyticsChartSection
        theme={theme}
        title="Productivity Lens"
        subtitle="Distribution of waste and margin efficiency"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#334155" : "#cbd5e1"}
              />
              <XAxis
                type="number"
                dataKey="sales"
                name="Sales"
                stroke={isDark ? "#94a3b8" : "#64748b"}
              />
              <YAxis
                type="number"
                dataKey="waste"
                name="Waste"
                stroke={isDark ? "#94a3b8" : "#64748b"}
              />
              <ZAxis range={[60, 400]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: 16,
                }}
              />
              <Scatter
                name="Dish Efficiency"
                data={profitabilityData}
                fill="#8b5cf6"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsChartSection>

      <div className="text-xs text-slate-400">
        {companyName ? `Current outlet: ${companyName}` : "No outlet selected"}
      </div>
    </div>
  );
};
