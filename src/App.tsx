import { Suspense, lazy, useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { AppRoutes } from "./routes/AppRoutes";

const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);

const outletsByRestaurant: Record<string, string[]> = {
  "Fry & Fire": [
    "Fry & Fire - Central Outlet",
    "Fry & Fire - North Outlet",
    "Fry & Fire - South Outlet",
    "Fry & Fire - Airport Outlet",
  ],
  "Harbor and Vine": [
    "Harbor and Vine - Downtown",
    "Harbor and Vine - Riverside",
    "Harbor and Vine - Marina",
  ],
  "Kopi Nusa": [
    "Kopi Nusa - Bukit Bintang",
    "Kopi Nusa - Bangsar",
    "Kopi Nusa - Damansara",
  ],
  BiteCraft: [
    "BiteCraft Kitchen - Damansara",
    "BiteCraft Kitchen - Mont Kiara",
    "BiteCraft Kitchen - Petaling Jaya",
  ],
};

type Theme = "light" | "dark";
type Language = "en" | "bm";
type Tab =
  | "home"
  | "dashboard"
  | "dailylog"
  | "menu"
  | "promotions"
  | "expiration";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const rememberMeEnabled =
      window.localStorage.getItem("wiseserve-remember-me") === "true";

    return (
      rememberMeEnabled &&
      window.localStorage.getItem("wiseserve-authenticated") === "true"
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(() => {
    const rememberMeEnabled =
      window.localStorage.getItem("wiseserve-remember-me") === "true";

    return (
      (rememberMeEnabled
        ? window.localStorage.getItem("wiseserve-outlet")
        : null) ?? "Fry & Fire - Central Outlet"
    );
  });
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  const restaurantName = selectedCompany.split(" - ")[0];
  const outletOptions = outletsByRestaurant[restaurantName] ?? [
    selectedCompany,
  ];

  useEffect(() => {
    if (!isAuthenticated || !isLoading) {
      return;
    }

    const loadingTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, 900);

    return () => window.clearTimeout(loadingTimer);
  }, [isAuthenticated, isLoading]);

  const handleLogin = (companyName: string, rememberMeValue = false) => {
    setSelectedCompany(companyName);
    setIsAuthenticated(true);
    setIsLoading(true);
    if (rememberMeValue) {
      window.localStorage.setItem("wiseserve-authenticated", "true");
      window.localStorage.setItem("wiseserve-outlet", companyName);
      window.localStorage.setItem("wiseserve-remember-me", "true");
    } else {
      window.localStorage.setItem("wiseserve-remember-me", "false");
      window.localStorage.removeItem("wiseserve-authenticated");
      window.localStorage.removeItem("wiseserve-outlet");
    }
  };

  const handleOutletChange = (companyName: string) => {
    setSelectedCompany(companyName);
    window.localStorage.setItem("wiseserve-outlet", companyName);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoading(false);
    window.localStorage.removeItem("wiseserve-authenticated");
    window.localStorage.removeItem("wiseserve-outlet");
    window.localStorage.removeItem("wiseserve-remember-me");
  };

  return (
    <ErrorBoundary theme={theme}>
      <Suspense fallback={null}>
        {!isAuthenticated ? (
          <Login
            onLogin={handleLogin}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
          />
        ) : (
          <AppRoutes
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            selectedCompany={selectedCompany}
            onLogout={handleLogout}
            outlets={outletOptions}
            onOutletChange={handleOutletChange}
            isLoading={isLoading}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
