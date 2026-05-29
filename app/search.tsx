import React from 'react';
import { Pressable, TextInput, StyleSheet, FlatList, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductCard from '../components/products/ProductCard';
import products from '../data/products.json';
import useBasketStore from '../stores/basketStore';
import { Colors } from '../constants/colors';
import { ThemedText } from '../components/ui/ThemedText';
import type { Product, ProductId } from '../types/product';

const productList = products as Product[];

export default function App() {
  const items = useBasketStore((state) => state.items);
  const addProduct = useBasketStore((state) => state.addProduct);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const [text, onChangeText] = React.useState('');
  const [activeQuantityProductName, setActiveQuantityProductName] =
    React.useState<ProductId | null>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const searchQuery = text.trim().toLowerCase();
  const canSearch = searchQuery.length > 0;
  const filteredProducts = React.useMemo<Product[]>(() => {
    if (!canSearch) {
      return [];
    }

    return productList.filter((product) => product.name.toLowerCase().includes(searchQuery));
  }, [canSearch, searchQuery]);

  return (
    <View style={styles.container}>
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.titleRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color={Colors.primaryForeground}
              />
            </Pressable>
            <ThemedText
              type="title"
              style={styles.searchTitle}>Search</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder={"Search..."}
            placeholderTextColor={Colors.placeholder}
            value={text}
          />
        </View>
        <View style={styles.main_wrap}>
          <FlatList<Product>
            data={filteredProducts}
            keyExtractor={(item) => item.name}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.emptySearch}>
                <ThemedText style={styles.emptySearchText}>
                  {canSearch ? 'No products found.' : 'Type to search products.'}
                </ThemedText>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={[styles.productTile, index % 2 === 0 ? styles.leftTile : styles.rightTile]}>
                <ProductCard
                  activeQuantityProductName={activeQuantityProductName}
                  product={item}
                  inBasket={items[item.name]?.quantity || 0}
                  onAddProduct={addProduct}
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
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  backButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    marginRight: 4,
    width: 42,
  },
  main_wrap: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  searchTitle: {
    fontSize: 20,
    color: Colors.primaryForeground,
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
  emptySearch: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptySearchText: {
    color: Colors.mutedForeground,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
