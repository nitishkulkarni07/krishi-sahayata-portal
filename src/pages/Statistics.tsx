import { PageShell } from "@/components/agri/PageShell";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/i18n/LanguageProvider";

const PRICES = [
  { month: "May", Wheat: 2275, Paddy: 2183, Mustard: 5650 },
  { month: "Jun", Wheat: 2310, Paddy: 2210, Mustard: 5720 },
  { month: "Jul", Wheat: 2355, Paddy: 2245, Mustard: 5680 },
  { month: "Aug", Wheat: 2402, Paddy: 2278, Mustard: 5810 },
  { month: "Sep", Wheat: 2380, Paddy: 2305, Mustard: 5905 },
  { month: "Oct", Wheat: 2425, Paddy: 2320, Mustard: 6020 },
  { month: "Nov", Wheat: 2470, Paddy: 2356, Mustard: 6155 },
];

const ARRIVALS = [
  { state: "UP", qtl: 4820 },
  { state: "Punjab", qtl: 6210 },
  { state: "MP", qtl: 3940 },
  { state: "Maha", qtl: 2870 },
  { state: "Raj", qtl: 2105 },
  { state: "Bihar", qtl: 1740 },
  { state: "WB", qtl: 1610 },
];

const KPIS = [
  { label: "Active Mandis", value: "1,389" },
  { label: "Daily Trade Volume", value: "₹412 Cr" },
  { label: "Avg. Wheat MSP", value: "₹2,425" },
  { label: "States Reporting", value: "28 / 28" },
];

const tickStyle = { fill: "hsl(0 0% 60%)", fontSize: 11, fontFamily: "ui-monospace" };

const Statistics = () => {
  const { tr } = useLanguage();
  return (
  <PageShell
    eyebrow="Module 04 // Telemetry"
    title="Market Statistics"
    description="Real-time aggregation of price discovery, mandi arrivals and trade velocity across the e-NAM network."
  >
    <div className="mb-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((k) => (
        <div key={k.label} className="bg-background p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tr(k.label)}</p>
          <p className="mt-3 text-3xl font-light tracking-tight text-primary">{k.value}</p>
        </div>
      ))}
    </div>

    <div className="grid gap-12 lg:grid-cols-5">
      <section className="lg:col-span-3 border border-border bg-card p-6">
        <header className="mb-6 flex items-baseline justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{tr("Price Trend")}</p>
            <h3 className="mt-1 text-lg font-medium">{tr("Modal Price (₹/quintal) — last 7 months")}</h3>
          </div>
        </header>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={PRICES}>
            <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
            <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(240 5% 13%)", border: "1px solid hsl(0 0% 100% / 0.08)", fontSize: 12 }} />
            <Line type="monotone" dataKey="Wheat" stroke="hsl(142 71% 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Paddy" stroke="hsl(30 100% 60%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Mustard" stroke="hsl(0 0% 80%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="lg:col-span-2 border border-border bg-card p-6">
        <header className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{tr("Arrivals")}</p>
          <h3 className="mt-1 text-lg font-medium">{tr("Mandi arrivals by state ('000 qtl)")}</h3>
        </header>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ARRIVALS}>
            <CartesianGrid stroke="hsl(0 0% 100% / 0.06)" vertical={false} />
            <XAxis dataKey="state" tick={tickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(240 5% 13%)", border: "1px solid hsl(0 0% 100% / 0.08)", fontSize: 12 }} />
            <Bar dataKey="qtl" fill="hsl(142 71% 38%)" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  </PageShell>
  );
};

export default Statistics;