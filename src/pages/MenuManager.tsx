import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { MenuItem, ScannedMenuItem } from "../models/Menu";
import { MenuScannerModal } from "../components/menu/MenuScannerModal";
import { MenuFormModal } from "../components/menu/MenuFormModal";
import { menuRepository } from "../repositories/menuRepository";

interface MenuManagerProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  theme,
  language,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // 1. Fetch menu items from Express backend on mount
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

  // 2. Persist Create/Update actions to Backend
  const handleSaveItem = async (itemData: Partial<MenuItem>) => {
    try {
      if (editingItem) {
        // PUT /api/v1/menu/:id
        const updated = await menuRepository.update(editingItem.id, itemData);
        setMenuItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? updated : item)),
        );
      } else {
        // POST /api/v1/menu
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

  // 3. Batch insert AI scanned items into Backend
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage active recipes, selling prices, and standard baseline
            production costs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => setIsScannerOpen(true)}>
            📷 Scan Menu / Recipe
          </Button>
          <Button variant="primary" onClick={handleOpenAddModal}>
            + Add New Item
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-72">
            <Input
              placeholder="🔍 Search dish name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
            {["All", "Mains", "Appetizers", "Dessert", "Beverages"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
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

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Prep Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
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
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      ${item.costToProduce.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
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
      />

      <MenuFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveItem}
        initialData={editingItem}
      />
    </div>
  );
};

export default MenuManager;
