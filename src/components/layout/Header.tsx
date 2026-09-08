import {
  useState,
  type Dispatch,
  type FormEvent,
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
}

export const Header = ({
  title,
  user = "Store Manager",
  theme = "light",
  onThemeToggle,
  language = "en",
  setLanguage,
  companyName,
}: HeaderProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(user);
  const [profileEmail, setProfileEmail] = useState("manager@wiseserve.com");

  const handleProfileSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProfileOpen(false);
  };

  return (
    <header
      className={`h-20 border-b px-6 md:px-8 flex items-center justify-between backdrop-blur-xl transition-colors duration-300 ${
        isDark
          ? "border-slate-800 bg-slate-900/70"
          : "border-slate-200/80 bg-white/70"
      }`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
          {isBM ? "Operasi" : "Operations"}
        </p>
        <h1
          className={`text-2xl font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
        >
          {title}
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {companyName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`inline-flex items-center gap-1 rounded-2xl border p-1 ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-slate-100"
          }`}
        >
          {[
            { code: "en", label: "ENG" },
            { code: "bm", label: "BM" },
          ].map((option: { code: Language; label: string }) => (
            <button
              key={option.code}
              type="button"
              onClick={() => setLanguage && setLanguage(option.code)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-[0.18em] transition-all ${
                language === option.code
                  ? isDark
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-900 text-white"
                  : isDark
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onThemeToggle}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-200 ${
            isDark
              ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
          aria-label="Toggle light and dark mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          aria-label="Open edit profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border shadow-sm ${
            isDark
              ? "bg-slate-800/90 border-slate-700"
              : "bg-slate-100/90 border-slate-200"
          } transition-all hover:-translate-y-0.5 hover:shadow-md`}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] text-[#1d4ed8] text-xs flex items-center justify-center font-semibold shadow-inner">
              {profileName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-100 bg-emerald-500" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              {isBM ? "Pengguna" : "User"}
            </span>
            <span
              className={`text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              {profileName}
            </span>
          </div>
          <span className="ml-1 text-xs text-slate-400" aria-hidden="true">
            ⌄
          </span>
        </button>
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
