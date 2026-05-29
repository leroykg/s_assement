import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

import { formatCurrency } from '../../helpers/basket';
import { Colors } from '../../constants/colors';

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
        mode="contained"
        icon="check"
        disabled={!checkoutReady}
        onPress={onCheckout}
        style={[styles.checkoutButton, !checkoutReady && styles.checkoutButtonDisabled]}
        labelStyle={styles.primaryButtonLabel}
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
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
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 132,
  },
  checkoutButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  primaryButtonLabel: {
    color: Colors.primaryForeground,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
  },
});
