import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

import {
  CHECKOUT_MINIMUM,
  FREE_DELIVERY_MINIMUM,
  formatCurrency,
} from '../../helpers/basket';

export default function DeliveryProgress({ basketTotal, freeDelivery }) {
  const remainingToCheckout = Math.max(0, CHECKOUT_MINIMUM - basketTotal);
  const remainingToDelivery = Math.max(0, FREE_DELIVERY_MINIMUM - basketTotal);
  const progress = Math.min(1, basketTotal / FREE_DELIVERY_MINIMUM);

  return (
    <View style={styles.progressPanel}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>
          {freeDelivery ? 'Free delivery unlocked' : `${formatCurrency(remainingToDelivery)} to free delivery`}
        </Text>
        <MaterialCommunityIcons
          name={freeDelivery ? 'star' : 'truck-fast'}
          size={22}
          color={Colors.primary}
        />
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      {remainingToCheckout > 0 && (
        <Text style={styles.progressCopy}>
          {`${formatCurrency(remainingToCheckout)} more to checkout.`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressPanel: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    color: Colors.cardForeground,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0,
  },
  progressTrack: {
    backgroundColor: Colors.muted,
    borderRadius: 8,
    height: 10,
    marginTop: 13,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: '100%',
  },
  progressCopy: {
    color: Colors.mutedForeground,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 9,
  },
});
