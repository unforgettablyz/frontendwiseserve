import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { BrandMark } from "../ui/BrandMark";

type Theme = "light" | "dark";
type AuthMode = "login" | "signup";

interface LoginProps {
  onLogin: (companyName: string) => void;
  theme?: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export const Login = ({ onLogin, theme = "light", setTheme }: LoginProps) => {
  const isDark = theme === "dark";
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [company, setCompany] = useState("Fry & Fire - Central Outlet");
  const [businessName, setBusinessName] = useState("");
  const [managerName, setManagerName] = useState("");

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_40%,_#020817_100%)]"
          : "bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#eef4ff_35%,_#f5f7fb_100%)]"
      }`}
    >
      <div className="absolute right-6 top-6">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl border transition-all duration-200 ${
            isDark
              ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
          }`}
          aria-label="Toggle light and dark mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>

      <Card
        theme={theme}
        className="w-full max-w-md p-8 flex flex-col gap-6 text-center border-slate-200/80 shadow-[0_30px_80px_rgba(15,23,42,0.08)]"
      >
        <div>
          <div className="mb-4 flex justify-center">
            <BrandMark />
          </div>
          <h2
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            WiseServe Management
          </h2>
          <p
            className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {authMode === "login"
              ? "One workspace for every shift, outlet, and menu decision."
              : "Create a smarter workspace for your F&B business."}
          </p>
        </div>

        <div
          className={`grid grid-cols-2 gap-1 rounded-2xl border p-1 ${
            isDark
              ? "border-slate-700 bg-slate-800"
              : "border-slate-200 bg-slate-100"
          }`}
          role="tablist"
          aria-label="Authentication mode"
        >
          {[
            { id: "login" as const, label: "Sign In" },
            { id: "signup" as const, label: "Create Business Account" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={authMode === mode.id}
              onClick={() => setAuthMode(mode.id)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                authMode === mode.id
                  ? isDark
                    ? "bg-slate-100 text-slate-900"
                    : "bg-white text-slate-900 shadow-sm"
                  : isDark
                    ? "text-slate-400 hover:text-slate-100"
                    : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onLogin(authMode === "login" ? company : businessName);
          }}
          className="flex flex-col gap-4 text-left"
        >
          {authMode === "signup" ? (
            <>
              <Input
                theme={theme}
                label="Business or company name"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="e.g. Fry & Fire"
                required
              />
              <Input
                theme={theme}
                label="Your name"
                value={managerName}
                onChange={(event) => setManagerName(event.target.value)}
                placeholder="e.g. Alex Tan"
                required
              />
              <label className="flex flex-col gap-1.5">
                <span
                  className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                    isDark ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  Business type
                </span>
                <select
                  className={`rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm ${
                    isDark
                      ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-400"
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-500 focus:bg-white"
                  }`}
                  defaultValue="quick-service"
                >
                  <option value="quick-service">
                    Quick-service restaurant
                  </option>
                  <option value="cafe">Cafe or coffee group</option>
                  <option value="casual-dining">
                    Casual dining restaurant
                  </option>
                  <option value="cloud-kitchen">Cloud kitchen</option>
                </select>
              </label>
              <Input
                theme={theme}
                label="Primary outlet"
                placeholder="e.g. Central Outlet"
                required
              />
            </>
          ) : (
            <label className="flex flex-col gap-1.5">
              <span
                className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                  isDark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                Restaurant group or outlet
              </span>
              <select
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className={`rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-sm ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-400"
                    : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-500 focus:bg-white"
                }`}
              >
                <option>Fry & Fire - Central Outlet</option>
                <option>Kopi Nusa - Bukit Bintang</option>
                <option>BiteCraft Kitchen - Damansara</option>
                <option>Green Plate Dining - Mont Kiara</option>
              </select>
              <span className="pl-1 text-[11px] text-slate-400">
                Manage one outlet or scale across your whole F&amp;B group.
              </span>
            </label>
          )}
          <Input
            theme={theme}
            label="Email"
            type="email"
            placeholder="manager@restaurant.com"
            required
          />
          <Input
            theme={theme}
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />
          <div
            className={`flex items-center justify-between text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {authMode === "login" ? (
              <>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-blue-500">
                  Forgot password?
                </button>
              </>
            ) : (
              <span className="text-slate-400">
                By continuing, you agree to WiseServe&apos;s business terms.
              </span>
            )}
          </div>
          <Button
            theme={theme}
            type="submit"
            className="w-full mt-2 py-3 text-base"
          >
            {authMode === "login"
              ? `Enter ${company.split(" - ")[0]} workspace`
              : "Create WiseServe workspace"}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          {authMode === "login"
            ? "New to WiseServe?"
            : "Already have a WiseServe account?"}{" "}
          <button
            type="button"
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
            className="font-semibold text-blue-500 hover:text-blue-600"
          >
            {authMode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </Card>
    </div>
  );
};
