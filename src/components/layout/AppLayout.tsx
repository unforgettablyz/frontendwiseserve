import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

type Theme = "light" | "dark";
type Tab = "dashboard" | "dailylog" | "menu" | "about" | "contact";
type Language = "en" | "bm";

interface AppLayoutProps {
  children: ReactNode;
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  title: string;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  companyName: string;
}

export const AppLayout = ({
  children,
  activeTab,
  setActiveTab,
  title,
  theme,
  setTheme,
  language,
  setLanguage,
  companyName,
}: AppLayoutProps) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-screen font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','SF_Pro_Text',sans-serif] transition-colors duration-300 ${
        isDark
          ? "bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#111827_30%,_#020817_100%)] text-slate-100"
          : "bg-[radial-gradient(circle_at_top_left,_#f8fbff_0%,_#f3f5f9_30%,_#eef2f7_100%)] text-slate-800"
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        language={language}
        companyName={companyName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          theme={theme}
          onThemeToggle={() => setTheme(isDark ? "light" : "dark")}
          language={language}
          setLanguage={setLanguage}
          companyName={companyName}
        />
        <main
          className={`flex-1 overflow-y-auto p-6 md:p-8 ${isDark ? "bg-slate-950/40" : "bg-transparent"}`}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};
