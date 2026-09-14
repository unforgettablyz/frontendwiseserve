import { type Dispatch, type SetStateAction, Suspense, lazy } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";

const Dashboard = lazy(() =>
  import("../pages/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);
const DailyLog = lazy(() =>
  import("../pages/DailyLog").then((module) => ({ default: module.DailyLog })),
);
const MenuManager = lazy(() =>
  import("../pages/MenuManager").then((module) => ({
    default: module.MenuManager,
  })),
);
const AboutUs = lazy(() =>
  import("../pages/InfoPages").then((module) => ({ default: module.AboutUs })),
);
const Promotions = lazy(() =>
  import("../pages/InfoPages").then((module) => ({
    default: module.Promotions,
  })),
);
const ExpirationAlerts = lazy(() =>
  import("../pages/InfoPages").then((module) => ({
    default: module.ExpirationAlerts,
  })),
);

type Theme = "light" | "dark";
type Language = "en" | "bm";
type Tab =
  | "home"
  | "dashboard"
  | "dailylog"
  | "menu"
  | "promotions"
  | "expiration";

interface AppRoutesProps {
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  selectedCompany: string;
  onLogout: () => void;
  outlets: string[];
  onOutletChange: (outlet: string) => void;
  isLoading: boolean;
}

export const AppRoutes = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  language,
  setLanguage,
  selectedCompany,
  onLogout,
  outlets,
  onOutletChange,
  isLoading,
}: AppRoutesProps) => {
  const translations: Record<
    Language,
    {
      pageTitles: Record<Tab, string>;
      sidebar: Record<Tab, string>;
      header: {
        operations: string;
        user: string;
      };
    }
  > = {
    en: {
      pageTitles: {
        home: "Home",
        dashboard: "Analytics Dashboard",
        dailylog: "Daily Operational Log",
        menu: "Menu Management",
        promotions: "Promotions",
        expiration: "Expiration Alerts",
      },
      sidebar: {
        home: "Home",
        dashboard: "Dashboard",
        dailylog: "Daily Log",
        menu: "Menu Manager",
        promotions: "Promotions",
        expiration: "Expiration alerts",
      },
      header: {
        operations: "Operations",
        user: "User",
      },
    },
    bm: {
      pageTitles: {
        home: "Laman Utama",
        dashboard: "Papan Pemuka Analitik",
        dailylog: "Log Operasi Harian",
        menu: "Pengurusan Menu",
        promotions: "Promosi",
        expiration: "Amaran Tamat Tempoh",
      },
      sidebar: {
        home: "Laman Utama",
        dashboard: "Papan Pemuka",
        dailylog: "Log Harian",
        menu: "Pengurus Menu",
        promotions: "Promosi",
        expiration: "Amaran tamat tempoh",
      },
      header: {
        operations: "Operasi",
        user: "Pengguna",
      },
    },
  };

  const t = translations[language];

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
      onLogout={onLogout}
      outlets={outlets}
      onOutletChange={onOutletChange}
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
      {!isLoading && activeTab === "home" && (
        <Suspense fallback={null}>
          <AboutUs
            theme={theme}
            language={language}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        </Suspense>
      )}
      {!isLoading && activeTab === "promotions" && (
        <Suspense fallback={null}>
          <Promotions theme={theme} language={language} />
        </Suspense>
      )}
      {!isLoading && activeTab === "expiration" && (
        <Suspense fallback={null}>
          <ExpirationAlerts theme={theme} language={language} />
        </Suspense>
      )}
    </AppLayout>
  );
};

export default AppRoutes;
