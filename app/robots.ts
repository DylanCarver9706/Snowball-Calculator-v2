import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mydebtsnowball.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/how-it-works",
          "/terms-of-service",
          "/privacy-policy",
          "/feedback",
        ],
        disallow: [
          "/api/",
          "/calculator",
          "/onboarding",
          "/sign-in",
          "/sign-up",
          "/manifest.json",
          "/favicon.ico",
          "/_next/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
