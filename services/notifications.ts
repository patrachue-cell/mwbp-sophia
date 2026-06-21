import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_ID_KEY = '@sophia:notification_id';
const NOTIF_TIME_KEY = '@sophia:notification_time';

// 포그라운드 알림 표시 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationTime {
  hour: number;
  minute: number;
}

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleDailyCheckIn(hour = 21, minute = 0): Promise<void> {
  try {
    if (Platform.OS === 'web') return;

    // 기존 알림 취소
    await cancelDailyCheckIn();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Sophia가 안부를 전합니다',
        body: '오늘 하루는 어떠셨나요? 잠깐 함께 이야기 나눠봐요.',
        sound: true,
        data: { screen: 'sophia' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    await AsyncStorage.setItem(NOTIF_ID_KEY, id);
    await AsyncStorage.setItem(NOTIF_TIME_KEY, JSON.stringify({ hour, minute }));
  } catch (e) {
    console.warn('[Notifications] 스케줄 실패:', e);
  }
}

export async function cancelDailyCheckIn(): Promise<void> {
  try {
    const id = await AsyncStorage.getItem(NOTIF_ID_KEY);
    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await AsyncStorage.removeItem(NOTIF_ID_KEY);
    }
  } catch {}
}

export async function getSavedNotificationTime(): Promise<NotificationTime> {
  try {
    const raw = await AsyncStorage.getItem(NOTIF_TIME_KEY);
    return raw ? JSON.parse(raw) : { hour: 21, minute: 0 };
  } catch {
    return { hour: 21, minute: 0 };
  }
}

export async function isNotificationScheduled(): Promise<boolean> {
  try {
    const id = await AsyncStorage.getItem(NOTIF_ID_KEY);
    if (!id) return false;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    return scheduled.some(n => n.identifier === id);
  } catch {
    return false;
  }
}
