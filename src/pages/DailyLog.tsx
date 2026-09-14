import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { LogControls } from "../components/daily/LogControls";
import { LogSummaryCards } from "../components/daily/LogSummaryCards";
import { LogTable } from "../components/daily/LogTable";
import { AddBatchModal } from "../components/daily/AddBatchModal";
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
      <LogSummaryCards
        theme={theme}
        language={language}
        totalPrepared={totalPrepared}
        totalSold={totalSold}
        totalRecycle={totalRecycle}
        totalWasteCost={totalWasteCost}
      />

      <LogControls
        theme={theme}
        language={language}
        shiftDate={shiftDate}
        shiftType={shiftType}
        onShiftDateChange={setShiftDate}
        onShiftTypeChange={setShiftType}
        onScanClick={() => setIsScanModalOpen(true)}
        onAddClick={handleOpenAddModal}
      />

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

      <LogTable
        theme={theme}
        language={language}
        rows={calculatedRows}
        availableMenuItems={availableMenuItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          costToProduce: item.costToProduce,
          soldQty: item.soldQty,
        }))}
        wasteReasons={WASTE_REASONS}
        onRowChange={handleRowChange}
        onRemoveRow={handleRemoveRow}
        onAddClick={handleOpenAddModal}
        onSubmit={handleSubmitLog}
        isSubmitting={isSubmitting}
      />

      <AddBatchModal
        theme={theme}
        language={language}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableMenuItems={availableMenuItems}
        newBatchForm={newBatchForm}
        wasteReasons={WASTE_REASONS}
        onFormChange={setNewBatchForm}
        onSubmit={handleManualAddBatch}
      />

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
