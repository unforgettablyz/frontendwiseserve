import { Card } from "../ui/Card";

type Theme = "light" | "dark";

interface DashboardSkeletonProps {
  theme?: Theme;
}

const SkeletonBlock = ({
  className = "",
  theme = "light",
}: {
  className?: string;
  theme?: Theme;
}) => (
  <div
    className={`animate-pulse rounded-xl ${
      theme === "dark" ? "bg-slate-800" : "bg-slate-200/80"
    } ${className}`}
  />
);

export const DashboardSkeleton = ({
  theme = "light",
}: DashboardSkeletonProps) => (
  <div
    className="flex flex-col gap-6"
    aria-busy="true"
    aria-label="Loading dashboard"
  >
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {["revenue", "prepared", "wasted", "value"].map((metric) => (
        <Card key={metric} theme={theme} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock theme={theme} className="h-3 w-28" />
            <SkeletonBlock theme={theme} className="h-5 w-14 rounded-full" />
          </div>
          <SkeletonBlock theme={theme} className="h-9 w-32" />
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <Card theme={theme} className="xl:col-span-2">
        <div className="flex items-center justify-between">
          <SkeletonBlock theme={theme} className="h-5 w-52" />
          <SkeletonBlock theme={theme} className="h-3 w-16" />
        </div>
        <SkeletonBlock
          theme={theme}
          className="mt-5 h-72 w-full rounded-[22px]"
        />
      </Card>
      <Card theme={theme}>
        <SkeletonBlock theme={theme} className="h-5 w-36" />
        <div className="mt-5 flex flex-col gap-3">
          {["one", "two", "three"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl border border-transparent p-3"
            >
              <div className="flex flex-col gap-2">
                <SkeletonBlock theme={theme} className="h-4 w-36" />
                <SkeletonBlock theme={theme} className="h-3 w-20" />
              </div>
              <SkeletonBlock theme={theme} className="h-4 w-12" />
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card theme={theme}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonBlock theme={theme} className="h-3 w-36" />
          <SkeletonBlock theme={theme} className="h-6 w-72" />
        </div>
        <SkeletonBlock theme={theme} className="h-12 w-24 rounded-2xl" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {["one", "two", "three"].map((item) => (
          <SkeletonBlock
            key={item}
            theme={theme}
            className="h-36 w-full rounded-2xl"
          />
        ))}
      </div>
    </Card>
  </div>
);
