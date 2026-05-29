import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../constants/colors';
import products from '../data/products.json';
import { formatCurrency } from '../helpers/basket';
import useBasketStore from '../stores/basketStore';
import { ThemedText } from '../components/ui/ThemedText';
import type { Product } from '../types/product';

const productList = products as Product[];

export default function ProductModal() {
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const items = useBasketStore((state) => state.items);
  const addProduct = useBasketStore((state) => state.addProduct);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const productName = Array.isArray(name) ? name[0] : name;
  const product = productList.find((item) => item.name === productName);
  const inBasket = product ? items[product.name]?.quantity || 0 : 0;
  const maxQuantity = product ? product.quantity_available : 0;
  const soldOut = product ? product.quantity_available === 0 : false;
  const initialQuantity = product && !soldOut ? Math.max(1, inBasket) : 0;
  const [selectedQuantity, setSelectedQuantity] = React.useState<number>(initialQuantity);
  const available = Math.max(0, maxQuantity - selectedQuantity);
  const atLimit = selectedQuantity >= maxQuantity;
  const canAddToBasket = !soldOut && selectedQuantity > 0;

  React.useEffect(() => {
    setSelectedQuantity(initialQuantity);
  }, [initialQuantity]);

  const decreaseSelectedQuantity = () => {
    setSelectedQuantity((quantity) => Math.max(1, quantity - 1));
  };

  const increaseSelectedQuantity = () => {
    setSelectedQuantity((quantity) => Math.min(maxQuantity, quantity + 1));
  };

  const handleAddToBasket = () => {
    if (!product) {
      return;
    }

    const quantityDifference = selectedQuantity - inBasket;

    if (quantityDifference > 0) {
      for (let index = 0; index < quantityDifference; index += 1) {
        addProduct(product);
      }
    }

    if (quantityDifference < 0) {
      for (let index = 0; index < Math.abs(quantityDifference); index += 1) {
        decreaseProduct(product.name);
      }
    }

    router.back();
  };

  if (!product) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close product details"
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <MaterialCommunityIcons name="close" size={34} color={Colors.foreground} />
        </Pressable>
        <View style={styles.missingWrap}>
          <ThemedText style={styles.missingTitle}>Product not found</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          styles.content,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close product details"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons name="close" size={34} color={Colors.foreground} />
        </Pressable>

        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
        </View>

        <View style={styles.details}>
          <ThemedText style={styles.productName}>{product.name}</ThemedText>
          <ThemedText style={styles.price}>{formatCurrency(product.price)}</ThemedText>
          <ThemedText style={[styles.stockText, soldOut && styles.soldOutText]}>
            {soldOut ? 'Sold out' : `${available} available`}
          </ThemedText>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.quantityControl}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove one ${product.name}`}
              disabled={selectedQuantity <= 1}
              onPress={decreaseSelectedQuantity}
              style={({ pressed }) => [
                styles.quantityAction,
                selectedQuantity <= 1 && styles.quantityActionDisabled,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="minus"
                size={28}
                color={selectedQuantity <= 1 ? Colors.disabledForeground : Colors.primary}
              />
            </Pressable>
            <View style={styles.quantityBadge}>
              <ThemedText style={styles.quantityText}>{selectedQuantity}</ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add one ${product.name}`}
              disabled={soldOut || atLimit}
              onPress={increaseSelectedQuantity}
              style={({ pressed }) => [
                styles.quantityAction,
                (soldOut || atLimit) && styles.quantityActionDisabled,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="plus"
                size={28}
                color={soldOut || atLimit ? Colors.disabledForeground : Colors.primary}
              />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${product.name} to basket`}
            disabled={!canAddToBasket}
            onPress={handleAddToBasket}
            style={({ pressed }) => [
              styles.addBasketButton,
              !canAddToBasket && styles.addBasketButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <ThemedText style={styles.addBasketText}>
              {soldOut ? 'Sold Out' : 'Add to Basket'}
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  productImage: {
    height: 260,
    width: '100%',
  },
  details: {
    marginTop: 36,
  },
  productName: {
    color: Colors.foreground,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
  },
  price: {
    color: Colors.foreground,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 60,
  },
  stockText: {
    color: Colors.mutedForeground,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 8,
  },
  soldOutText: {
    color: Colors.destructive,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 30,
  },
  quantityControl: {
    alignItems: 'center',
    backgroundColor: Colors.disabled,
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  quantityAction: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  quantityActionDisabled: {
    opacity: 0.5,
  },
  quantityBadge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 24,
    height: 34,
    justifyContent: 'center',
    minWidth: 34,
    paddingHorizontal: 12,
  },
  quantityText: {
    color: Colors.primaryForeground,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 28,
  },
  addBasketButton: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  addBasketButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  addBasketText: {
    color: Colors.primaryForeground,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  missingWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  missingTitle: {
    color: Colors.foreground,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
