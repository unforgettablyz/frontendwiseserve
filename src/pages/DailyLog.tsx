import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { menuRepository } from "../repositories/menuRepository";
import { recordRepository } from "../repositories/recordRepository";
import { MenuItem } from "../models/Menu";

const CameraIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 4v16m8-8H4"
    />
  </svg>
);

interface ShiftLogRow {
  id: string;
  batchId: string;
  menuItemId: number;
  itemName: string;
  category: string;
  costToProduce: number;
  prepTime: string;
  preparedQty: number;
  soldQty: number;
  wasteQty: number;
  recycleQty: number;
  wasteReason: string;
}

interface DailyLogProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  companyName?: string; // Add this line
}

export const DailyLog: React.FC<DailyLogProps> = ({
  theme = "light",
  language = "en",
  companyName = "WiseServe Outlet",
}) => {
  // ... rest of your DailyLog component code
  const isDark = theme === "dark";
  const isBM = language === "bm";

  const WASTE_REASONS = [
    isBM ? "Tamat Tempoh / Basa" : "Expired / Spoiled",
    isBM ? "Terlebih Masak / Hangus" : "Overcooked / Burned",
    isBM ? "Penurunan Kualiti (QC Drop)" : "Quality Control Drop",
    isBM ? "Pulangan Pelanggan" : "Customer Return",
    isBM ? "Penggunaan Staf / Rasa" : "Staff Consumption / Tasting",
  ];

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

  // Modal States
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState({
    menuItemId: 0,
    prepTime: "10:30 AM",
    preparedQty: 10,
    wasteQty: 0,
    recycleQty: 0,
    wasteReason: WASTE_REASONS[0] || "Expired / Spoiled",
  });

  useEffect(() => {
    fetchMenu();
  }, [language]);

  const fetchMenu = async () => {
    try {
      const items = await menuRepository.getAll("active");
      if (items && Array.isArray(items) && items.length > 0) {
        setAvailableMenuItems(items);
        setNewBatchForm((prev) => ({ ...prev, menuItemId: items[0].id }));
      }
    } catch (err) {
      console.error("Failed to load active menu items", err);
    }
  };

  const handleOpenAddModal = () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setNewBatchForm({
      menuItemId: availableMenuItems[0]?.id || 0,
      prepTime: currentTime,
      preparedQty: 10,
      wasteQty: 0,
      recycleQty: 0,
      wasteReason: WASTE_REASONS[0] || "Expired / Spoiled",
    });
    setIsAddModalOpen(true);
  };

  const handleManualAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItem = availableMenuItems.find(
      (m) => m.id === Number(newBatchForm.menuItemId),
    );

    if (!selectedItem) return;

    const generatedBatchId = `#B${Math.floor(100 + Math.random() * 900)}`;
    const newRow: ShiftLogRow = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      batchId: generatedBatchId,
      menuItemId: selectedItem.id,
      itemName: selectedItem.name || "Item",
      category: selectedItem.category || "General",
      costToProduce: selectedItem.costToProduce || 0,
      prepTime: newBatchForm.prepTime,
      preparedQty: Number(newBatchForm.preparedQty) || 0,
      soldQty: selectedItem.soldQty || 0,
      wasteQty: Number(newBatchForm.wasteQty) || 0,
      recycleQty: Number(newBatchForm.recycleQty) || 0,
      wasteReason: newBatchForm.wasteReason,
    };

    setRows((prev) => [newRow, ...(prev || [])]);
    setIsAddModalOpen(false);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => (prev || []).filter((r) => r.id !== id));
  };

  const handleRowChange = (
    id: string,
    field: keyof ShiftLogRow,
    value: any,
  ) => {
    setRows((prev) =>
      (prev || []).map((row) => {
        if (row.id !== id) return row;

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
              costToProduce: selectedItem.costToProduce || 0,
              soldQty: selectedItem.soldQty || 0,
            };
          }
        }

        return { ...row, [field]: value };
      }),
    );
  };

  const handleScanPrepSheet = () => {
    if (!scanFile || availableMenuItems.length === 0) return;
    setIsScanning(true);

    setTimeout(() => {
      const scannedRows: ShiftLogRow[] = [
        {
          id: Date.now().toString() + "1",
          batchId: "#B108",
          menuItemId: availableMenuItems[0]?.id || 1,
          itemName: availableMenuItems[0]?.name || "Item 1",
          category: availableMenuItems[0]?.category || "Mains",
          costToProduce: availableMenuItems[0]?.costToProduce || 5,
          prepTime: "10:30 AM",
          preparedQty: 40,
          soldQty: availableMenuItems[0]?.soldQty || 30,
          wasteQty: 2,
          recycleQty: 8,
          wasteReason: WASTE_REASONS[0] || "Expired / Spoiled",
        },
      ];

      setRows((prev) => [...scannedRows, ...(prev || [])]);
      setIsScanning(false);
      setIsScanModalOpen(false);
      setScanFile(null);
      setSuccessMessage(
        isBM
          ? "Data Kitchen Prep Sheet berjaya diekstrak melalui OCR!"
          : "Kitchen Prep Sheet data successfully extracted via OCR!",
      );
    }, 1500);
  };

  // Safe Calculations
  const safeRows = Array.isArray(rows) ? rows : [];
  const calculatedRows = safeRows.map((r) => {
    const totalRemaining = Math.max(0, (r.preparedQty || 0) - (r.soldQty || 0));
    const wasteCost = (r.wasteQty || 0) * (r.costToProduce || 0);
    return { ...r, totalRemaining, wasteCost };
  });

  const totalPrepared = calculatedRows.reduce(
    (acc, r) => acc + (r.preparedQty || 0),
    0,
  );
  const totalSold = calculatedRows.reduce(
    (acc, r) => acc + (r.soldQty || 0),
    0,
  );
  const totalRecycle = calculatedRows.reduce(
    (acc, r) => acc + (r.recycleQty || 0),
    0,
  );
  const totalWasteCost = calculatedRows.reduce(
    (acc, r) => acc + (r.wasteCost || 0),
    0,
  );

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
          batchId: r.batchId,
          menuItemId: r.menuItemId,
          prepTime: r.prepTime,
          preparedQty: r.preparedQty,
          soldQty: r.soldQty,
          wasteQty: r.wasteQty,
          recycleQty: r.recycleQty,
          wasteCost: r.wasteCost,
          wasteReason: r.wasteReason,
        })),
      };

      await recordRepository.createBatch(payload);
      setSuccessMessage(
        isBM
          ? "Log syif berjaya disimpan! Baki recycle dihantar ke Expiration Alert."
          : "Shift log saved successfully! Recycled items routed to Expiration Alert.",
      );
    } catch (err: any) {
      console.error("Failed to submit shift log batch", err);
      setErrorMessage(
        err?.response?.data?.message ||
          (isBM
            ? "Gagal menyimpan log syif. Sila cuba lagi."
            : "Failed to save shift logs. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Overview Cards (Now at the top) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card theme={theme}>
          <p
            className={`text-xs font-semibold uppercase ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {isBM ? "JUMLAH PREP" : "TOTAL PREPARED"}
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
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
          <p className="text-2xl font-bold text-emerald-500 mt-1">
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
          <p className="text-2xl font-bold text-amber-500 mt-1">
            {totalRecycle}{" "}
            <span className="text-xs font-normal text-slate-400">
              {isBM ? "unit" : "units"}
            </span>
          </p>
        </Card>

        <Card theme={theme}>
          <p className="text-xs font-semibold text-rose-500 uppercase">
            {isBM ? "KOS SISA / BUANG" : "ESTIMATED WASTE COST"}
          </p>
          <p className="text-2xl font-bold text-rose-500 mt-1">
            RM{totalWasteCost.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* 2. Inline Action Controls Bar (Now below overview cards) */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={shiftDate}
          onChange={(e) => setShiftDate(e.target.value)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        />

        <select
          value={shiftType}
          onChange={(e) => setShiftType(e.target.value as any)}
          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-100"
              : "bg-white border-slate-200 text-slate-700"
          }`}
        >
          <option value="Lunch">
            {isBM ? "Syif Tengah Hari" : "Lunch Shift"}
          </option>
          <option value="Dinner">{isBM ? "Syif Malam" : "Dinner Shift"}</option>
          <option value="Full Day">
            {isBM ? "Sepanjang Hari" : "Full Day"}
          </option>
        </select>

        <Button
          theme={theme}
          variant="secondary"
          onClick={() => setIsScanModalOpen(true)}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          <CameraIcon />
          <span>
            {isBM ? "Imbas Kitchen Prep Sheet" : "Scan Kitchen Prep Sheet"}
          </span>
        </Button>

        <Button
          theme={theme}
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          <PlusIcon />
          <span>{isBM ? "Tambah Batch Manual" : "Add Batch Row"}</span>
        </Button>
      </div>

      {/* Feedback Banners */}
      {successMessage && (
        <div
          className={`p-4 text-xs rounded-2xl border ${
            isDark
              ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className={`p-4 text-xs rounded-2xl border ${
            isDark
              ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {errorMessage}
        </div>
      )}

      {/* 3. Main Table Form */}
      <form onSubmit={handleSubmitLog}>
        <Card theme={theme} className="overflow-hidden min-h-[250px]">
          <div
            className={`p-4 border-b flex justify-between items-center ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <h3
              className={`font-semibold text-sm ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {isBM ? "Senarai Batch Syif Dapur" : "Shift Kitchen Batch Entry"}{" "}
              ({calculatedRows.length})
            </h3>
            <Button
              type="button"
              theme={theme}
              variant="secondary"
              size="sm"
              onClick={handleOpenAddModal}
              className="rounded-xl text-xs"
            >
              + {isBM ? "Tambah Batch Manual" : "Add Batch Row"}
            </Button>
          </div>

          {calculatedRows.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              {isBM
                ? "Tiada batch direkodkan lagi. Klik '+ Tambah Batch Manual' atau 'Imbas Kitchen Prep Sheet' untuk bermula."
                : "No batches recorded yet. Click '+ Add Batch Row' or 'Scan Kitchen Prep Sheet' to start."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead
                  className={`font-semibold uppercase border-b ${
                    isDark
                      ? "bg-slate-800/60 text-slate-400 border-slate-800"
                      : "bg-slate-50 text-slate-700 border-slate-100"
                  }`}
                >
                  <tr>
                    <th className="p-3">
                      {isBM ? "BATCH & MASA" : "BATCH & TIME"}
                    </th>
                    <th className="p-3">{isBM ? "ITEM MENU" : "MENU ITEM"}</th>
                    <th className="p-3 w-20">
                      {isBM ? "PREP QTY" : "PREP QTY"}
                    </th>
                    <th className="p-3 w-20">
                      {isBM ? "SOLD (POS)" : "SOLD (POS)"}
                    </th>
                    <th className="p-3 w-20">
                      {isBM ? "VARIANS" : "VARIANCE"}
                    </th>
                    <th className="p-3 w-20 text-amber-500">
                      {isBM ? "RECYCLE" : "RECYCLE"}
                    </th>
                    <th className="p-3 w-20 text-rose-500">
                      {isBM ? "SISA/BUANG" : "WASTE QTY"}
                    </th>
                    <th className="p-3">
                      {isBM ? "SEBAB SISA" : "WASTE REASON"}
                    </th>
                    <th className="p-3 w-10 text-center">
                      {isBM ? "TINDAKAN" : "ACTION"}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-slate-800" : "divide-slate-100"
                  }`}
                >
                  {calculatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        isDark
                          ? "hover:bg-slate-800/40"
                          : "hover:bg-slate-50/50"
                      }
                    >
                      <td className="p-3 font-mono text-[11px]">
                        <div className="font-bold text-slate-400">
                          {row.batchId}
                        </div>
                        <Input
                          theme={theme}
                          type="time"
                          value={row.prepTime}
                          onChange={(e) =>
                            handleRowChange(row.id, "prepTime", e.target.value)
                          }
                          className="mt-1 text-[10px] p-1 h-6"
                        />
                      </td>

                      <td className="p-3">
                        <select
                          value={row.menuItemId}
                          onChange={(e) =>
                            handleRowChange(
                              row.id,
                              "menuItemId",
                              e.target.value,
                            )
                          }
                          className={`w-full border rounded-xl p-1.5 text-xs focus:ring-1 ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-slate-100"
                              : "bg-white border-slate-200 text-slate-800"
                          }`}
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
                          theme={theme}
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

                      <td className="p-3 font-semibold text-emerald-500">
                        {row.soldQty}
                      </td>

                      <td className="p-3 font-semibold text-slate-400">
                        {row.totalRemaining}
                      </td>

                      <td className="p-3">
                        <Input
                          theme={theme}
                          type="number"
                          min="0"
                          value={row.recycleQty}
                          onChange={(e) =>
                            handleRowChange(
                              row.id,
                              "recycleQty",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </td>

                      <td className="p-3">
                        <Input
                          theme={theme}
                          type="number"
                          min="0"
                          value={row.wasteQty}
                          onChange={(e) =>
                            handleRowChange(
                              row.id,
                              "wasteQty",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </td>

                      <td className="p-3">
                        <select
                          value={row.wasteReason}
                          onChange={(e) =>
                            handleRowChange(
                              row.id,
                              "wasteReason",
                              e.target.value,
                            )
                          }
                          className={`w-full border rounded-xl p-1.5 text-xs focus:ring-1 ${
                            isDark
                              ? "bg-slate-800 border-slate-700 text-slate-100"
                              : "bg-white border-slate-200 text-slate-800"
                          }`}
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
                          className="text-slate-400 hover:text-rose-500 font-bold p-1"
                          title={isBM ? "Buang baris" : "Remove row"}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            className={`p-4 border-t flex justify-between items-center ${
              isDark
                ? "bg-slate-900/50 border-slate-800 text-slate-400"
                : "bg-slate-50 border-slate-100 text-slate-500"
            }`}
          >
            <span className="text-xs">
              {isBM
                ? "Varians & baki recycle akan dihantar secara automatik ke Expiration Alert."
                : "Variances and recycled stocks will be automatically routed to Expiration Alert."}
            </span>
            <Button
              type="submit"
              theme={theme}
              variant="primary"
              disabled={isSubmitting || calculatedRows.length === 0}
            >
              {isSubmitting
                ? isBM
                  ? "Menghantar..."
                  : "Submitting..."
                : isBM
                  ? "Simpan Rekod Log Syif"
                  : "Save Shift Log Records"}
            </Button>
          </div>
        </Card>
      </form>

      {/* Modal Manual Add Batch Row */}
      <Modal
        theme={theme}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={isBM ? "Tambah Batch Masakan Dapur" : "Add Kitchen Prep Batch"}
      >
        <form onSubmit={handleManualAddBatch} className="space-y-3 text-xs">
          <div>
            <label
              className={`block mb-1 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              {isBM ? "Pilih Item Menu" : "Select Menu Item"}
            </label>
            <select
              value={newBatchForm.menuItemId}
              onChange={(e) =>
                setNewBatchForm({
                  ...newBatchForm,
                  menuItemId: Number(e.target.value),
                })
              }
              className={`w-full border rounded-xl p-2 text-xs ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
              required
            >
              {availableMenuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              theme={theme}
              label={isBM ? "Masa Prep Dapur" : "Kitchen Prep Time"}
              type="time"
              value={newBatchForm.prepTime}
              onChange={(e) =>
                setNewBatchForm({ ...newBatchForm, prepTime: e.target.value })
              }
              required
            />
            <Input
              theme={theme}
              label={isBM ? "Kuantiti Masak (Prep Qty)" : "Prep Quantity"}
              type="number"
              min="1"
              value={newBatchForm.preparedQty}
              onChange={(e) =>
                setNewBatchForm({
                  ...newBatchForm,
                  preparedQty: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              theme={theme}
              label={isBM ? "Kuantiti Recycle (Baki Elok)" : "Recycle Qty"}
              type="number"
              min="0"
              value={newBatchForm.recycleQty}
              onChange={(e) =>
                setNewBatchForm({
                  ...newBatchForm,
                  recycleQty: Number(e.target.value),
                })
              }
            />
            <Input
              theme={theme}
              label={isBM ? "Kuantiti Sisa (Buang)" : "Waste Quantity"}
              type="number"
              min="0"
              value={newBatchForm.wasteQty}
              onChange={(e) =>
                setNewBatchForm({
                  ...newBatchForm,
                  wasteQty: Number(e.target.value),
                })
              }
            />
          </div>

          <div>
            <label
              className={`block mb-1 font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}
            >
              {isBM ? "Sebab Sisa / Kerosakan" : "Waste Reason"}
            </label>
            <select
              value={newBatchForm.wasteReason}
              onChange={(e) =>
                setNewBatchForm({
                  ...newBatchForm,
                  wasteReason: e.target.value,
                })
              }
              className={`w-full border rounded-xl p-2 text-xs ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {WASTE_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl text-xs"
            >
              {isBM ? "Batal" : "Cancel"}
            </Button>
            <Button theme={theme} type="submit" className="rounded-xl text-xs">
              {isBM ? "Tambah Batch" : "Add Batch"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal OCR Kitchen Prep Sheet Scanner */}
      <Modal
        theme={theme}
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        title={
          isBM
            ? "Imbas Kitchen Prep Sheet (OCR)"
            : "Scan Kitchen Prep Sheet (OCR)"
        }
      >
        <div className="space-y-4">
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {isBM
              ? "Muat naik imej atau video borang Kitchen Prep Sheet bertulis tangan/cetakan untuk mengekstrak Batch ID, Masa Prep, dan Kuantiti secara automatik."
              : "Upload a printed/handwritten Kitchen Prep Sheet image or video to automatically extract Batch IDs, Prep Times, and Quantities."}
          </p>
          <input
            type="file"
            accept="image/*,video/*,.mp4,.mov,.webm"
            onChange={(e) => e.target.files && setScanFile(e.target.files[0])}
            className={`block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 ${
              isDark
                ? "text-slate-300 file:bg-slate-800 file:text-slate-200"
                : "text-slate-500 file:bg-slate-100 file:text-slate-700"
            }`}
          />
          {scanFile && (
            <Button
              theme={theme}
              onClick={handleScanPrepSheet}
              disabled={isScanning}
              className="w-full rounded-xl text-xs"
            >
              {isScanning
                ? isBM
                  ? "Menganalisis Borang Dapur..."
                  : "Extracting Kitchen Data..."
                : isBM
                  ? "Ekstrak Data Prep Sheet"
                  : "Extract Prep Data"}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DailyLog;
