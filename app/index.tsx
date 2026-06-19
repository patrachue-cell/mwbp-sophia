import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PhilosopherCard from '@/components/PhilosopherCard';
import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

const PHILOSOPHER_IDS: PhilosopherId[] = ['socrates', 'plato', 'aristotle'];

const DAILY_QUOTES = [
  { text: '"너 자신을 알라"', author: '소크라테스' },
  { text: '"이데아를 향해 나아가라"', author: '플라톤' },
  { text: '"덕은 중용에 있다"', author: '아리스토텔레스' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const quoteIdx = new Date().getDate() % DAILY_QUOTES.length;
  const quote = DAILY_QUOTES[quoteIdx];

  const handleSelectPhilosopher = (id: PhilosopherId) => {
    router.push(`/chat/${id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <LinearGradient
        colors={['#1a0a2e', '#0F0A1E']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appLabel}>MWBP via IT</Text>
          <Text style={styles.appName}>Sophia</Text>
          <Text style={styles.appSubtitle}>고대 철학자와 함께하는 사유의 공간</Text>
        </View>

        {/* Daily Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteDecoration}>"</Text>
          <Text style={styles.quoteText}>{quote.text.replace(/^"|"$/g, '')}</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>철학자를 선택하세요</Text>
        <Text style={styles.sectionSubtitle}>
          당신의 고민을 고대 철학자의 지혜로 탐구해보세요
        </Text>

        {/* Philosopher Cards */}
        <View style={styles.cardGrid}>
          {PHILOSOPHER_IDS.map((id) => (
            <PhilosopherCard
              key={id}
              philosopher={PHILOSOPHERS[id]}
              onPress={() => handleSelectPhilosopher(id)}
            />
          ))}
        </View>

        {/* How it works */}
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>어떻게 사용하나요?</Text>
          {[
            { icon: '💭', text: '일상의 고민이나 질문을 자유롭게 입력하세요' },
            { icon: '🦉', text: '철학자가 그들의 방식으로 함께 탐구합니다' },
            { icon: '✨', text: '스스로 답을 발견하는 과정을 경험하세요' },
          ].map((item, i) => (
            <View key={i} style={styles.howItem}>
              <Text style={styles.howIcon}>{item.icon}</Text>
              <Text style={styles.howText}>{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  appLabel: {
    fontSize: Typography.fontSizeXs,
    color: Colors.text.muted,
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 4,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: Typography.fontSizeSm,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  quoteCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quoteDecoration: {
    fontSize: 40,
    color: Colors.accent + '60',
    lineHeight: 36,
    marginBottom: -8,
  },
  quoteText: {
    fontSize: Typography.fontSizeMd,
    color: Colors.text.primary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: Typography.fontSizeSm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSizeXl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
    paddingHorizontal: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSizeSm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  howSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.lg,
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  howTitle: {
    fontSize: Typography.fontSizeLg,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  howItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  howIcon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  howText: {
    flex: 1,
    fontSize: Typography.fontSizeSm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});
