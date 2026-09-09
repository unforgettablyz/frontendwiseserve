import { Component, type ErrorInfo, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ErrorBoundaryProps {
  children: ReactNode;
  theme?: Theme;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const isDark = this.props.theme === "dark";

      return (
        <div
          className={`flex min-h-screen items-center justify-center px-4 py-10 transition-colors duration-300 ${
            isDark
              ? "bg-[radial-gradient(circle_at_top_left,_#0f172a_0%,_#111827_30%,_#020817_100%)] text-slate-100"
              : "bg-[radial-gradient(circle_at_top_left,_#f8fbff_0%,_#f3f5f9_30%,_#eef2f7_100%)] text-slate-800"
          }`}
        >
          <div
            className={`w-full max-w-lg rounded-[28px] border p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] ${
              isDark
                ? "border-slate-700 bg-slate-900/90"
                : "border-slate-200 bg-white/90"
            }`}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-2xl text-rose-500">
              !
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              System Notice
            </p>
            <h2
              className={`mt-2 text-2xl font-bold tracking-tight ${
                isDark ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Something went wrong
            </h2>
            <p
              className={`mt-3 text-sm leading-6 ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              The app hit an unexpected error. You can try refreshing this
              section to continue without losing the rest of your workspace.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Try again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "border-slate-600 text-slate-200 hover:bg-slate-800"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
