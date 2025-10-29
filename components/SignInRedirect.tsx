"use client";

import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

interface SignInRedirectProps {
  children: React.ReactNode;
  redirectUrl?: string;
}

export default function SignInRedirect({
  children,
  redirectUrl = "/calculator",
}: SignInRedirectProps) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <>
      {isLoaded && isSignedIn ? (
        children
      ) : (
        <SignInButton mode="modal" forceRedirectUrl={redirectUrl}>
          {children}
        </SignInButton>
      )}
    </>
  );
}
