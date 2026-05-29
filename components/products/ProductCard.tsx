import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { formatCurrency } from '../../helpers/basket';
import { ThemedText } from '../ui/ThemedText';
import { Colors } from '../../constants/colors';
import type { Product, ProductId } from '../../types/product';

type ProductCardProps = {
  activeQuantityProductName: ProductId | null;
  inBasket: number;
  onAddProduct: (product: Product) => void;
  onDecreaseProduct: (productId: ProductId) => void;
  onSelectQuantityProduct: (productId: ProductId) => void;
  product: Product;
};

export default function ProductCard({
  activeQuantityProductName,
  inBasket,
  onAddProduct,
  onDecreaseProduct,
  onSelectQuantityProduct,
  product,
}: ProductCardProps) {
  const router = useRouter();
  const available = product.quantity_available - inBasket;
  const soldOut = product.quantity_available === 0;
  const atLimit = available <= 0;
  const isInBasket = inBasket > 0;
  const isEditingQuantity = isInBasket && activeQuantityProductName === product.name;
  const openProduct = () => {
    router.push({
      pathname: '/product',
      params: { name: product.name },
    });
  };

  return (
    <View style={styles.productCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name} details`}
        onPress={openProduct}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <Image source={{ uri: product.image }} style={styles.productImage} />
      </Pressable>
      {isEditingQuantity ? (
        <View style={styles.quantityControl}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove one ${product.name}`}
            onPress={() => onDecreaseProduct(product.name)}
            style={({ pressed }) => [styles.quantityAction, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons name="minus" size={24} color={Colors.primary} />
          </Pressable>
          <View style={styles.quantityBadge}>
            <ThemedText style={styles.quantityText}>{inBasket}</ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add one ${product.name}`}
            disabled={atLimit}
            onPress={() => onAddProduct(product)}
            style={({ pressed }) => [
              styles.quantityAction,
              atLimit && styles.quantityActionDisabled,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="plus"
              size={24}
              color={atLimit ? Colors.disabledForeground : Colors.primary}
            />
          </Pressable>
        </View>
      ) : isInBasket ? (
        <Pressable
          id="inCartQntyButton"
          nativeID="inCartQntyButton"
          accessibilityRole="button"
          accessibilityLabel={`Edit ${product.name} quantity`}
          onPress={() => onSelectQuantityProduct(product.name)}
          style={({ pressed }) => [
            styles.inCartQnty,
            pressed && styles.pressed,
          ]}
        >
          <ThemedText style={styles.inCartQntyText}>{inBasket}</ThemedText>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name}`}
          disabled={soldOut || atLimit}
          onPress={() => onAddProduct(product)}
          style={({ pressed }) => [
            styles.addButton,
            (soldOut || atLimit) && styles.addButtonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name={soldOut || atLimit ? 'minus-circle-outline' : 'plus'}
            size={28}
            color={soldOut || atLimit ? Colors.disabledForeground : Colors.primary}
          />
        </Pressable>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${product.name} details`}
        onPress={openProduct}
        style={({ pressed }) => [styles.productInfo, pressed && styles.pressed]}
      >
        <View style={styles.productTopLine}>
          <ThemedText style={styles.productPrice}>{formatCurrency(product.price)}</ThemedText>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
        </View>
        <ThemedText style={[styles.stockText, soldOut && styles.soldOutText]}>
          {soldOut ? 'Sold out' : `${available} available`}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 200,
    padding: 10,
  },
  productImage: {
    backgroundColor: Colors.muted,
    borderRadius: 8,
    aspectRatio: 1,
    marginBottom: 10,
    width: '100%',
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productTopLine: {
    gap: 4,
  },
  productName: {
    color: Colors.cardForeground,
    fontSize: 14,
    fontFamily: 'NotoSans_400Regular',
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 18,
  },
  productPrice: {
    color: Colors.foreground,
    fontSize: 17,
    fontFamily: 'NotoSans_900Black',
    fontWeight: '800',
    letterSpacing: 0,
  },
  stockText: {
    color: Colors.mutedForeground,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 4,
  },
  soldOutText: {
    color: Colors.destructive,
  },
  addButton: {
    alignItems: 'center',
    borderColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1,
  },
  addButtonDisabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  inCartQnty: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1,
  },
  inCartQntyText: {
    color: Colors.primaryForeground,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 18,
  },
  quantityControl: {
    alignItems: 'center',
    backgroundColor: Colors.disabled,
    borderRadius: 20,
    flexDirection: 'row',
    height: 38,
    justifyContent: 'space-between',
    left: 16,
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  quantityAction: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 44,
  },
  quantityActionDisabled: {
    opacity: 0.5,
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 30,
    height: 24,
    justifyContent: 'center',
    minWidth: 24,
    paddingHorizontal: 10,
  },
  quantityText: {
    color: Colors.primaryForeground,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.74,
  },
});
