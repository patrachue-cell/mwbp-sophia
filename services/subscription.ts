import AsyncStorage from '@react-native-async-storage/async-storage';

// 결제 기능 활성화 플래그 — true로 바꾸면 구독 게이트 및 결제 화면이 활성화됨
export const PAYMENT_ENABLED = false;

const KEY = '@sophia:subscription';

export interface SubscriptionInfo {
  isPremium: boolean;
  orderId: string | null;
  paymentKey: string | null;
  purchasedAt: number | null;
  expiresAt: number | null; // ms timestamp
}

const DEFAULT: SubscriptionInfo = {
  isPremium: false,
  orderId: null,
  paymentKey: null,
  purchasedAt: null,
  expiresAt: null,
};

export async function getSubscription(): Promise<SubscriptionInfo> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT;
  try {
    const info: SubscriptionInfo = JSON.parse(raw);
    // 만료 체크
    if (info.expiresAt && Date.now() > info.expiresAt) {
      return { ...DEFAULT };
    }
    return info;
  } catch {
    return DEFAULT;
  }
}

export async function saveSubscription(info: SubscriptionInfo): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(info));
}

export async function clearSubscription(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export async function isPremiumUser(): Promise<boolean> {
  const info = await getSubscription();
  return info.isPremium;
}

// 결제 성공 후 호출 — 30일 구독 등록
export async function activateSubscription(orderId: string, paymentKey: string): Promise<void> {
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  await saveSubscription({
    isPremium: true,
    orderId,
    paymentKey,
    purchasedAt: now,
    expiresAt: now + THIRTY_DAYS,
  });
}
