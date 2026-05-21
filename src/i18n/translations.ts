export type LangCode =
  | "en" | "hi" | "bn" | "te" | "mr" | "ta" | "gu" | "kn" | "ml" | "pa" | "or" | "as" | "ur";

export const LANGUAGES: { code: LangCode; label: string; native: string; states: string }[] = [
  { code: "en", label: "English", native: "English", states: "All India" },
  { code: "hi", label: "Hindi", native: "हिन्दी", states: "UP, MP, BR, RJ, HR, DL, UK, HP, CG, JH" },
  { code: "bn", label: "Bengali", native: "বাংলা", states: "West Bengal, Tripura" },
  { code: "te", label: "Telugu", native: "తెలుగు", states: "Andhra Pradesh, Telangana" },
  { code: "mr", label: "Marathi", native: "मराठी", states: "Maharashtra" },
  { code: "ta", label: "Tamil", native: "தமிழ்", states: "Tamil Nadu, Puducherry" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", states: "Gujarat" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", states: "Karnataka" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", states: "Kerala" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", states: "Punjab" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", states: "Odisha" },
  { code: "as", label: "Assamese", native: "অসমীয়া", states: "Assam" },
  { code: "ur", label: "Urdu", native: "اردو", states: "J&K, Telangana" },
];

export const TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  "nav.home":        { en: "Home", hi: "मुख्य पृष्ठ", bn: "হোম", te: "హోమ్", mr: "मुख्यपृष्ठ", ta: "முகப்பு", gu: "મુખ્ય", kn: "ಮುಖಪುಟ", ml: "ഹോം", pa: "ਮੁੱਖ", or: "ମୁଖ୍ୟ", as: "মুখ্য", ur: "ہوم" },
  "nav.schemes":     { en: "Schemes", hi: "योजनाएं", bn: "প্রকল্প", te: "పథకాలు", mr: "योजना", ta: "திட்டங்கள்", gu: "યોજનાઓ", kn: "ಯೋಜನೆಗಳು", ml: "പദ്ധതികൾ", pa: "ਯੋਜਨਾਵਾਂ", or: "ଯୋଜନା", as: "আঁচনি", ur: "اسکیمیں" },
  "nav.market":      { en: "Market", hi: "बाज़ार", bn: "বাজার", te: "మార్కెట్", mr: "बाजार", ta: "சந்தை", gu: "બજાર", kn: "ಮಾರುಕಟ್ಟೆ", ml: "വിപണി", pa: "ਮੰਡੀ", or: "ବଜାର", as: "বজাৰ", ur: "منڈی" },
  "nav.advisories":  { en: "Advisories", hi: "सलाह", bn: "পরামর্শ", te: "సలహాలు", mr: "सल्ले", ta: "ஆலோசனை", gu: "સલાહ", kn: "ಸಲಹೆಗಳು", ml: "നിർദ്ദേശങ്ങൾ", pa: "ਸਲਾਹਾਂ", or: "ପରାମର୍ଶ", as: "পৰামৰ্শ", ur: "مشورے" },
  "nav.statistics":  { en: "Statistics", hi: "आँकड़े", bn: "পরিসংখ্যান", te: "గణాంకాలు", mr: "आकडेवारी", ta: "புள்ளிவிவரம்", gu: "આંકડા", kn: "ಅಂಕಿಅಂಶ", ml: "സ്ഥിതിവിവരക്കണക്ക്", pa: "ਅੰਕੜੇ", or: "ପରିସଂଖ୍ୟାନ", as: "পৰিসংখ্যা", ur: "اعداد و شمار" },
  "nav.login":       { en: "Farmer Login", hi: "किसान लॉगिन", bn: "কৃষক লগইন", te: "రైతు లాగిన్", mr: "शेतकरी लॉगिन", ta: "விவசாயி உள்நுழைவு", gu: "ખેડૂત લોગિન", kn: "ರೈತ ಲಾಗಿನ್", ml: "കർഷക ലോഗിൻ", pa: "ਕਿਸਾਨ ਲਾਗਇਨ", or: "କୃଷକ ଲଗଇନ୍", as: "কৃষক লগ-ইন", ur: "کسان لاگ ان" },
  "nav.logout":      { en: "Sign Out", hi: "साइन आउट", bn: "সাইন আউট", te: "సైన్ అవుట్", mr: "साइन आउट", ta: "வெளியேறு", gu: "સાઇન આઉટ", kn: "ಸೈನ್ ಔಟ್", ml: "സൈൻ ഔട്ട്", pa: "ਸਾਈਨ ਆਉਟ", or: "ସାଇନ୍ ଆଉଟ୍", as: "ছাইন আউট", ur: "سائن آؤٹ" },
  "hero.eyebrow":    { en: "Digital Agronomy Infrastructure", hi: "डिजिटल कृषि अवसंरचना", bn: "ডিজিটাল কৃষি পরিকাঠামো", te: "డిజిటల్ వ్యవసాయ మౌలిక సదుపాయాలు", mr: "डिजिटल कृषी पायाभूत सुविधा", ta: "டிஜிட்டல் வேளாண் உள்கட்டமைப்பு", gu: "ડિજિટલ કૃષિ માળખું", kn: "ಡಿಜಿಟಲ್ ಕೃಷಿ ಮೂಲಸೌಕರ್ಯ", ml: "ഡിജിറ്റൽ കാർഷിക അടിസ്ഥാന സൗകര്യം", pa: "ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਢਾਂਚਾ", or: "ଡିଜିଟାଲ୍ କୃଷି ଭିତ୍ତିଭୂମି", as: "ডিজিটেল কৃষি আন্তঃগাঁথনি", ur: "ڈیجیٹل زرعی بنیادی ڈھانچہ" },
  "hero.title.a":    { en: "Sovereignty through", hi: "संप्रभुता द्वारा", bn: "সার্বভৌমত্ব মাধ্যমে", te: "సార్వభౌమత్వం ద్వారా", mr: "सार्वभौमत्व द्वारे", ta: "இறையாண்மை மூலம்", gu: "સાર્વભૌમત્વ દ્વારા", kn: "ಸಾರ್ವಭೌಮತ್ವ ಮೂಲಕ", ml: "പരമാധികാരം വഴി", pa: "ਪ੍ਰਭੁਸੱਤਾ ਰਾਹੀਂ", or: "ସାର୍ବଭୌମତ୍ୱ ମାଧ୍ୟମରେ", as: "সাৰ্বভৌমত্ব যোগে", ur: "خودمختاری بذریعہ" },
  "hero.title.b":    { en: "Precision", hi: "सटीकता", bn: "নির্ভুলতা", te: "ఖచ్చితత్వం", mr: "अचूकता", ta: "துல்லியம்", gu: "ચોકસાઈ", kn: "ನಿಖರತೆ", ml: "കൃത്യത", pa: "ਸ਼ੁੱਧਤਾ", or: "ସଠିକତା", as: "নিখুঁততা", ur: "درستگی" },
  "hero.desc":       { en: "Orchestrating the future of Indian agriculture through high-precision digital integration, real-time satellite telemetry, and farmer-centric data systems serving over 140 million cultivators.", hi: "उच्च-परिशुद्धता डिजिटल एकीकरण, वास्तविक समय उपग्रह टेलीमेट्री और 14 करोड़ से अधिक किसानों के लिए डेटा प्रणाली के माध्यम से भारतीय कृषि के भविष्य का संचालन।", bn: "উচ্চ-নির্ভুলতা ডিজিটাল ইন্টিগ্রেশন, রিয়েল-টাইম স্যাটেলাইট টেলিমেট্রি এবং ১৪ কোটি কৃষকের জন্য তথ্য ব্যবস্থার মাধ্যমে ভারতীয় কৃষির ভবিষ্যৎ পরিচালনা।", te: "అధిక-ఖచ్చితత్వ డిజిటల్ ఏకీకరణ, రియల్-టైమ్ ఉపగ్రహ టెలిమెట్రీ ద్వారా 14 కోట్ల రైతులకు సేవలు.", mr: "उच्च-अचूक डिजिटल एकत्रीकरण आणि 14 कोटी शेतकऱ्यांना सेवा देणाऱ्या प्रणालींद्वारे भारतीय शेतीचे भविष्य.", ta: "துல்லியமான டிஜிட்டல் ஒருங்கிணைப்பு மற்றும் 14 கோடி விவசாயிகளுக்கு சேவை.", gu: "ઉચ્ચ-ચોકસાઈ ડિજિટલ એકીકરણ દ્વારા 14 કરોડ ખેડૂતોને સેવા.", kn: "ಹೆಚ್ಚಿನ ನಿಖರ ಡಿಜಿಟಲ್ ಏಕೀಕರಣದ ಮೂಲಕ 14 ಕೋಟಿ ರೈತರಿಗೆ ಸೇವೆ.", ml: "ഉയർന്ന കൃത്യതയുള്ള ഡിജിറ്റൽ ഏകീകരണത്തിലൂടെ 14 കോടി കർഷകർക്ക് സേവനം.", pa: "ਉੱਚ-ਸ਼ੁੱਧਤਾ ਡਿਜੀਟਲ ਏਕੀਕਰਨ ਰਾਹੀਂ 14 ਕਰੋੜ ਕਿਸਾਨਾਂ ਦੀ ਸੇਵਾ।", or: "ଉଚ୍ଚ-ସଠିକତା ଡିଜିଟାଲ୍ ଏକୀକରଣ ମାଧ୍ୟମରେ 14 କୋଟି କୃଷକଙ୍କୁ ସେବା।", as: "উচ্চ-নিখুঁত ডিজিটেল একত্ৰীকৰণৰ যোগে 14 কোটি কৃষকক সেৱা।", ur: "اعلیٰ درستگی والے ڈیجیٹل انضمام کے ذریعے 14 کروڑ کسانوں کی خدمت۔" },
  "hero.cta.schemes":{ en: "Find Direct Schemes", hi: "योजनाएं खोजें", bn: "প্রকল্প খুঁজুন", te: "పథకాలు కనుగొనండి", mr: "योजना शोधा", ta: "திட்டங்களைக் கண்டறி", gu: "યોજનાઓ શોધો", kn: "ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ", ml: "പദ്ധതികൾ കണ്ടെത്തുക", pa: "ਯੋਜਨਾਵਾਂ ਲੱਭੋ", or: "ଯୋଜନା ଖୋଜନ୍ତୁ", as: "আঁচনি বিচাৰক", ur: "اسکیمیں تلاش کریں" },
  "hero.cta.mandi":  { en: "Live Mandi Feed", hi: "लाइव मंडी फ़ीड", bn: "লাইভ মান্ডি ফিড", te: "లైవ్ మండి ఫీడ్", mr: "थेट मंडी फीड", ta: "நேரடி சந்தை", gu: "લાઇવ મંડી ફીડ", kn: "ಲೈವ್ ಮಂಡಿ ಫೀಡ್", ml: "ലൈവ് മണ്ഡി ഫീഡ്", pa: "ਲਾਈਵ ਮੰਡੀ ਫੀਡ", or: "ଲାଇଭ୍ ମଣ୍ଡି", as: "জীৱন্ত মাণ্ডি", ur: "لائیو منڈی فیڈ" },
  "lang.select":     { en: "Select Language", hi: "भाषा चुनें", bn: "ভাষা নির্বাচন", te: "భాష ఎంచుకోండి", mr: "भाषा निवडा", ta: "மொழியைத் தேர்வுசெய்", gu: "ભાષા પસંદ કરો", kn: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", ml: "ഭാഷ തിരഞ്ഞെടുക്കുക", pa: "ਭਾਸ਼ਾ ਚੁਣੋ", or: "ଭାଷା ବାଛନ୍ତୁ", as: "ভাষা বাছনি কৰক", ur: "زبان منتخب کریں" },
};

export const t = (key: string, lang: LangCode): string => {
  const row = TRANSLATIONS[key];
  if (!row) return key;
  return row[lang] || row.en;
};