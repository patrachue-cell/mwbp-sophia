import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PhilosopherCard from '@/components/PhilosopherCard';
import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

const PHILOSOPHER_IDS: PhilosopherId[] = ['socrates', 'plato', 'aristotle'];

const DAILY_QUOTES = [
  { text: '너 자신을 알라', author: '소크라테스' },
  { text: '이데아를 향해 나아가라', author: '플라톤' },
  { text: '덕은 중용에 있다', author: '아리스토텔레스' },
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
      <LinearGradient colors={['#EDE8FA', '#F5F0FF']} style={styles.header}>
        <View style={styles.sophiaRow}>
          <View style={styles.sophiaAvatarWrapper}>
            <Image source={require('@/assets/sophia.jpeg')} style={styles.sophiaImage} resizeMode="cover" />
          </View>
          <View style={styles.sophiaTitleBox}>
            <Text style={styles.appLabel}>MWBP via IT</Text>
            <Text style={styles.appName}>Sophia</Text>
            <Text style={styles.appSubtitle}>고대 철학자와 함께하는{'\n'}사유의 공간</Text>
          </View>
        </View>
        <View style={styles.quoteCard}>
          <Text style={styles.quoteOpen}>"</Text>
          <Text style={styles.quoteText}>{quote.text}</Text>
          <Text style={styles.quoteClose}>"</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>철학자를 선택하세요</Text>
        <Text style={styles.sectionSubtitle}>당신의 고민을 고대 철학자의 지혜로 탐구해보세요</Text>
        <View style={styles.cardGrid}>
          {PHILOSOPHER_IDS.map((id) => (
            <PhilosopherCard key={id} philosopher={PHILOSOPHERS[id]} onPress={() => handleSelectPhilosopher(id)} />
          ))}
        </View>
        <View style={styles.howSection}>
          <Text style={styles.howTitle}>어떻게 사용하나요?</Text>
          {[
            { icon: '💭', text: '일상의 고민이나 질문을 자유롭게 입력하세요' },
            { icon: '🏛️', text: '철학자가 그들의 방식으로 함께 탐구합니다' },
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg, paddingTop: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sophiaRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: Spacing.md },
  sophiaAvatarWrapper: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', borderWidth: 3, borderColor: Colors.sophia, elevation: 8, shadowColor: Colors.sophia, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12 },
  sophiaImage: { width: 120, height: 120 },
  sophiaTitleBox: { flex: 1, paddingLeft: Spacing.md },
  appLabel: { fontSize: Typography.fontSizeXs, color: Colors.text.muted, letterSpacing: 2, fontWeight: '600', marginBottom: 2 },
  appName: { fontSize: 38, fontWeight: '800', color: Colors.sophia, letterSpacing: 1, lineHeight: 44 },
  appSubtitle: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary, marginTop: 4, lineHeight: 18 },
  quoteCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border, elevation: 2, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  quoteOpen: { fontSize: 28, color: Colors.sophia + '60', lineHeight: 24, marginBottom: -4, alignSelf: 'flex-start', fontStyle: 'italic' },
  quoteText: { fontSize: Typography.fontSizeMd, color: Colors.text.primary, textAlign: 'center', fontStyle: 'italic', lineHeight: 22, paddingHorizontal: Spacing.sm },
  quoteClose: { fontSize: 28, color: Colors.sophia + '60', lineHeight: 24, marginTop: -4, alignSelf: 'flex-end', fontStyle: 'italic' },
  quoteAuthor: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary, marginTop: Spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.sm, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: Typography.fontSizeXl, fontWeight: '700', color: Colors.text.primary, marginBottom: 4, paddingHorizontal: Spacing.sm },
  sectionSubtitle: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary, marginBottom: Spacing.lg, paddingHorizontal: Spacing.sm },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.lg },
  howSection: { backgroundColor: Colors.surface, borderRadius: 20, padding: Spacing.lg, marginHorizontal: Spacing.sm, borderWidth: 1, borderColor: Colors.border, elevation: 2, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  howTitle: { fontSize: Typography.fontSizeLg, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.md },
  howItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.md, gap: Spacing.md },
  howIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  howText: { flex: 1, fontSize: Typography.fontSizeSm, color: Colors.text.secondary, lineHeight: 20 },
});
