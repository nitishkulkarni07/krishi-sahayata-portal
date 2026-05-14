import { ReactNode } from "react";
import { UtilityBar } from "@/components/agri/UtilityBar";
import { SiteHeader } from "@/components/agri/SiteHeader";
import { SiteFooter } from "@/components/agri/SiteFooter";

export const PageShell = ({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <UtilityBar />
      <SiteHeader />
      <main className="mx-auto max-w-[1440px] px-4 md:px-8 py-12 md:py-20">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-light tracking-tight">{title}</h1>
          {description && <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>}
        </header>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};