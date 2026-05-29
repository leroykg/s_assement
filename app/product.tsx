import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../constants/colors';
import { formatCurrency } from '../helpers/basket';
import { getProductById } from '../helpers/products';
import useBasketStore from '../stores/basketStore';
import { ThemedText } from '../components/ui/ThemedText';
import ProductQuantityControl from '../components/products/ProductQuantityControl';

export default function ProductModal() {
  const { name } = useLocalSearchParams<{ name?: string | string[] }>();
  const insets = useSafeAreaInsets();
  const items = useBasketStore((state) => state.items);
  const addProduct = useBasketStore((state) => state.addProduct);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const productName = Array.isArray(name) ? name[0] : name;
  const product = getProductById(productName);
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
      <View style={[styles.container, { marginTop: insets.top }]}>
        <StatusBar style="light" />
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
    <View style={[styles.container, { marginTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          { paddingBottom: insets.bottom + 32 },
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
          <ProductQuantityControl
            decreaseDisabled={selectedQuantity <= 1}
            increaseDisabled={soldOut || atLimit}
            onDecrease={decreaseSelectedQuantity}
            onIncrease={increaseSelectedQuantity}
            productName={product.name}
            quantity={selectedQuantity}
            variant="large"
          />

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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    marginRight: -12,
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
    opacity: 0.70,
  },
});
