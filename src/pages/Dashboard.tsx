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

type NearbyListing = {
  id: string;
  commodity: string;
  variety: string | null;
  quantity_qtl: number;
  price_per_qtl: number;
  location: string;
  contact: string | null;
  distance: "district" | "state" | "other";
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { tr } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [apps, setApps] = useState<number>(0);
  const [listings, setListings] = useState<number>(0);
  const [nearby, setNearby] = useState<NearbyListing[]>([]);
  const [prefs, setPrefs] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("crop_prefs") || "[]"); } catch { return []; }
  });
  const [prefInput, setPrefInput] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => setProfile(data as any));
    supabase.from("purchases").select("*").order("created_at", { ascending: false }).then(({ data }) => setPurchases((data as any) ?? []));
    supabase.from("scheme_applications").select("id", { count: "exact", head: true }).then(({ count }) => setApps(count ?? 0));
    supabase.from("crop_listings").select("id", { count: "exact", head: true }).eq("user_id", user.id).then(({ count }) => setListings(count ?? 0));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("crop_listings")
      .select("*")
      .eq("listing_type", "sell")
      .eq("status", "active")
      .neq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        const state = (profile?.state || "").toLowerCase().trim();
        const district = (profile?.district || "").toLowerCase().trim();
        const ranked: NearbyListing[] = ((data as any[]) ?? []).map((l) => {
          const loc = (l.location || "").toLowerCase();
          let distance: NearbyListing["distance"] = "other";
          if (district && loc.includes(district)) distance = "district";
          else if (state && loc.includes(state)) distance = "state";
          return { ...l, distance };
        });
        const order = { district: 0, state: 1, other: 2 } as const;
        ranked.sort((a, b) => order[a.distance] - order[b.distance]);
        const filtered = prefs.length
          ? ranked.filter((l) => prefs.some((p) => l.commodity.toLowerCase().includes(p.toLowerCase())))
          : ranked;
        setNearby(filtered.slice(0, 12));
      });
  }, [user, profile?.state, profile?.district, prefs]);

  const addPref = () => {
    const v = prefInput.trim();
    if (!v) return;
    const next = Array.from(new Set([...prefs, v]));
    setPrefs(next);
    localStorage.setItem("crop_prefs", JSON.stringify(next));
    setPrefInput("");
  };
  const removePref = (p: string) => {
    const next = prefs.filter((x) => x !== p);
    setPrefs(next);
    localStorage.setItem("crop_prefs", JSON.stringify(next));
  };

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

      {/* Nearby crops preference */}
      <section className="mb-10 border border-border bg-card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-primary">{tr("Nearby Crops · Low Transport Cost")}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {tr("Ranked by proximity to your region")}
              {profile?.district || profile?.state ? ` — ${[profile?.district, profile?.state].filter(Boolean).join(", ")}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={prefInput}
              onChange={(e) => setPrefInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPref())}
              placeholder={tr("Add preferred crop (e.g. Wheat)")}
              className="rounded-sm border border-border bg-secondary px-3 py-2 text-xs outline-none focus:border-primary"
            />
            <button onClick={addPref} className="rounded-sm bg-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              {tr("Add")}
            </button>
          </div>
        </div>

        {prefs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {prefs.map((p) => (
              <button key={p} onClick={() => removePref(p)}
                className="group rounded-full border border-border bg-secondary px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:border-destructive hover:text-destructive">
                {tr(p)} <span className="ml-1 opacity-60 group-hover:opacity-100">×</span>
              </button>
            ))}
          </div>
        )}

        {!profile?.state && !profile?.district ? (
          <p className="mt-4 text-sm text-muted-foreground">{tr("Set your state and district in your profile to see nearby crops.")}</p>
        ) : nearby.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{tr("No nearby listings match your preferences yet.")}</p>
        ) : (
          <div className="mt-5 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {nearby.map((l) => {
              const tag = l.distance === "district" ? tr("In your district") : l.distance === "state" ? tr("In your state") : tr("Other region");
              const color = l.distance === "district" ? "text-primary" : l.distance === "state" ? "text-foreground" : "text-muted-foreground";
              return (
                <article key={l.id} className="bg-background p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-sm font-medium">{tr(l.commodity)}</h4>
                    <span className="font-mono text-[11px] text-primary">₹{Number(l.price_per_qtl).toLocaleString("en-IN")}/qtl</span>
                  </div>
                  {l.variety && <p className="text-[11px] text-muted-foreground">{tr(l.variety)}</p>}
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest">
                    <span className={color}>● {tag}</span>
                  </p>
                  <dl className="mt-1 space-y-0.5 font-mono text-[10px] text-muted-foreground">
                    <div className="flex justify-between"><dt>{tr("Qty")}</dt><dd>{Number(l.quantity_qtl).toLocaleString("en-IN")} {tr("qtl")}</dd></div>
                    <div className="flex justify-between"><dt>{tr("Where")}</dt><dd className="truncate">{tr(l.location)}</dd></div>
                    {l.contact && <div className="flex justify-between"><dt>{tr("Contact")}</dt><dd>{l.contact}</dd></div>}
                  </dl>
                </article>
              );
            })}
          </div>
        )}
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