import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MenuItem, CategoryType } from "../../models/Menu";

type Theme = "light" | "dark";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<MenuItem>) => void | Promise<void>;
  initialData?: MenuItem | null;
  theme?: Theme;
}

const CATEGORIES: CategoryType[] = [
  "Mains",
  "Appetizers",
  "Dessert",
  "Beverages",
];

export const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  theme = "light",
}) => {
  const isDark = theme === "dark";
  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState<CategoryType>(
    initialData?.category ?? "Mains",
  );
  const [price, setPrice] = useState(
    initialData?.sellingPrice?.toString() ?? "",
  );
  const [costToProduce, setCostToProduce] = useState(
    initialData?.costToProduce?.toString() ?? "",
  );
  const [shelfLifeHours, setShelfLifeHours] = useState(
    initialData?.shelfLifeHours?.toString() ?? "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !costToProduce || !shelfLifeHours) return;

    await onSave({
      id: initialData ? initialData.id : undefined,
      name: name.trim(),
      category,
      sellingPrice: parseFloat(price),
      costToProduce: parseFloat(costToProduce),
      shelfLifeHours: parseFloat(shelfLifeHours),
      isActive: true,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Menu Item" : "Add New Menu Item"}
      theme={theme}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className={`block text-xs font-semibold mb-1 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Item Name
          </label>
          <Input
            theme={theme}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Teriyaki Chicken Bento"
            required
          />
        </div>

        <div>
          <label
            className={`block text-xs font-semibold mb-1 ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className={`w-full border rounded-md p-2 text-xs focus:ring-1 focus:ring-slate-900 ${
              isDark
                ? "border-slate-600 bg-slate-800 text-slate-100"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              className={`block text-xs font-semibold mb-1 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Selling Price ($)
            </label>
            <Input
              theme={theme}
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label
              className={`block text-xs font-semibold mb-1 ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Prep Cost ($)
            </label>
            <Input
              theme={theme}
              type="number"
              step="0.01"
              value={costToProduce}
              onChange={(e) => setCostToProduce(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <Input
          theme={theme}
          label="Shelf Life (in hours)"
          type="number"
          min="1"
          step="1"
          value={shelfLifeHours}
          onChange={(e) => setShelfLifeHours(e.target.value)}
          placeholder="e.g. 24"
          required
        />

        <div
          className={`flex justify-end space-x-3 pt-3 border-t ${
            isDark ? "border-slate-700" : "border-slate-100"
          }`}
        >
          <Button
            variant="secondary"
            theme={theme}
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button variant="primary" theme={theme} type="submit">
            {initialData ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
