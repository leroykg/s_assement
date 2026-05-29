export type ProductId = string;

export type Product = {
  name: ProductId;
  price: number;
  quantity_available: number;
  image?: string;
};
