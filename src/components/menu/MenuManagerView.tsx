import React from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { type CategoryType, type MenuItem } from "../../models/Menu";

export interface MenuCategory {
  code: string;
  label: string;
}

export interface MenuManagerViewProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  menuItems: MenuItem[];
  filteredItems: MenuItem[];
  categories: MenuCategory[];
  searchTerm: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
  isReceiptModalOpen: boolean;
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  onEditModalOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  newItem: Partial<MenuItem>;
  scanFile: File | null;
  isScanning: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onFetchMenu: () => void;
  onReceiptModalOpenChange: (open: boolean) => void;
  onFileChange: (file: File | null) => void;
  onScanReceipt: () => void;
  onOpenEdit: (item: MenuItem) => void;
  onSaveEdit: (e: React.FormEvent) => void;
  onAddNewItem: (e: React.FormEvent) => void;
  onAddModalOpenChange: (open: boolean) => void;
  onEditingItemChange: (item: MenuItem) => void;
  onNewItemChange: (nextItem: Partial<MenuItem>) => void;
}

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

const RefreshIcon = () => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    className="w-10 h-10 text-rose-500 mb-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export const MenuManagerView: React.FC<MenuManagerViewProps> = ({
  theme = "light",
  language = "en",
  menuItems,
  filteredItems,
  categories,
  searchTerm,
  selectedCategory,
  isLoading,
  error,
  isReceiptModalOpen,
  isEditModalOpen,
  isAddModalOpen,
  editingItem,
  newItem,
  scanFile,
  isScanning,
  onSearchChange,
  onCategoryChange,
  onFetchMenu,
  onReceiptModalOpenChange,
  onEditModalOpenChange,
  onFileChange,
  onScanReceipt,
  onOpenEdit,
  onSaveEdit,
  onAddNewItem,
  onAddModalOpenChange,
  onEditingItemChange,
  onNewItemChange,
}) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-3">
        <Button
          theme={theme}
          variant="secondary"
          onClick={() => onReceiptModalOpenChange(true)}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          <CameraIcon />
          <span>{isBM ? "Imbas Resit Jualan" : "Scan Sales Receipt"}</span>
        </Button>

        <Button
          theme={theme}
          onClick={() => onAddModalOpenChange(true)}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          <PlusIcon />
          <span>{isBM ? "Tambah Menu Baru" : "Add New Item"}</span>
        </Button>
      </div>

      <Card
        theme={theme}
        className="p-3.5 flex flex-col md:flex-row justify-between items-center gap-3"
      >
        <div className="w-full md:w-72">
          <Input
            theme={theme}
            placeholder={isBM ? "Cari nama hidangan..." : "Search dish name..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => onCategoryChange(cat.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.code
                  ? isDark
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "bg-slate-900 text-white font-semibold"
                  : isDark
                    ? "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Card>

      <Card
        theme={theme}
        className="overflow-hidden min-h-[320px] flex flex-col justify-center"
      >
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {isBM ? "Memuatkan data menu..." : "Loading menu catalog..."}
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <AlertIcon />
            <h3
              className={`text-sm font-semibold mb-1 ${isDark ? "text-slate-200" : "text-slate-800"}`}
            >
              {isBM ? "Gagal Memuatkan Menu" : "Unable to Load Menu"}
            </h3>
            <p
              className={`text-xs mb-5 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {error}
            </p>
            <Button
              theme={theme}
              onClick={onFetchMenu}
              className="flex items-center gap-2 text-xs rounded-xl px-4 py-2"
            >
              <RefreshIcon />
              <span>{isBM ? "Cuba Lagi" : "Try Again"}</span>
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {isBM
              ? "Tiada item menu direkodkan lagi. Klik '+ Tambah Menu Baru' atau 'Imbas Resit Jualan' untuk bermula."
              : "No menu items recorded yet. Click '+ Add New Item' or 'Scan Sales Receipt' to start."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`uppercase border-b text-[10px] tracking-wider ${
                  isDark
                    ? "bg-slate-800/60 text-slate-400 border-slate-800"
                    : "bg-slate-50 text-slate-600 border-slate-100"
                }`}
              >
                <tr>
                  <th className="p-4">{isBM ? "NAMA ITEM" : "ITEM NAME"}</th>
                  <th className="p-4">{isBM ? "KATEGORI" : "CATEGORY"}</th>
                  <th className="p-4">
                    {isBM ? "HARGA JUALAN" : "SELLING PRICE"}
                  </th>
                  <th className="p-4">
                    {isBM ? "KOS PENYEDIAAN" : "PREP COST"}
                  </th>
                  <th className="p-4 text-center">
                    {isBM ? "TERJUAL HARIAN" : "DAILY SOLD QTY"}
                  </th>
                  <th className="p-4 text-center">
                    {isBM ? "TINDAKAN" : "ACTIONS"}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark ? "divide-slate-800" : "divide-slate-100"
                }`}
              >
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/50"
                    }
                  >
                    <td
                      className={`p-4 font-semibold ${
                        isDark ? "text-slate-100" : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.category}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      RM{(item.sellingPrice || 0).toFixed(2)}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      RM{(item.costToProduce || 0).toFixed(2)}
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-500">
                      {item.soldQty} {isBM ? "unit" : "units"}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        theme={theme}
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenEdit(item)}
                        className="rounded-xl text-[11px]"
                      >
                        {isBM ? "Edit" : "Edit"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        theme={theme}
        isOpen={isReceiptModalOpen}
        onClose={() => onReceiptModalOpenChange(false)}
        title={isBM ? "Imbas Resit Jualan Harian" : "Scan Daily Sales Receipt"}
      >
        <div className="space-y-4">
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {isBM
              ? "Muat naik imej atau video resit jualan harian POS untuk mengekstrak dan mengemas kini metrik jualan item secara automatik."
              : "Upload the daily POS sales receipt image or video to automatically extract and update item sales metrics."}
          </p>
          <input
            type="file"
            accept="image/*,video/*,.mp4,.mov,.webm"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className={`block w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 ${
              isDark
                ? "text-slate-300 file:bg-slate-800 file:text-slate-200"
                : "text-slate-500 file:bg-slate-100 file:text-slate-700"
            }`}
          />
          {scanFile && (
            <Button
              theme={theme}
              onClick={onScanReceipt}
              disabled={isScanning}
              className="w-full rounded-xl text-xs"
            >
              {isScanning
                ? isBM
                  ? "Menganalisis Resit Jualan..."
                  : "Processing Sales Receipt..."
                : isBM
                  ? "Ekstrak Data Jualan"
                  : "Extract Sales Data"}
            </Button>
          )}
        </div>
      </Modal>

      {editingItem && (
        <Modal
          theme={theme}
          isOpen={isEditModalOpen}
          onClose={() => onEditModalOpenChange(false)}
          title={`${isBM ? "Edit" : "Edit"} ${editingItem.name}`}
        >
          <form onSubmit={onSaveEdit} className="space-y-3 text-xs">
            <Input
              theme={theme}
              label={isBM ? "Nama Hidangan" : "Dish Name"}
              value={editingItem.name}
              onChange={(e) =>
                onEditingItemChange({ ...editingItem, name: e.target.value })
              }
            />
            <Input
              theme={theme}
              label={isBM ? "Kategori" : "Category"}
              value={editingItem.category}
              onChange={(e) =>
                onEditingItemChange({
                  ...editingItem,
                  category: e.target.value as CategoryType,
                })
              }
            />
            <Input
              theme={theme}
              label={isBM ? "Harga Jualan (RM)" : "Selling Price (RM)"}
              type="number"
              step="0.01"
              value={editingItem.sellingPrice || 0}
              onChange={(e) =>
                onEditingItemChange({
                  ...editingItem,
                  sellingPrice: parseFloat(e.target.value) || 0,
                })
              }
            />
            <Input
              theme={theme}
              label={isBM ? "Kos Penyediaan (RM)" : "Prep Cost (RM)"}
              type="number"
              step="0.01"
              value={editingItem.costToProduce || 0}
              onChange={(e) =>
                onEditingItemChange({
                  ...editingItem,
                  costToProduce: parseFloat(e.target.value) || 0,
                })
              }
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                theme={theme}
                variant="secondary"
                type="button"
                onClick={() => onEditModalOpenChange(false)}
                className="rounded-xl text-xs"
              >
                {isBM ? "Batal" : "Cancel"}
              </Button>
              <Button
                theme={theme}
                type="submit"
                className="rounded-xl text-xs"
              >
                {isBM ? "Simpan Perubahan" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <Modal
        theme={theme}
        isOpen={isAddModalOpen}
        onClose={() => onAddModalOpenChange(false)}
        title={isBM ? "Tambah Item Menu Baru" : "Add New Menu Item"}
      >
        <form onSubmit={onAddNewItem} className="space-y-3 text-xs">
          <Input
            theme={theme}
            label={isBM ? "Nama Hidangan" : "Dish Name"}
            placeholder="e.g. Chicken Burger"
            value={newItem.name || ""}
            onChange={(e) =>
              onNewItemChange({ ...newItem, name: e.target.value })
            }
            required
          />
          <Input
            theme={theme}
            label={isBM ? "Kategori" : "Category"}
            placeholder="Mains, Appetizers, Dessert, Beverages"
            value={newItem.category || "Mains"}
            onChange={(e) =>
              onNewItemChange({
                ...newItem,
                category: e.target.value as CategoryType,
              })
            }
          />
          <Input
            theme={theme}
            label={isBM ? "Harga Jualan (RM)" : "Selling Price (RM)"}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={newItem.sellingPrice || ""}
            onChange={(e) =>
              onNewItemChange({
                ...newItem,
                sellingPrice: parseFloat(e.target.value) || 0,
              })
            }
          />
          <Input
            theme={theme}
            label={isBM ? "Kos Penyediaan (RM)" : "Prep Cost (RM)"}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={newItem.costToProduce || ""}
            onChange={(e) =>
              onNewItemChange({
                ...newItem,
                costToProduce: parseFloat(e.target.value) || 0,
              })
            }
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              onClick={() => onAddModalOpenChange(false)}
              className="rounded-xl text-xs"
            >
              {isBM ? "Batal" : "Cancel"}
            </Button>
            <Button theme={theme} type="submit" className="rounded-xl text-xs">
              {isBM ? "Tambah Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuManagerView;
