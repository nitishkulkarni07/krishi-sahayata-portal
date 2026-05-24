import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { LangCode, t as staticTranslate, TRANSLATIONS } from "./translations";
import { supabase } from "@/integrations/supabase/client";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  /** Static-key translator (existing dictionary). */
  t: (key: string) => string;
  /** Auto-translate any English string via AI (cached). */
  tr: (text: string) => string;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

const CACHE_KEY = "agri_tr_cache_v1";

type Cache = Record<string, Record<string, string>>; // lang -> { english: translated }

const loadCache = (): Cache => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("agri_lang") as LangCode) || "en";
  });
  const cacheRef = useRef<Cache>(loadCache());
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    localStorage.setItem("agri_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    // trigger flush on language switch
    pendingRef.current.clear();
    force((n) => n + 1);
  }, [lang]);

  const flush = useCallback(async () => {
    const targetLang = lang;
    const texts = Array.from(pendingRef.current);
    pendingRef.current = new Set();
    timerRef.current = null;
    if (texts.length === 0 || targetLang === "en") return;
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { texts, lang: targetLang },
      });
      if (error) return;
      const translations = (data as any)?.translations as Record<string, string> | undefined;
      if (!translations) return;
      cacheRef.current[targetLang] = { ...(cacheRef.current[targetLang] || {}), ...translations };
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cacheRef.current)); } catch {}
      force((n) => n + 1);
    } catch {
      /* swallow */
    }
  }, [lang]);

  const schedule = useCallback(() => {
    if (timerRef.current != null) return;
    timerRef.current = window.setTimeout(flush, 120);
  }, [flush]);

  const tr = useCallback((text: string): string => {
    if (!text || typeof text !== "string") return text;
    if (lang === "en") return text;
    // Pure number / symbol / whitespace -> skip
    if (!/[A-Za-z]/.test(text)) return text;
    const cached = cacheRef.current[lang]?.[text];
    if (cached) return cached;
    if (!pendingRef.current.has(text)) {
      pendingRef.current.add(text);
      schedule();
    }
    return text;
  }, [lang, schedule]);

  const t = useCallback((key: string) => {
    // Prefer static dictionary; otherwise auto-translate the key as English text.
    if (TRANSLATIONS[key]) return staticTranslate(key, lang);
    return tr(key);
  }, [lang, tr]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

/** Auto-translate any English string. Usage: <T>Hello world</T> */
export const T = ({ children }: { children: string }) => {
  const { tr } = useLanguage();
  return <>{tr(children)}</>;
};