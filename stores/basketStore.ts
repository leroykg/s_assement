import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  addLineItem,
  getBasketCount,
  getBasketLines,
  getBasketTotal,
  removeLineItem,
  setLineItemQuantity,
} from '../helpers/basket';
import type { BasketStoreState } from '../types/basket';

const useBasketStore = create<BasketStoreState>()(
  persist(
    (set, get) => ({
      items: {},
      addProduct: (product) => {
        set((state) => ({
          items: addLineItem(state.items, product),
        }));
      },
      decreaseProduct: (productId) => {
        set((state) => ({
          items: removeLineItem(state.items, productId),
        }));
      },
      setProductQuantity: (productId, quantity) => {
        set((state) => ({
          items: setLineItemQuantity(state.items, productId, quantity),
        }));
      },
      clearBasket: () => set({ items: {} }),
      getLines: () => getBasketLines(get().items),
      getTotal: () => getBasketTotal(get().items),
      getCount: () => getBasketCount(get().items),
    }),
    {
      name: 'groceries-basket',
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useBasketStore;
