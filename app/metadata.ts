import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mydebtsnowball.com";

export const homeMetadata: Metadata = {
  title:
    "My Debt Snowball - Free Debt Payoff Tool | Free Debt Calculator",
  description:
    "Free Debt Snowball Method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress, see your debt-free date, and achieve financial freedom.",
  openGraph: {
    title: "My Debt Snowball - Free Debt Payoff Tool",
    description:
      "Free Debt Snowball Method calculator. Calculate your debt payoff strategy and get out of debt faster.",
    url: siteUrl,
    siteName: "My Debt Snowball",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "My Debt Snowball - Free Debt Payoff Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const calculatorMetadata: Metadata = {
  title: "My Debt Snowball - Create Your Debt Payoff Plan",
  description:
    "Use our free debt snowball calculator to create a personalized debt payoff plan. Enter your debts, see your payment schedule, and discover when you'll be debt-free using the Debt Snowball Method.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "My Debt Snowball - Create Your Debt Payoff Plan",
    description:
      "Use our free debt snowball calculator to create a personalized debt payoff plan using the Debt Snowball Method.",
    url: `${siteUrl}/calculator`,
    siteName: "My Debt Snowball",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "Debt Snowball Calculator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/calculator`,
  },
};

export const howItWorksMetadata: Metadata = {
  title:
    "How the Debt Snowball Method Works - Debt Snowball Debt Payoff Strategy",
  description:
    "Learn how the Debt Snowball Method works. Understand the psychology behind paying off debt from smallest to largest, and see step-by-step how to implement this proven debt payoff strategy.",
  openGraph: {
    title:
      "How the Debt Snowball Method Works - Debt Snowball Debt Payoff Strategy",
    description:
      "Learn how the Debt Snowball Method works and how to implement this proven debt payoff strategy.",
    url: `${siteUrl}/how-it-works`,
    siteName: "My Debt Snowball",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "How the Debt Snowball Method Works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/how-it-works`,
  },
};

export const termsOfServiceMetadata: Metadata = {
  title: "Terms of Service - My Debt Snowball",
  description:
    "Read the Terms of Service for the My Debt Snowball. Understand the terms and conditions for using our free debt payoff calculator.",
  openGraph: {
    title: "Terms of Service - My Debt Snowball",
    description:
      "Read the Terms of Service for the My Debt Snowball.",
    url: `${siteUrl}/terms-of-service`,
    siteName: "My Debt Snowball",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "Terms of Service",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/terms-of-service`,
  },
};

export const privacyPolicyMetadata: Metadata = {
  title: "Privacy Policy - My Debt Snowball",
  description:
    "Read the Privacy Policy for the My Debt Snowball. Learn how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy - My Debt Snowball",
    description:
      "Read the Privacy Policy for the My Debt Snowball.",
    url: `${siteUrl}/privacy-policy`,
    siteName: "My Debt Snowball",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};
