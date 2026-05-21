import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/i18n/LanguageProvider";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const NAV = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.schemes"), to: "/schemes" },
    { label: t("nav.market"), to: "/market" },
    { label: t("nav.advisories"), to: "/advisories" },
    { label: t("nav.statistics"), to: "/statistics" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-sm bg-foreground p-1.5">
            <div className="flex size-full items-center justify-center bg-background">
              <span className="font-mono text-[10px] font-bold text-foreground">सत्यमेव<br/>जयते</span>
            </div>
          </div>
          <div className="leading-tight">
            <p className="font-mono text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Ministry of Agriculture & Farmers Welfare
            </p>
            <p className="text-base md:text-lg font-medium tracking-tight">
              कृषि एवं किसान कल्याण विभाग
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="font-mono text-[11px] font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={signOut}
              className="ml-2 rounded-full border border-primary px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {t("nav.logout")}
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-2 rounded-full border border-primary px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {t("nav.login")}
            </Link>
          )}
        </nav>

        <button
          className="lg:hidden rounded-sm border border-border p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-4 py-4 md:px-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { setOpen(false); signOut(); }}
                className="mt-4 rounded-full border border-primary px-5 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full border border-primary px-5 py-3 text-center font-mono text-[10px] font-bold uppercase tracking-widest text-primary"
              >
                {t("nav.login")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};