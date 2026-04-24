import { Banknote, Sprout, ShieldCheck, LineChart, CloudSun, Headset } from "lucide-react";

const MODULES = [
  { id: "01", title: "PM-KISAN", icon: Banknote, desc: "Direct Benefit Transfer portal for ₹6,000 annual financial assistance and ledger tracking.", cta: "Access Module" },
  { id: "02", title: "Soil Health Card", icon: Sprout, desc: "Geo-tagged nutrient analysis and custom fertilizer recommendations for specific land plots.", cta: "View Records" },
  { id: "03", title: "Crop Insurance", icon: ShieldCheck, desc: "End-to-end risk management and claim settlement through Pradhan Mantri Fasal Bima Yojana.", cta: "Check Status" },
  { id: "04", title: "Mandi Prices", icon: LineChart, desc: "Real-time commodity valuation across 1,000+ national markets via the e-NAM integration.", cta: "Live Feed" },
  { id: "05", title: "Weather Advisory", icon: CloudSun, desc: "Hyper-local meteorological forecasting and pest outbreak warnings for proactive farming.", cta: "Forecast Map" },
  { id: "06", title: "Kisan Call Center", icon: Headset, desc: "24/7 technical advisory line in 22 regional languages. Toll-free 1800-180-1551.", cta: "Contact Expert" },
];

export const Modules = () => {
  return (
    <section id="modules" className="mx-auto max-w-[1440px] px-4 md:px-8 py-20 md:py-32">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">System Modules</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Operational command for nation-wide agricultural services.
          </p>
        </div>
        <div className="font-mono text-[11px] text-muted-foreground/60">
          COORD // 28.6139° N, 77.2090° E
        </div>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <article
              key={m.id}
              className="group relative bg-background p-8 transition-colors hover:bg-card md:p-10"
            >
              <div className="mb-8 flex items-start justify-between">
                <span className="font-mono text-xs text-primary">{m.id}</span>
                <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium tracking-tight">{m.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.desc}</p>
              <div className="mt-8 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {m.cta} <span>→</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};