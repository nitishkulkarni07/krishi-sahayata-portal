import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { PageShell } from "@/components/agri/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [tab, setTab] = useState<"sell" | "buy">("sell");
  const [listings, setListings] = useState<Listing[]>([]);
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
  useEffect(() => { if (user) refresh(); }, [user]);

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

  const filtered = listings.filter((l) => l.listing_type === tab);

  return (
    <PageShell
      eyebrow="Module 04 // e-NAM"
      title="Crop Marketplace"
      description="Direct farmer-to-buyer transactions across the National Agriculture Market network."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={submit} className="space-y-4 border border-border bg-card p-6 h-fit">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-primary">New Listing</h3>

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
                I want to {t}
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
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{f.l}</label>
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
            {busy ? "Publishing…" : "Publish Listing"}
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
                {t === "sell" ? "Selling" : "Buying"} ({listings.filter((l) => l.listing_type === t).length})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active listings yet.</p>
          ) : (
            <div className="grid gap-px bg-border md:grid-cols-2">
              {filtered.map((l) => (
                <article key={l.id} className="bg-background p-5">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-base font-medium">{l.commodity}</h4>
                    <span className="font-mono text-xs text-primary">₹{Number(l.price_per_qtl).toLocaleString("en-IN")}/qtl</span>
                  </div>
                  {l.variety && <p className="text-xs text-muted-foreground">{l.variety}</p>}
                  <dl className="mt-4 space-y-1 font-mono text-[11px] text-muted-foreground">
                    <div className="flex justify-between"><dt>Qty</dt><dd>{Number(l.quantity_qtl).toLocaleString("en-IN")} qtl</dd></div>
                    <div className="flex justify-between"><dt>Where</dt><dd>{l.location}</dd></div>
                    {l.contact && <div className="flex justify-between"><dt>Contact</dt><dd>{l.contact}</dd></div>}
                    <div className="flex justify-between"><dt>Posted</dt><dd>{new Date(l.created_at).toLocaleDateString()}</dd></div>
                  </dl>
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