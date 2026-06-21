import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, ScrollView, Switch, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadAllSummaries, ConversationSummary, groupSummariesByDate, loadAllCheckIns, DailyCheckIn,
} from '@/services/summary';
import {
  scheduleDailyCheckIn, cancelDailyCheckIn, getSavedNotificationTime,
  isNotificationScheduled, requestPermissions, NotificationTime,
} from '@/services/notifications';
import { getAllStats } from '@/services/knowledge';
import { Colors, Spacing, Typography } from '@/constants/theme';

const PHILOSOPHER_IMAGES: Record<string, any> = {
  socrates: require('@/assets/socrates.png'),
  plato: require('@/assets/plato.png'),
  aristotle: require('@/assets/aristotle.png'),
};
const PHILOSOPHER_NAMES: Record<string, string> = {
  socrates: '소크라테스', plato: '플라톤', aristotle: '아리스토텔레스',
};
const PHILOSOPHER_COLORS: Record<string, string> = {
  socrates: Colors.socrates, plato: Colors.plato, aristotle: Colors.aristotle,
};
const EMOTION_EMOJI: Record<string, string> = {
  '불안': '😰', '성장': '🌱', '혼란': '😕', '평온': '😌', '용기': '💪',
  '슬픔': '😢', '희망': '🌟', '성찰': '🤔', '기쁨': '😊', '감사': '🙏',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return `${m}월 ${d}일 (${days[date.getDay()]})`;
}

