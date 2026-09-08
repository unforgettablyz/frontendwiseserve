import type { Dispatch, SetStateAction } from "react";
import { BrandMark } from "../ui/BrandMark";

type Theme = "light" | "dark";
type Language = "en" | "bm";
type Tab = "dashboard" | "dailylog" | "menu" | "about" | "contact";

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  theme?: Theme;
  language?: Language;
  companyName: string;
  onClose: () => void;
  outlets: string[];
  onOutletChange: (outlet: string) => void;
}

export const Sidebar = ({
  activeTab,
  setActiveTab,
  theme = "light",
  language = "en",
  companyName,
  onClose,
  outlets,
  onOutletChange,
}: SidebarProps) => {
  const isDark = theme === "dark";
  const labels: Record<Language, Record<Tab, string>> = {
    en: {
      dashboard: "Analytics",
      dailylog: "Daily Log",
      menu: "Menu Manager",
      about: "About Us",
      contact: "Contact Us",
    },
    bm: {
      dashboard: "Analitik",
      dailylog: "Log Harian",
      menu: "Pengurus Menu",
      about: "Tentang Kami",
      contact: "Hubungi Kami",
    },
  };

  const menuItems: { id: Tab; label: string }[] = [
    { id: "dashboard", label: labels[language].dashboard },
    { id: "dailylog", label: labels[language].dailylog },
    { id: "menu", label: labels[language].menu },
  ];

  const supportItems: { id: Tab; label: string }[] = [
    { id: "about", label: labels[language].about },
    { id: "contact", label: labels[language].contact },
  ];

  return (
    <aside
      className={`w-72 h-screen border-r p-5 flex flex-col justify-between shadow-[inset_-1px_0_0_rgba(148,163,184,0.1)] backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? "border-slate-800 bg-[#0b1324]"
          : "border-[#d9e4f2] bg-[#edf3fb]"
      }`}
    >
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <BrandMark />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
              F&B
            </p>
            <span
              className={`font-bold text-xl tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              WiseServe
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            title="Close sidebar"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-lg leading-none transition-colors ${
              isDark
                ? "border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                : "border-[#d9e4f2] text-slate-500 hover:bg-white hover:text-slate-900"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M9 4v16M15 12l-3-3m3 3-3 3" />
            </svg>
          </button>
        </div>

        <div
          className={`mb-6 rounded-2xl border px-3 py-2.5 ${
            isDark
              ? "border-slate-700 bg-slate-900/70"
              : "border-[#d9e4f2] bg-white/70"
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {language === "bm" ? "Ruang kerja" : "Current workspace"}
          </p>
          <select
            value={companyName}
            onChange={(event) => onOutletChange(event.target.value)}
            aria-label="Select outlet"
            className={`workspace-select mt-1 w-full truncate bg-transparent text-sm font-semibold outline-none ${isDark ? "workspace-select-dark text-slate-100" : "workspace-select-light text-slate-800"}`}
          >
            {outlets.map((outlet) => (
              <option key={outlet} value={outlet}>
                {outlet}
              </option>
            ))}
          </select>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Main navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? isDark
                    ? "bg-slate-100 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.4)]"
                    : "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                  : isDark
                    ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/90"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {language === "bm" ? "Maklumat" : "Information"}
          </p>
          <nav
            className="flex flex-col gap-2"
            aria-label="Information navigation"
          >
            {supportItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? isDark
                      ? "bg-slate-100 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.4)]"
                      : "bg-slate-900 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]"
                    : isDark
                      ? "text-slate-400 hover:bg-slate-800/90 hover:text-slate-100"
                      : "text-slate-600 hover:bg-white/80 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <footer
        className={`rounded-2xl border p-4 ${
          isDark
            ? "border-slate-700 bg-slate-900/80"
            : "border-[#d9e4f2] bg-white/70"
        }`}
      >
        <div className="flex items-center gap-2">
          <BrandMark compact />
          <div>
            <p
              className={`text-xs font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}
            >
              WiseServe
            </p>
            <p className="text-[10px] text-slate-400">
              Smarter kitchens, less waste
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[10px] text-slate-400 dark:border-slate-700">
          <span>F&B Waste Prevention</span>
          <span>v1.0</span>
        </div>
      </footer>
    </aside>
  );
};
