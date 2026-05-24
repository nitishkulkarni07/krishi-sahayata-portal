import { Banknote, Sprout, ShieldCheck, LineChart, CloudSun, Headset } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageProvider";

const MODULES = [
  { id: "01", title: "Schemes", icon: Banknote, desc: "Apply directly for PM-KISAN, KCC, PMFBY and other flagship schemes administered by the Department.", cta: "Apply Now", to: "/schemes" },
  { id: "02", title: "Crop Marketplace", icon: Sprout, desc: "List your produce or post buy requirements on the national e-NAM mandi network.", cta: "Open Market", to: "/market" },
  { id: "03", title: "Advisories", icon: CloudSun, desc: "Hyper-local agronomic, weather and pest advisories from IMD, ICAR and KVK observation networks.", cta: "View Advisories", to: "/advisories" },
  { id: "04", title: "Market Statistics", icon: LineChart, desc: "Real-time price discovery, mandi arrivals and trade velocity across 28 states.", cta: "View Telemetry", to: "/statistics" },
  { id: "05", title: "Crop Insurance", icon: ShieldCheck, desc: "End-to-end risk management and claim settlement through Pradhan Mantri Fasal Bima Yojana.", cta: "Apply", to: "/schemes" },
  { id: "06", title: "Kisan Call Center", icon: Headset, desc: "24/7 technical advisory line in 22 regional languages. Toll-free 1800-180-1551.", cta: "Contact Expert", to: "/advisories" },
];

export const Modules = () => {
  const { tr } = useLanguage();
  return (
    <section id="modules" className="mx-auto max-w-[1440px] px-4 md:px-8 py-20 md:py-32">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">{tr("System Modules")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {tr("Operational command for nation-wide agricultural services.")}
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
            <Link
              key={m.id}
              to={m.to}
              className="group relative block bg-background p-8 transition-colors hover:bg-card md:p-10"
            >
              <div className="mb-8 flex items-start justify-between">
                <span className="font-mono text-xs text-primary">{m.id}</span>
                <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-medium tracking-tight">{tr(m.title)}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tr(m.desc)}</p>
              <div className="mt-8 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {tr(m.cta)} <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};