import React, { useState, useEffect } from "react";
import { LogControls } from "../components/daily/LogControls";
import { LogSummaryCards } from "../components/daily/LogSummaryCards";
import { LogTable } from "../components/daily/LogTable";
import { AddBatchModal } from "../components/daily/AddBatchModal";
import { PrepSheetScannerModal } from "../components/daily/PrepSheetScannerModal";
import { menuRepository } from "../repositories/menuRepository";
import { recordRepository } from "../repositories/recordRepository";
import { MenuItem } from "../models/Menu";

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
  notes: string;
  shelfLifeHours: number;
  expirationAt: string;
}

interface DailyLogProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  companyName?: string; // Add this line
}

export const DailyLog: React.FC<DailyLogProps> = ({
  theme = "light",
  language = "en",
  companyName: _companyName = "WiseServe Outlet",
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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState({
    menuItemId: 0,
    prepTime: "10:30 AM",
    preparedQty: 10,
    notes: "",
  });

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

  useEffect(() => {
    void Promise.resolve().then(fetchMenu);
  }, [language]);

  const handleOpenAddModal = () => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setNewBatchForm({
      menuItemId: availableMenuItems[0]?.id || 0,
      prepTime: currentTime,
      preparedQty: 10,
      notes: "",
    });
    setIsAddModalOpen(true);
  };

  const calculateExpirationAt = (prepTime: string, shelfLifeHours: number) => {
    const prepDate = /^\d{2}:\d{2}$/.test(prepTime)
      ? new Date(`${shiftDate}T${prepTime}`)
      : new Date(`${shiftDate} ${prepTime}`);

    if (Number.isNaN(prepDate.getTime())) return "";
    prepDate.setHours(prepDate.getHours() + shelfLifeHours);
    return prepDate.toISOString();
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
      soldQty: 0,
      wasteQty: 0,
      recycleQty: 0,
      wasteReason: WASTE_REASONS[0] || "Expired / Spoiled",
      notes: newBatchForm.notes,
      shelfLifeHours: selectedItem.shelfLifeHours,
      expirationAt: calculateExpirationAt(
        newBatchForm.prepTime,
        selectedItem.shelfLifeHours,
      ),
    };

    setRows((prev) => [newRow, ...(prev || [])]);
    setIsAddModalOpen(false);
  };

  const handleRemoveRow = async (id: string) => {
    try {
      await recordRepository.deleteRecord(id);
      setRows((prev) => (prev || []).filter((r) => r.id !== id));
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to delete batch record.",
      );
    }
  };

  const handleSaveLogEdits = async (editedRows: Array<ShiftLogRow>) => {
    setRows(editedRows);
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
              soldQty: row.soldQty || 0,
              shelfLifeHours: selectedItem.shelfLifeHours,
              expirationAt: calculateExpirationAt(
                row.prepTime,
                selectedItem.shelfLifeHours,
              ),
            };
          }
        }

        if (field === "prepTime") {
          return {
            ...row,
            prepTime: value,
            expirationAt: calculateExpirationAt(value, row.shelfLifeHours),
          };
        }

        return { ...row, [field]: value };
      }),
    );
  };

  const handleScanImport = (
    scannedItems: Array<{
      itemName: string;
      preparedQty: number;
      soldQty: number;
      wasteReason: string;
    }>,
  ) => {
    const scannedRows = scannedItems.map((item, index) => {
      const selectedItem =
        availableMenuItems.find(
          (menuItem) =>
            menuItem.name.toLowerCase() === item.itemName.toLowerCase(),
        ) ?? availableMenuItems[0];

      return {
        id: `${Date.now()}-${index}`,
        batchId: `#B${Math.floor(100 + Math.random() * 900)}`,
        menuItemId: selectedItem?.id ?? 0,
        itemName: selectedItem?.name ?? item.itemName,
        category: selectedItem?.category ?? "General",
        costToProduce: selectedItem?.costToProduce ?? 0,
        prepTime: "10:30 AM",
        preparedQty: item.preparedQty,
        soldQty: item.soldQty,
        wasteQty: Math.max(0, item.preparedQty - item.soldQty),
        recycleQty: 0,
        wasteReason: item.wasteReason || WASTE_REASONS[0],
        notes: "",
        shelfLifeHours: selectedItem?.shelfLifeHours ?? 24,
        expirationAt: calculateExpirationAt(
          "10:30 AM",
          selectedItem?.shelfLifeHours ?? 24,
        ),
      } satisfies ShiftLogRow;
    });

    setRows((prev) => [...scannedRows, ...prev]);
    setIsScanModalOpen(false);
    setSuccessMessage(
      isBM
        ? "Data Kitchen Prep Sheet berjaya diekstrak melalui OCR!"
        : "Kitchen Prep Sheet data successfully extracted via OCR!",
    );
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
          prepQuantity: r.preparedQty,
          preparedQty: r.preparedQty,
          soldQty: r.soldQty,
          wasteQty: r.wasteQty,
          recycleQty: r.recycleQty,
          wasteCost: r.wasteCost,
          wasteReason: r.wasteReason,
          expirationAt: r.expirationAt,
          notes: r.notes,
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
          shelfLifeHours: item.shelfLifeHours,
        }))}
        wasteReasons={WASTE_REASONS}
        onRowChange={handleRowChange}
        onRemoveRow={handleRemoveRow}
        onSaveEdits={handleSaveLogEdits}
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
        onFormChange={setNewBatchForm}
        onSubmit={handleManualAddBatch}
      />

      <PrepSheetScannerModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onScan={recordRepository.scanReceipt}
        onImport={handleScanImport}
      />
    </div>
  );
};

export default DailyLog;
