import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";

interface MenuManagerProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const MenuManager = ({ theme = "light" }: MenuManagerProps) => {
  const isDark = theme === "dark";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockMenu = [
    {
      id: 1,
      name: "Chicken Teriyaki Bento",
      category: "Mains",
      price: "$12.50",
    },
    {
      id: 2,
      name: "Salmon Sashimi Plate",
      category: "Appetizers",
      price: "$16.00",
    },
    { id: 3, name: "Green Tea Ice Cream", category: "Dessert", price: "$4.50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p
          className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
        >
          Manage active menu items and standard pricing.
        </p>
        <Button theme={theme} onClick={() => setIsModalOpen(true)}>
          + Add New Item
        </Button>
      </div>

      <Card theme={theme} className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              className={`border-b text-[11px] font-semibold uppercase tracking-[0.18em] ${
                isDark
                  ? "border-slate-700 bg-slate-800/80 text-slate-400"
                  : "border-slate-200 bg-slate-50/80 text-slate-400"
              }`}
            >
              <th className="py-4 px-6">Item Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm ${isDark ? "divide-slate-700" : "divide-slate-200"}`}
          >
            {mockMenu.map((item) => (
              <tr
                key={item.id}
                className={
                  isDark
                    ? "hover:bg-slate-800/60 transition-colors"
                    : "hover:bg-slate-50/70 transition-colors"
                }
              >
                <td
                  className={`py-4 px-6 font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}
                >
                  {item.name}
                </td>
                <td
                  className={`py-4 px-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {item.category}
                </td>
                <td
                  className={`py-4 px-6 font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}
                >
                  {item.price}
                </td>
                <td className="py-4 px-6 text-right">
                  <Button
                    theme={theme}
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        theme={theme}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Menu Item"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setIsModalOpen(false);
          }}
        >
          <Input
            theme={theme}
            label="Item Name"
            placeholder="e.g. Wagyu Beef Bowl"
            required
          />
          <Input
            theme={theme}
            label="Category"
            placeholder="e.g. Mains"
            required
          />
          <Input
            theme={theme}
            label="Selling Price ($)"
            type="number"
            step="0.01"
            placeholder="15.00"
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button theme={theme} type="submit">
              Save Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
