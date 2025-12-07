import { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://daveramseysnowball.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/how-it-works"],
        disallow: ["/api/", "/calculator"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
