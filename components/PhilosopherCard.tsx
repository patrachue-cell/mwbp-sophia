import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import { Philosopher } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

const PHILOSOPHER_IMAGES: Record<string, any> = {
  socrates: require('@/assets/socrates.png'),
  plato: require('@/assets/plato.png'),
  aristotle: require('@/assets/aristotle.png'),
};

interface Props {
  philosopher: Philosopher;
  onPress: () => void;
  isSelected?: boolean;
}

export default function PhilosopherCard({ philosopher, onPress, isSelected }: Props) {
  const img = PHILOSOPHER_IMAGES[philosopher.id];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={styles.wrapper}>
      <View style={[
        styles.card,
        { borderColor: philosopher.color + '99' },
        isSelected && [styles.selectedCard, { borderColor: philosopher.color }],
      ]}>
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: philosopher.color }]} />
        )}

        {/* 철학자 실제 이미지 */}
        <View style={[styles.imageWrapper, { borderColor: philosopher.color + '80' }]}>
          <Image
            source={img}
            style={styles.philosopherImage}
            resizeMode="cover"
          />
        </View>

        {/* 구분선 */}
        <View style={[styles.divider, { backgroundColor: philosopher.color + '40' }]} />

        {/* 정보 */}
        <View style={styles.infoBox}>
          <Text style={[styles.name, { color: philosopher.color }]}>{philosopher.nameKo}</Text>
          <Text style={styles.era}>{philosopher.era}</Text>
          <Text style={styles.tagline}>{philosopher.tagline}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: Spacing.sm,
    minWidth: 150,
  },
  card: {
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    elevation: 8,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
  },
  selectedCard: {
    borderWidth: 3,
    elevation: 12,
    shadowOpacity: 0.4,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 11,
    height: 11,
    borderRadius: 5.5,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    borderWidth: 2,
    marginBottom: Spacing.sm,
  },
  philosopherImage: {
    width: 140,
    height: 140,
  },
  divider: {
    width: '80%',
    height: 1,
    marginBottom: Spacing.sm,
  },
  infoBox: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  name: {
    fontSize: Typography.fontSizeLg,
    fontWeight: '800',
    marginBottom: 2,
  },
  era: {
    fontSize: Typography.fontSizeXs,
    color: Colors.text.muted,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});
