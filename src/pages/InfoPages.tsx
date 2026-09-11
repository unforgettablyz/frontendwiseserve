import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";

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
            {isBM ? "Laman Utama WiseServe" : "WiseServe home"}
          </p>
          <h2
            className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {isBM
              ? "Keputusan lebih bijak. Kurang pembaziran. Operasi lebih kukuh."
              : "Better decisions. Less waste. Stronger operations."}
          </h2>
          <p
            className={`mt-4 max-w-xl text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            {isBM
              ? "WiseServe membantu pasukan makanan dan minuman melihat apa yang disediakan, dijual, dan dibazirkan supaya setiap syif berjalan dengan lebih yakin."
              : "WiseServe gives food and beverage teams a clear view of what is being prepared, sold, and wasted so every shift can operate with more confidence."}
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
            {isBM
              ? "Jadikan kelestarian boleh diukur."
              : "Make sustainability measurable."}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isBM
              ? "Dari dapur hingga laporan pengurusan, WiseServe menghubungkan tindakan harian dengan hasil kewangan dan alam sekitar."
              : "From the kitchen floor to the management report, WiseServe connects daily actions with financial and environmental outcomes."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`rounded-2xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <p className="text-2xl font-bold text-blue-500">24/7</p>
            <p className="mt-1 text-xs text-slate-400">
              {isBM ? "Keterlihatan operasi" : "Operational visibility"}
            </p>
          </div>
          <div
            className={`rounded-2xl p-4 ${isDark ? "bg-slate-800" : "bg-slate-50"}`}
          >
            <p className="text-2xl font-bold text-emerald-500">1 view</p>
            <p className="mt-1 text-xs text-slate-400">
              {isBM ? "Untuk seluruh pasukan" : "For the whole team"}
            </p>
          </div>
        </div>
      </Card>

      <ContactUs theme={theme} language={language} />
    </div>
  );
};

