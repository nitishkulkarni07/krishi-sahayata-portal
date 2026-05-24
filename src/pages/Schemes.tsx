import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageShell } from "@/components/agri/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";

const SCHEMES = [
  { code: "PMKISAN", name: "PM-KISAN Samman Nidhi", desc: "₹6,000/year direct income support to land-holding farmer families.", tag: "DBT" },
  { code: "PMFBY", name: "Pradhan Mantri Fasal Bima Yojana", desc: "Crop insurance against natural calamity, pests and disease.", tag: "INSURANCE" },
  { code: "SHC", name: "Soil Health Card", desc: "Plot-level soil testing and customised nutrient recommendations.", tag: "ADVISORY" },
  { code: "KCC", name: "Kisan Credit Card", desc: "Short-term credit at 4% effective interest for cultivation needs.", tag: "CREDIT" },
  { code: "PKVY", name: "Paramparagat Krishi Vikas Yojana", desc: "Cluster-based promotion of organic farming with ₹50,000/ha support.", tag: "ORGANIC" },
  { code: "PMKSY", name: "PM Krishi Sinchayee Yojana", desc: "Per-drop-more-crop micro-irrigation subsidy up to 55%.", tag: "IRRIGATION" },
];

type Application = { id: string; scheme_code: string; scheme_name: string; status: string; created_at: string };

const Schemes = () => {
  const { user, loading } = useAuth();
  const { tr } = useLanguage();
  const [apps, setApps] = useState<Application[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = async () => {
    const { data } = await supabase.from("scheme_applications").select("*").order("created_at", { ascending: false });
    setApps((data as Application[]) ?? []);
  };
  useEffect(() => { if (user) refresh(); }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const apply = async (code: string, name: string) => {
    setBusy(code);
    const { error } = await supabase.from("scheme_applications").insert({ user_id: user.id, scheme_code: code, scheme_name: name });
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success(`Application submitted for ${name}`);
    refresh();
  };

  const appliedSet = new Set(apps.map((a) => a.scheme_code));

  return (
    <PageShell
      eyebrow="Module 01 // Schemes"
      title="Apply for Government Schemes"
      description="Direct enrolment into flagship schemes administered by the Department of Agriculture & Farmers Welfare."
    >
      <div className="grid gap-px bg-border md:grid-cols-2 mb-16">
        {SCHEMES.map((s) => (
          <article key={s.code} className="bg-background p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{s.tag}</span>
              <span className="font-mono text-[10px] text-muted-foreground/60">{s.code}</span>
            </div>
            <h3 className="text-lg font-medium tracking-tight">{tr(s.name)}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tr(s.desc)}</p>
            <button
              disabled={busy === s.code || appliedSet.has(s.code)}
              onClick={() => apply(s.code, s.name)}
              className="mt-6 rounded-sm border border-primary px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
            >
              {tr(appliedSet.has(s.code) ? "Applied ✓" : busy === s.code ? "Submitting…" : "Apply Now →")}
            </button>
          </article>
        ))}
      </div>

      <section>
        <h2 className="mb-6 text-xl font-medium tracking-tight">{tr("My Applications")}</h2>
        {apps.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tr("No applications submitted yet.")}</p>
        ) : (
          <div className="border border-border">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="p-4">{tr("Scheme")}</th>
                  <th className="p-4">{tr("Code")}</th>
                  <th className="p-4">{tr("Status")}</th>
                  <th className="p-4">{tr("Submitted")}</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-4">{tr(a.scheme_name)}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{a.scheme_code}</td>
                    <td className="p-4"><span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase text-primary">{tr(a.status)}</span></td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default Schemes;