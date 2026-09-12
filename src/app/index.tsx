import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { MaxContentWidth, Spacing } from '@/constants/theme'

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small">GFF — Gluten Free Finder</ThemedText>
        <ThemedText type="title" style={styles.title}>
          Find that mud cake before it disappears.
        </ThemedText>
        <ThemedText>
          PostHog records unique visitors and pageviews for production web
          traffic. Open About to fire a second `$pageview`.
        </ThemedText>
        <Link href="/about">
          <ThemedText type="link">About Gluten Free Finder</ThemedText>
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
  title: {
    textAlign: 'left',
  },
})
