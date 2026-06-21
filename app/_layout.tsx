import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';
import { requestPermissions, scheduleDailyCheckIn, isNotificationScheduled } from '@/services/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync().catch(() => {});

const FIRST_LAUNCH_KEY = '@sophia:first_launch';

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
    initNotifications();
  }, []);

  async function initNotifications() {
    try {
      const isFirst = !(await AsyncStorage.getItem(FIRST_LAUNCH_KEY));
      if (isFirst) {
        await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'done');
        const granted = await requestPermissions();
        if (granted) {
          await scheduleDailyCheckIn(21, 0); // 기본 오후 9시
        }
      } else {
        // 앱 재실행 시 알림이 취소됐으면 재등록
        const scheduled = await isNotificationScheduled();
        if (!scheduled) {
          const granted = await requestPermissions();
          if (granted) await scheduleDailyCheckIn(21, 0);
        }
      }
    } catch {}
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text.primary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* 탭 그룹 */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* 철학자 채팅 */}
        <Stack.Screen
          name="chat/[philosopherId]"
          options={{ headerBackTitle: '홈', title: '' }}
        />
      </Stack>
    </>
  );
}
