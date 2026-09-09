import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { menuRepository } from "../repositories/menuRepository";
import { recordRepository } from "../repositories/recordRepository";
import { MenuItem } from "../models/Menu";

interface ShiftLogRow {
  id: string;
  menuItemId: number;
  itemName: string;
  category: string;
  costToProduce: number;
  preparedQty: number;
  soldQty: number;
  wasteReason: string;
}

const WASTE_REASONS = [
  "Expired / Overcooked",
  "Quality Control Drop",
  "Customer Return / Wrong Order",
  "Staff Consumption / Tasting",
  "Unsold End of Shift",
];

export const DailyLog: React.FC = () => {
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([]);
  const [shiftDate, setShiftDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [shiftType, setShiftType] = useState<"Lunch" | "Dinner" | "Full Day">(
    "Lunch",
  );

  const [rows, setRows] = useState<ShiftLogRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load menu items on mount
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const items = await menuRepository.getAll("active");
        setAvailableMenuItems(items);
        if (items.length > 0) {
          setRows([createDefaultRow(items[0])]);
        }
      } catch (err) {
        console.error("Failed to load menu items", err);
        setErrorMessage("Failed to load active menu items from server.");
      }
    };
    fetchMenu();
  }, []);

  // Helper to build a default table row
  const createDefaultRow = (menuItem: MenuItem): ShiftLogRow => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
    menuItemId: menuItem.id,
    itemName: menuItem.name,
    category: menuItem.category,
    costToProduce: menuItem.costToProduce,
    preparedQty: 10,
    soldQty: 8,
    wasteReason: WASTE_REASONS[0],
  });

  // Table row management
  const handleAddRow = () => {
    if (availableMenuItems.length === 0) return;
    setRows((prev) => [...prev, createDefaultRow(availableMenuItems[0])]);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (
    id: string,
    field: keyof ShiftLogRow,
    value: any,
  ) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        // Sync item details if menu selection changes
        if (field === "menuItemId") {
          const selectedItem = availableMenuItems.find(
            (m) => m.id === Number(value),
          );
          if (selectedItem) {
            return {
              ...row,
              menuItemId: selectedItem.id,
              itemName: selectedItem.name,
              category: selectedItem.category,
              costToProduce: selectedItem.costToProduce,
            };
          }
        }

        return { ...row, [field]: value };
      }),
    );
  };

  // Real-time waste and cost calculations
  const calculatedRows = rows.map((r) => {
    const wasteQty = Math.max(0, r.preparedQty - r.soldQty);
    const wasteCost = wasteQty * r.costToProduce;
    const wastePct = r.preparedQty > 0 ? (wasteQty / r.preparedQty) * 100 : 0;
    return { ...r, wasteQty, wasteCost, wastePct };
  });

  // Aggregate stats
  const totalPrepared = calculatedRows.reduce(
    (acc, r) => acc + r.preparedQty,
    0,
  );
  const totalSold = calculatedRows.reduce((acc, r) => acc + r.soldQty, 0);
  const totalWasteQty = calculatedRows.reduce((acc, r) => acc + r.wasteQty, 0);
  const totalWasteCost = calculatedRows.reduce(
    (acc, r) => acc + r.wasteCost,
    0,
  );

  // Submit log handler using recordRepository
  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        date: shiftDate,
        shift: shiftType,
        records: calculatedRows.map((r) => ({
          menuItemId: r.menuItemId,
          preparedQty: r.preparedQty,
          soldQty: r.soldQty,
          wasteQty: r.wasteQty,
          wasteCost: r.wasteCost,
          wasteReason: r.wasteReason,
        })),
      };

      await recordRepository.createBatch(payload);
      setSuccessMessage("Shift log records saved successfully to the server!");
    } catch (err: any) {
      console.error("Failed to submit shift log batch", err);
      setErrorMessage(
        err?.response?.data?.message ||
          "Failed to save shift logs. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Daily Operational Log
          </h1>
          <p className="text-sm text-slate-500">
            Record shift preparation, sales, and food waste metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Input
            type="date"
            value={shiftDate}
            onChange={(e) => setShiftDate(e.target.value)}
            className="w-auto text-xs"
          />
          <select
            value={shiftType}
            onChange={(e) => setShiftType(e.target.value as any)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-slate-900"
          >
            <option value="Lunch">Lunch Shift</option>
            <option value="Dinner">Dinner Shift</option>
            <option value="Full Day">Full Day</option>
          </select>
        </div>
      </div>

      {/* Success / Error Feedback Banners */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Prepared
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {totalPrepared} <span className="text-xs font-normal">units</span>
          </p>
        </Card>
        <Card className="p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Sold
          </p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {totalSold} <span className="text-xs font-normal">units</span>
          </p>
        </Card>
        <Card className="p-4 bg-slate-50">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Waste Volume
          </p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {totalWasteQty} <span className="text-xs font-normal">units</span>
          </p>
        </Card>
        <Card className="p-4 bg-rose-50 border-rose-100">
          <p className="text-xs font-semibold text-rose-600 uppercase">
            Estimated Waste Cost
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">
            ${totalWasteCost.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Shift Log Table */}
      <form onSubmit={handleSubmitLog}>
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-sm">
              Shift Entry Items ({rows.length})
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddRow}
            >
              + Add Item Row
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100">
                <tr>
                  <th className="p-3">Menu Item</th>
                  <th className="p-3 w-28">Prep Qty</th>
                  <th className="p-3 w-28">Sold Qty</th>
                  <th className="p-3 w-28">Waste Qty</th>
                  <th className="p-3 w-32">Waste Cost</th>
                  <th className="p-3">Waste Reason</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculatedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <select
                        value={row.menuItemId}
                        onChange={(e) =>
                          handleRowChange(row.id, "menuItemId", e.target.value)
                        }
                        className="w-full border border-slate-200 rounded-md p-1.5 text-xs focus:ring-1 focus:ring-slate-900"
                      >
                        {availableMenuItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.category})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        value={row.preparedQty}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "preparedQty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>

                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        value={row.soldQty}
                        onChange={(e) =>
                          handleRowChange(
                            row.id,
                            "soldQty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>

                    <td className="p-3 font-semibold text-slate-800">
                      <span
                        className={
                          row.wasteQty > 0 ? "text-amber-600" : "text-slate-400"
                        }
                      >
                        {row.wasteQty} ({row.wastePct.toFixed(0)}%)
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-rose-600">
                      ${row.wasteCost.toFixed(2)}
                    </td>

                    <td className="p-3">
                      <select
                        value={row.wasteReason}
                        onChange={(e) =>
                          handleRowChange(row.id, "wasteReason", e.target.value)
                        }
                        className="w-full border border-slate-200 rounded-md p-1.5 text-xs focus:ring-1 focus:ring-slate-900"
                      >
                        {WASTE_REASONS.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        disabled={rows.length === 1}
                        className="text-slate-400 hover:text-rose-600 font-bold p-1 disabled:opacity-30"
                        title="Remove row"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Auto-calculated variances ready for submit
            </span>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || rows.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Save Shift Log Records"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
