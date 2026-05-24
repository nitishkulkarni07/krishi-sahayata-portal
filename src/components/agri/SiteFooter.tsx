import { useLanguage } from "@/i18n/LanguageProvider";

const COLS = [
  {
    title: "Services",
    links: ["PM-KISAN", "Soil Health Card", "Fasal Bima Yojana", "e-NAM", "Kisan Call Center"],
  },
  {
    title: "Department",
    links: ["About Us", "Organisation Chart", "Annual Report", "Tenders", "Right to Information"],
  },
  {
    title: "Connect",
    links: ["Contact Officials", "Media Releases", "Newsletter", "Twitter / X", "YouTube"],
  },
];

export const SiteFooter = () => {
  const { tr } = useLanguage();
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center bg-foreground p-1.5">
                <div className="flex size-full items-center justify-center bg-background">
                  <span className="font-mono text-[9px] font-bold text-foreground text-center">सत्यमेव<br/>जयते</span>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {tr("Government of India")}
                </p>
                <p className="text-sm font-medium">{tr("Department of Agriculture & Farmers Welfare")}</p>
              </div>
            </div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {tr("Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi — 110001")}
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              {tr("Helpline")}: <span className="text-foreground">1800-180-1551</span>
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} className="md:col-span-2">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
                {tr(col.title)}
              </h4>
              <ul className="mt-6 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {tr(l)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-2">
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
              {tr("System Status")}
            </h4>
            <div className="mt-6 flex items-center gap-2">
              <div className="size-2 animate-pulse-dot rounded-full bg-primary" />
              <span className="font-mono text-xs text-muted-foreground">{tr("All systems nominal")}</span>
            </div>
            <p className="mt-4 font-mono text-[10px] text-muted-foreground/60">
              {tr("Uptime")} · 99.97%<br/>
              {tr("Last sync · 2 min ago")}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {tr("© 2026 Ministry of Agriculture · Designed by NIC")}
          </p>
          <div className="flex flex-wrap gap-6">
            {["Privacy Policy", "Cyber Security", "Accessibility", "Sitemap"].map((l) => (
              <a key={l} href="#" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
                {tr(l)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};