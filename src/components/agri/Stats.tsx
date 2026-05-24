import { useLanguage } from "@/i18n/LanguageProvider";

const STATS = [
  { value: "11.8 Cr+", label: "PM-KISAN Beneficiaries" },
  { value: "₹3.04 L Cr", label: "DBT Disbursed Lifetime" },
  { value: "23.6 Cr", label: "Soil Health Cards Issued" },
  { value: "1,389", label: "e-NAM Integrated Mandis" },
];

export const Stats = () => {
  const { tr } = useLanguage();
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-20">
        <div className="mb-10 flex items-center gap-3">
          <div className="h-px w-8 bg-accent" />
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-accent">
            {tr("National Telemetry")}
          </span>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-background p-6 md:p-8">
              <p className="font-display text-3xl font-light tracking-tight md:text-4xl">
                <span className="text-primary">{s.value.split(" ")[0]}</span>
                {s.value.includes(" ") && (
                  <span className="text-foreground"> {s.value.split(" ").slice(1).join(" ")}</span>
                )}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {tr(s.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};