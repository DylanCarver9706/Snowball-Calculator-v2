import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { CssBaseline } from "@mui/material";
import PostHogProvider from "@/components/PostHogProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeRegistry from "@/components/ThemeRegistry";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mydebtsnowball.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "My Debt Snowball - Free Debt Payoff Tool | Free Debt Calculator",
    template: "%s | My Debt Snowball",
  },
  description:
    "Free Snowball Method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress, see your debt-free date, and achieve financial freedom.",
  keywords: [
    "debt payoff calculator",
    "snowball method calculator",
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
  authors: [{ name: "My Debt Snowball" }],
  creator: "My Debt Snowball",
  publisher: "My Debt Snowball",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/icon.PNG", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "My Debt Snowball",
    title: "My Debt Snowball - Free Debt Payoff Tool",
    description:
      "Free Debt Snowball Method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress and achieve financial freedom.",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "My Debt Snowball - Free Debt Payoff Tool",
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
              <Footer />
            </PostHogProvider>
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
