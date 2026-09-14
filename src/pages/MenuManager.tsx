import React, { useEffect, useMemo, useState } from "react";
import { MenuManagerView } from "../components/menu/MenuManagerView";
import { menuRepository } from "../repositories/menuRepository";
import { type CategoryType, type MenuItem } from "../models/Menu";

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

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    category: "Mains",
    sellingPrice: 0,
    costToProduce: 0,
    soldQty: 0,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanFile, setScanFile] = useState<File | null>(null);

  useEffect(() => {
    void fetchMenu();
  }, []);

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
        soldQty: item.soldQty ?? 0,
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
    <MenuManagerView
      theme={theme}
      language={language}
      menuItems={menuItems}
      filteredItems={filteredItems}
      categories={categories}
      searchTerm={searchTerm}
      selectedCategory={selectedCategory}
      isLoading={isLoading}
      error={error}
      isReceiptModalOpen={isReceiptModalOpen}
      isEditModalOpen={isEditModalOpen}
      isAddModalOpen={isAddModalOpen}
      editingItem={editingItem}
      newItem={newItem}
      scanFile={scanFile}
      isScanning={isScanning}
      onSearchChange={setSearchTerm}
      onCategoryChange={setSelectedCategory}
      onFetchMenu={fetchMenu}
      onReceiptModalOpenChange={setIsReceiptModalOpen}
      onEditModalOpenChange={setIsEditModalOpen}
      onFileChange={setScanFile}
      onScanReceipt={handleScanReceipt}
      onOpenEdit={handleOpenEdit}
      onSaveEdit={handleSaveEdit}
      onAddNewItem={handleAddNewItem}
      onAddModalOpenChange={setIsAddModalOpen}
      onEditingItemChange={setEditingItem}
      onNewItemChange={setNewItem}
    />
  );
};

export default MenuManager;
