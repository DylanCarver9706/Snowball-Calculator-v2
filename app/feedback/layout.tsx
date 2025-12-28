import type { Metadata } from "next";
import { feedbackMetadata } from "../metadata";

export const metadata: Metadata = feedbackMetadata;

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
