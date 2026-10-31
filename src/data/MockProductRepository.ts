import { getStore } from "../config/stores";
import { sampleCatalogs } from "./sampleCatalog";
import type { ProductRepository } from "./ProductRepository";
import type { Product } from "./types";

function cloneProducts(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => ({ ...variant })),
  }));
}

export class MockProductRepository implements ProductRepository {
  private failNextCollection = false;
  private failNextProduct = false;

  armCollectionFailure(): void {
    this.failNextCollection = true;
  }

  armProductFailure(): void {
    this.failNextProduct = true;
  }

  async getCollection(storeId: string): Promise<Product[]> {
    if (this.failNextCollection) {
      this.failNextCollection = false;
      throw new Error("The catalog could not be loaded.");
    }
    const catalogId = getStore(storeId)?.catalogId;
    if (!catalogId) {
      return [];
    }
    return cloneProducts(sampleCatalogs[catalogId] ?? []);
  }

  async getProduct(storeId: string, productId: string): Promise<Product | null> {
    if (this.failNextProduct) {
      this.failNextProduct = false;
      throw new Error("The product could not be loaded.");
    }
    const catalogId = getStore(storeId)?.catalogId;
    const products = catalogId ? (sampleCatalogs[catalogId] ?? []) : [];
    const product = products.find((item) => item.id === productId);
    return product
      ? {
          ...product,
          variants: product.variants.map((variant) => ({ ...variant })),
        }
      : null;
  }
}
