import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://daveramseysnowball.com";

export const homeMetadata: Metadata = {
  title:
    "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool | Free Debt Calculator",
  description:
    "Free Dave Ramsey snowball method calculator. Calculate your debt payoff strategy and get out of debt faster. Track your progress, see your debt-free date, and achieve financial freedom.",
  openGraph: {
    title: "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool",
    description:
      "Free Dave Ramsey snowball method calculator. Calculate your debt payoff strategy and get out of debt faster.",
    url: siteUrl,
    siteName: "Dave Ramsey Snowball Calculator",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "Dave Ramsey Snowball Calculator - Free Debt Payoff Tool",
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
  title: "Dave Ramsey Snowball Calculator - Create Your Debt Payoff Plan",
  description:
    "Use our free debt snowball calculator to create a personalized debt payoff plan. Enter your debts, see your payment schedule, and discover when you'll be debt-free using the Dave Ramsey snowball method.",
  openGraph: {
    title: "Dave Ramsey Snowball Calculator - Create Your Debt Payoff Plan",
    description:
      "Use our free debt snowball calculator to create a personalized debt payoff plan using the Dave Ramsey snowball method.",
    url: `${siteUrl}/calculator`,
    siteName: "Dave Ramsey Snowball Calculator",
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
    "How the Dave Ramsey Snowball Method Works - Dave Ramsey Debt Payoff Strategy",
  description:
    "Learn how the Dave Ramsey snowball method works. Understand the psychology behind paying off debt from smallest to largest, and see step-by-step how to implement this proven debt payoff strategy.",
  openGraph: {
    title:
      "How the Dave Ramsey Snowball Method Works - Dave Ramsey Debt Payoff Strategy",
    description:
      "Learn how the Dave Ramsey snowball method works and how to implement this proven debt payoff strategy.",
    url: `${siteUrl}/how-it-works`,
    siteName: "Dave Ramsey Snowball Calculator",
    images: [
      {
        url: `${siteUrl}/icon.PNG`,
        width: 634,
        height: 637,
        alt: "How the Dave Ramsey Snowball Method Works",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: `${siteUrl}/how-it-works`,
  },
};
