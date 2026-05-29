import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import BasketTabIcon from '../../components/cart/BasketTabIcon';
import useBasketStore from '../../stores/basketStore';
import { Colors } from '../../constants/colors';

import {
  formatCurrency,
  getBasketTotal,
} from '../../helpers/basket'

export default function TabsLayout() {
  
  const items = useBasketStore((state) => state.items);
  const basketTotal = useMemo(() => getBasketTotal(items), [items]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          letterSpacing: 0,
        },
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          height: 70,
          paddingTop: 7,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused, size }) => (
            <MaterialCommunityIcons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="basket"
        options={{
          title: `Basket ${formatCurrency(basketTotal)}`,
          tabBarIcon: (props) => <BasketTabIcon {...props} />,
        }}
      />
    </Tabs>
  );
}
