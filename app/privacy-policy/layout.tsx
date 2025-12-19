import type { Metadata } from "next";
import { privacyPolicyMetadata } from "../metadata";

export const metadata: Metadata = privacyPolicyMetadata;

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

