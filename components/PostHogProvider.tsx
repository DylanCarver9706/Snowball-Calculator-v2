'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize PostHog
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST as string,
      loaded: (posthog) => {
        if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('test')) posthog.debug()
      }
    })
  }, [])

  return <>{children}</>
}
