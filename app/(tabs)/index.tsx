import React from 'react';
import { Image, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductCard from '../../components/products/ProductCard';
import BasketPromo from '../../components/marketing/BasketPromo';
import products from '../../data/products.json';
import useBasketStore from '../../stores/basketStore';
import { Colors } from '../../constants/colors';
import { ThemedText } from '../../components/ui/ThemedText';
import type { Product, ProductId } from '../../types/product';

const productList = products as Product[];

export default function App() {
  const items = useBasketStore((state) => state.items);
  const addProduct = useBasketStore((state) => state.addProduct);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const [activeQuantityProductName, setActiveQuantityProductName] =
    React.useState<ProductId | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
        <StatusBar style="light" />
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
              <ThemedText style={styles.searchPlaceholderText}>Search...</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.main_wrap}>
          <FlatList<Product>
            data={productList}
            keyExtractor={(item) => item.name}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={<BasketPromo />}
            renderItem={({ item, index }) => (
              <View style={[styles.productTile, index % 2 === 0 ? styles.leftTile : styles.rightTile]}>
                <ProductCard
                  activeQuantityProductName={activeQuantityProductName}
                  product={item}
                  inBasket={items[item.name]?.quantity || 0}
                  onAddProduct={() => {
                    addProduct(item);
                    setActiveQuantityProductName(item.name);
                  }}
                  onDecreaseProduct={decreaseProduct}
                  onSelectQuantityProduct={setActiveQuantityProductName}
                />
              </View>
            )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productRow: {
    alignItems: 'stretch',
  },
  productTile: {
    width: '50%',
  },
  leftTile: {
    paddingRight: 5,
  },
  rightTile: {
    paddingLeft: 5,
  },
});
