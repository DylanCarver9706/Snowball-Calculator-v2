import type { Metadata } from "next";
import { howItWorksMetadata } from "../metadata";

export const metadata: Metadata = howItWorksMetadata;

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

