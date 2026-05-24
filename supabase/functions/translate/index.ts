const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", bn: "Bengali", te: "Telugu", mr: "Marathi",
  ta: "Tamil", gu: "Gujarati", kn: "Kannada", ml: "Malayalam", pa: "Punjabi",
  or: "Odia", as: "Assamese", ur: "Urdu",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { texts, lang } = await req.json();
    if (!Array.isArray(texts) || !lang) {
      return new Response(JSON.stringify({ error: "texts[] and lang required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (lang === "en") {
      const out: Record<string, string> = {};
      texts.forEach((t: string) => (out[t] = t));
      return new Response(JSON.stringify({ translations: out }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const target = LANG_NAMES[lang] ?? lang;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sys = `You are a professional UI translator for an Indian government agriculture portal. Translate each input string to ${target}. Keep proper nouns (PM-KISAN, e-NAM, KCC, PMFBY, ICAR, IMD, KVK, NIC), numbers, currency symbols (₹), units, dates, hex/codes, and email/phone unchanged. Preserve punctuation, casing style (UPPERCASE arrows like → stays). Return ONLY a JSON object mapping each original English string to its translation. No prose.`;
    const user = JSON.stringify({ strings: texts });

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: sys }, { role: "user", content: user }],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const errTxt = await resp.text();
      return new Response(JSON.stringify({ error: `AI gateway: ${resp.status} ${errTxt}` }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, string> = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }
    // Accept either {original: translated} or {strings: {...}}
    if (parsed && typeof parsed === "object" && "strings" in parsed && typeof (parsed as any).strings === "object") {
      parsed = (parsed as any).strings;
    }
    const translations: Record<string, string> = {};
    for (const t of texts) translations[t] = parsed[t] || t;
    return new Response(JSON.stringify({ translations }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});