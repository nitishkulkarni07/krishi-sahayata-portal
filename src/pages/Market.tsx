import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { PageShell } from "@/components/agri/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageProvider";

type Listing = {
  id: string;
  user_id: string;
  listing_type: "sell" | "buy";
  commodity: string;
  variety: string | null;
  quantity_qtl: number;
  price_per_qtl: number;
  location: string;
  contact: string | null;
  status: string;
  created_at: string;
};

const listingSchema = z.object({
  listing_type: z.enum(["sell", "buy"]),
  commodity: z.string().trim().min(2).max(60),
  variety: z.string().trim().max(60).optional().or(z.literal("")),
  quantity_qtl: z.coerce.number().positive().max(1_000_000),
  price_per_qtl: z.coerce.number().positive().max(10_000_000),
  location: z.string().trim().min(2).max(120),
  contact: z.string().trim().max(60).optional().or(z.literal("")),
});

const Market = () => {
  const { user, loading } = useAuth();
  const { tr } = useLanguage();
  const [tab, setTab] = useState<"sell" | "buy">("sell");
  const [listings, setListings] = useState<Listing[]>([]);
  const [profile, setProfile] = useState<{ state: string | null; district: string | null; role: string | null } | null>(null);
  const [regionOnly, setRegionOnly] = useState(true);
  const [recording, setRecording] = useState<string | null>(null);
  const [form, setForm] = useState({
    listing_type: "sell" as "sell" | "buy",
    commodity: "",
    variety: "",
    quantity_qtl: "",
    price_per_qtl: "",
    location: "",
    contact: "",
  });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("crop_listings").select("*").order("created_at", { ascending: false }).limit(200);
    setListings((data as Listing[]) ?? []);
  };
  useEffect(() => {
    if (!user) return;
    refresh();
    supabase.from("profiles").select("state,district,role").eq("id", user.id).maybeSingle()
      .then(({ data }) => setProfile(data as any));
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = listingSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    const d = parsed.data;
    const { error } = await supabase.from("crop_listings").insert({
      user_id: user.id,
      listing_type: d.listing_type,
      commodity: d.commodity,
      quantity_qtl: d.quantity_qtl,
      price_per_qtl: d.price_per_qtl,
      location: d.location,
      variety: d.variety || null,
      contact: d.contact || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Listing published to national mandi.");
    setForm({ ...form, commodity: "", variety: "", quantity_qtl: "", price_per_qtl: "", location: "", contact: "" });
    refresh();
  };

  const region = (profile?.state || "").toLowerCase();
  const district = (profile?.district || "").toLowerCase();
  const matchesRegion = (loc: string) => {
    const l = (loc || "").toLowerCase();
    return (!!region && l.includes(region)) || (!!district && l.includes(district));
  };
  const base = listings.filter((l) => l.listing_type === tab);
  const filtered = regionOnly && region ? base.filter((l) => matchesRegion(l.location)) : base;

  const recordPurchase = async (l: Listing) => {
    if (l.listing_type !== "sell") return;
    setRecording(l.id);
    const { error } = await supabase.from("purchases").insert({
      user_id: user.id,
      listing_id: l.id,
      commodity: l.commodity,
      variety: l.variety,
      quantity_qtl: l.quantity_qtl,
      price_per_qtl: l.price_per_qtl,
      location: l.location,
      seller_contact: l.contact,
    });
    setRecording(null);
    if (error) return toast.error(error.message);
    toast.success("Purchase recorded in your dashboard.");
  };

  return (
    <PageShell
      eyebrow="Module 04 // e-NAM"
      title="Crop Marketplace"
      description="Direct farmer-to-buyer transactions across the National Agriculture Market network."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={submit} className="space-y-4 border border-border bg-card p-6 h-fit">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-primary">{tr("New Listing")}</h3>

          <div className="grid grid-cols-2 gap-2">
            {(["sell", "buy"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, listing_type: t })}
                className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition ${
                  form.listing_type === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {tr(t === "sell" ? "I want to sell" : "I want to buy")}
              </button>
            ))}
          </div>

          {[
            { k: "commodity", l: "Commodity (e.g. Wheat)" },
            { k: "variety", l: "Variety (optional)" },
            { k: "quantity_qtl", l: "Quantity (quintal)", type: "number" },
            { k: "price_per_qtl", l: "Price per quintal (₹)", type: "number" },
            { k: "location", l: "Mandi / Location" },
            { k: "contact", l: "Contact (optional)" },
          ].map((f) => (
            <div key={f.k} className="space-y-1">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr(f.l)}</label>
              <input
                type={(f as any).type ?? "text"}
                value={(form as any)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full rounded-sm border border-border bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}

          <button
            disabled={busy}
            className="w-full rounded-sm bg-primary px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {tr(busy ? "Publishing…" : "Publish Listing")}
          </button>
        </form>

        <div>
          <div className="mb-6 flex gap-2 border-b border-border">
            {(["sell", "buy"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 font-mono text-[10px] uppercase tracking-widest transition ${
                  tab === t ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tr(t === "sell" ? "Selling" : "Buying")} ({listings.filter((l) => l.listing_type === t).length})
              </button>
            ))}
            {region && (
              <label className="ml-auto flex cursor-pointer items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <input type="checkbox" checked={regionOnly} onChange={(e) => setRegionOnly(e.target.checked)} />
                {tr("My region only")} ({profile?.district || profile?.state})
              </label>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">{tr("No active listings yet.")}</p>
          ) : (
            <div className="grid gap-px bg-border md:grid-cols-2">
              {filtered.map((l) => (
                <article key={l.id} className="bg-background p-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-base font-medium">{tr(l.commodity)}</h4>
                    <span className="font-mono text-xs text-primary">₹{Number(l.price_per_qtl).toLocaleString("en-IN")}/qtl</span>
                  </div>
                  {l.variety && <p className="text-xs text-muted-foreground">{tr(l.variety)}</p>}
                  <dl className="mt-4 space-y-1 font-mono text-[11px] text-muted-foreground">
                    <div className="flex justify-between"><dt>{tr("Qty")}</dt><dd>{Number(l.quantity_qtl).toLocaleString("en-IN")} {tr("qtl")}</dd></div>
                    <div className="flex justify-between"><dt>{tr("Where")}</dt><dd>{tr(l.location)}</dd></div>
                    {l.contact && <div className="flex justify-between"><dt>{tr("Contact")}</dt><dd>{l.contact}</dd></div>}
                    <div className="flex justify-between"><dt>{tr("Posted")}</dt><dd>{new Date(l.created_at).toLocaleDateString()}</dd></div>
                  </dl>
                  {tab === "sell" && l.user_id !== user.id && (
                    <button onClick={() => recordPurchase(l)} disabled={recording === l.id}
                      className="mt-4 w-full rounded-sm border border-primary px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50">
                      {tr(recording === l.id ? "Recording…" : "Buy & Record")}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default Market;