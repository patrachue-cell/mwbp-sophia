import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { activateSubscription } from '@/services/subscription';

// 토스페이먼츠 테스트 클라이언트 키 (테스트용)
const TOSS_CLIENT_KEY = process.env.EXPO_PUBLIC_TOSS_CLIENT_KEY ?? 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const TOSS_SECRET_KEY = process.env.EXPO_PUBLIC_TOSS_SECRET_KEY ?? 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';

// 결제 승인 API — 실서비스는 반드시 서버에서 처리해야 함 (Secret Key 노출 위험)
// 현재는 테스트 환경 데모용으로 클라이언트에서 처리
async function confirmPayment(paymentKey: string, orderId: string, amount: number): Promise<boolean> {
  try {
    const encoded = btoa(`${TOSS_SECRET_KEY}:`);
    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encoded}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SOPHIA-${ts}-${rand}`;
}

// 토스페이먼츠 결제창 HTML (SDK v2)
function buildPaymentHtml(orderId: string, amount: number, successUrl: string, failUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script src="https://js.tosspayments.com/v2/standard"></script>
</head>
<body style="margin:0;background:#F5F0FF;">
  <script>
    const toss = TossPayments("${TOSS_CLIENT_KEY}");
    const payment = toss.payment({ customerKey: "sophia-guest-001" });
    payment.requestPayment({
      method: "CARD",
      amount: { currency: "KRW", value: ${amount} },
      orderId: "${orderId}",
      orderName: "Sophia 프리미엄 1개월",
      successUrl: "${successUrl}",
      failUrl: "${failUrl}",
    }).catch(function(err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "error", message: err.message }));
    });
  </script>
</body>
</html>`;
}

const AMOUNT = 4900;
const SUCCESS_URL = 'sophia://payment/success';
const FAIL_URL = 'sophia://payment/fail';

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const orderId = useRef(generateOrderId()).current;
  const html = buildPaymentHtml(orderId, AMOUNT, SUCCESS_URL, FAIL_URL);

  // Android에서 sophia:// 딥링크는 onNavigationStateChange가 아닌
  // onShouldStartLoadWithRequest에서 가로채야 함 (외부 앱 인텐트 방지)
  const handleShouldStartLoad = (request: { url: string }) => {
    const url = request.url;

    if (url.includes('payment/success')) {
      const normalized = url.startsWith('sophia://')
        ? url.replace('sophia://', 'https://sophia/')
        : url;
      try {
        const parsed = new URL(normalized);
        const paymentKey = parsed.searchParams.get('paymentKey') ?? '';
        const returnedOrderId = parsed.searchParams.get('orderId') ?? orderId;
        const amount = parseInt(parsed.searchParams.get('amount') ?? String(AMOUNT), 10);
        handleSuccess(paymentKey, returnedOrderId, amount);
      } catch {
        handleSuccess('', orderId, AMOUNT);
      }
      return false; // WebView가 해당 URL 로드하지 않도록 차단
    }

    if (url.includes('payment/fail')) {
      const normalized = url.startsWith('sophia://')
        ? url.replace('sophia://', 'https://sophia/')
        : url;
      try {
        const parsed = new URL(normalized);
        const message = parsed.searchParams.get('message') ?? '결제가 취소됐어요.';
        Alert.alert('결제 취소', message, [{ text: '돌아가기', onPress: () => router.back() }]);
      } catch {
        Alert.alert('결제 취소', '결제가 취소됐어요.', [{ text: '돌아가기', onPress: () => router.back() }]);
      }
      return false;
    }

    return true;
  };

  const handleSuccess = async (paymentKey: string, returnedOrderId: string, amount: number) => {
    setConfirming(true);
    const ok = await confirmPayment(paymentKey, returnedOrderId, amount);
    setConfirming(false);

    if (ok) {
      await activateSubscription(returnedOrderId, paymentKey);
      Alert.alert(
        '구독 완료 ✨',
        'Sophia 프리미엄 1개월 구독이 시작됐어요!\n모든 기능을 무제한으로 사용하세요.',
        [{ text: '시작하기', onPress: () => router.replace('/(tabs)/sophia') }],
      );
    } else {
      Alert.alert('결제 실패', '결제 승인 중 오류가 발생했어요. 다시 시도해주세요.', [
        { text: '돌아가기', onPress: () => router.back() },
      ]);
    }
  };

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'error') {
        Alert.alert('결제 오류', data.message ?? '결제 중 오류가 발생했어요.', [
          { text: '돌아가기', onPress: () => router.back() },
        ]);
      }
    } catch {}
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>구독 결제</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 구독 정보 배너 */}
      <View style={styles.infoBanner}>
        <Text style={styles.bannerTitle}>✨ Sophia 프리미엄</Text>
        <Text style={styles.bannerPrice}>월 4,900원</Text>
        <Text style={styles.bannerDesc}>무제한 대화 · 감정 분석 · 지혜 카드 저장</Text>
      </View>

      {/* 결제 WebView */}
      <View style={styles.webviewWrapper}>
        {(loading || confirming) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.sophia} />
            <Text style={styles.loadingText}>
              {confirming ? '결제 승인 중...' : '결제창 로딩 중...'}
            </Text>
          </View>
        )}
        <WebView
          source={{ html, baseUrl: 'https://sophia.app' }}
          style={styles.webview}
          onLoadEnd={() => setLoading(false)}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onMessage={handleMessage}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: Typography.fontSizeLg, fontWeight: '700', color: Colors.text.primary },
  infoBanner: {
    backgroundColor: Colors.sophia,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  bannerTitle: { fontSize: Typography.fontSizeLg, fontWeight: '700', color: '#fff', marginBottom: 2 },
  bannerPrice: { fontSize: Typography.fontSizeXxl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  bannerDesc: { fontSize: Typography.fontSizeSm, color: '#E9D5FF', textAlign: 'center' },
  webviewWrapper: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: Spacing.md,
  },
  loadingText: { fontSize: Typography.fontSizeSm, color: Colors.text.secondary },
});
