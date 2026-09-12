import PostHog from 'posthog-react-native'
import Constants from 'expo-constants'
import { Platform } from 'react-native'

const DEFAULT_KEY = 'phc_uKBqegXYEqDn7M8qgcavMNkcRwxoqGVkhUeqXSHaqmJG'
const DEFAULT_HOST = 'https://us.i.posthog.com'

const extra = (Constants.expoConfig?.extra ?? {}) as {
  posthogKey?: string
  posthogHost?: string
}

export const posthogApiKey =
  process.env.EXPO_PUBLIC_POSTHOG_KEY || extra.posthogKey || DEFAULT_KEY

export const posthogHost =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || extra.posthogHost || DEFAULT_HOST

/**
 * Shared PostHog client for Expo (web + native).
 *
 * Session replay stays off. Distinct IDs persist via file/async-storage so
 * unique visitors are counted across page loads.
 *
 * @see https://posthog.com/docs/libraries/react-native
 */
export const posthog = new PostHog(posthogApiKey, {
  host: posthogHost,
  captureAppLifecycleEvents: true,
  enableSessionReplay: false,
  persistence: 'file',
  // Web traffic is low-volume; flush quickly so pageviews show up in PostHog.
  flushAt: Platform.OS === 'web' ? 1 : 20,
  flushInterval: Platform.OS === 'web' ? 2000 : 10000,
})
