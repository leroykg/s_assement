import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import QuantityButton from './QuantityButton';

import { formatCurrency } from '../../helpers/basket';
import { Colors } from '../../constants/colors';
import type { BasketLine } from '../../types/basket';
import type { ProductId } from '../../types/product';

type BasketLineItemProps = {
  line: BasketLine;
  onDecreaseProduct: (productId: ProductId) => void;
  onIncreaseProduct: (productId: ProductId, quantity: number) => void;
};

export default function BasketLineItem({
  line,
  onDecreaseProduct,
  onIncreaseProduct,
}: BasketLineItemProps) {
  return (
    <View style={styles.basketLine}>
      <Image source={{ uri: line.product.image }} style={styles.basketImage} />
      <View style={styles.basketLineBody}>
        <View style={styles.basketLineTop}>
          <Text style={styles.basketLineName}>{line.product.name}</Text>
          <Text style={styles.lineTotal}>{formatCurrency(line.lineTotal)}</Text>
        </View>
        <Text style={styles.basketLineMeta}>
          {formatCurrency(line.product.price)} each
        </Text>
        <View style={styles.quantityRow}>
          <QuantityButton
            icon="minus"
            label={`Remove one ${line.product.name}`}
            onPress={() => onDecreaseProduct(line.id)}
          />
          <Text style={styles.quantityText}>{line.quantity}</Text>
          <QuantityButton
            icon="plus"
            label={`Add one ${line.product.name}`}
            onPress={() => onIncreaseProduct(line.id, line.quantity + 1)}
            disabled={line.quantity >= line.product.quantity_available}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  basketLine: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
  },
  basketImage: {
    backgroundColor: Colors.muted,
    borderRadius: 8,
    height: 58,
    marginRight: 12,
    width: 58,
  },
  basketLineBody: {
    flex: 1,
    minWidth: 0,
  },
  basketLineTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  basketLineName: {
    color: Colors.cardForeground,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 20,
  },
  lineTotal: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  basketLineMeta: {
    color: Colors.mutedForeground,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 3,
  },
  quantityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  quantityText: {
    color: Colors.cardForeground,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    minWidth: 24,
    textAlign: 'center',
  },
});
