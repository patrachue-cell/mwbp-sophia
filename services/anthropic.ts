import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Message } from '@/types/chat';
import { Platform } from 'react-native';

function buildRequestBody(
  philosopherId: PhilosopherId,
  conversationHistory: Message[],
  userMessage: string,
) {
  const philosopher = PHILOSOPHERS[philosopherId];
  const messages = [
    ...conversationHistory
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];
  return {
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: philosopher.systemPrompt,
    messages,
  };
}

export async function* streamPhilosopherResponse(
  philosopherId: PhilosopherId,
  conversationHistory: Message[],
  userMessage: string,
): AsyncGenerator<string> {
  const body = buildRequestBody(philosopherId, conversationHistory, userMessage);

  let url: string;
  let headers: Record<string, string>;

  if (Platform.OS === 'web') {
    // 웹: 같은 오리진 API 라우트 (CORS 없음)
    url = '/api/chat';
    headers = { 'Content-Type': 'application/json' };
  } else {
    // 네이티브: Hyperspace 프록시 또는 Anthropic 직접 호출
    const baseUrl = process.env.EXPO_PUBLIC_ANTHROPIC_BASE_URL;
    const apiKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

    if (baseUrl) {
      url = `${baseUrl.replace(/\/$/, '')}/v1/messages`;
    } else {
      url = 'https://api.anthropic.com/v1/messages';
    }
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'Authorization': `Bearer ${apiKey}`,
      'anthropic-version': '2023-06-01',
    };
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (networkErr: any) {
    throw new Error(`네트워크 오류 - URL: ${url}\n${networkErr?.message}`);
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API 오류 (${response.status}) - URL: ${url}\n${errText}`);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? '';
  if (!text) throw new Error(`응답이 비어있습니다. URL: ${url}\n${JSON.stringify(data)}`);
  yield text;
}
