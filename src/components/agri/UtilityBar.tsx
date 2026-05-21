import { useLanguage } from "@/i18n/LanguageProvider";
import { LANGUAGES, LangCode } from "@/i18n/translations";
import { Globe } from "lucide-react";

export const UtilityBar = () => {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <a href="#main" className="transition-colors hover:text-foreground">
            Skip to Content
          </a>
          <div className="hidden items-center gap-3 sm:flex" aria-label="Font size">
            <button className="transition-colors hover:text-foreground" aria-label="Decrease font size">A-</button>
            <button className="text-foreground" aria-label="Default font size">A</button>
            <button className="transition-colors hover:text-foreground" aria-label="Increase font size">A+</button>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
          <Globe size={12} className="text-accent" />
          <label htmlFor="lang-select" className="sr-only">{t("lang.select")}</label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as LangCode)}
            className="cursor-pointer rounded-sm border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label={t("lang.select")}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-background text-foreground">
                {l.native} — {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};