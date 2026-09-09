import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import {
  recordRepository,
  ShiftRecordBatch,
} from "../repositories/recordRepository";
import { menuRepository } from "../repositories/menuRepository";
import { MenuItem } from "../models/Menu";

interface DashboardProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const Dashboard: React.FC<DashboardProps> = ({ theme, language }) => {
  const [records, setRecords] = useState<ShiftRecordBatch[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Default date filter range: Last 30 Days
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [recordsData, menuData] = await Promise.all([
          recordRepository.getAll(startDate, endDate),
          menuRepository.getAll(),
        ]);
        setRecords(recordsData || []);
        setMenuItems(menuData || []);
      } catch (err: any) {
        console.error("Failed to fetch dashboard analytics", err);
        setError("Failed to load analytics data from server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]);

  // Aggregate stats across fetched records
  const allEntries = records.flatMap((b) => b.records || []);
  const totalPrepared = allEntries.reduce(
    (acc, curr) => acc + curr.preparedQty,
    0,
  );
  const totalSold = allEntries.reduce((acc, curr) => acc + curr.soldQty, 0);
  const totalWasteQty = allEntries.reduce(
    (acc, curr) => acc + curr.wasteQty,
    0,
  );
  const totalWasteCost = allEntries.reduce(
    (acc, curr) => acc + curr.wasteCost,
    0,
  );

  const overallWastePct =
    totalPrepared > 0 ? (totalWasteQty / totalPrepared) * 100 : 0;

  // Breakdown waste cost by waste reason
  const reasonBreakdown = allEntries.reduce<
    Record<string, { qty: number; cost: number }>
  >((acc, curr) => {
    const reason = curr.wasteReason || "Unspecified";
    if (!acc[reason]) acc[reason] = { qty: 0, cost: 0 };
    acc[reason].qty += curr.wasteQty;
    acc[reason].cost += curr.wasteCost;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header & Date Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview of operational food waste, costs, and key performance
            metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-slate-900"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Prepared
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {isLoading ? "..." : totalPrepared}{" "}
            <span className="text-xs font-normal">units</span>
          </p>
        </Card>
        <Card className="p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Sold
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {isLoading ? "..." : totalSold}{" "}
            <span className="text-xs font-normal">units</span>
          </p>
        </Card>
        <Card className="p-4 bg-amber-50 border-amber-100">
          <p className="text-xs font-semibold text-amber-700 uppercase">
            Waste Rate
          </p>
          <p className="text-2xl font-bold text-amber-800 mt-1">
            {isLoading ? "..." : `${overallWastePct.toFixed(1)}%`}
          </p>
        </Card>
        <Card className="p-4 bg-rose-50 border-rose-100">
          <p className="text-xs font-semibold text-rose-600 uppercase">
            Total Waste Loss
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            {isLoading ? "..." : `$${totalWasteCost.toFixed(2)}`}
          </p>
        </Card>
      </div>

      {/* Operational Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Cost by Reason */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">
            Waste Loss by Reason
          </h3>
          {Object.keys(reasonBreakdown).length === 0 ? (
            <p className="text-xs text-slate-400">
              No shift records found for selected date range.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(reasonBreakdown).map(([reason, data]) => {
                const pct =
                  totalWasteCost > 0 ? (data.cost / totalWasteCost) * 100 : 0;
                return (
                  <div key={reason} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{reason}</span>
                      <span>
                        ${data.cost.toFixed(2)} ({data.qty} units)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Shifts Logged */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">
            Recent Shift Submissions
          </h3>
          {records.length === 0 ? (
            <p className="text-xs text-slate-400">
              No shift logs registered yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {records.slice(0, 5).map((batch) => (
                <div
                  key={batch.id || Math.random()}
                  className="py-2.5 flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{batch.date}</p>
                    <p className="text-slate-500">
                      {batch.shift} Shift • {batch.records?.length || 0} items
                    </p>
                  </div>
                  <span className="font-bold text-rose-600">
                    $
                    {(batch.records || [])
                      .reduce((a, c) => a + c.wasteCost, 0)
                      .toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
