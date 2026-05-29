import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { formatCurrency } from '../../helpers/basket';
import { ThemedText } from '../../components/ui/ThemedText';
import { Colors } from '../../constants/colors';
import type { Product, ProductId } from '../../types/product';
import Button from '../../components/ui/Button';
import ProductQuantityControl from '../../components/products/ProductQuantityControl';

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
        <View style={styles.quantityControlWrap}>
          <ProductQuantityControl
            increaseDisabled={atLimit}
            onDecrease={() => onDecreaseProduct(product.name)}
            onIncrease={() => onAddProduct(product)}
            productName={product.name}
            quantity={inBasket}
          />
        </View>
      ) : isInBasket ? (
        <Button
          id="inCartQntyButton"
          nativeID="inCartQntyButton"
          accessibilityLabel={`Edit ${product.name} quantity`}
          onPress={() => onSelectQuantityProduct(product.name)}
          size="icon-sm"
          style={styles.inCartQnty}
          textStyle={styles.inCartQntyText}
        >
          {inBasket}
        </Button>
      ) : (
        <Button
          accessibilityLabel={`Add ${product.name}`}
          disabled={soldOut || atLimit}
          iconName={soldOut || atLimit ? 'minus-circle-outline' : 'plus'}
          onPress={() => onAddProduct(product)}
          size="icon-lg"
          style={styles.addButton}
          variant="outline"
        />
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
    fontFamily: 'NotoSans_400Regular',
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
    borderRadius: 20,
    height: 32,
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1,
  },
  inCartQnty: {
    borderRadius: 20,
    height: 32,
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1,
  },
  inCartQntyText: {
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 18,
  },
  quantityControlWrap: {
    left: 16,
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  pressed: {
    opacity: 0.74,
  },
});
