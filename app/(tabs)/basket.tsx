import React, { useMemo } from 'react';
import {
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
import Button from '../../components/ui/Button';
import Dialog, { type DialogButton } from '../../components/ui/Dialog';
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

type BasketDialog = {
  buttons: DialogButton[];
  description: string;
  title: string;
};

const EMPTY_DIALOG_BUTTONS: DialogButton[] = [];

export default function BasketScreen() {
  const items = useBasketStore((state) => state.items);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const setProductQuantity = useBasketStore((state) => state.setProductQuantity);
  const clearBasket = useBasketStore((state) => state.clearBasket);
  const [dialog, setDialog] = React.useState<BasketDialog | null>(null);

  const basketLines = useMemo(() => getBasketLines(items), [items]);
  const basketTotal = useMemo(() => getBasketTotal(items), [items]);
  const checkoutReady = canCheckout(basketTotal);
  const freeDelivery = hasFreeDelivery(basketTotal);
  const insets = useSafeAreaInsets();

  const handleClearBasket = () => {
    setDialog({
      title: 'Clear basket?',
      description: 'This will remove every item from your basket.',
      buttons: [
        {
          text: 'Cancel',
          onPress: () => setDialog(null),
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            setDialog(null);
            clearBasket();
          },
          style: 'destructive',
        },
      ],
    });
  };

  const handleCheckout = () => {
    if (!checkoutReady) {
      return;
    }

    setDialog({
      title: 'Order placed',
      description: `Your ${formatCurrency(basketTotal)} grocery order is on its way.`,
      buttons: [
        {
          text: 'Done',
          onPress: () => {
            setDialog(null);
            clearBasket();
          },
        },
      ],
    });
  };

  if (basketLines.length === 0) {
    return (
      <EmptyBasket onBrowseProducts={() => router.navigate('/')} />
    );
  }

  return (
      <View style={[styles.basketScreen, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        <View style={styles.headerRow}>
          <ThemedText
            type="title"
            style={styles.basketTitle}>Your Basket</ThemedText>
          <Button
            accessibilityLabel="Clear basket"
            contentColor={Colors.destructive}
            iconName="trash-can-outline"
            size="icon"
            variant="ghost"
            onPress={handleClearBasket}
            style={styles.clearButton}
          />
        </View>

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
        <Dialog
          visible={dialog !== null}
          title={dialog?.title || ''}
          description={dialog?.description || ''}
          buttons={dialog?.buttons || EMPTY_DIALOG_BUTTONS}
          onRequestClose={() => setDialog(null)}
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
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  basketTitle: {
    fontSize: 28,
    color: Colors.foreground,
    fontFamily: 'NotoSans_700Bold',
    fontWeight: '900',
    letterSpacing: 0,
  },
  clearButton: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
  },
});
