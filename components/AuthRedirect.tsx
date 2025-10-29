"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectUrl?: string;
  mode?: "signIn" | "signUp";
}

export default function AuthRedirect({
  children,
  redirectUrl = "/calculator",
  mode = "signIn",
}: AuthRedirectProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return <>{children}</>;
  }

  if (mode === "signUp") {
    return (
      <SignUpButton
        mode="modal"
        forceRedirectUrl={redirectUrl}
        signInForceRedirectUrl={redirectUrl}
      >
        {children}
      </SignUpButton>
    );
  }

  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    >
      {children}
    </SignInButton>
  );
}
