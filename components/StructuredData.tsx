import Script from "next/script";

interface StructuredDataProps {
  type?: "WebApplication" | "WebSite" | "Article" | "FAQPage";
  data?: Record<string, any>;
}

export default function StructuredData({
  type = "WebApplication",
  data,
}: StructuredDataProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://daveramseysnowball.com";

  const defaultData = {
    "@context": "https://schema.org",
    "@type": type,
    name: "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool",
    description:
      "Free Dave Ramsey snowball method calculator. Calculate your debt payoff strategy and get out of debt faster.",
    url: siteUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "54",
    },
  };

  const structuredData = data ? { ...defaultData, ...data } : defaultData;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
