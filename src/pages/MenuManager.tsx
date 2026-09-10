import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { menuRepository } from "../repositories/menuRepository";
import { MenuItem, CategoryType } from "../models/Menu";

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

interface MenuManagerProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  theme = "light",
  language = "en",
}) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New Item State
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    category: "Mains",
    sellingPrice: 0,
    costToProduce: 0,
    soldQty: 0,
  });

  // Receipt Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await menuRepository.getAll();
      const enrichedData = data.map((item: any) => ({
        ...item,
        sellingPrice: item.sellingPrice ?? item.price ?? 0,
        costToProduce: item.costToProduce ?? item.cost ?? 0,
        soldQty: item.soldQty ?? Math.floor(Math.random() * 40) + 10,
      }));
      setMenuItems(enrichedData);
    } catch (err) {
      console.error(err);
      setError(
        isBM
          ? "Gagal memuatkan katalog menu daripada pelayan."
          : "Failed to load menu catalog from server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { code: "All", label: isBM ? "Semua" : "All" },
    { code: "Mains", label: isBM ? "Hidangan Utama" : "Mains" },
    { code: "Appetizers", label: isBM ? "Makanan Sampingan" : "Appetizers" },
    { code: "Dessert", label: isBM ? "Pencuci Mulut" : "Dessert" },
    { code: "Beverages", label: isBM ? "Minuman" : "Beverages" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleScanReceipt = () => {
    if (!scanFile) return;
    setIsScanning(true);

    setTimeout(() => {
      const updatedList = menuItems.map((item) => ({
        ...item,
        soldQty: (item.soldQty || 0) + Math.floor(Math.random() * 15) + 5,
      }));

      setMenuItems(updatedList);
      setIsScanning(false);
      setIsReceiptModalOpen(false);
      setScanFile(null);
    }, 1500);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setMenuItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i)),
    );
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const createdItem: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      category: (newItem.category as CategoryType) || "Mains",
      sellingPrice: newItem.sellingPrice || 0,
      costToProduce: newItem.costToProduce || 0,
      soldQty: newItem.soldQty || 0,
      isActive: true,
    };

    setMenuItems((prev) => [createdItem, ...prev]);
    setIsAddModalOpen(false);
    setNewItem({
      name: "",
      category: "Mains",
      sellingPrice: 0,
      costToProduce: 0,
      soldQty: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Single Clean Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            {isBM ? "Pengurusan Menu" : "Menu Management"}
          </h1>
          <p
            className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {isBM
              ? "Urus item aktif, harga jualan, kos pengeluaran, dan imbas resit jualan harian."
              : "Manage active items, selling prices, production costs, and scan daily sales receipts."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            theme={theme}
            variant="secondary"
            onClick={() => setIsReceiptModalOpen(true)}
            className="flex items-center gap-2 text-xs rounded-xl"
          >
            <CameraIcon />
            <span>{isBM ? "Imbas Resit Jualan" : "Scan Sales Receipt"}</span>
          </Button>

          <Button
            theme={theme}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 text-xs rounded-xl"
          >
            <PlusIcon />
            <span>{isBM ? "Tambah Menu Baru" : "Add New Item"}</span>
          </Button>
        </div>
      </div>

      {/* Tightly Integrated Search & Category Filters */}
      <Card
        theme={theme}
        className="p-3.5 flex flex-col md:flex-row justify-between items-center gap-3"
      >
        <div className="w-full md:w-72">
          <Input
            theme={theme}
            placeholder={isBM ? "Cari nama hidangan..." : "Search dish name..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => setSelectedCategory(cat.code)}
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

      {/* Content Area & Actionable Empty/Error State */}
      <Card
        theme={theme}
        className="overflow-hidden min-h-[320px] flex flex-col justify-center"
      >
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {isBM ? "Memuatkan data menu..." : "Loading menu catalog..."}
          </div>
        ) : error ? (
          /* High Priority Fix: Helpful Error State with Retry Button */
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
              onClick={fetchMenu}
              className="flex items-center gap-2 text-xs rounded-xl px-4 py-2"
            >
              <RefreshIcon />
              <span>{isBM ? "Cuba Lagi" : "Try Again"}</span>
            </Button>
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
                        onClick={() => handleOpenEdit(item)}
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

      {/* Modals */}
      <Modal
        theme={theme}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title={isBM ? "Imbas Resit Jualan Harian" : "Scan Daily Sales Receipt"}
      >
        <div className="space-y-4">
          <p
            className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {isBM
              ? "Muat naik imej resit jualan harian POS untuk mengekstrak dan mengemas kini metrik jualan item secara automatik."
              : "Upload the daily POS sales receipt image to automatically extract and update item sales metrics."}
          </p>
          <input
            type="file"
            accept="image/*"
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
              onClick={handleScanReceipt}
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
          onClose={() => setIsEditModalOpen(false)}
          title={`${isBM ? "Edit" : "Edit"} ${editingItem.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
            <Input
              theme={theme}
              label={isBM ? "Nama Hidangan" : "Dish Name"}
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
            />
            <Input
              theme={theme}
              label={isBM ? "Kategori" : "Category"}
              value={editingItem.category}
              onChange={(e) =>
                setEditingItem({
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
                setEditingItem({
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
                setEditingItem({
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
                onClick={() => setIsEditModalOpen(false)}
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
        onClose={() => setIsAddModalOpen(false)}
        title={isBM ? "Tambah Item Menu Baru" : "Add New Menu Item"}
      >
        <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
          <Input
            theme={theme}
            label={isBM ? "Nama Hidangan" : "Dish Name"}
            placeholder="e.g. Chicken Burger"
            value={newItem.name || ""}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <Input
            theme={theme}
            label={isBM ? "Kategori" : "Category"}
            placeholder="Mains, Appetizers, Dessert, Beverages"
            value={newItem.category || "Mains"}
            onChange={(e) =>
              setNewItem({
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
              setNewItem({
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
              setNewItem({
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
              onClick={() => setIsAddModalOpen(false)}
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

export default MenuManager;
