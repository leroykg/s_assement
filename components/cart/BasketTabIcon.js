import React, { useMemo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import useBasketStore from '../../stores/basketStore';
import { Colors } from '../../constants/colors';

import { getBasketCount } from '../../helpers/basket';

export default function BasketTabIcon({ color, focused, size }) {
  const items = useBasketStore((state) => state.items);
  const basketCount = useMemo(() => getBasketCount(items), [items]);

  return (
    <View style={styles.tabIconWrap}>
      <MaterialCommunityIcons
        name={focused ? 'basket' : 'basket-outline'}
        size={size}
        color={color}
      />
      {basketCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{basketCount}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    height: 26,
    justifyContent: 'center',
  },
   badge: {
    alignItems: 'center',
    backgroundColor: Colors.badge,
    borderRadius: 8,
    minWidth: 18,
    paddingHorizontal: 5,
    position: 'absolute',
    right: -14,
    top: -7,
  },
  badgeText: {
    color: Colors.badgeForeground,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0,
  },
  
});
