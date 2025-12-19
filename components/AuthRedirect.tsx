"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement, ReactElement } from "react";

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
  const router = useRouter();

  if (isLoaded && isSignedIn) {
    // If user is signed in, add navigation to the button
    if (isValidElement(children)) {
      const child = children as ReactElement<{
        onClick?: (e: React.MouseEvent) => void;
      }>;
      const existingOnClick = child.props.onClick;

      // Clone the element and add onClick handler to navigate
      return cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
          // Call original onClick if it exists
          if (existingOnClick) {
            existingOnClick(e);
          }
          // Navigate to the redirect URL
          router.push(redirectUrl);
        },
      } as Record<string, unknown>);
    }

    // Fallback: if not a valid element, wrap in a div with onClick
    return (
      <div
        onClick={() => router.push(redirectUrl)}
        style={{ display: "inline-block", cursor: "pointer" }}
      >
        {children}
      </div>
    );
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
