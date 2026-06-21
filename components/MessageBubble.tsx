import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Message } from '@/types/chat';
import { PHILOSOPHERS, PhilosopherId } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

const PHILOSOPHER_IMAGES: Record<PhilosopherId, any> = {
  socrates: require('@/assets/socrates.png'),
  plato: require('@/assets/plato.png'),
  aristotle: require('@/assets/aristotle.png'),
};

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
        <View style={[styles.avatarWrapper, { borderColor: philosopher.color + '80' }]}>
          <Image
            source={PHILOSOPHER_IMAGES[philosopherId]}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser
          ? styles.userBubble
          : [styles.assistantBubble, { borderColor: philosopher.color + '40' }],
      ]}>
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
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    marginBottom: 2,
    borderWidth: 2,
  },
  avatarImage: {
    width: 38,
    height: 38,
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
    backgroundColor: Colors.surface + 'E8',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    elevation: 2,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
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
