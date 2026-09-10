import { Suspense, lazy, useEffect, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardSkeleton } from "./components/dashboard/DashboardSkeleton";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";

const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard })),
);
const DailyLog = lazy(() =>
  import("./pages/DailyLog").then((module) => ({ default: module.DailyLog })),
);
const MenuManager = lazy(() =>
  import("./pages/MenuManager").then((module) => ({
    default: module.MenuManager,
  })),
);
const AboutUs = lazy(() =>
  import("./pages/InfoPages").then((module) => ({ default: module.AboutUs })),
);
const ContactUs = lazy(() =>
  import("./pages/InfoPages").then((module) => ({ default: module.ContactUs })),
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
type Tab = "dashboard" | "dailylog" | "menu" | "about" | "contact";

interface Translations {
  pageTitles: Record<Tab, string>;
  sidebar: Record<Tab, string>;
  header: {
    operations: string;
    user: string;
  };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => window.localStorage.getItem("wiseserve-authenticated") === "true",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
    () =>
      window.localStorage.getItem("wiseserve-outlet") ??
      "Fry & Fire - Central Outlet",
  );
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  const translations: Record<Language, Translations> = {
    en: {
      pageTitles: {
        dashboard: "Analytics Dashboard",
        dailylog: "Daily Operational Log",
        menu: "Menu Management",
        about: "About WiseServe",
        contact: "Contact Support",
      },
      sidebar: {
        dashboard: "Analytics",
        dailylog: "Daily Log",
        menu: "Menu Manager",
        about: "About Us",
        contact: "Contact Us",
      },
      header: {
        operations: "Operations",
        user: "User",
      },
    },
    bm: {
      pageTitles: {
        dashboard: "Papan Pemuka Analitik",
        dailylog: "Log Operasi Harian",
        menu: "Pengurusan Menu",
        about: "Tentang WiseServe",
        contact: "Hubungi Sokongan",
      },
      sidebar: {
        dashboard: "Analitik",
        dailylog: "Log Harian",
        menu: "Pengurus Menu",
        about: "Tentang Kami",
        contact: "Hubungi Kami",
      },
      header: {
        operations: "Operasi",
        user: "Pengguna",
      },
    },
  };

  const t = translations[language];
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

  const handleLogin = (companyName: string) => {
    setSelectedCompany(companyName);
    setIsAuthenticated(true);
    setIsLoading(true);
    window.localStorage.setItem("wiseserve-authenticated", "true");
    window.localStorage.setItem("wiseserve-outlet", companyName);
  };

  const handleOutletChange = (companyName: string) => {
    setSelectedCompany(companyName);
    window.localStorage.setItem("wiseserve-outlet", companyName);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsLoading(false);
    window.localStorage.removeItem("wiseserve-authenticated");
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
          <AppLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            title={t.pageTitles[activeTab]}
            theme={theme}
            setTheme={setTheme}
            language={language}
            setLanguage={setLanguage}
            companyName={selectedCompany}
            onLogout={handleLogout}
            outlets={outletOptions}
            onOutletChange={handleOutletChange}
          >
            {isLoading && activeTab === "dashboard" && (
              <DashboardSkeleton theme={theme} />
            )}
            {!isLoading && activeTab === "dashboard" && (
              <Suspense fallback={null}>
                <Dashboard
                  theme={theme}
                  language={language}
                  companyName={selectedCompany}
                />
              </Suspense>
            )}
            {!isLoading && activeTab === "dailylog" && (
              <Suspense fallback={null}>
                <DailyLog
                  theme={theme}
                  language={language}
                  companyName={selectedCompany}
                />
              </Suspense>
            )}
            {!isLoading && activeTab === "menu" && (
              <Suspense fallback={null}>
                <MenuManager theme={theme} language={language} />
              </Suspense>
            )}
            {!isLoading && activeTab === "about" && (
              <Suspense fallback={null}>
                <AboutUs theme={theme} language={language} />
              </Suspense>
            )}
            {!isLoading && activeTab === "contact" && (
              <Suspense fallback={null}>
                <ContactUs theme={theme} language={language} />
              </Suspense>
            )}
          </AppLayout>
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
