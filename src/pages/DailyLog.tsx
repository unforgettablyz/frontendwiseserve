import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

interface DailyLogProps {
  theme?: "light" | "dark";
  language?: "en" | "bm";
}

export const DailyLog = ({ theme = "light" }: DailyLogProps) => {
  const isDark = theme === "dark";
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [savedMessage, setSavedMessage] = useState("");
  const [quantities, setQuantities] = useState<
    Record<number, { prepared: string; sold: string; leftover: string }>
  >({});

  const mockItems = [
    { id: 1, name: "Chicken Teriyaki Bento", price: "$12.50" },
    { id: 2, name: "Salmon Sashimi Plate", price: "$16.00" },
    { id: 3, name: "Green Tea Ice Cream", price: "$4.50" },
  ];

  const updateQuantity = (
    id: number,
    field: "prepared" | "sold" | "leftover",
    value: string,
  ) => {
    setQuantities((current) => ({
      ...current,
      [id]: {
        prepared: "",
        sold: "",
        leftover: "",
        ...current[id],
        [field]: value,
      },
    }));
  };

  const saveLog = () => {
    const existingLogs = JSON.parse(
      window.localStorage.getItem("wiseserve-daily-logs") ?? "[]",
    );
    const entries = mockItems.map((item) => ({
      date: selectedDate,
      item: item.name,
      prepared: Number(quantities[item.id]?.prepared ?? 0),
      sold: Number(quantities[item.id]?.sold ?? 0),
      leftover: Number(quantities[item.id]?.leftover ?? 0),
    }));
    window.localStorage.setItem(
      "wiseserve-daily-logs",
      JSON.stringify([...existingLogs, ...entries]),
    );
    setSavedMessage(
      `Saved ${entries.length} menu records for ${selectedDate}.`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p
            className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Record daily operational output and remaining stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedDate(e.target.value)
            }
            className={`border rounded-2xl px-4 py-2 text-sm outline-none shadow-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100"
                : "bg-white border-slate-200 text-slate-700"
            }`}
          />
          <Button theme={theme} onClick={saveLog}>
            Save Log Entry
          </Button>
          {savedMessage && (
            <span className="text-xs text-emerald-500">{savedMessage}</span>
          )}
        </div>
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
              <th className="py-4 px-6">Menu Item</th>
              <th className="py-4 px-6 w-36">Qty Prepared</th>
              <th className="py-4 px-6 w-36">Qty Sold</th>
              <th className="py-4 px-6 w-36">Qty Leftover</th>
            </tr>
          </thead>
          <tbody
            className={`divide-y text-sm ${isDark ? "divide-slate-700" : "divide-slate-200"}`}
          >
            {mockItems.map((item) => (
              <tr
                key={item.id}
                className={
                  isDark
                    ? "hover:bg-slate-800/60 transition-colors"
                    : "hover:bg-slate-50/80 transition-colors"
                }
              >
                <td
                  className={`py-4 px-6 font-medium ${isDark ? "text-slate-100" : "text-slate-800"}`}
                >
                  {item.name}
                </td>
                <td className="py-3 px-6">
                  <input
                    type="number"
                    min="0"
                    value={quantities[item.id]?.prepared ?? ""}
                    onChange={(event) =>
                      updateQuantity(item.id, "prepared", event.target.value)
                    }
                    placeholder="0"
                    className={`w-full rounded-xl px-3 py-2 text-sm outline-none border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-400 focus:bg-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white"
                    }`}
                  />
                </td>
                <td className="py-3 px-6">
                  <input
                    type="number"
                    min="0"
                    value={quantities[item.id]?.sold ?? ""}
                    onChange={(event) =>
                      updateQuantity(item.id, "sold", event.target.value)
                    }
                    placeholder="0"
                    className={`w-full rounded-xl px-3 py-2 text-sm outline-none border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-400 focus:bg-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white"
                    }`}
                  />
                </td>
                <td className="py-3 px-6">
                  <input
                    type="number"
                    min="0"
                    value={quantities[item.id]?.leftover ?? ""}
                    onChange={(event) =>
                      updateQuantity(item.id, "leftover", event.target.value)
                    }
                    placeholder="0"
                    className={`w-full rounded-xl px-3 py-2 text-sm outline-none border ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-blue-400 focus:bg-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white"
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
