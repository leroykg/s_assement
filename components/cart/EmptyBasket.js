import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';

export default function EmptyBasket({ onBrowseProducts }) {
  return (
    <View style={styles.emptyBasket}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons name="basket-off-outline" size={42} color={Colors.mutedForeground} />
      </View>
      <Text style={styles.emptyTitle}>Your basket is empty</Text>
      <Text style={styles.emptyCopy}>Add products from the shop tab to start your order.</Text>
      <Button
        onPress={onBrowseProducts}
        style={styles.emptyButton}
        textStyle={styles.primaryButtonLabel}
      >
        Browse products
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyBasket: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 88,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: Colors.muted,
    borderRadius: 8,
    height: 76,
    justifyContent: 'center',
    marginBottom: 18,
    width: 76,
  },
  emptyTitle: {
    color: Colors.foreground,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  emptyCopy: {
    color: Colors.mutedForeground,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
  },
  primaryButtonLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});
