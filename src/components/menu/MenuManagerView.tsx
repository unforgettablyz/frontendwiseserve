import React, { useState } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { MenuFormModal } from "./MenuFormModal";
import { MenuScannerModal } from "./MenuScannerModal";
import { type MenuItem } from "../../models/Menu";

export interface MenuCategory {
  code: string;
  label: string;
}

export interface MenuManagerViewProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  filteredItems: MenuItem[];
  categories: MenuCategory[];
  searchTerm: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
  isMenuScannerOpen: boolean;
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  onEditModalOpenChange: (open: boolean) => void;
  editingItem: MenuItem | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onFetchMenu: () => void;
  onMenuScannerOpenChange: (open: boolean) => void;
  onScanMenu: (
    file: File,
  ) => Promise<import("../../models/Menu").ScannedMenuItem[]>;
  onImportMenuItems: (
    items: import("../../models/Menu").ScannedMenuItem[],
  ) => void | Promise<void>;
  onOpenEdit: (item: MenuItem) => void;
  onSaveItem: (itemData: Partial<MenuItem>) => void;
  onCreateItem: (itemData: Partial<MenuItem>) => void;
  onAddModalOpenChange: (open: boolean) => void;
  onUpdateItems: (items: MenuItem[]) => Promise<void>;
  onDeleteItem: (id: number) => Promise<void>;
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
  filteredItems,
  categories,
  searchTerm,
  selectedCategory,
  isLoading,
  error,
  isMenuScannerOpen,
  isEditModalOpen,
  isAddModalOpen,
  editingItem,
  onSearchChange,
  onCategoryChange,
  onFetchMenu,
  onMenuScannerOpenChange,
  onEditModalOpenChange,
  onScanMenu,
  onImportMenuItems,
  onOpenEdit,
  onSaveItem,
  onCreateItem,
  onAddModalOpenChange,
  onUpdateItems,
  onDeleteItem,
}) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [isEditing, setIsEditing] = useState(false);
  const [draftItems, setDraftItems] = useState<MenuItem[]>(filteredItems);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) return;
    setDraftItems(filteredItems.map((item) => ({ ...item })));
    setIsEditing(true);
  };

  const handleDraftChange = (
    id: number,
    field:
      | "name"
      | "category"
      | "sellingPrice"
      | "costToProduce"
      | "shelfLifeHours",
    value: string,
  ) => {
    setDraftItems((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "sellingPrice" ||
                field === "costToProduce" ||
                field === "shelfLifeHours"
                  ? Number(value) || 0
                  : value,
            }
          : item,
      ),
    );
  };

  const handleSaveTable = async () => {
    setIsSaving(true);
    try {
      await onUpdateItems(draftItems);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      isBM
        ? "Padam item menu ini? Tindakan ini tidak boleh dibuat asal."
        : "Delete this menu item? This action cannot be undone.",
    );
    if (!confirmed) return;

    await onDeleteItem(id);
    setDraftItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center gap-3">
        <Button
          theme={theme}
          variant="secondary"
          onClick={isEditing ? handleSaveTable : handleEditToggle}
          disabled={isSaving}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          {isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Pencil className="h-4 w-4" />
          )}
          <span>
            {isSaving
              ? isBM
                ? "Menyimpan..."
                : "Saving..."
              : isEditing
                ? isBM
                  ? "Selesai"
                  : "Save / Done"
                : isBM
                  ? "Edit Jadual"
                  : "Edit Table"}
          </span>
        </Button>
        <Button
          theme={theme}
          variant="secondary"
          onClick={() => onMenuScannerOpenChange(true)}
          className="flex items-center gap-2 text-xs rounded-xl py-2 px-3"
        >
          <CameraIcon />
          <span>{isBM ? "Imbas Menu" : "Scan Menu"}</span>
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
                    {isBM ? "JANGKA HAYAT (JAM)" : "SHELF LIFE (HOURS)"}
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
                {(isEditing ? draftItems : filteredItems).map((item) => (
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
                      {isEditing ? (
                        <Input
                          theme={theme}
                          value={item.name}
                          onChange={(event) =>
                            handleDraftChange(
                              item.id,
                              "name",
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isEditing ? (
                        <select
                          value={item.category}
                          onChange={(event) =>
                            handleDraftChange(
                              item.id,
                              "category",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
                        >
                          {categories
                            .filter((category) => category.code !== "All")
                            .map((category) => (
                              <option key={category.code} value={category.code}>
                                {category.label}
                              </option>
                            ))}
                        </select>
                      ) : (
                        item.category
                      )}
                    </td>
                    <td
                      className={`p-4 font-medium ${
                        isDark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {isEditing ? (
                        <Input
                          theme={theme}
                          type="number"
                          step="0.01"
                          value={item.sellingPrice || 0}
                          onChange={(event) =>
                            handleDraftChange(
                              item.id,
                              "sellingPrice",
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        `RM${(item.sellingPrice || 0).toFixed(2)}`
                      )}
                    </td>
                    <td
                      className={`p-4 ${
                        isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {isEditing ? (
                        <Input
                          theme={theme}
                          type="number"
                          step="0.01"
                          value={item.costToProduce || 0}
                          onChange={(event) =>
                            handleDraftChange(
                              item.id,
                              "costToProduce",
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        `RM${(item.costToProduce || 0).toFixed(2)}`
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-emerald-500">
                      {isEditing ? (
                        <Input
                          theme={theme}
                          type="number"
                          min="1"
                          step="1"
                          value={item.shelfLifeHours}
                          onChange={(event) =>
                            handleDraftChange(
                              item.id,
                              "shelfLifeHours",
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        `${item.shelfLifeHours} hrs`
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => void handleDelete(item.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                          title={isBM ? "Padam item" : "Delete item"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <Button
                          theme={theme}
                          variant="secondary"
                          size="sm"
                          onClick={() => onOpenEdit(item)}
                          className="rounded-xl text-[11px]"
                        >
                          {isBM ? "Edit" : "Edit"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <MenuScannerModal
        theme={theme}
        isOpen={isMenuScannerOpen}
        onClose={() => onMenuScannerOpenChange(false)}
        onScanMenu={onScanMenu}
        onImportItems={onImportMenuItems}
      />

      <MenuFormModal
        key={`edit-${editingItem?.id ?? "none"}-${isEditModalOpen}`}
        theme={theme}
        isOpen={isEditModalOpen}
        onClose={() => onEditModalOpenChange(false)}
        onSave={onSaveItem}
        initialData={editingItem}
      />

      <MenuFormModal
        key={`add-${isAddModalOpen}`}
        theme={theme}
        isOpen={isAddModalOpen}
        onClose={() => onAddModalOpenChange(false)}
        onSave={onCreateItem}
        initialData={null}
      />
    </div>
  );
};

export default MenuManagerView;
