import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";

interface AddBatchModalProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  isOpen: boolean;
  onClose: () => void;
  availableMenuItems: Array<{ id: number; name: string; category: string }>;
  newBatchForm: {
    menuItemId: number;
    prepTime: string;
    preparedQty: number;
    wasteQty: number;
    recycleQty: number;
    wasteReason: string;
  };
  wasteReasons: string[];
  onFormChange: (next: {
    menuItemId: number;
    prepTime: string;
    preparedQty: number;
    wasteQty: number;
    recycleQty: number;
    wasteReason: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddBatchModal = ({
  theme = "light",
  language = "en",
  isOpen,
  onClose,
  availableMenuItems,
  newBatchForm,
  wasteReasons,
  onFormChange,
  onSubmit,
}: AddBatchModalProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  return (
    <Modal
      theme={theme}
      isOpen={isOpen}
      onClose={onClose}
      title={isBM ? "Tambah Batch Masakan Dapur" : "Add Kitchen Prep Batch"}
    >
      <form onSubmit={onSubmit} className="space-y-3 text-xs">
        <div>
          <label
            className={`mb-1 block font-medium ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {isBM ? "Pilih Item Menu" : "Select Menu Item"}
          </label>
          <select
            value={newBatchForm.menuItemId}
            onChange={(e) =>
              onFormChange({
                ...newBatchForm,
                menuItemId: Number(e.target.value),
              })
            }
            className={`w-full rounded-xl border p-2 text-xs ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-100"
                : "border-slate-200 bg-white text-slate-800"
            }`}
            required
          >
            {availableMenuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.category})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            theme={theme}
            label={isBM ? "Masa Prep Dapur" : "Kitchen Prep Time"}
            type="time"
            value={newBatchForm.prepTime}
            onChange={(e) =>
              onFormChange({ ...newBatchForm, prepTime: e.target.value })
            }
            required
          />
          <Input
            theme={theme}
            label={isBM ? "Kuantiti Masak (Prep Qty)" : "Prep Quantity"}
            type="number"
            min="1"
            value={newBatchForm.preparedQty}
            onChange={(e) =>
              onFormChange({
                ...newBatchForm,
                preparedQty: Number(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            theme={theme}
            label={isBM ? "Kuantiti Recycle (Baki Elok)" : "Recycle Qty"}
            type="number"
            min="0"
            value={newBatchForm.recycleQty}
            onChange={(e) =>
              onFormChange({
                ...newBatchForm,
                recycleQty: Number(e.target.value),
              })
            }
          />
          <Input
            theme={theme}
            label={isBM ? "Kuantiti Sisa (Buang)" : "Waste Quantity"}
            type="number"
            min="0"
            value={newBatchForm.wasteQty}
            onChange={(e) =>
              onFormChange({
                ...newBatchForm,
                wasteQty: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <label
            className={`mb-1 block font-medium ${
              isDark ? "text-slate-300" : "text-slate-700"
            }`}
          >
            {isBM ? "Sebab Sisa / Kerosakan" : "Waste Reason"}
          </label>
          <select
            value={newBatchForm.wasteReason}
            onChange={(e) =>
              onFormChange({
                ...newBatchForm,
                wasteReason: e.target.value,
              })
            }
            className={`w-full rounded-xl border p-2 text-xs ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-100"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          >
            {wasteReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <Button
            theme={theme}
            variant="secondary"
            type="button"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            {isBM ? "Batal" : "Cancel"}
          </Button>
          <Button theme={theme} type="submit" className="rounded-xl text-xs">
            {isBM ? "Tambah Batch" : "Add Batch"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBatchModal;
