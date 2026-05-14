import { PageShell } from "@/components/agri/PageShell";
import { CloudSun, Bug, Droplets, Sprout, ThermometerSun, Wind } from "lucide-react";

const ADVISORIES = [
  { icon: CloudSun, region: "North Plains", crop: "Wheat", advice: "Optimal sowing window opens 12 Nov. Maintain seed rate at 100 kg/ha for late sowing.", level: "ROUTINE" },
  { icon: Bug, region: "Maharashtra (Vidarbha)", crop: "Cotton", advice: "Pink bollworm pheromone traps showing 8+ moths/trap. Initiate IPM protocol immediately.", level: "ALERT" },
  { icon: Droplets, region: "Punjab", crop: "Paddy", advice: "Reduce irrigation frequency to alternate wetting & drying. Saves 20% water without yield loss.", level: "ROUTINE" },
  { icon: ThermometerSun, region: "Rajasthan", crop: "Mustard", advice: "Heat advisory: night temperatures rising. Apply 0.2% boron foliar spray at flowering.", level: "ADVISORY" },
  { icon: Sprout, region: "West Bengal", crop: "Jute", advice: "Soil moisture optimum for line sowing. Use JRO-524 variety for retting quality.", level: "ROUTINE" },
  { icon: Wind, region: "Coastal Andhra", crop: "Rice", advice: "Cyclonic depression forecast 72hr. Drain fields, harvest mature crop, secure stored produce.", level: "URGENT" },
];

const tone = (l: string) =>
  l === "URGENT" ? "text-destructive border-destructive/40 bg-destructive/10"
  : l === "ALERT" ? "text-accent border-accent/40 bg-accent/10"
  : "text-primary border-primary/30 bg-primary/10";

const Advisories = () => (
  <PageShell
    eyebrow="Module 05 // Advisories"
    title="Agronomic & Weather Advisories"
    description="Hyper-local guidance synthesised from IMD, ICAR, and KVK observation networks across 750+ districts."
  >
    <div className="grid gap-px bg-border md:grid-cols-2">
      {ADVISORIES.map((a, i) => {
        const Icon = a.icon;
        return (
          <article key={i} className="bg-background p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <Icon className="size-6 text-primary" strokeWidth={1.5} />
              <span className={`rounded-sm border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${tone(a.level)}`}>{a.level}</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.region} · {a.crop}</p>
            <p className="mt-3 text-base leading-relaxed">{a.advice}</p>
            <div className="mt-6 font-mono text-[10px] text-muted-foreground/60">
              ISSUED // {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </div>
          </article>
        );
      })}
    </div>
  </PageShell>
);

export default Advisories;