import type { Metadata } from "next";
import { homeMetadata } from "./metadata";
import HomePageClient from "./HomePageClient";
import FAQStructuredData from "@/components/FAQStructuredData";

export const metadata: Metadata = homeMetadata;

export default function HomePage() {
  return (
    <>
      <FAQStructuredData />
      <HomePageClient />
    </>
  );
}
