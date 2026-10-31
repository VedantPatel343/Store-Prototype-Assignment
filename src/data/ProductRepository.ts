import type { Product } from "./types";

export interface ProductRepository {
  getCollection(storeId: string): Promise<Product[]>;
  getProduct(storeId: string, productId: string): Promise<Product | null>;
}
