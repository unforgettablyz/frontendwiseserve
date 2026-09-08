import { useEffect, useState } from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./components/pages/Login";
import { Dashboard } from "./components/pages/Dashboard";
import { DailyLog } from "./components/pages/DailyLog";
import { MenuManager } from "./components/pages/MenuManager";
import { AboutUs, ContactUs } from "./components/pages/InfoPages";
import { DashboardSkeleton } from "./components/pages/DashboardSkeleton";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(
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
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title={t.pageTitles[activeTab]}
      theme={theme}
      setTheme={setTheme}
      language={language}
      setLanguage={setLanguage}
      companyName={selectedCompany}
    >
      {isLoading && activeTab === "dashboard" && (
        <DashboardSkeleton theme={theme} />
      )}
      {!isLoading && activeTab === "dashboard" && (
        <Dashboard theme={theme} language={language} />
      )}
      {!isLoading && activeTab === "dailylog" && (
        <DailyLog theme={theme} language={language} />
      )}
      {!isLoading && activeTab === "menu" && (
        <MenuManager theme={theme} language={language} />
      )}
      {!isLoading && activeTab === "about" && (
        <AboutUs theme={theme} language={language} />
      )}
      {!isLoading && activeTab === "contact" && (
        <ContactUs theme={theme} language={language} />
      )}
    </AppLayout>
  );
}
