import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MenuItem, ScannedMenuItem } from "../models/Menu";
import { MenuScannerModal } from "../components/menu/MenuScannerModal";
import { MenuFormModal } from "../components/menu/MenuFormModal";
import { menuRepository } from "../repositories/menuRepository";

type Theme = "light" | "dark";

interface MenuManagerProps {
  theme?: Theme;
  language?: "en" | "bm";
}

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <circle cx="11" cy="11" r="6" />
    <path d="m16 16 4 4" />
  </svg>
);

const CameraIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.2l1.2-1.5h4.2L15.3 5h2.2A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

const PlusIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-4 w-4"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MenuManager: React.FC<MenuManagerProps> = ({
  theme = "light",
  language: _language,
}) => {
  const isDark = theme === "dark";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuRepository.getAll("active");
      setMenuItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load menu catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    try {
      if (editingItem) {
        const updated = await menuRepository.update(editingItem.id, itemData);
        setMenuItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item)),
        );
      } else {
        const created = await menuRepository.create({
          name: itemData.name || "",
          category: itemData.category || "Mains",
          price: itemData.price || 0,
          costToProduce: itemData.costToProduce || 0,
          isActive: true,
        });
        setMenuItems((prev) => [...prev, created]);
      }
    } catch (err) {
      alert("Error saving menu item to database");
    }
  };

  const handleImportScannedItems = async (scanned: ScannedMenuItem[]) => {
    try {
      const promises = scanned.map((item) =>
        menuRepository.create({
          name: item.name,
          category: item.category,
          price: item.price,
          costToProduce: item.costToProduce,
          isActive: true,
        }),
      );
      const newItems = await Promise.all(promises);
      setMenuItems((prev) => [...prev, ...newItems]);
    } catch (err) {
      alert("Failed to import scanned items");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold tracking-tight ${
              isDark ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Menu Management
          </h1>
          <p
            className={`text-xs mt-1 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Manage active recipes, selling prices, and standard baseline
            production costs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            theme={theme}
            onClick={() => setIsScannerOpen(true)}
          >
            <span className="inline-flex items-center gap-2">
              <CameraIcon />
              <span>Scan Menu / Recipe</span>
            </span>
          </Button>
          <Button variant="primary" theme={theme} onClick={handleOpenAddModal}>
            <span className="inline-flex items-center gap-2">
              <PlusIcon />
              <span>Add New Item</span>
            </span>
          </Button>
        </div>
      </div>

      <Card theme={theme} className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-72">
            <div className="relative">
              <span
                className={`pointer-events-none absolute inset-y-0 left-3 flex items-center ${
                  isDark ? "text-slate-400" : "text-slate-400"
                }`}
              >
                <SearchIcon />
              </span>
              <Input
                theme={theme}
                className="pl-9"
                placeholder="Search dish name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Mains", "Appetizers", "Dessert", "Beverages"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? isDark
                        ? "bg-slate-100 text-slate-900"
                        : "bg-slate-900 text-white"
                      : isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ),
            )}
          </div>
        </div>
      </Card>

      <Card theme={theme} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDark
                    ? "border-slate-700 bg-slate-800/60 text-slate-400"
                    : "border-slate-100 bg-slate-50/50 text-slate-400"
                }`}
              >
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Prep Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody
              className={`text-xs ${
                isDark
                  ? "divide-y divide-slate-700 text-slate-300"
                  : "divide-y divide-slate-100 text-slate-700"
              }`}
            >
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading menu catalog from server...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-rose-500 font-medium"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      isDark
                        ? "hover:bg-slate-800/60 transition-colors"
                        : "hover:bg-slate-50/50 transition-colors"
                    }
                  >
                    <td
                      className={`py-3.5 px-4 font-semibold ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          isDark
                            ? "bg-slate-800 text-slate-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 font-semibold ${
                        isDark ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      ${item.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3.5 px-4 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      ${item.costToProduce.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.isActive
                            ? isDark
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isDark
                              ? "bg-slate-800 text-slate-300"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className={`text-xs font-medium transition-colors ${
                          isDark
                            ? "text-slate-300 hover:text-slate-100"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <MenuScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onImportItems={handleImportScannedItems}
        theme={theme}
      />

      <MenuFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveItem}
        initialData={editingItem}
        theme={theme}
      />
    </div>
  );
};

export default MenuManager;