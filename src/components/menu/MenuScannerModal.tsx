import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { CategoryType, ScannedMenuItem } from "../../models/Menu";

interface MenuScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportItems: (items: ScannedMenuItem[]) => void;
}

const CATEGORY_OPTIONS: CategoryType[] = [
  "Mains",
  "Appetizers",
  "Dessert",
  "Beverages",
  "Sides",
];

const CameraIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-12 w-12 text-slate-400"
  >
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.2l1.2-1.5h4.2L15.3 5h2.2A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

const ClockIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v5l3 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M5 12.5 9.2 16.7 19 6.9" />
  </svg>
);

const XIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MenuScannerModal: React.FC<MenuScannerModalProps> = ({
  isOpen,
  onClose,
  onImportItems,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [stagedItems, setStagedItems] = useState<ScannedMenuItem[]>([]);

  // Handle Drag & Drop / File Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      simulateAiScan(file);
    }
  };

  // Mock AI Extraction Call (This will connect to POST /api/v1/ocr/parse-menu)
  const simulateAiScan = (_file: File) => {
    setIsScanning(true);
    setTimeout(() => {
      // Mocked Vision API response
      const mockParsedData: ScannedMenuItem[] = [
        {
          tempId: "1",
          name: "Tonkotsu Ramen",
          category: "Mains",
          price: 14.5,
          costToProduce: 4.8,
        },
        {
          tempId: "2",
          name: "Chicken Gyoza (5pcs)",
          category: "Appetizers",
          price: 6.5,
          costToProduce: 1.9,
        },
        {
          tempId: "3",
          name: "Matcha Cheesecake",
          category: "Dessert",
          price: 5.5,
          costToProduce: 1.5,
        },
      ];
      setStagedItems(mockParsedData);
      setIsScanning(false);
    }, 1800);
  };

  const handleUpdateStagedItem = (
    tempId: string,
    field: keyof ScannedMenuItem,
    value: any,
  ) => {
    setStagedItems((prev) =>
      prev.map((item) =>
        item.tempId === tempId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleRemoveStagedItem = (tempId: string) => {
    setStagedItems((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleConfirmImport = () => {
    onImportItems(stagedItems);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStagedItems([]);
    setIsScanning(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Menu Items via Vision AI"
    >
      <div className="space-y-6">
        {/* Step 1: Upload Zone */}
        {!previewUrl ? (
          <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl p-8 text-center bg-slate-50 transition-colors">
            <div className="flex flex-col items-center justify-center space-y-3">
              <CameraIcon />
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Drag & drop menu or recipe sheet photo
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, or PDF up to 10MB
                </p>
              </div>
              <label className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                Browse File
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4 bg-slate-100 p-3 rounded-lg">
            <img
              src={previewUrl}
              alt="Scan preview"
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                {selectedFile?.name}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                {isScanning ? (
                  <>
                    <ClockIcon />
                    <span>Extracting dish data with Vision AI...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    <span>Scanning complete</span>
                  </>
                )}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Re-upload
            </Button>
          </div>
        )}

        {/* Step 2: Loading Indicator */}
        {isScanning && (
          <div className="flex flex-col items-center py-6 space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium text-slate-600">
              Parsing dish names, prices, and prep costs...
            </p>
          </div>
        )}

        {/* Step 3: Editable Staging Review Grid */}
        {!isScanning && stagedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Extracted Items ({stagedItems.length})
              </h4>
              <span className="text-xs text-slate-500">
                Verify extracted data before importing
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
              {stagedItems.map((item) => (
                <div
                  key={item.tempId}
                  className="p-3 grid grid-cols-12 gap-2 items-center bg-white text-xs"
                >
                  {/* Dish Name */}
                  <div className="col-span-4">
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateStagedItem(
                          item.tempId,
                          "name",
                          e.target.value,
                        )
                      }
                      placeholder="Dish Name"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <div className="col-span-3">
                    <select
                      value={item.category}
                      onChange={(e) =>
                        handleUpdateStagedItem(
                          item.tempId,
                          "category",
                          e.target.value as CategoryType,
                        )
                      }
                      className="w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-slate-900"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateStagedItem(
                          item.tempId,
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="Price ($)"
                    />
                  </div>

                  {/* Prep Cost */}
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={item.costToProduce}
                      onChange={(e) =>
                        handleUpdateStagedItem(
                          item.tempId,
                          "costToProduce",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="Cost ($)"
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleRemoveStagedItem(item.tempId)}
                      className="inline-flex items-center justify-center text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      title="Remove row"
                      aria-label="Remove item"
                    >
                      <XIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={stagedItems.length === 0 || isScanning}
            onClick={handleConfirmImport}
          >
            Confirm & Import {stagedItems.length} Items
          </Button>
        </div>
      </div>
    </Modal>
  );
};
