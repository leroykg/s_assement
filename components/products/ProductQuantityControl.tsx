import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';
import { ThemedText } from '../../components/ui/ThemedText';

type ProductQuantityControlProps = {
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  productName: string;
  quantity: number;
  variant?: 'compact' | 'large';
};

export default function ProductQuantityControl({
  decreaseDisabled = false,
  increaseDisabled = false,
  onDecrease,
  onIncrease,
  productName,
  quantity,
  variant = 'compact',
}: ProductQuantityControlProps) {
  const large = variant === 'large';

  return (
    <View style={[styles.control, large ? styles.largeControl : styles.compactControl]}>
      <Button
        accessibilityLabel={`Remove one ${productName}`}
        contentColor={Colors.primary}
        disabled={decreaseDisabled}
        iconName="minus"
        size={large ? 'icon-lg' : 'icon'}
        variant="ghost"
        onPress={onDecrease}
        style={[
          styles.action,
          large ? styles.largeAction : styles.compactAction,
        ]}
      />
      <View style={[styles.badge, large ? styles.largeBadge : styles.compactBadge]}>
        <ThemedText style={[styles.quantityText, large ? styles.largeQuantityText : styles.compactQuantityText]}>
          {quantity}
        </ThemedText>
      </View>
      <Button
        accessibilityLabel={`Add one ${productName}`}
        contentColor={Colors.primary}
        disabled={increaseDisabled}
        iconName="plus"
        size={large ? 'icon-lg' : 'icon'}
        variant="ghost"
        onPress={onIncrease}
        style={[
          styles.action,
          large ? styles.largeAction : styles.compactAction,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    backgroundColor: Colors.disabled,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compactControl: {
    borderRadius: 20,
    height: 38,
  },
  largeControl: {
    borderRadius: 8,
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
  },
  action: {
    borderWidth: 0,
  },
  compactAction: {
    height: 38,
    width: 44,
  },
  largeAction: {
    height: 50,
    width: 50,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
  },
  compactBadge: {
    borderRadius: 30,
    height: 24,
    minWidth: 24,
    paddingHorizontal: 10,
  },
  largeBadge: {
    borderRadius: 24,
    height: 34,
    minWidth: 34,
    paddingHorizontal: 12,
  },
  quantityText: {
    color: Colors.primaryForeground,
    fontWeight: '900',
    letterSpacing: 0,
  },
  compactQuantityText: {
    fontSize: 18,
    lineHeight: 22,
  },
  largeQuantityText: {
    fontSize: 16,
    lineHeight: 28,
  },
});
