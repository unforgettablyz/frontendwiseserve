import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MenuItem, CategoryType } from "../../models/Menu";

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Partial<MenuItem>) => void;
  initialData?: MenuItem | null;
}

const CATEGORIES: CategoryType[] = [
  "Mains",
  "Appetizers",
  "Dessert",
  "Beverages",
  "Sides",
];

export const MenuFormModal: React.FC<MenuFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryType>("Mains");
  const [price, setPrice] = useState("");
  const [costToProduce, setCostToProduce] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price.toString());
      setCostToProduce(initialData.costToProduce.toString());
    } else {
      setName("");
      setCategory("Mains");
      setPrice("");
      setCostToProduce("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !costToProduce) return;

    onSave({
      id: initialData ? initialData.id : undefined,
      name: name.trim(),
      category,
      price: parseFloat(price),
      costToProduce: parseFloat(costToProduce),
      isActive: true,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Menu Item" : "Add New Menu Item"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Item Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Teriyaki Chicken Bento"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-slate-900 bg-white"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selling Price ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prep Cost ($)
            </label>
            <Input
              type="number"
              step="0.01"
              value={costToProduce}
              onChange={(e) => setCostToProduce(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? "Save Changes" : "Create Item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
