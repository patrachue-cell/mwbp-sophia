import Anthropic from '@anthropic-ai/sdk';
import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Message } from '@/types/chat';
import Constants from 'expo-constants';

const getApiKey = (): string => {
  const key =
    Constants.expoConfig?.extra?.anthropicApiKey ||
    process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ||
    '';
  return key;
};

export async function* streamPhilosopherResponse(
  philosopherId: PhilosopherId,
  conversationHistory: Message[],
  userMessage: string,
): AsyncGenerator<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(
      'Anthropic API 키가 설정되지 않았습니다. .env 파일에 EXPO_PUBLIC_ANTHROPIC_API_KEY를 설정해주세요.',
    );
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  const philosopher = PHILOSOPHERS[philosopherId];

  const messages: Anthropic.MessageParam[] = conversationHistory
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

  messages.push({ role: 'user', content: userMessage });

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: philosopher.systemPrompt,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}
