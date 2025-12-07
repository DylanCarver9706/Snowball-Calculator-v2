import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CssBaseline } from "@mui/material";
import PostHogProvider from "@/components/PostHogProvider";
import Navbar from "@/components/Navbar";
import ThemeRegistry from "@/components/ThemeRegistry";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://daveramseysnowball.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool | Free Debt Calculator",
    template: "%s | Dave Ramsey Snowball Calculator",
  },
  description:
    "Free Dave Ramsey snowball method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress, see your debt-free date, and achieve financial freedom.",
  keywords: [
    "debt payoff calculator",
    "snowball method calculator",
    "Dave Ramsey calculator",
    "debt calculator",
    "debt payoff strategy",
    "snowball debt method",
    "debt free calculator",
    "financial freedom",
    "debt elimination",
    "debt payoff plan",
    "debt snowball",
    "pay off debt faster",
    "debt reduction calculator",
    "debt payoff schedule",
  ],
  authors: [{ name: "Dave Ramsey Snowball Calculator" }],
  creator: "Dave Ramsey Snowball Calculator",
  publisher: "Dave Ramsey Snowball Calculator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Dave Ramsey Snowball Calculator",
    title: "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool",
    description:
      "Free Dave Ramsey snowball method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress and achieve financial freedom.",
    images: [
      {
        url: `${siteUrl}/favicon.ico`,
        width: 1200,
        height: 630,
        alt: "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "/",
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeRegistry>
            <CssBaseline />
            <StructuredData type="WebApplication" />
            <PostHogProvider>
              <Navbar />
              <main className="min-h-screen">{children}</main>
            </PostHogProvider>
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
