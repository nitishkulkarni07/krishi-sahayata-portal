import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageShell } from "@/components/agri/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/i18n/LanguageProvider";
import { toast } from "sonner";

type Purchase = {
  id: string;
  commodity: string;
  variety: string | null;
  quantity_qtl: number;
  price_per_qtl: number;
  location: string;
  seller_contact: string | null;
  created_at: string;
};

type Profile = {
  full_name: string | null;
  phone: string | null;
  state: string | null;
  district: string | null;
  role: string | null;
  aadhaar: string | null;
  address: string | null;
  trader_company: string | null;
  trader_license: string | null;
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { tr } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [apps, setApps] = useState<number>(0);
  const [listings, setListings] = useState<number>(0);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data as any));
    supabase.from("purchases").select("*").order("created_at", { ascending: false }).then(({ data }) => setPurchases((data as any) ?? []));
    supabase.from("scheme_applications").select("id", { count: "exact", head: true }).then(({ count }) => setApps(count ?? 0));
    supabase.from("crop_listings").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => setListings(count ?? 0));
  }, [user]);

  const totals = useMemo(() => {
    const qty = purchases.reduce((s, p) => s + Number(p.quantity_qtl), 0);
    const value = purchases.reduce((s, p) => s + Number(p.quantity_qtl) * Number(p.price_per_qtl), 0);
    const byCommodity = new Map<string, number>();
    purchases.forEach((p) => byCommodity.set(p.commodity, (byCommodity.get(p.commodity) ?? 0) + Number(p.quantity_qtl)));
    const top = [...byCommodity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { qty, value, top };
  }, [purchases]);

  const removePurchase = async (id: string) => {
    const { error } = await supabase.from("purchases").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setPurchases((ps) => ps.filter((p) => p.id !== id));
  };

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const isTrader = profile?.role === "trader";

  return (
    <PageShell
      eyebrow="Module 06 // Kisan Console"
      title={isTrader ? "Trader Dashboard" : "Farmer Dashboard"}
      description="Personal ledger of purchases, listings, and scheme participation across the national agriculture network."
    >
      {/* Identity card */}
      <section className="mb-10 grid gap-px bg-border md:grid-cols-4">
        {[
          { l: "Name", v: profile?.full_name },
          { l: "Role", v: profile?.role },
          { l: "State / District", v: [profile?.state, profile?.district].filter(Boolean).join(" · ") },
          { l: "Phone", v: profile?.phone },
          { l: "Aadhaar", v: profile?.aadhaar ? `XXXX-XXXX-${profile.aadhaar.slice(-4)}` : "—" },
          { l: "Address", v: profile?.address },
          ...(isTrader
            ? [
                { l: "Company", v: profile?.trader_company },
                { l: "License", v: profile?.trader_license },
              ]
            : []),
        ].map((f) => (
          <div key={f.l} className="bg-background p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr(f.l)}</p>
            <p className="mt-1 text-sm">{f.v || "—"}</p>
          </div>
        ))}
      </section>

      {/* KPIs */}
      <section className="mb-10 grid gap-px bg-border md:grid-cols-4">
        {[
          { l: "Total Purchases", v: purchases.length },
          { l: "Total Quantity (qtl)", v: totals.qty.toLocaleString("en-IN") },
          { l: "Total Spend (₹)", v: totals.value.toLocaleString("en-IN") },
          { l: isTrader ? "Active Buys Posted" : "My Listings", v: listings },
        ].map((k) => (
          <div key={k.l} className="bg-background p-6">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr(k.l)}</p>
            <p className="mt-2 text-2xl font-light text-primary">{k.v}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h3 className="font-mono text-[11px] uppercase tracking-widest text-primary">{tr("Top Commodities by Volume")}</h3>
        {totals.top.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{tr("No purchases recorded yet.")}</p>
        ) : (
          <div className="mt-4 space-y-2">
            {totals.top.map(([c, q]) => {
              const pct = Math.round((q / totals.qty) * 100);
              return (
                <div key={c}>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>{tr(c)}</span>
                    <span className="text-muted-foreground">{q.toLocaleString("en-IN")} {tr("qtl")} · {pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 bg-border">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-primary">{tr("Purchase Ledger")}</h3>
        {purchases.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tr("Purchases recorded from the marketplace will appear here.")}</p>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  {["Date", "Commodity", "Qty (qtl)", "Price/qtl", "Total", "Location", "Contact", ""].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">{tr(h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{tr(p.commodity)}{p.variety ? ` · ${p.variety}` : ""}</td>
                    <td className="px-3 py-2">{Number(p.quantity_qtl).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2">₹{Number(p.price_per_qtl).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2 text-primary">₹{(Number(p.quantity_qtl) * Number(p.price_per_qtl)).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-2">{tr(p.location)}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{p.seller_contact || "—"}</td>
                    <td className="px-3 py-2">
                      <button onClick={() => removePurchase(p.id)} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive">
                        {tr("Delete")}
                      </button>
                    </td>
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

export default Dashboard;