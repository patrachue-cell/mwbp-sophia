import { Redirect } from 'expo-router';

// 루트 인덱스를 탭으로 리다이렉트
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
