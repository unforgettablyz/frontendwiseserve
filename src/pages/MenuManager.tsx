import React, { useEffect, useMemo, useState } from "react";
import { MenuManagerView } from "../components/menu/MenuManagerView";
import { menuRepository } from "../repositories/menuRepository";
import {
  type CategoryType,
  type MenuItem,
  type ScannedMenuItem,
} from "../models/Menu";

interface MenuManagerProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const MenuManager: React.FC<MenuManagerProps> = ({
  theme = "light",
  language = "en",
}) => {
  const isBM = language === "bm";

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMenuScannerOpen, setIsMenuScannerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const categories = useMemo(
    () => [
      { code: "All", label: isBM ? "Semua" : "All" },
      { code: "Mains", label: isBM ? "Hidangan Utama" : "Mains" },
      { code: "Appetizers", label: isBM ? "Makanan Sampingan" : "Appetizers" },
      { code: "Dessert", label: isBM ? "Pencuci Mulut" : "Dessert" },
      { code: "Beverages", label: isBM ? "Minuman" : "Beverages" },
    ],
    [isBM],
  );

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  const fetchMenu = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await menuRepository.getAll();
      const enrichedData = (data || []).map((item: any) => ({
        ...item,
        sellingPrice: item.sellingPrice ?? item.price ?? 0,
        costToProduce: item.costToProduce ?? item.cost ?? 0,
        shelfLifeHours: Number(
          item.shelfLifeHours ?? item.shelf_life_hours ?? 24,
        ),
      }));
      setMenuItems(enrichedData);
    } catch (err) {
      console.warn(
        "Backend API offline or failed to load menu catalog. Falling back to empty state:",
        err,
      );
      setMenuItems([]);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchMenu);
  }, []);

  const handleScanMenu = (file: File) => menuRepository.scanMenu(file);

  const handleImportMenuItems = async (items: ScannedMenuItem[]) => {
    await Promise.all(
      items.map((item) =>
        menuRepository.create({
          name: item.name,
          category: item.category,
          price: item.price,
          sellingPrice: item.price,
          costToProduce: item.costToProduce,
          shelfLifeHours: item.shelfLifeHours,
          isActive: true,
        }),
      ),
    );
    await fetchMenu();
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (itemData: Partial<MenuItem>) => {
    if (!editingItem || !itemData.name) return;
    try {
      await menuRepository.update(editingItem.id, itemData);
      await fetchMenu();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update menu item.",
      );
    }
  };

  const handleAddNewItem = async (itemData: Partial<MenuItem>) => {
    if (!itemData.name) return;

    try {
      await menuRepository.create({
        name: itemData.name,
        category: (itemData.category as CategoryType) || "Mains",
        price: itemData.sellingPrice || 0,
        sellingPrice: itemData.sellingPrice || 0,
        costToProduce: itemData.costToProduce || 0,
        shelfLifeHours: itemData.shelfLifeHours || 24,
        isActive: true,
      });
      await fetchMenu();
      setIsAddModalOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create menu item.",
      );
    }
  };

  const handleUpdateItems = async (items: MenuItem[]) => {
    const changedItems = items.filter((item) => {
      const original = menuItems.find((current) => current.id === item.id);
      return (
        original &&
        (original.name !== item.name ||
          original.category !== item.category ||
          original.sellingPrice !== item.sellingPrice ||
          original.costToProduce !== item.costToProduce ||
          original.shelfLifeHours !== item.shelfLifeHours)
      );
    });

    await Promise.all(
      changedItems.map((item) => menuRepository.update(item.id, item)),
    );
    await fetchMenu();
  };

  const handleDeleteItem = async (id: number) => {
    await menuRepository.delete(id);
    setMenuItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <MenuManagerView
      theme={theme}
      language={language}
      filteredItems={filteredItems}
      categories={categories}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      isLoading={isLoading}
      error={error}
      isMenuScannerOpen={isMenuScannerOpen}
      isEditModalOpen={isEditModalOpen}
      isAddModalOpen={isAddModalOpen}
      editingItem={editingItem}
      onSearchChange={setSearchTerm}
      onCategoryChange={setSelectedCategory}
      onFetchMenu={fetchMenu}
      onMenuScannerOpenChange={setIsMenuScannerOpen}
      onEditModalOpenChange={setIsEditModalOpen}
      onScanMenu={handleScanMenu}
      onImportMenuItems={handleImportMenuItems}
      onOpenEdit={handleOpenEdit}
      onSaveItem={handleSaveEdit}
      onCreateItem={handleAddNewItem}
      onAddModalOpenChange={setIsAddModalOpen}
      onUpdateItems={handleUpdateItems}
      onDeleteItem={handleDeleteItem}
    />
  );
};

export default MenuManager;
