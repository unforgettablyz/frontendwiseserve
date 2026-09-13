import {
  useState,
  type Dispatch,
  type SyntheticEvent,
  type SetStateAction,
} from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";

type Theme = "light" | "dark";
type Language = "en" | "bm";

interface HeaderProps {
  title: string;
  user?: string;
  theme?: Theme;
  onThemeToggle: () => void;
  language?: Language;
  setLanguage?: Dispatch<SetStateAction<Language>>;
  companyName: string;
  onLogout: () => void;
  onOpenSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({
  title,
  user = "Store Manager",
  theme = "light",
  onThemeToggle,
  language = "en",
  setLanguage,
  companyName,
  onLogout,
  onOpenSidebar,
  isSidebarOpen,
}: HeaderProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState(user);
  const [profileEmail, setProfileEmail] = useState("manager@wiseserve.com");

  const handleProfileSave = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProfileOpen(false);
  };

  return (
    <header
      className={`relative z-40 isolate flex h-24 items-center justify-between border-b px-4 backdrop-blur-xl transition-colors duration-300 sm:px-6 md:px-8 ${
        isDark
          ? "border-slate-800 bg-slate-900/80"
          : "border-[#BFE7E8] bg-[#EAF7F7]/90"
      }`}
    >
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
            title="Open sidebar"
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                : "border-[#BFE7E8] bg-[#F2FBFB] text-slate-600 hover:bg-[#DDF7F4]"
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
              <path d="M9 4v16M12 12l3-3m-3 3 3 3" />
            </svg>
          </button>
        )}

        <div className="flex flex-col">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
              isDark ? "text-slate-400" : "text-[#0EA5A4]"
            }`}
          >
            {isBM ? "Operasi" : "Operations"}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h1
              className={`text-2xl font-bold tracking-[-0.06em] ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              {title}
            </h1>
          </div>
          <div
            className={`mt-1 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
              isDark
                ? "border-slate-700 bg-slate-800/80 text-slate-300"
                : "border-[#BFE7E8] bg-[#DDF7F4] text-[#0F172A]"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {companyName}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`inline-flex items-center gap-1 rounded-2xl border p-1 shadow-sm ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-[#BFE7E8] bg-[#F1FCFC]"
          }`}
        >
          {(
            [
              { code: "en", label: "ENG" },
              { code: "bm", label: "BM" },
            ] as const
          ).map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLanguage && setLanguage(option.code)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-[0.18em] transition-all ${
                language === option.code
                  ? isDark
                    ? "bg-slate-100 text-slate-900"
                    : "bg-[#DDF7F4] text-[#0F172A]"
                  : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-[#0F172A]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${
            isDark
              ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              : "border-[#BFE7E8] bg-[#F1FCFC] text-[#0EA5A4] hover:bg-[#DDF7F4]"
          }`}
          aria-label="Toggle light and dark mode"
        >
          <span className="text-base leading-none">{isDark ? "☀" : "☾"}</span>
        </button>

        <div className="relative z-50">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            aria-label="Open profile menu"
            className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isDark
                ? "border-slate-700 bg-slate-800/90"
                : "border-[#BFE7E8] bg-[#F1FCFC]"
            }`}
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#a5f3fc] text-xs font-bold text-[#1d4ed8] shadow-inner">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-100 bg-emerald-500" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                {isBM ? "Pengguna" : "User"}
              </span>
              <span
                className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-[#0F172A]"}`}
              >
                {profileName}
              </span>
            </div>
            <span className="ml-1 text-xs text-slate-400" aria-hidden="true">
              ▾
            </span>
          </button>

          {isProfileMenuOpen && (
            <div
              className={`absolute right-0 top-full z-[60] mt-3 w-60 rounded-[24px] border p-2.5 shadow-[0_22px_50px_rgba(15,23,42,0.18)] ${
                isDark
                  ? "border-slate-700 bg-slate-900/95"
                  : "border-[#BFE7E8] bg-[#F7FEFE]/95"
              }`}
              role="menu"
            >
              <div
                className={`mb-2 rounded-2xl px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                  isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-[#EAF7F7] text-[#0EA5A4]"
                }`}
              >
                Account
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setIsProfileOpen(true);
                }}
                className={`flex w-full items-center justify-between rounded-[18px] border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  isDark
                    ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-100 hover:bg-cyan-500/15"
                    : "border-[#BFE7E8] bg-[#DDF7F4] text-[#0F172A] hover:bg-[#CFF3F0]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-[11px] ${
                      isDark
                        ? "bg-slate-800 text-cyan-300"
                        : "bg-white text-[#0EA5A4]"
                    }`}
                  >
                    ✦
                  </span>
                  Edit Profile
                </span>
                <span className="text-xs text-slate-400" aria-hidden="true">
                  ↗
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onLogout();
                }}
                className={`mt-2 flex w-full items-center justify-between rounded-[18px] border px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  isDark
                    ? "border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/15"
                    : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-xl text-[11px] ${
                      isDark
                        ? "bg-slate-800 text-red-300"
                        : "bg-white text-red-500"
                    }`}
                  >
                    ⎋
                  </span>
                  Log out
                </span>
                <span className="text-xs" aria-hidden="true">
                  →
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        theme={theme}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Edit Profile"
      >
        <form className="flex flex-col gap-4" onSubmit={handleProfileSave}>
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${
              isDark
                ? "border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-slate-800 to-slate-800"
                : "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50"
            }`}
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d74f5] to-[#0f172a] font-semibold text-white shadow-[0_12px_24px_rgba(29,116,245,0.25)]">
                {profileName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {profileName}
                </p>
                <p className="mt-1 text-xs text-slate-400">{profileEmail}</p>
              </div>
            </div>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active account <span className="text-slate-300">·</span> WiseServe
              Central
            </div>
          </div>

          <p className="-mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Account details
          </p>

          <Input
            theme={theme}
            label="Display name"
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            placeholder="Your name"
            required
          />
          <Input
            theme={theme}
            label="Work email"
            type="email"
            value={profileEmail}
            onChange={(event) => setProfileEmail(event.target.value)}
            placeholder="manager@wiseserve.com"
            required
          />

          <div
            className={`grid grid-cols-2 gap-3 rounded-2xl border p-3 text-xs ${
              isDark
                ? "border-slate-700 bg-slate-800/50 text-slate-300"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <div>
              <span className="block text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Role
              </span>
              <span className="mt-1 block font-medium">Store Manager</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.14em] text-slate-400">
                Outlet
              </span>
              <span className="mt-1 block font-medium">{companyName}</span>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              theme={theme}
              variant="secondary"
              type="button"
              onClick={() => setIsProfileOpen(false)}
            >
              Close
            </Button>
            <Button theme={theme} type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
