"use client";

import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface SignInRedirectProps {
  children: React.ReactNode;
  redirectUrl?: string;
}

export default function SignInRedirect({
  children,
  redirectUrl = "/calculator",
}: SignInRedirectProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(redirectUrl);
    }
  }, [isSignedIn, isLoaded, router, redirectUrl]);

  return (
    <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
      {children}
    </SignInButton>
  );
}
