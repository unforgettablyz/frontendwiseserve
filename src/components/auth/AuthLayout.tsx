import { useState, type FormEvent } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { BrandMark } from "../ui/BrandMark";
import { AgreementModal } from "../common/AgreementModal";
import { API_ENABLED, api } from "../../api/axios";

type Theme = "light" | "dark";
type AuthMode = "login" | "signup";

interface AuthLayoutProps {
  onLogin: (companyName: string, rememberMe?: boolean) => void;
  theme?: Theme;
}

export const AuthLayout = ({ onLogin, theme = "light" }: AuthLayoutProps) => {
  const isDark = theme === "dark";
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [company, setCompany] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedAgreement, setSelectedAgreement] = useState("business-terms");
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  const agreements = [
    {
      id: "business-terms",
      label: "Business Terms",
      content:
        "WiseServe provides business operations tools for managing outlets, menu planning, daily logs, and waste prevention workflows. Users are responsible for accurate data entry, operational compliance, and secure handling of their business account.",
    },
    {
      id: "privacy-policy",
      label: "Privacy Policy",
      content:
        "WiseServe uses account details, outlet information, and operational data only to provide service functionality, improve system performance, and support business reporting. Personal and business information is handled in accordance with system security requirements.",
    },
    {
      id: "data-security",
      label: "Data Security",
      content:
        "All business and account information should be kept secure. Users must protect login credentials, limit access to authorized staff, and report any unauthorized use of the system immediately.",
    },
  ];

  const hasOutletData = false;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (!API_ENABLED) {
        localStorage.setItem("token", "preview-token");
        onLogin(
          authMode === "login"
            ? company || "Fry & Fire - Central Outlet"
            : businessName || "WiseServe Preview Outlet",
          rememberMe,
        );
        return;
      }

      const endpoint =
        authMode === "login" ? "/v1/auth/login" : "/v1/auth/register";
      const response = await api.post(endpoint, {
        email,
        password,
        companyName: authMode === "login" ? company : businessName,
        managerName: authMode === "signup" ? managerName : undefined,
      });
      const token = response.data.token ?? response.data.accessToken;

      if (!token) {
        throw new Error("Authentication succeeded without a JWT token.");
      }

      localStorage.setItem("token", token);
      onLogin(authMode === "login" ? company : businessName, rememberMe);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to authenticate. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#020817]"
          : "bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#111827_40%,_#020817_100%)]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_38%)]" />

      {showAgreementModal && (
        <AgreementModal
          theme={theme}
          agreements={agreements}
          selectedAgreement={selectedAgreement}
          onSelectAgreement={setSelectedAgreement}
          onClose={() => setShowAgreementModal(false)}
        />
      )}

      <div className="relative mx-auto flex min-h-screen max-w-[1300px] items-center justify-center px-4 py-6 sm:p-8">
        <div className="grid w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/60 shadow-[0_24px_80px_rgba(2,6,23,0.72)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_46%),linear-gradient(135deg,#0f172a_0%,#020817_54%,#020617_100%)] p-6 sm:p-8 lg:min-h-[680px] lg:p-8">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <BrandMark />
              <span className="text-[1.75rem] font-bold tracking-[-0.08em] text-white">
                WiseServe
              </span>
            </div>

            <div className="relative z-10 flex flex-col gap-5 pt-8 lg:pt-12">
              <div className="inline-flex w-fit items-center rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
                F&B Business operations platform
              </div>
              <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-[-0.06em] text-white sm:text-[2.75rem] lg:text-[3.1rem]">
                Make every shift smoother.
              </h2>
              <p className="max-w-md text-base leading-relaxed text-slate-300">
                One workspace for every shift, outlet, and menu decision.
              </p>
            </div>

            <div className="relative z-10 mt-auto flex w-full justify-center pb-2 pt-6 lg:pt-8">
              <img
                src="/login-illustration.svg"
                alt="Business dashboard illustration"
                className="h-auto w-full max-w-[560px] object-contain opacity-95"
              />
            </div>
          </div>

          <div className="flex items-center justify-center bg-[#08111f] px-4 py-6 sm:px-8 lg:px-8">
            <div className="w-full max-w-[420px]">
              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4 shadow-[0_16px_36px_rgba(34,211,238,0.08)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                  Our mission
                </p>
                <p className="mt-2 text-base font-medium leading-relaxed tracking-[-0.03em] text-white/95">
                  Zero avoidable food waste - one order, one shift, one outlet
                  at a time.
                </p>
              </div>

              <div className="mb-5 inline-flex w-full items-center rounded-2xl border border-slate-700 bg-slate-900/85 p-1">
                {[
                  { id: "login" as const, label: "Sign in" },
                  { id: "signup" as const, label: "Create business account" },
                ].map((mode) => {
                  const isSignupTab = mode.id === "signup";
                  const isDisabled = showForgotPassword && isSignupTab;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      role="tab"
                      aria-selected={authMode === mode.id}
                      aria-disabled={isDisabled}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setAuthMode(mode.id)}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                        authMode === mode.id
                          ? "bg-white text-slate-900 shadow-sm"
                          : isDisabled
                            ? "cursor-not-allowed text-slate-500"
                            : "text-slate-400 hover:text-slate-100"
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[26px] border border-slate-800 bg-[#111827]/95 p-5 shadow-[0_18px_54px_rgba(15,23,42,0.32)] sm:p-6">
                {showForgotPassword ? (
                  <div className="flex flex-col gap-4 text-left">
                    {passwordUpdated ? (
                      <>
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                            Password updated
                          </p>
                          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
                            Success
                          </h1>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                          Your password has been updated successfully. You can
                          now sign in with your new password.
                        </p>
                        <Button
                          theme="dark"
                          type="button"
                          onClick={() => {
                            setPasswordUpdated(false);
                            setShowForgotPassword(false);
                          }}
                          className="mt-2 w-full bg-gradient-to-r from-emerald-400 to-cyan-500 py-3 text-base font-semibold text-slate-900 shadow-[0_12px_26px_rgba(16,185,129,0.35)] hover:from-emerald-300 hover:to-cyan-400"
                        >
                          Back to sign in
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                            Password recovery
                          </p>
                          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-white">
                            Reset your password
                          </h1>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                          Update your account password by entering your email,
                          your current password, and your new preferred
                          password.
                        </p>
                        <Input
                          theme="dark"
                          label="Email"
                          type="email"
                          placeholder="manager@restaurant.com"
                          required
                        />
                        <Input
                          theme="dark"
                          label="Old password"
                          type="password"
                          placeholder="Enter your current password"
                          required
                        />
                        <Input
                          theme="dark"
                          label="New password"
                          type="password"
                          placeholder="Enter your new password"
                          required
                        />
                        <Button
                          theme="dark"
                          type="button"
                          onClick={() => setPasswordUpdated(true)}
                          className="mt-2 w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-base font-semibold text-slate-900 shadow-[0_12px_26px_rgba(34,211,238,0.35)] hover:from-cyan-300 hover:to-blue-400"
                        >
                          Update password
                        </Button>
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordUpdated(false);
                            setShowForgotPassword(false);
                          }}
                          className="text-center text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                        >
                          Back to sign in
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-5 flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Food waste prevention system
                      </p>
                      <h1 className="text-3xl font-bold tracking-[-0.04em] text-white">
                        {authMode === "login"
                          ? "Welcome back"
                          : "Create business account"}
                      </h1>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4 text-left"
                    >
                      {authMode === "signup" ? (
                        <>
                          <Input
                            theme="dark"
                            label="Business or company name"
                            value={businessName}
                            onChange={(event) =>
                              setBusinessName(event.target.value)
                            }
                            placeholder="e.g. Fry & Fire"
                            required
                          />
                          <Input
                            theme="dark"
                            label="Your name"
                            value={managerName}
                            onChange={(event) =>
                              setManagerName(event.target.value)
                            }
                            placeholder="e.g. Alex Tan"
                            required
                          />
                          <label className="flex flex-col gap-1.5">
                            <span className="pl-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
                              Business type
                            </span>
                            <select
                              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all duration-200 shadow-sm focus:border-cyan-400"
                              defaultValue="quick-service"
                            >
                              <option value="quick-service">
                                Quick-service restaurant
                              </option>
                              <option value="cafe">Cafe or coffee group</option>
                              <option value="casual-dining">
                                Casual dining restaurant
                              </option>
                              <option value="Others">Others</option>
                            </select>
                          </label>
                          <Input
                            theme="dark"
                            label="Primary outlet"
                            placeholder="e.g. Central Outlet"
                            required
                          />
                        </>
                      ) : (
                        <label className="flex flex-col gap-1.5">
                          <span className="pl-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
                            Restaurant group or outlet
                          </span>
                          <select
                            value={company}
                            onChange={(event) => setCompany(event.target.value)}
                            disabled={!hasOutletData}
                            className={`rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all duration-200 shadow-sm focus:border-cyan-400 ${!hasOutletData ? "cursor-not-allowed opacity-75" : ""}`}
                          >
                            <option value="">Unavailable</option>
                            <option value="Fry & Fire - Central Outlet">
                              Fry &amp; Fire - Central Outlet
                            </option>
                            <option value="Kopi Nusa - Bukit Bintang">
                              Kopi Nusa - Bukit Bintang
                            </option>
                            <option value="BiteCraft Kitchen - Damansara">
                              BiteCraft Kitchen - Damansara
                            </option>
                            <option value="Green Plate Dining - Mont Kiara">
                              Green Plate Dining - Mont Kiara
                            </option>
                          </select>
                          <span className="pl-1 text-[11px] text-slate-400">
                            {hasOutletData
                              ? "Manage one outlet or scale across your whole F&B group."
                              : "No restaurant group or outlet available yet."}
                          </span>
                        </label>
                      )}

                      <Input
                        theme="dark"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="manager@restaurant.com"
                        required
                      />
                      <Input
                        theme="dark"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="********"
                        required
                      />

                      {errorMessage && (
                        <p className="text-xs text-rose-400">{errorMessage}</p>
                      )}

                      <div className="mt-1 flex items-center justify-between gap-3 text-xs text-slate-400">
                        {authMode === "login" ? (
                          <>
                            <label className="inline-flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) =>
                                  setRememberMe(event.target.checked)
                                }
                                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-400 focus:ring-cyan-500"
                              />
                              Remember me
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setPasswordUpdated(false);
                                setShowForgotPassword(true);
                              }}
                              className="font-medium text-cyan-400"
                            >
                              Forgot password?
                            </button>
                          </>
                        ) : (
                          <div className="flex w-full flex-col gap-2">
                            <label className="inline-flex items-center gap-2 text-slate-300">
                              <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(event) =>
                                  setAgreeToTerms(event.target.checked)
                                }
                                required
                                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-400 focus:ring-cyan-500"
                              />
                              <span>
                                By continuing, you agree to WiseServe&apos;s
                                business terms.
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowAgreementModal(true)}
                              className="self-start text-xs font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                            >
                              View agreements
                            </button>
                          </div>
                        )}
                      </div>

                      <Button
                        theme="dark"
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-base font-semibold text-slate-900 shadow-[0_12px_26px_rgba(34,211,238,0.35)] hover:from-cyan-300 hover:to-blue-400"
                      >
                        {isSubmitting
                          ? "Signing in..."
                          : authMode === "login"
                            ? "Sign in"
                            : "Create WiseServe workspace"}
                      </Button>
                    </form>

                    <p className="mt-5 text-center text-sm text-slate-400">
                      {authMode === "login"
                        ? "New to WiseServe?"
                        : "Already have a WiseServe account?"}{" "}
                      <button
                        type="button"
                        onClick={() =>
                          setAuthMode(authMode === "login" ? "signup" : "login")
                        }
                        className="font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        {authMode === "login" ? "Create an account" : "Sign in"}
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
