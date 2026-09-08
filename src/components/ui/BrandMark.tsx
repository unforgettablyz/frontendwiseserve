interface BrandMarkProps {
  compact?: boolean;
}

export const BrandMark = ({ compact = false }: BrandMarkProps) => (
  <div
    className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563eb] via-[#0f766e] to-[#0f172a] text-white shadow-[0_12px_24px_rgba(37,99,235,0.24)] ${compact ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-sm"}`}
    aria-label="WiseServe logo"
  >
    <span className="relative z-10 font-bold tracking-[-0.08em]">WS</span>
    <span className="absolute -bottom-3 -right-2 h-7 w-7 rounded-full border-4 border-white/20" />
    <span className="absolute -left-2 -top-3 h-7 w-7 rounded-full border-4 border-emerald-300/30" />
  </div>
);
