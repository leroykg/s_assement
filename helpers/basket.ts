import type { BasketItems, BasketLine } from '../types/basket';
import type { Product, ProductId } from '../types/product';

export const CHECKOUT_MINIMUM = 5;
export const FREE_DELIVERY_MINIMUM = 10;

export function formatCurrency(amount?: number | null): string {
  return `R${Number(amount || 0).toFixed(2)}`;
}

export function getProductId(product: Product): ProductId {
  return product.name;
}

function clampQuantity(quantity: number, available: number): number {
  const safeQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0;
  return Math.max(0, Math.min(safeQuantity, available));
}

export function addLineItem(items: BasketItems, product: Product): BasketItems {
  const id = getProductId(product);
  const currentQuantity = items[id]?.quantity || 0;
  const available = product.quantity_available || 0;

  if (available <= 0 || currentQuantity >= available) {
    return items;
  }

  return {
    ...items,
    [id]: {
      product,
      quantity: currentQuantity + 1,
    },
  };
}

export function removeLineItem(items: BasketItems, productId: ProductId): BasketItems {
  const current = items[productId];

  if (!current) {
    return items;
  }

  if (current.quantity <= 1) {
    const nextItems = { ...items };
    delete nextItems[productId];
    return nextItems;
  }

  return {
    ...items,
    [productId]: {
      ...current,
      quantity: current.quantity - 1,
    },
  };
}

export function setLineItemQuantity(
  items: BasketItems,
  productId: ProductId,
  quantity: number,
): BasketItems {
  const current = items[productId];

  if (!current) {
    return items;
  }

  const nextQuantity = clampQuantity(quantity, current.product.quantity_available || 0);

  if (nextQuantity === 0) {
    const nextItems = { ...items };
    delete nextItems[productId];
    return nextItems;
  }

  return {
    ...items,
    [productId]: {
      ...current,
      quantity: nextQuantity,
    },
  };
}

export function getBasketLines(items: BasketItems): BasketLine[] {
  return Object.entries(items).map(([id, item]) => ({
    id,
    ...item,
    lineTotal: Number((item.product.price * item.quantity).toFixed(2)),
  }));
}

export function getBasketTotal(items: BasketItems): number {
  const total = getBasketLines(items).reduce((sum, item) => sum + item.lineTotal, 0);
  return Number(total.toFixed(2));
}

export function getBasketCount(items: BasketItems): number {
  return getBasketLines(items).reduce((sum, item) => sum + item.quantity, 0);
}

export function canCheckout(total: number): boolean {
  return total >= CHECKOUT_MINIMUM;
}

export function hasFreeDelivery(total: number): boolean {
  return total >= FREE_DELIVERY_MINIMUM;
}
