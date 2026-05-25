import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";
import { UtilityBar } from "@/components/agri/UtilityBar";

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
  role: z.enum(["farmer", "trader"]),
  state: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  aadhaar: z.string().trim().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  address: z.string().trim().min(4).max(240),
  trader_company: z.string().trim().max(120).optional().or(z.literal("")),
  trader_license: z.string().trim().max(60).optional().or(z.literal("")),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { tr } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", phone: "",
    role: "farmer" as "farmer" | "trader",
    state: "", district: "", aadhaar: "", address: "",
    trader_company: "", trader_license: "",
  });

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const p = signupSchema.safeParse(form);
        if (!p.success) { toast.error(p.error.issues[0].message); return; }
        const { error } = await supabase.auth.signUp({
          email: p.data.email,
          password: p.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: p.data.full_name,
              phone: p.data.phone,
              role: p.data.role,
              state: p.data.state,
              district: p.data.district,
              aadhaar: p.data.aadhaar,
              address: p.data.address,
              trader_company: p.data.trader_company,
              trader_license: p.data.trader_license,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created. You are signed in.");
        navigate("/");
      } else {
        const p = loginSchema.safeParse(form);
        if (!p.success) { toast.error(p.error.issues[0].message); return; }
        const { error } = await supabase.auth.signInWithPassword({ email: p.data.email, password: p.data.password });
        if (error) throw error;
        toast.success("Welcome back, Kisan.");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background text-foreground grid lg:grid-cols-2">
      <div className="lg:col-span-2"><UtilityBar /></div>
      <div className="hidden lg:flex flex-col justify-between p-12 bg-card border-r border-border">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          ← {tr("Back to portal")}
        </Link>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">{tr("Farmer Identity Network")}</p>
          <h1 className="text-4xl font-light tracking-tight leading-tight">
            {tr("Secure access to")} <br />
            <span className="text-primary">{tr("national agronomy")}</span> {tr("services.")}
          </h1>
          <p className="mt-6 text-sm text-muted-foreground max-w-md">
            {tr("Sign in to apply for schemes, list crops on the national mandi, and receive personalised advisories from the Department of Agriculture & Farmers Welfare.")}
          </p>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground/60">
          GOI // KRISHI BHAWAN // NEW DELHI 110001
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{tr(mode === "login" ? "Authenticate" : "Register")}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              {tr(mode === "login" ? "Farmer Login" : "Create Farmer Account")}
            </h2>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Full Name")}</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Email")}</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Phone (optional)")}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Account Type")}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["farmer","trader"] as const).map((r) => (
                    <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                      className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition ${
                        form.role === r ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                      }`}>{tr(r === "farmer" ? "Farmer" : "Trader / Buyer")}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("State")}</label>
                  <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required
                    className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("District")}</label>
                  <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required
                    className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Aadhaar Number (12 digits)")}</label>
                <input inputMode="numeric" maxLength={12} value={form.aadhaar}
                  onChange={(e) => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, "") })} required
                  className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm tracking-widest outline-none focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Address")}</label>
                <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required rows={2}
                  className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              {form.role === "trader" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Company / Firm")}</label>
                    <input value={form.trader_company} onChange={(e) => setForm({ ...form, trader_company: e.target.value })}
                      className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Trade License No.")}</label>
                    <input value={form.trader_license} onChange={(e) => setForm({ ...form, trader_license: e.target.value })}
                      className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary" />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr("Password")}</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-sm bg-primary px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-widest text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {tr(busy ? "Processing…" : mode === "login" ? "Sign In" : "Create Account")}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            {tr(mode === "login" ? "New here? Register a farmer account →" : "Already registered? Sign in →")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;