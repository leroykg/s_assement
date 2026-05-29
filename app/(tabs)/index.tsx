import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BasketPromo from '../../components/marketing/BasketPromo';
import FreeDeliveryToast from '../../components/cart/FreeDeliveryToast';
import ProductGrid from '../../components/products/ProductGrid';
import { Colors } from '../../constants/colors';
import { ThemedText } from '../../components/ui/ThemedText';
import { FREE_DELIVERY_MINIMUM, getBasketTotal } from '../../helpers/basket';
import { getProducts } from '../../helpers/products';
import useBasketStore from '../../stores/basketStore';

export default function App() {
  const items = useBasketStore((state) => state.items);
  const [showFreeDeliveryToast, setShowFreeDeliveryToast] = React.useState(false);
  const wasBelowFreeDelivery = React.useRef(true);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const productList = React.useMemo(() => getProducts({ onlyInStock: false }), []);
  const basketTotal = React.useMemo(() => getBasketTotal(items), [items]);
  const dismissFreeDeliveryToast = React.useCallback(() => {
    setShowFreeDeliveryToast(false);
  }, []);

  React.useEffect(() => {
    const hasFreeDelivery = basketTotal >= FREE_DELIVERY_MINIMUM;

    if (hasFreeDelivery && wasBelowFreeDelivery.current) {
      setShowFreeDeliveryToast(true);
      wasBelowFreeDelivery.current = false;
      return;
    }

    if (!hasFreeDelivery) {
      wasBelowFreeDelivery.current = true;
    }
  }, [basketTotal]);

  return (
    <View style={styles.container}>
        <StatusBar style="light" />
        <FreeDeliveryToast
          visible={showFreeDeliveryToast}
          onDismiss={dismissFreeDeliveryToast}
          topOffset={insets.top + 8}
        />
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.logo_wrap}>
            <Image
              source={require('../../assets/srx-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity onPress={() => router.navigate('/search')}>
            <View style={styles.input}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color={Colors.placeholder}
              />
              <ThemedText style={styles.searchPlaceholderText}>Search...</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.main_wrap}>
          <ProductGrid
            products={productList}
            ListHeaderComponent={<BasketPromo />}
          />
        </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    margin: 0,
    padding: 0
  },
  logo_wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  logo: {
    height: 36,
    width: 150,
  },
  main_wrap: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  input: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    height: 38,
    margin: 12,
    borderWidth: 0,
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.input,
    color: Colors.inputForeground,
  },
  searchPlaceholderText: {
    color: Colors.placeholder,
    fontSize: 16,
    lineHeight: 19,
  },
});
