import type { Product, ProductId } from './product';

export type BasketItem = {
  product: Product;
  quantity: number;
};

export type BasketItems = Record<ProductId, BasketItem>;

export type BasketLine = BasketItem & {
  id: ProductId;
  lineTotal: number;
};

export type BasketStoreState = {
  items: BasketItems;
  addProduct: (product: Product) => void;
  decreaseProduct: (productId: ProductId) => void;
  setProductQuantity: (productId: ProductId, quantity: number) => void;
  clearBasket: () => void;
  getLines: () => BasketLine[];
  getTotal: () => number;
  getCount: () => number;
};
