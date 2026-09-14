interface AgreementModalProps {
  theme?: "light" | "dark";
  agreements: Array<{ id: string; label: string; content: string }>;
  selectedAgreement: string;
  onSelectAgreement: (id: string) => void;
  onClose: () => void;
}

export const AgreementModal = ({
  theme = "light",
  agreements,
  selectedAgreement,
  onSelectAgreement,
  onClose,
}: AgreementModalProps) => {
  const isDark = theme === "dark";
  const activeAgreement =
    agreements.find((agreement) => agreement.id === selectedAgreement) ??
    agreements[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-700 bg-[#111827] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              WiseServe agreements
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white">
              Terms and policies
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {agreements.map((agreement) => {
            const isActive = agreement.id === selectedAgreement;

            return (
              <button
                key={agreement.id}
                type="button"
                onClick={() => onSelectAgreement(agreement.id)}
                className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                    : "border-slate-600 bg-slate-800/70 text-slate-300 hover:border-slate-500 hover:text-white"
                }`}
              >
                {agreement.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            {activeAgreement?.label}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            {activeAgreement?.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
