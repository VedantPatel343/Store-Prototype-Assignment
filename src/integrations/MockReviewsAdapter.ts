import type { Review, ReviewsAdapter, ReviewsResult } from "./ReviewsAdapter";

const UNAVAILABLE_PRODUCT_IDS = new Set(["apex-flex-hoodie"]);

const sampleReviews: Review[] = [
  {
    id: "sample-1",
    author: "Sample shopper",
    rating: 5,
    body: "Sample review. The fit matched the size chart and the fabric held up after washing.",
  },
  {
    id: "sample-2",
    author: "Alex M.",
    rating: 4,
    body: "Sample review. Comfortable for training. I would size up if you want a looser layer.",
  },
];

export class MockReviewsAdapter implements ReviewsAdapter {
  async getReviews(productId: string): Promise<ReviewsResult> {
    if (UNAVAILABLE_PRODUCT_IDS.has(productId)) {
      return { status: "unavailable" };
    }
    return {
      status: "success",
      reviews: sampleReviews.map((review) => ({ ...review })),
    };
  }
}
