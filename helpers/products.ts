import products from '../data/products.json';
import type { Product, ProductId } from '../types/product';

type GetProductsOptions = {
  onlyInStock?: boolean;
  search?: string;
};

const productList = products as Product[];

function normalizeSearch(search: string): string {
  return search.trim().toLowerCase();
}

export function getProducts({
  onlyInStock = false,
  search = '',
}: GetProductsOptions = {}): Product[] {
  const searchQuery = normalizeSearch(search);

  return productList.filter((product) => {
    if (onlyInStock && product.quantity_available <= 0) {
      return false;
    }

    if (searchQuery.length === 0) {
      return true;
    }

    return product.name.toLowerCase().includes(searchQuery);
  });
}

export function getProductById(productId?: ProductId | null): Product | undefined {
  if (!productId) {
    return undefined;
  }

  return productList.find((product) => product.name === productId);
}
