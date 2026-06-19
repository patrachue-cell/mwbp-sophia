import { PhilosopherId } from '@/constants/philosophers';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  philosopherId?: PhilosopherId;
  timestamp: number;
}

export interface Conversation {
  id: string;
  philosopherId: PhilosopherId;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
