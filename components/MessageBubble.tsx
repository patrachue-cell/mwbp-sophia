import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types/chat';
import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface Props {
  message: Message;
  philosopherId: PhilosopherId;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, philosopherId, isStreaming }: Props) {
  const isUser = message.role === 'user';
  const philosopher = PHILOSOPHERS[philosopherId];

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={[styles.avatarWrapper, { backgroundColor: philosopher.color + '22' }]}>
          <Text style={styles.avatarEmoji}>{philosopher.avatar}</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        {!isUser && (
          <Text style={[styles.philosopherName, { color: philosopher.color }]}>
            {philosopher.nameKo}
          </Text>
        )}
        <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
          {isStreaming && <Text style={{ color: philosopher.color }}>▍</Text>}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginBottom: 2,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  userBubble: {
    backgroundColor: Colors.userBubble,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.surfaceElevated,
    borderBottomLeftRadius: 4,
  },
  philosopherName: {
    fontSize: Typography.fontSizeXs,
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  messageText: {
    fontSize: Typography.fontSizeMd,
    lineHeight: Typography.lineHeightBody,
  },
  userText: {
    color: Colors.userBubbleText,
  },
  assistantText: {
    color: Colors.text.primary,
  },
});
