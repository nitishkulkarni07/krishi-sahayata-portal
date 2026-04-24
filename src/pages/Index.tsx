import { UtilityBar } from "@/components/agri/UtilityBar";
import { SiteHeader } from "@/components/agri/SiteHeader";
import { Hero } from "@/components/agri/Hero";
import { NewsTicker } from "@/components/agri/NewsTicker";
import { Modules } from "@/components/agri/Modules";
import { Stats } from "@/components/agri/Stats";
import { SiteFooter } from "@/components/agri/SiteFooter";

const Index = () => {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Department of Agriculture & Farmers Welfare",
    alternateName: "कृषि एवं किसान कल्याण विभाग",
    parentOrganization: "Ministry of Agriculture & Farmers Welfare, Government of India",
    url: "/",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Krishi Bhawan, Dr. Rajendra Prasad Road",
      addressLocality: "New Delhi",
      postalCode: "110001",
      addressCountry: "IN",
    },
    telephone: "1800-180-1551",
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <UtilityBar />
      <SiteHeader />
      <main id="main">
        <Hero />
        <NewsTicker />
        <Stats />
        <Modules />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
