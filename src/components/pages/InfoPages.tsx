import { useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

type Theme = "light" | "dark";
type Language = "en" | "bm";

interface InfoPageProps {
  theme?: Theme;
  language?: Language;
}

export const AboutUs = ({
  theme = "light",
  language = "en",
}: InfoPageProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  const principles = isBM
    ? [
        {
          title: "Kurangkan pembaziran",
          text: "Tukar data operasi kepada keputusan penyediaan yang lebih bijak.",
        },
        {
          title: "Lindungi margin",
          text: "Kenal pasti kebocoran kos sebelum ia memberi kesan kepada keuntungan.",
        },
        {
          title: "Bina tabiat lebih baik",
          text: "Bantu setiap pasukan membuat perubahan kecil yang konsisten.",
        },
      ]
    : [
        {
          title: "Reduce waste",
          text: "Turn operational data into smarter preparation decisions.",
        },
        {
          title: "Protect margins",
          text: "Spot cost leakage before it affects your bottom line.",
        },
        {
          title: "Build better habits",
          text: "Help every team make small, consistent improvements.",
        },
      ];

  return (
    <div className="flex flex-col gap-6">
      <section
        className={`relative overflow-hidden rounded-[28px] border p-8 md:p-10 ${
          isDark
            ? "border-blue-400/20 bg-gradient-to-br from-blue-500/20 via-slate-900 to-slate-950"
            : "border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50"
        }`}
      >
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-500">
            WiseServe F&B Intelligence
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Better decisions. Less waste. Stronger operations.
          </h2>
          <p
            className={`mt-4 max-w-xl text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            WiseServe gives food and beverage teams a clear view of what is
            being prepared, sold, and wasted so every shift can operate with
            more confidence.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[28px] border-emerald-400/20" />
        <div className="pointer-events-none absolute -bottom-24 right-28 h-48 w-48 rounded-full border-[24px] border-blue-400/15" />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {principles.map((principle) => (
          <Card
            key={principle.title}
            theme={theme}
            className="flex flex-col gap-3"
          >
            <span className="h-2 w-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
            <h3
              className={`text-base font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              {principle.title}
            </h3>
            <p className="text-sm leading-6 text-slate-400">{principle.text}</p>
          </Card>
        ))}
      </div>

      <Card
        theme={theme}
        className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
            {isBM ? "Kesan kami" : "Our impact"}
          </p>
          <h3
            className={`mt-2 text-2xl font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            Make sustainability measurable.
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            From the kitchen floor to the management report, WiseServe connects
            daily actions with financial and environmental outcomes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <p className="text-2xl font-bold text-blue-500">24/7</p>
            <p className="mt-1 text-xs text-slate-400">
              Operational visibility
            </p>
          </div>
          <div
            className={`rounded-2xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <p className="text-2xl font-bold text-emerald-500">1 view</p>
            <p className="mt-1 text-xs text-slate-400">For the whole team</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ContactUs = ({
  theme = "light",
  language = "en",
}: InfoPageProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card theme={theme} className="flex flex-col justify-between gap-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500">
            {isBM ? "Sokongan WiseServe" : "WiseServe support"}
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            {isBM ? "Mari berbincang." : "Let&apos;s talk."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isBM
              ? "Ada soalan tentang operasi, laporan, atau akaun anda? Pasukan kami sedia membantu."
              : "Have a question about operations, reporting, or your account? Our team is ready to help."}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div
            className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Email
            </p>
            <p
              className={`mt-1 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              hello@wiseserve.com
            </p>
          </div>
          <div
            className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Response time
            </p>
            <p
              className={`mt-1 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
            >
              Within one business day
            </p>
          </div>
        </div>
      </Card>

      <Card theme={theme}>
        {isSubmitted ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-500">
              ✓
            </div>
            <h3
              className={`mt-5 text-xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              Message received
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Thanks for reaching out. The WiseServe team will reply within one
              business day.
            </p>
            <Button
              theme={theme}
              variant="secondary"
              className="mt-6"
              onClick={() => setIsSubmitted(false)}
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <h2
                className={`text-xl font-semibold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Tell us how we can help your operation.
              </p>
            </div>
            <Input
              theme={theme}
              label="Name"
              placeholder="Your name"
              required
            />
            <Input
              theme={theme}
              label="Email"
              type="email"
              placeholder="you@company.com"
              required
            />
            <label className="flex flex-col gap-1.5">
              <span
                className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${isDark ? "text-slate-300" : "text-slate-500"}`}
              >
                Message
              </span>
              <textarea
                className={`min-h-32 resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${isDark ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-400" : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"}`}
                placeholder="How can we help?"
                required
              />
            </label>
            <div className="flex justify-end pt-2">
              <Button theme={theme} type="submit">
                Send Message
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
