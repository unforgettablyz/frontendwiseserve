import {
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";

type Theme = "light" | "dark";
type AuthMode = "login" | "signup";

interface LoginProps {
  onLogin: (companyName: string) => void;
  theme?: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export const Login = ({
  onLogin,
  theme: _theme,
  setTheme: _setTheme,
}: LoginProps) => {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [company, setCompany] = useState("Harbor and Vine - Downtown");
  const [businessName, setBusinessName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(authMode === "login" ? company : businessName);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101110]">
      <div className="grid min-h-screen lg:grid-cols-[40%_60%]">
        <section className="relative hidden overflow-hidden bg-[#09111f] px-8 py-14 text-white lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center whitespace-nowrap text-[10rem] font-black leading-none tracking-[-0.16em] text-white/[0.025]">
            WS
          </div>
          <div className="relative z-10 max-w-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/30 bg-blue-400/15 text-lg font-bold text-blue-500 shadow-[0_12px_30px_rgba(37,99,235,0.2)]">
              WS
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">
              WiseServe
            </h1>
            <p className="mt-3 text-sm font-semibold leading-5 text-slate-400">
              One workspace for every shift, outlet, and menu decision.
            </p>
            <div className="mx-auto my-8 h-px w-14 bg-slate-700" />
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
              Our mission
            </p>
            <p className="mt-4 text-base font-semibold leading-6 text-slate-200">
              Zero avoidable food waste - one order, one shift, one outlet at a
              time.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-14 sm:px-10 lg:px-20">
          <div className="w-full max-w-[430px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-300/30 bg-blue-400/15 text-sm font-bold text-blue-300">
                WS
              </div>
              <div>
                <p className="text-sm font-bold text-white">WiseServe</p>
                <p className="text-xs text-slate-500">Operations workspace</p>
              </div>
            </div>
            <div className="mb-8 flex w-fit rounded-full border border-white/[0.06] bg-black/20 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={`rounded-full px-4 py-2 transition-colors ${
                  authMode === "login"
                    ? "bg-[#111827] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`rounded-full px-4 py-2 transition-colors ${
                  authMode === "signup"
                    ? "bg-[#111827] text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create account
              </button>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {authMode === "login"
                  ? "Welcome back"
                  : "Create your workspace"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {authMode === "login"
                  ? "Sign in to pick up where your shift left off."
                  : "Set up a smarter workspace for your F&B business."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {authMode === "signup" ? (
                <>
                  <FieldLabel label="Business or company name">
                    <input
                      required
                      value={businessName}
                      onChange={(event) => setBusinessName(event.target.value)}
                      placeholder="e.g. Fry & Fire"
                      className="login-input"
                    />
                  </FieldLabel>
                  <FieldLabel label="Your name">
                    <input
                      required
                      value={managerName}
                      onChange={(event) => setManagerName(event.target.value)}
                      placeholder="e.g. Alex Tan"
                      className="login-input"
                    />
                  </FieldLabel>
                </>
              ) : (
                <FieldLabel
                  label="Restaurant group or outlet"
                  hint="Multi-outlet switching isn't wired up yet"
                >
                  <select
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="login-input appearance-none"
                  >
                    <option>Harbor and Vine - Downtown</option>
                    <option>Fry & Fire - Central Outlet</option>
                    <option>Kopi Nusa - Bukit Bintang</option>
                    <option>BiteCraft Kitchen - Damansara</option>
                  </select>
                </FieldLabel>
              )}

              <FieldLabel
                label={authMode === "login" ? "User ID" : "Work email"}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    @
                  </span>
                  <input
                    required
                    type="email"
                    placeholder="manager@harborandvine.com"
                    className="login-input pl-9"
                  />
                </div>
              </FieldLabel>

              <FieldLabel label="Password">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    *
                  </span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="login-input pl-9 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FieldLabel>

              {authMode === "login" ? (
                <div className="flex items-center justify-between pt-1 text-xs text-slate-300">
                  <label className="flex items-center gap-2 font-semibold">
                    <input type="checkbox" className="accent-blue-500" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Forgot credentials?
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  By continuing, you agree to WiseServe&apos;s business terms.
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#287bd9] py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(40,123,217,0.2)] transition-colors hover:bg-[#3589e5]"
              >
                {authMode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-center text-xs font-semibold text-slate-400">
              {authMode === "login"
                ? "New to WiseServe?"
                : "Already have a WiseServe account?"}{" "}
              <button
                type="button"
                onClick={() =>
                  setAuthMode(authMode === "login" ? "signup" : "login")
                }
                className="text-blue-400 hover:text-blue-300"
              >
                {authMode === "login" ? "Create a business account" : "Sign in"}
              </button>
            </p>

            <footer className="mt-8 text-center text-xs text-slate-500">
              Powered by <span className="font-bold text-slate-300">WS</span>{" "}
              WiseServe
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
};

interface FieldLabelProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

const FieldLabel = ({ label, hint, children }: FieldLabelProps) => (
  <label className="block">
    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
      {label}
    </span>
    {children}
    {hint && (
      <span className="mt-1 block text-[10px] text-slate-500">{hint}</span>
    )}
  </label>
);
