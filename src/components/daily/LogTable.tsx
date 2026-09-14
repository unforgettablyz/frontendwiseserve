import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export interface ShiftLogRow {
  id: string;
  batchId: string;
  menuItemId: number;
  itemName: string;
  category: string;
  costToProduce: number;
  prepTime: string;
  preparedQty: number;
  soldQty: number;
  wasteQty: number;
  recycleQty: number;
  wasteReason: string;
  totalRemaining: number;
}

interface LogTableProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  rows: ShiftLogRow[];
  availableMenuItems: Array<{
    id: number;
    name: string;
    category: string;
    costToProduce?: number;
    soldQty?: number;
  }>;
  wasteReasons: string[];
  onRowChange: (id: string, field: keyof ShiftLogRow, value: any) => void;
  onRemoveRow: (id: string) => void;
  onAddClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export const LogTable = ({
  theme = "light",
  language = "en",
  rows,
  availableMenuItems,
  wasteReasons,
  onRowChange,
  onRemoveRow,
  onAddClick,
  onSubmit,
  isSubmitting,
}: LogTableProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  return (
    <form onSubmit={onSubmit}>
      <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
        <div
          className={`flex items-center justify-between border-b p-4 ${
            isDark
              ? "border-slate-800 bg-slate-900/90"
              : "border-slate-100 bg-white"
          }`}
        >
          <h3
            className={`text-sm font-semibold ${
              isDark ? "text-slate-100" : "text-slate-800"
            }`}
          >
            {isBM ? "Senarai Batch Syif Dapur" : "Shift Kitchen Batch Entry"} (
            {rows.length})
          </h3>
          <Button
            type="button"
            theme={theme}
            variant="secondary"
            size="sm"
            onClick={onAddClick}
            className="rounded-xl text-xs"
          >
            + {isBM ? "Tambah Batch Manual" : "Add Batch Row"}
          </Button>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {isBM
              ? "Tiada batch direkodkan lagi. Klik '+ Tambah Batch Manual' atau 'Imbas Kitchen Prep Sheet' untuk bermula."
              : "No batches recorded yet. Click '+ Add Batch Row' or 'Scan Kitchen Prep Sheet' to start."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`border-b font-semibold uppercase ${
                  isDark
                    ? "border-slate-800 bg-slate-800/60 text-slate-400"
                    : "border-slate-100 bg-slate-50 text-slate-700"
                }`}
              >
                <tr>
                  <th className="p-3">
                    {isBM ? "BATCH & MASA" : "BATCH & TIME"}
                  </th>
                  <th className="p-3">{isBM ? "ITEM MENU" : "MENU ITEM"}</th>
                  <th className="p-3 w-20">{isBM ? "PREP QTY" : "PREP QTY"}</th>
                  <th className="p-3 w-20">
                    {isBM ? "SOLD (POS)" : "SOLD (POS)"}
                  </th>
                  <th className="p-3 w-20">{isBM ? "VARIANS" : "VARIANCE"}</th>
                  <th className="p-3 w-20 text-amber-500">
                    {isBM ? "RECYCLE" : "RECYCLE"}
                  </th>
                  <th className="p-3 w-20 text-rose-500">
                    {isBM ? "SISA/BUANG" : "WASTE QTY"}
                  </th>
                  <th className="p-3">
                    {isBM ? "SEBAB SISA" : "WASTE REASON"}
                  </th>
                  <th className="p-3 w-10 text-center">
                    {isBM ? "TINDAKAN" : "ACTION"}
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  isDark
                    ? "divide-y divide-slate-800"
                    : "divide-y divide-slate-100"
                }
              >
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/50"
                    }
                  >
                    <td className="p-3 font-mono text-[11px]">
                      <div className="font-bold text-slate-400">
                        {row.batchId}
                      </div>
                      <Input
                        theme={theme}
                        type="time"
                        value={row.prepTime}
                        onChange={(e) =>
                          onRowChange(row.id, "prepTime", e.target.value)
                        }
                        className="mt-1 h-6 p-1 text-[10px]"
                      />
                    </td>

                    <td className="p-3">
                      <select
                        value={row.menuItemId}
                        onChange={(e) =>
                          onRowChange(row.id, "menuItemId", e.target.value)
                        }
                        className={`w-full rounded-xl border p-1.5 text-xs focus:ring-1 ${
                          isDark
                            ? "border-slate-700 bg-slate-800 text-slate-100"
                            : "border-slate-200 bg-white text-slate-800"
                        }`}
                      >
                        {availableMenuItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.category})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <Input
                        theme={theme}
                        type="number"
                        min="0"
                        value={row.preparedQty}
                        onChange={(e) =>
                          onRowChange(
                            row.id,
                            "preparedQty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>

                    <td className="p-3 font-semibold text-emerald-500">
                      {row.soldQty}
                    </td>
                    <td className="p-3 font-semibold text-slate-400">
                      {row.totalRemaining}
                    </td>

                    <td className="p-3">
                      <Input
                        theme={theme}
                        type="number"
                        min="0"
                        value={row.recycleQty}
                        onChange={(e) =>
                          onRowChange(
                            row.id,
                            "recycleQty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>

                    <td className="p-3">
                      <Input
                        theme={theme}
                        type="number"
                        min="0"
                        value={row.wasteQty}
                        onChange={(e) =>
                          onRowChange(
                            row.id,
                            "wasteQty",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </td>

                    <td className="p-3">
                      <select
                        value={row.wasteReason}
                        onChange={(e) =>
                          onRowChange(row.id, "wasteReason", e.target.value)
                        }
                        className={`w-full rounded-xl border p-1.5 text-xs focus:ring-1 ${
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
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        className="p-1 font-bold text-slate-400 hover:text-rose-500"
                        title={isBM ? "Buang baris" : "Remove row"}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          className={`flex items-center justify-between border-t p-4 text-xs ${
            isDark
              ? "border-slate-800 bg-slate-900/50 text-slate-400"
              : "border-slate-100 bg-slate-50 text-slate-500"
          }`}
        >
          <span>
            {isBM
              ? "Varians & baki recycle akan dihantar secara automatik ke Expiration Alert."
              : "Variances and recycled stocks will be automatically routed to Expiration Alert."}
          </span>
          <Button
            type="submit"
            theme={theme}
            variant="primary"
            disabled={isSubmitting || rows.length === 0}
          >
            {isSubmitting
              ? isBM
                ? "Menghantar..."
                : "Submitting..."
              : isBM
                ? "Simpan Rekod Log Syif"
                : "Save Shift Log Records"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LogTable;
