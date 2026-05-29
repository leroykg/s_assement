import React from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';

import useBasketStore from '../../stores/basketStore';
import type { Product, ProductId } from '../../types/product';
import ProductCard from './ProductCard';

type ProductGridProps = {
  ListEmptyComponent?: React.ReactElement | null;
  ListHeaderComponent?: React.ReactElement | null;
  products: Product[];
};

export default function ProductGrid({
  ListEmptyComponent,
  ListHeaderComponent,
  products,
}: ProductGridProps) {
  const items = useBasketStore((state) => state.items);
  const addProduct = useBasketStore((state) => state.addProduct);
  const decreaseProduct = useBasketStore((state) => state.decreaseProduct);
  const [activeQuantityProductName, setActiveQuantityProductName] =
    React.useState<ProductId | null>(null);

  const renderItem = ({ item, index }: ListRenderItemInfo<Product>) => (
    <View style={[styles.productTile, index % 2 === 0 ? styles.leftTile : styles.rightTile]}>
      <ProductCard
        activeQuantityProductName={activeQuantityProductName}
        product={item}
        inBasket={items[item.name]?.quantity || 0}
        onAddProduct={(product) => {
          addProduct(product);
          setActiveQuantityProductName(product.name);
        }}
        onDecreaseProduct={decreaseProduct}
        onSelectQuantityProduct={setActiveQuantityProductName}
      />
    </View>
  );

  return (
    <FlatList<Product>
      data={products}
      keyExtractor={(item) => item.name}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.productRow}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
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