function SummaryCard({ item, onPress }: { item: ConversationSummary; onPress: () => void }) {
  const color = PHILOSOPHER_COLORS[item.philosopherId] || Colors.sophia;
  const emoji = EMOTION_EMOJI[item.emotion] || '💬';
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardAvatarWrap, { borderColor: color }]}>
          <Image source={PHILOSOPHER_IMAGES[item.philosopherId]} style={styles.cardAvatar} resizeMode="cover" />
        </View>
        <View style={styles.cardMeta}>
          <Text style={[styles.cardPhilosopher, { color }]}>{PHILOSOPHER_NAMES[item.philosopherId]}</Text>
          <View style={styles.emotionRow}>
            <Text style={styles.emotionEmoji}>{emoji}</Text>
            <Text style={styles.emotionText}>{item.emotion}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardSummary} numberOfLines={3}>{item.summary}</Text>
      {item.wisdoms.length > 0 && (
        <View style={[styles.wisdomBadge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.wisdomText, { color }]}>✨ {item.wisdoms[0]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function CheckInCard({ item }: { item: DailyCheckIn }) {
  const emoji = EMOTION_EMOJI[item.emotion] || '💬';
  return (
    <View style={[styles.card, { borderLeftColor: Colors.sophia }]}>
      <View style={styles.cardHeader}>
        <Image source={require('@/assets/sophia.jpeg')} style={[styles.cardAvatar, { borderRadius: 18, borderWidth: 2, borderColor: Colors.sophia }]} resizeMode="cover" />
        <View style={[styles.cardMeta, { marginLeft: Spacing.sm }]}>
          <Text style={[styles.cardPhilosopher, { color: Colors.sophia }]}>Sophia · 멘탈 체크</Text>
          <View style={styles.emotionRow}>
            <Text style={styles.emotionEmoji}>{emoji}</Text>
            <Text style={styles.emotionText}>{item.emotion}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardSummary} numberOfLines={3}>{item.summary}</Text>
    </View>
  );
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const [summaries, setSummaries] = useState<ConversationSummary[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [grouped, setGrouped] = useState<Record<string, { summaries: ConversationSummary[]; checkIn?: DailyCheckIn }>>({});
  const [selectedSummary, setSelectedSummary] = useState<ConversationSummary | null>(null);
  const [totalConvs, setTotalConvs] = useState(0);
  const [topPhilosopher, setTopPhilosopher] = useState('');

  // 알림 설정
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState<NotificationTime>({ hour: 21, minute: 0 });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
      loadNotifSettings();
    }, [])
  );

  async function loadData() {
    const [s, c, stats] = await Promise.all([loadAllSummaries(), loadAllCheckIns(), getAllStats()]);
    setSummaries(s);
    setCheckIns(c);

    const dates = new Set([...s.map(x => x.date), ...c.map(x => x.date)]);
    const g: typeof grouped = {};
    for (const date of dates) {
      g[date] = {
        summaries: s.filter(x => x.date === date),
        checkIn: c.find(x => x.date === date),
      };
    }
    setGrouped(g);

    if (stats.length > 0) {
      const total = stats.reduce((a, b) => a + b.totalMessages, 0);
      setTotalConvs(total);
      const top = stats.sort((a, b) => b.totalMessages - a.totalMessages)[0];
      if (top) setTopPhilosopher(PHILOSOPHER_NAMES[top.philosopherId] || '');
    }
  }

  async function loadNotifSettings() {
    const [scheduled, time] = await Promise.all([isNotificationScheduled(), getSavedNotificationTime()]);
    setNotifEnabled(scheduled);
    setNotifTime(time);
  }

  async function toggleNotification(val: boolean) {
    if (val) {
      const granted = await requestPermissions();
      if (!granted) return;
      await scheduleDailyCheckIn(notifTime.hour, notifTime.minute);
    } else {
      await cancelDailyCheckIn();
    }
    setNotifEnabled(val);
  }

  async function saveNotifTime(h: number, m: number) {
    setNotifTime({ hour: h, minute: m });
    if (notifEnabled) {
      await scheduleDailyCheckIn(h, m);
    }
    setShowTimePicker(false);
  }

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>나의 기록</Text>
        <Text style={styles.headerSub}>철학자와 나눈 지혜의 여정</Text>
      </View>

      {/* 통계 */}
      {totalConvs > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalConvs}</Text>
            <Text style={styles.statLabel}>총 메시지</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{summaries.length}</Text>
            <Text style={styles.statLabel}>저장된 대화</Text>
          </View>
          {topPhilosopher !== '' && (
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { fontSize: 13 }]}>{topPhilosopher}</Text>
              <Text style={styles.statLabel}>자주 만난 철학자</Text>
            </View>
          )}
        </View>
      )}

      {/* 알림 설정 */}
      <View style={styles.notifCard}>
        <View style={styles.notifRow}>
          <Ionicons name="notifications-outline" size={20} color={Colors.sophia} />
          <Text style={styles.notifTitle}>매일 Sophia 안부 알림</Text>
          <Switch
            value={notifEnabled}
            onValueChange={toggleNotification}
            trackColor={{ true: Colors.sophia, false: Colors.border }}
            thumbColor={notifEnabled ? '#fff' : Colors.text.muted}
          />
        </View>
        {notifEnabled && (
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeButton}>
            <Ionicons name="time-outline" size={16} color={Colors.sophia} />
            <Text style={[styles.timeText, { color: Colors.sophia }]}>
              매일 {String(notifTime.hour).padStart(2, '0')}:{String(notifTime.minute).padStart(2, '0')} 알림
            </Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.sophia} />
          </TouchableOpacity>
        )}
      </View>

      {/* 기록 목록 */}
      {sortedDates.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyTitle}>아직 기록이 없어요</Text>
          <Text style={styles.emptySub}>철학자와 대화를 나눠보세요{'\n'}대화가 끝나면 지혜를 요약해 드려요</Text>
        </View>
      ) : (
        <FlatList
          data={sortedDates}
          keyExtractor={d => d}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: date }) => {
            const group = grouped[date];
            return (
              <View>
                <Text style={styles.dateLabel}>{formatDate(date)}</Text>
                {group.checkIn && <CheckInCard item={group.checkIn} />}
                {group.summaries.map(s => (
                  <SummaryCard key={s.id} item={s} onPress={() => setSelectedSummary(s)} />
                ))}
              </View>
            );
          }}
        />
      )}

      {/* 시간 선택 모달 */}
      <Modal visible={showTimePicker} transparent animationType="slide" onRequestClose={() => setShowTimePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>알림 시간 설정</Text>
            <View style={styles.timeGrid}>
              {[7, 8, 9, 12, 18, 20, 21, 22].map(h => (
                <TouchableOpacity
                  key={h}
                  style={[styles.timeChip, notifTime.hour === h && { backgroundColor: Colors.sophia }]}
                  onPress={() => saveNotifTime(h, 0)}
                >
                  <Text style={[styles.timeChipText, notifTime.hour === h && { color: '#fff' }]}>
                    {h < 12 ? `오전 ${h}시` : h === 12 ? '정오' : `오후 ${h - 12}시`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowTimePicker(false)}>
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 상세 모달 */}
      <Modal visible={!!selectedSummary} transparent animationType="fade" onRequestClose={() => setSelectedSummary(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailBox}>
            {selectedSummary && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailHeader}>
                  <Image source={PHILOSOPHER_IMAGES[selectedSummary.philosopherId]} style={styles.detailAvatar} resizeMode="cover" />
                  <View>
                    <Text style={[styles.detailPhilosopher, { color: PHILOSOPHER_COLORS[selectedSummary.philosopherId] }]}>
                      {PHILOSOPHER_NAMES[selectedSummary.philosopherId]}
                    </Text>
                    <Text style={styles.detailDate}>{formatDate(selectedSummary.date)}</Text>
                  </View>
                </View>
                <Text style={styles.detailSectionLabel}>대화 요약</Text>
                <Text style={styles.detailSummary}>{selectedSummary.summary}</Text>
                {selectedSummary.wisdoms.length > 0 && (
                  <>
                    <Text style={styles.detailSectionLabel}>✨ 얻은 지혜</Text>
                    {selectedSummary.wisdoms.map((w, i) => (
                      <View key={i} style={[styles.wisdomItem, { borderColor: PHILOSOPHER_COLORS[selectedSummary.philosopherId] + '50' }]}>
                        <Text style={styles.wisdomItemText}>{w}</Text>
                      </View>
                    ))}
                  </>
                )}
                <View style={styles.emotionRow}>
                  <Text style={styles.detailEmotionLabel}>오늘의 감정</Text>
                  <Text style={styles.detailEmotion}>{EMOTION_EMOJI[selectedSummary.emotion] || '💬'} {selectedSummary.emotion}</Text>
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={[styles.modalClose, { backgroundColor: Colors.sophia }]} onPress={() => setSelectedSummary(null)}>
              <Text style={[styles.modalCloseText, { color: '#fff' }]}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: Typography.fontSizeXxl, fontWeight: '800', color: Colors.text.primary },
  headerSub: { fontSize: Typography.fontSizeSm, color: Colors.text.muted, marginTop: 2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface, gap: Spacing.sm },
  statBox: { flex: 1, alignItems: 'center', backgroundColor: Colors.surfaceElevated, borderRadius: 12, padding: Spacing.sm },
  statNum: { fontSize: Typography.fontSizeLg, fontWeight: '800', color: Colors.sophia },
  statLabel: { fontSize: 10, color: Colors.text.muted, marginTop: 2, textAlign: 'center' },
  notifCard: { margin: Spacing.md, backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, elevation: 2, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
  notifRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifTitle: { flex: 1, fontSize: Typography.fontSizeMd, fontWeight: '600', color: Colors.text.primary },
  timeButton: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.sm, gap: 4, paddingLeft: 28 },
  timeText: { fontSize: Typography.fontSizeSm, flex: 1 },
  list: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
  dateLabel: { fontSize: Typography.fontSizeSm, fontWeight: '700', color: Colors.text.muted, marginTop: Spacing.md, marginBottom: Spacing.xs },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md, marginBottom: Spacing.sm, borderLeftWidth: 4, elevation: 2, shadowColor: Colors.cardShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  cardAvatarWrap: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden', borderWidth: 2 },
  cardAvatar: { width: 36, height: 36 },
  cardMeta: { flex: 1 },
  cardPhilosopher: { fontSize: Typography.fontSizeSm, fontWeight: '700' },
  emotionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  emotionEmoji: { fontSize: 14 },
  emotionText: { fontSize: Typography.fontSizeXs, color: Colors.text.muted },
  cardSummary: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary, lineHeight: 20 },
  wisdomBadge: { marginTop: Spacing.sm, borderRadius: 8, padding: Spacing.xs + 2 },
  wisdomText: { fontSize: Typography.fontSizeXs, fontWeight: '600', lineHeight: 18 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: Typography.fontSizeLg, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.sm },
  emptySub: { fontSize: Typography.fontSizeSm, color: Colors.text.muted, textAlign: 'center', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg },
  modalTitle: { fontSize: Typography.fontSizeLg, fontWeight: '700', color: Colors.text.primary, marginBottom: Spacing.md },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  timeChip: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surfaceElevated, borderRadius: 20 },
  timeChipText: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary, fontWeight: '600' },
  modalClose: { backgroundColor: Colors.surfaceElevated, borderRadius: 14, padding: Spacing.md, alignItems: 'center' },
  modalCloseText: { fontSize: Typography.fontSizeMd, fontWeight: '600', color: Colors.text.secondary },
  detailBox: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, maxHeight: '80%' },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  detailAvatar: { width: 52, height: 52, borderRadius: 26 },
  detailPhilosopher: { fontSize: Typography.fontSizeLg, fontWeight: '800' },
  detailDate: { fontSize: Typography.fontSizeSm, color: Colors.text.muted, marginTop: 2 },
  detailSectionLabel: { fontSize: Typography.fontSizeSm, fontWeight: '700', color: Colors.text.muted, marginBottom: Spacing.sm, marginTop: Spacing.md },
  detailSummary: { fontSize: Typography.fontSizeMd, color: Colors.text.primary, lineHeight: 24 },
  wisdomItem: { borderWidth: 1, borderRadius: 12, padding: Spacing.sm + 2, marginBottom: Spacing.sm },
  wisdomItemText: { fontSize: Typography.fontSizeMd, color: Colors.text.primary, lineHeight: 22, fontStyle: 'italic' },
  detailEmotionLabel: { fontSize: Typography.fontSizeSm, color: Colors.text.muted, marginRight: Spacing.sm },
  detailEmotion: { fontSize: Typography.fontSizeMd, color: Colors.text.primary, fontWeight: '600' },
});