export const Promotions = ({
  theme = "light",
  language = "en",
}: InfoPageProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Main");

  const campaigns = [
    {
      title: isBM
        ? "Promo Hari Raya Aidilfitri"
        : "Hari Raya Aidilfitri Special",
      description: isBM
        ? "Diskaun makanan yang hampir tamat tempoh untuk memindahkan stok berlebihan sebelum tamat tempoh."
        : "Discount items nearing expiry to move surplus stock before it expires.",
      discount: "20% off",
      category: isBM ? "Utama" : "Main",
      period: "2026-04-18 → 2026-04-25",
      active: true,
    },
    {
      title: isBM
        ? "Paket Tahun Baru China"
        : "Chinese New Year Reunion Bundle",
      description: isBM
        ? "Paket snek dan pencuci mulut untuk majlis keluarga dan sambutan Tahun Baru Cina."
        : "Bundle snacks and desserts for family gatherings and Chinese New Year celebrations.",
      discount: "15% off",
      category: isBM ? "Snek" : "Snack",
      period: "2026-02-10 → 2026-02-17",
      active: false,
    },
    {
      title: isBM ? "Pakej Akhir Minggu Merdeka" : "Merdeka Day Weekend Deal",
      description: isBM
        ? "Kosongkan stok sedia ada sebelum cuti hujung minggu dengan diskaun bermakna."
        : "Clear ready-to-serve stock before the weekend with a meaningful discount.",
      discount: "12% off",
      category: isBM ? "Makanan" : "Food",
      period: "2026-08-29 → 2026-08-31",
      active: false,
    },
  ];

  const menuOptionsByCategory: Record<string, string[]> = {
    Main: isBM
      ? ["Nasi Lemak", "Ayam Goreng", "Rendang", "Sup"]
      : ["Nasi Lemak", "Fried Chicken", "Rendang", "Soup"],
    Food: isBM
      ? ["Nasi Lemak", "Ayam Goreng", "Rendang", "Sup", "Pasta"]
      : ["Nasi Lemak", "Fried Chicken", "Rendang", "Soup", "Pasta"],
    Snack: isBM
      ? ["Snek", "Keropok", "Dessert"]
      : ["Snack", "Crisps", "Dessert"],
    Beverage: isBM
      ? ["Teh O Ais", "Kopi", "Jus", "Minuman Sejuk"]
      : ["Iced Tea", "Coffee", "Juice", "Cold Drinks"],
  };

  const menuOptions = menuOptionsByCategory[selectedCategory] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            className={`text-3xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            {isBM ? "Promosi" : "Promotions"}
          </h2>
          <p
            className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            {isBM
              ? "Fesyen promosi diskaun untuk memindahkan stok sisa sebelum tamat tempoh."
              : "Festive-season discounts to move surplus stock before it expires."}
          </p>
        </div>
        <Button
          theme={theme}
          className="whitespace-nowrap"
          onClick={() => setIsModalOpen(true)}
        >
          {isBM ? "+ Promosi Baru" : "+ New promotion"}
        </Button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card
            key={campaign.title}
            theme={theme}
            className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xl ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
                >
                  🎯
                </span>
                <div>
                  <h3
                    className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}
                  >
                    {campaign.title}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {campaign.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? "bg-amber-500/15 text-amber-300" : "bg-amber-100 text-amber-700"}`}
                >
                  {campaign.discount}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
                >
                  {campaign.category}
                </span>
                <span
                  className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {campaign.period}
                </span>
              </div>
            </div>

            <div
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
                campaign.active
                  ? isDark
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isDark
                    ? "border-slate-700 bg-slate-800 text-slate-300"
                    : "border-slate-200 bg-slate-100 text-slate-600"
              }`}
            >
              {campaign.active
                ? isBM
                  ? "Aktif"
                  : "Active"
                : isBM
                  ? "Tidak aktif"
                  : "Inactive"}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isBM ? "Promosi baru" : "New promotion"}
        theme={theme}
      >
        <div className="space-y-4">
          <div>
            <Input
              theme={theme}
              label={isBM ? "Nama kempen" : "Campaign name"}
              defaultValue={
                isBM ? "Promo Hari Raya Special" : "Hari Raya Special"
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              theme={theme}
              label={isBM ? "Diskaun %" : "Discount %"}
              defaultValue="15"
            />

            <div className="flex flex-col gap-1.5">
              <label
                className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                  isDark ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {isBM ? "Kategori" : "Category"}
              </label>

              <select
                className={`rounded-2xl border px-4 py-2.5 text-sm shadow-sm outline-none transition-all duration-200 ${
                  isDark
                    ? "border-slate-700 bg-slate-800 text-slate-100 focus:border-blue-400 focus:bg-slate-900"
                    : "border-slate-200 bg-slate-50 text-slate-800 focus:border-blue-500 focus:bg-white"
                }`}
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option>Main</option>
                <option>Food</option>
                <option>Snack</option>
                <option>Beverage</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              theme={theme}
              label={isBM ? "Tarikh mula" : "Start date"}
              type="date"
            />
            <Input
              theme={theme}
              label={isBM ? "Tarikh tamat" : "End date"}
              type="date"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {isBM ? "Pilihan menu" : "Menu options"}
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              {menuOptions.map((option) => (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-sm transition-colors ${
                    isDark
                      ? "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-blue-400/60"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <input type="checkbox" className="h-4 w-4 accent-blue-600" />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className={`pl-1 text-xs font-semibold uppercase tracking-[0.08em] ${
                isDark ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {isBM ? "Nota" : "Note"}
            </label>
            <textarea
              className={`min-h-24 resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
                isDark
                  ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-blue-400"
                  : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
              }`}
              placeholder={
                isBM
                  ? "Kenapa promosi ini, dan apa sasarannya?"
                  : "Why this campaign, and what it targets"
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              theme={theme}
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              {isBM ? "Batal" : "Cancel"}
            </Button>
            <Button theme={theme} onClick={() => setIsModalOpen(false)}>
              {isBM ? "Cipta promosi" : "Create promotion"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const ExpirationAlerts = ({
  theme = "light",
  language = "en",
}: InfoPageProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";
  const [selectedLookAhead, setSelectedLookAhead] = useState("24h");

  const alerts = [
    {
      name: "Chicken Soup",
      amount: "34 L",
      expiresIn: "2h",
      preparedAt: "2026-05-19 • 14:00",
      status: "warning",
    },
    {
      name: "Fried Chicken",
      amount: "39 pcs",
      expiresIn: "6h",
      preparedAt: "2026-05-19 • 14:00",
      status: "warning",
    },
    {
      name: "Beef Rendang",
      amount: "59 kg",
      expiresIn: "6h",
      preparedAt: "2026-05-19 • 14:00",
      status: "warning",
    },
  ];

  const lookAheadOptions = ["6h", "24h", "48h"];

  return (
    <div className="space-y-6">
      <div>
        <h2
          className={`text-3xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
        >
          {isBM ? "Amaran tamat tempoh" : "Expiration alerts"}
        </h2>
        <p
          className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
        >
          {isBM
            ? "Komputasi berpandukan jangka hayat setiap item dan masa paling baru untuk batch."
            : "Computed from each item&apos;s shelf life and the most recent batch timestamp."}
        </p>
      </div>

      <div
        className={`rounded-[24px] border p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] ${
          isDark
            ? "border-slate-700 bg-slate-900/90"
            : "border-slate-200/80 bg-white/90"
        }`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {isBM ? "Pandangan hadapan" : "Look ahead"}
            </span>
            <div className="flex items-center gap-2">
              {lookAheadOptions.map((option) => {
                const isActive = selectedLookAhead === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedLookAhead(option)}
                    className={`inline-flex min-w-[54px] items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? isDark
                          ? "border-orange-500/50 bg-orange-500/20 text-orange-200"
                          : "border-orange-300 bg-orange-100 text-orange-700"
                        : isDark
                          ? "border-slate-700 bg-slate-800 text-slate-300"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div
              className={`rounded-[20px] border p-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800/60"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p
                className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {isBM ? "Item ditanda" : "Items flagged"}
              </p>
              <p
                className={`mt-3 text-4xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                19
              </p>
            </div>

            <div
              className={`rounded-[20px] border p-4 ${
                isDark
                  ? "border-slate-700 bg-slate-800/60"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <p
                className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
              >
                {isBM ? "Sudah tamat tempoh" : "Already expired"}
              </p>
              <p
                className={`mt-3 text-4xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                0
              </p>
            </div>
          </div>

          <div
            className={`rounded-[20px] border p-4 ${
              isDark
                ? "border-slate-700 bg-slate-800/60"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <p
              className={`text-sm ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              {isBM ? "Masa rujukan" : "Reference time"}
            </p>
            <p
              className={`mt-2 text-xl font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
            >
              {alerts[0]?.preparedAt ?? "2026-05-19 • 14:00"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card
            key={alert.name}
            theme={theme}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}
              >
                ⏰
              </div>
              <div>
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-slate-100" : "text-slate-900"}`}
                >
                  {alert.name}
                </h3>
                <p
                  className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {isBM ? "Disediakan" : "Prepared"} {alert.preparedAt}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-slate-900"}`}
              >
                {alert.amount}
              </p>
              <p className="text-xs text-amber-500">
                {isBM ? "Tamat tempoh dalam" : "Expires in"} {alert.expiresIn}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ContactUs = ({
  theme = "light",
  language = "en",
}: InfoPageProps) => {
  const isDark = theme === "dark";
  const isBM = language === "bm";

  return (
    <footer
      className={`rounded-[28px] border p-6 md:p-8 ${
        isDark
          ? "border-slate-700 bg-slate-900/70"
          : "border-slate-200 bg-white/80"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500">
            {isBM ? "Sokongan WiseServe" : "WiseServe support"}
          </p>
          <h2
            className={`mt-2 text-2xl font-bold tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}
          >
            {isBM ? "Mari berbincang." : "Let&apos;s talk."}
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:hello@wiseserve.com"
            className={`inline-flex rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            hello@wiseserve.com
          </a>
          <a
            href="tel:+60312345678"
            className={`inline-flex rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            +603 1234 5678
          </a>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div
          className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {isBM ? "Emel" : "Email"}
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
            {isBM ? "Masa respons" : "Response time"}
          </p>
          <p
            className={`mt-1 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
          >
            {isBM
              ? "Dalam masa satu hari perniagaan"
              : "Within one business day"}
          </p>
        </div>
        <div
          className={`rounded-2xl border p-4 ${isDark ? "border-slate-700 bg-slate-800/60" : "border-slate-200 bg-slate-50"}`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {isBM ? "Waktu operasi" : "Office hours"}
          </p>
          <p
            className={`mt-1 font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
          >
            {isBM
              ? "Isnin - Jumaat, 9:00 - 18:00"
              : "Mon - Fri, 9:00 AM - 6:00 PM"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AboutUs;
