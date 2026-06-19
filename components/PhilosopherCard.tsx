import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Philosopher } from '@/constants/philosophers';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface Props {
  philosopher: Philosopher;
  onPress: () => void;
  isSelected?: boolean;
}

export default function PhilosopherCard({ philosopher, onPress, isSelected }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <LinearGradient
        colors={philosopher.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isSelected && styles.selectedCard]}
      >
        {isSelected && <View style={styles.selectedBadge} />}
        <Text style={styles.avatar}>{philosopher.avatar}</Text>
        <Text style={styles.name}>{philosopher.nameKo}</Text>
        <Text style={styles.era}>{philosopher.era}</Text>
        <Text style={styles.tagline}>{philosopher.tagline}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: Spacing.sm,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  avatar: {
    fontSize: 38,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.fontSizeLg,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
  },
  era: {
    fontSize: Typography.fontSizeXs,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.fontSizeSm,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
