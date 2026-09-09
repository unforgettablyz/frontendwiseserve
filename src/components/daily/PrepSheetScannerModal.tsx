import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface ScannedItem {
  menuItemId?: number;
  itemName: string;
  preparedQty: number;
  soldQty: number;
  wasteReason: string;
}

interface PrepSheetScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (scannedData: ScannedItem[]) => void;
}

export const PrepSheetScannerModal: React.FC<PrepSheetScannerModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedResults, setScannedResults] = useState<ScannedItem[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScannedResults([]);
    }
  };

  const handleScanImage = () => {
    if (!selectedFile) return;
    setIsScanning(true);

    setTimeout(() => {
      const mockParsedItems: ScannedItem[] = [
        {
          itemName: "Grilled Chicken Burger",
          preparedQty: 25,
          soldQty: 22,
          wasteReason: "Unsold End of Shift",
        },
        {
          itemName: "Truffle Fries",
          preparedQty: 40,
          soldQty: 38,
          wasteReason: "Quality Control Drop",
        },
        {
          itemName: "Iced Matcha Latte",
          preparedQty: 15,
          soldQty: 12,
          wasteReason: "Customer Return / Wrong Order",
        },
      ];

      setScannedResults(mockParsedItems);
      setIsScanning(false);
    }, 1500);
  };

  const handleConfirmImport = () => {
    onImport(scannedResults);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl p-6 bg-white space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold text-slate-800">
            Scan Kitchen Prep Sheet
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Upload or Capture Prep Sheet Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>

        {previewUrl && (
          <div className="relative border rounded-lg overflow-hidden max-h-48 flex items-center justify-center bg-slate-900">
            <img
              src={previewUrl}
              alt="Prep Sheet Preview"
              className="object-contain max-h-48"
            />
          </div>
        )}

        {selectedFile && scannedResults.length === 0 && (
          <Button
            type="button"
            variant="primary"
            onClick={handleScanImage}
            disabled={isScanning}
            className="w-full"
          >
            {isScanning ? "Processing OCR Image..." : "Scan & Extract Data"}
          </Button>
        )}

        {scannedResults.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase text-slate-600">
              Extracted Prep Items
            </h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b text-slate-600">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Prep</th>
                    <th className="p-2">Sold</th>
                    <th className="p-2">Waste Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {scannedResults.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-medium">{item.itemName}</td>
                      <td className="p-2">{item.preparedQty}</td>
                      <td className="p-2">{item.soldQty}</td>
                      <td className="p-2 text-slate-500">{item.wasteReason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {scannedResults.length > 0 && (
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirmImport}
            >
              Import Items to Daily Log
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PrepSheetScannerModal;
