import { useEffect, useRef } from 'react'
import { useGlobalSearchParams, usePathname } from 'expo-router'
import { Platform } from 'react-native'

import { posthog } from '@/config/posthog'

/**
 * Records Expo Router navigations as `$screen` and `$pageview`.
 *
 * Automatic `captureScreens` is incompatible with Expo Router (React Navigation
 * v7). Track the URL instead, as recommended by Expo and PostHog.
 *
 * @see https://docs.expo.dev/router/reference/screen-tracking/
 * @see https://posthog.com/docs/libraries/react-native#with-expo-router
 */
export function usePostHogPageviews() {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  const previousPathname = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!pathname) {
      return
    }
    if (previousPathname.current === pathname) {
      return
    }

    const currentUrl =
      Platform.OS === 'web' && typeof window !== 'undefined'
        ? window.location.href
        : pathname

    posthog.screen(pathname, {
      $pathname: pathname,
      previous_screen: previousPathname.current ?? null,
    })

    posthog.capture('$pageview', {
      $current_url: currentUrl,
      $pathname: pathname,
    })

    void posthog.flush()
    previousPathname.current = pathname
  }, [pathname, params])
}
