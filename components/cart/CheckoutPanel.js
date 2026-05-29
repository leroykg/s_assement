import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatCurrency } from '../../helpers/basket';
import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';

export default function CheckoutPanel({
  basketTotal,
  checkoutReady,
  onCheckout,
}) {
  return (
    <View style={styles.checkoutPanel}>
      <View>
        <Text style={styles.checkoutLabel}>Basket total</Text>
        <Text style={styles.checkoutTotal}>{formatCurrency(basketTotal)}</Text>
      </View>
      <Button
        iconName="check"
        disabled={!checkoutReady}
        onPress={onCheckout}
        style={styles.checkoutButton}
        textStyle={styles.primaryButtonLabel}
      >
        Checkout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  checkoutPanel: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    padding: 14,
    position: 'absolute',
    right: 0,
  },
  checkoutLabel: {
    color: Colors.mutedForeground,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  checkoutTotal: {
    color: Colors.cardForeground,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  checkoutButton: {
    minWidth: 132,
  },
  primaryButtonLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});
