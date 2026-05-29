import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BasketLineItem from '../../components/cart/BasketLineItem';
import CheckoutPanel from '../../components/cart/CheckoutPanel';
import DeliveryProgress from '../../components/cart/DeliveryProgress';
import EmptyBasket from '../../components/cart/EmptyBasket';
import useBasketStore from '../../stores/basketStore';
import { Colors } from '../../constants/colors';

import {
  canCheckout,
  formatCurrency,
  getBasketLines,
  getBasketTotal,
  hasFreeDelivery,
} from '../../helpers/basket';
import { ThemedText } from '../../components/ui/ThemedText';

export default function BasketScreen() {
  const items = useBasketStore((state) => state.items);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const setProductQuantity = useBasketStore((state) => state.setProductQuantity);
  const clearBasket = useBasketStore((state) => state.clearBasket);

  const basketLines = useMemo(() => getBasketLines(items), [items]);
  const basketTotal = useMemo(() => getBasketTotal(items), [items]);
  const checkoutReady = canCheckout(basketTotal);
  const freeDelivery = hasFreeDelivery(basketTotal);
  const insets = useSafeAreaInsets();

  const handleCheckout = () => {
    if (!checkoutReady) {
      return;
    }

    Alert.alert(
      'Order placed',
      `Your ${formatCurrency(basketTotal)} grocery order is on its way.`,
      [
        {
          text: 'Done',
          onPress: clearBasket,
        },
      ],
    );
  };

  if (basketLines.length === 0) {
    return (
      <EmptyBasket onBrowseProducts={() => router.navigate('/')} />
    );
  }

  return (
      <View style={[styles.basketScreen, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <ThemedText
          type="title"
          style={styles.basketTitle}>Your Basket</ThemedText>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.basketScrollContent}
        >
          <DeliveryProgress basketTotal={basketTotal} freeDelivery={freeDelivery} />

          {basketLines.map((line) => (
            <BasketLineItem
              key={line.id}
              line={line}
              onDecreaseProduct={decreaseProduct}
              onIncreaseProduct={setProductQuantity}
            />
          ))}
        </ScrollView>

        <CheckoutPanel
          basketTotal={basketTotal}
          checkoutReady={checkoutReady}
          onCheckout={handleCheckout}
        />
      </View>
    
  );
}

const styles = StyleSheet.create({
  basketScreen: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  basketScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 128,
  },
  basketTitle: {
    fontSize: 28,
    color: Colors.foreground,
    fontFamily: 'NotoSans_700Bold',
    fontWeight: '900',
    letterSpacing: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
