import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
});
const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", password: "", phone: "" });

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
            data: { full_name: p.data.full_name, phone: p.data.phone },
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
      <div className="hidden lg:flex flex-col justify-between p-12 bg-card border-r border-border">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
          ← Back to portal
        </Link>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">Farmer Identity Network</p>
          <h1 className="text-4xl font-light tracking-tight leading-tight">
            Secure access to <br />
            <span className="text-primary">national agronomy</span> services.
          </h1>
          <p className="mt-6 text-sm text-muted-foreground max-w-md">
            Sign in to apply for schemes, list crops on the national mandi, and receive
            personalised advisories from the Department of Agriculture & Farmers Welfare.
          </p>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground/60">
          GOI // KRISHI BHAWAN // NEW DELHI 110001
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary">{mode === "login" ? "Authenticate" : "Register"}</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              {mode === "login" ? "Farmer Login" : "Create Farmer Account"}
            </h2>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</label>
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
                className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
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
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Phone (optional)</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-sm border border-border bg-secondary px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
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
            {busy ? "Processing…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="w-full text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            {mode === "login" ? "New here? Register a farmer account →" : "Already registered? Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;