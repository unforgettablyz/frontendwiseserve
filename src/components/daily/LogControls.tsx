import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface LogControlsProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
  shiftDate: string;
  shiftType: "Lunch" | "Dinner" | "Full Day";
  onShiftDateChange: (value: string) => void;
  onShiftTypeChange: (value: "Lunch" | "Dinner" | "Full Day") => void;
  onScanClick: () => void;
  onAddClick: () => void;
}

export const LogControls = ({
  theme = "light",
  language = "en",
  shiftDate,
  shiftType,
  onShiftDateChange,
  onShiftTypeChange,
  onScanClick,
  onAddClick,
}: LogControlsProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  const cameraIcon = (
    <svg
      className="h-4 w-4"
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

  const plusIcon = (
    <svg
      className="h-4 w-4"
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        theme={theme}
        type="date"
        value={shiftDate}
        onChange={(e) => onShiftDateChange(e.target.value)}
        className="w-auto rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400"
      />

      <select
        value={shiftType}
        onChange={(e) =>
          onShiftTypeChange(e.target.value as "Lunch" | "Dinner" | "Full Day")
        }
        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 ${
          isDark
            ? "border-slate-700 bg-slate-800 text-slate-100"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        <option value="Lunch">
          {isBM ? "Syif Tengah Hari" : "Lunch Shift"}
        </option>
        <option value="Dinner">{isBM ? "Syif Malam" : "Dinner Shift"}</option>
        <option value="Full Day">{isBM ? "Sepanjang Hari" : "Full Day"}</option>
      </select>

      <Button
        theme={theme}
        variant="secondary"
        onClick={onScanClick}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
      >
        {cameraIcon}
        <span>
          {isBM ? "Imbas Kitchen Prep Sheet" : "Scan Kitchen Prep Sheet"}
        </span>
      </Button>

      <Button
        theme={theme}
        onClick={onAddClick}
        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
      >
        {plusIcon}
        <span>{isBM ? "Tambah Batch Manual" : "Add Batch Row"}</span>
      </Button>
    </div>
  );
};

export default LogControls;
