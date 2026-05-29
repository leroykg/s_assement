import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProductGrid from '../components/products/ProductGrid';
import { Colors } from '../constants/colors';
import Button from '../components/ui/Button';
import { ThemedText } from '../components/ui/ThemedText';
import { getProducts } from '../helpers/products';
import type { Product } from '../types/product';

export default function App() {
  const [text, onChangeText] = React.useState('');
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const searchQuery = text.trim().toLowerCase();
  const canSearch = searchQuery.length > 0;
  const filteredProducts = React.useMemo<Product[]>(() => {
    if (!canSearch) {
      return [];
    }

    return getProducts({ onlyInStock: false, search: text });
  }, [canSearch, text]);

  return (
    <View style={styles.container}>
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <View style={styles.titleRow}>
            <Button
              accessibilityLabel="Go back"
              contentColor={Colors.primaryForeground}
              iconName="arrow-left"
              onPress={() => router.back()}
              size="icon"
              style={styles.backButton}
              variant="ghost"
            />
            <ThemedText
              type="title"
              style={styles.searchTitle}>Search</ThemedText>
          </View>
          <TextInput
            style={styles.input}
            autoFocus={true}
            onChangeText={onChangeText}
            placeholder={"Search..."}
            placeholderTextColor={Colors.placeholder}
            value={text}
          />
        </View>
        <View style={styles.main_wrap}>
          <View style={styles.spacer}></View>
          <ProductGrid
            products={filteredProducts}
            ListEmptyComponent={
              <View style={styles.emptySearch}>
                <ThemedText style={styles.emptySearchText}>
                  {canSearch ? 'No products found.' : 'Type to search products.'}
                </ThemedText>
              </View>
            }
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
  spacer: {
    height: 16,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  backButton: {
    marginRight: 4,
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
});
