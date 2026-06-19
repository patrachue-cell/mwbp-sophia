import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation } from '@/types/chat';

const CONVERSATIONS_KEY = 'sophia_conversations';

export async function saveConversation(conversation: Conversation): Promise<void> {
  const all = await loadAllConversations();
  const idx = all.findIndex((c) => c.id === conversation.id);
  if (idx >= 0) {
    all[idx] = conversation;
  } else {
    all.unshift(conversation);
  }
  await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
}

export async function loadAllConversations(): Promise<Conversation[]> {
  const raw = await AsyncStorage.getItem(CONVERSATIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

export async function deleteConversation(id: string): Promise<void> {
  const all = await loadAllConversations();
  const filtered = all.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered));
}
