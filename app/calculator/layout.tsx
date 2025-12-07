import type { Metadata } from "next";
import { calculatorMetadata } from "../metadata";

export const metadata: Metadata = calculatorMetadata;

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

