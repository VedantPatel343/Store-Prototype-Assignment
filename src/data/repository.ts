import { MockProductRepository } from "./MockProductRepository";
import type { ProductRepository } from "./ProductRepository";

const mockProductRepository = new MockProductRepository();

export const productRepository: ProductRepository = mockProductRepository;

export const demoControls = {
  enabled: true,
  armCollectionFailure: () => {
    mockProductRepository.armCollectionFailure();
  },
  armProductFailure: () => {
    mockProductRepository.armProductFailure();
  },
};
