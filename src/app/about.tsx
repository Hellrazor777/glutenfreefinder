import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { MaxContentWidth, Spacing } from '@/constants/theme'

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">About</ThemedText>
        <ThemedText>
          GFF is independent of Woolworths. This Expo Router screen exists so
          navigation emits a separate PostHog pageview from Home.
        </ThemedText>
        <Link href="/">
          <ThemedText type="link">Back to home</ThemedText>
        </Link>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.three,
  },
})
