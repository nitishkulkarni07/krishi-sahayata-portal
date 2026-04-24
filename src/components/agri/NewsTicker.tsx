const ITEMS = [
  "Minimum Support Price (MSP) revised for 14 Kharif crops for marketing season 2024-25",
  "Soil Health Card mobile application crosses 12 million downloads nationwide",
  "PM-KISAN 17th Installment processed — ₹20,000 Cr disbursed to 9.3 Cr farmers",
  "Precision irrigation advisory issued for the Northern plains zone",
  "e-NAM platform now integrates 1,389 mandis across 23 states & UTs",
];

export const NewsTicker = () => {
  return (
    <div id="mandi" className="border-y border-border bg-card/40 py-4">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-4 md:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <div className="size-2 animate-pulse-dot rounded-full bg-primary" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground">
            Latest Transmission
          </span>
        </div>
        <div className="hidden h-4 w-px bg-border md:block" />
        <div className="flex-1 overflow-hidden">
          <div className="flex w-max animate-ticker gap-12">
            {[...ITEMS, ...ITEMS].map((t, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap text-xs font-medium text-muted-foreground">
                {t}
                <span className="text-border">●</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};