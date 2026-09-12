import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { colors } from "../src/lib/constants";
import { posthog } from "../src/lib/posthog";
import { usePostHogPageviews } from "../src/lib/use-posthog-pageviews";

function PostHogRouteTracker() {
  usePostHogPageviews();
  return null;
}

export default function RootLayout() {
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        // Expo Router cannot use automatic screen capture; we track pathnames.
        captureScreens: false,
        captureTouches: true,
      }}
    >
      <PostHogRouteTracker />
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.parchment },
          }}
        />
      </SafeAreaProvider>
    </PostHogProvider>
  );
}
