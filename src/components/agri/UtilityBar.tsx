import { useState } from "react";

export const UtilityBar = () => {
  const [lang, setLang] = useState<"en" | "hi">("en");
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
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
          <button
            onClick={() => setLang("hi")}
            className={lang === "hi" ? "text-accent" : "text-muted-foreground hover:text-foreground"}
          >
            हिन्दी
          </button>
          <span className="text-border">/</span>
          <button
            onClick={() => setLang("en")}
            className={lang === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
};