import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { PostHogProvider } from 'posthog-react-native'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

import { posthog } from '@/config/posthog'
import { usePostHogPageviews } from '@/hooks/use-posthog-pageviews'

SplashScreen.preventAutoHideAsync()

function PostHogRouteTracker() {
  usePostHogPageviews()
  return null
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    void SplashScreen.hideAsync()
  }, [])

  return (
    <PostHogProvider
      client={posthog}
      debug={__DEV__}
      autocapture={{
        // Expo Router cannot use automatic screen capture; we track pathnames.
        captureScreens: false,
        captureTouches: true,
      }}>
      <PostHogRouteTracker />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerTitle: 'Gluten Free Finder',
          }}>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
        </Stack>
      </ThemeProvider>
    </PostHogProvider>
  )
}
