import heroImg from "@/assets/hero-farmlands.jpg";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Aerial view of Indian farmlands at sunrise"
          className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-accent" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-accent">
              {t("hero.eyebrow")}
            </span>
          </div>
          <h1 className="text-balance text-5xl font-light leading-[1.05] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
            {t("hero.title.a")}{" "}
            <span className="font-medium italic text-primary">{t("hero.title.b")}</span>.
          </h1>
          <p className="mt-8 max-w-[55ch] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("hero.desc")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#modules"
              className="group flex items-center gap-3 rounded-sm bg-primary px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("hero.cta.schemes")}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#mandi"
              className="flex items-center gap-3 border border-border bg-secondary/50 px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-widest text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
            >
              {t("hero.cta.mandi")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};