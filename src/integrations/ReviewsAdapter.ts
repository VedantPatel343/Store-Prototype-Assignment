export type Review = {
  id: string;
  author: string;
  rating: number;
  body: string;
};

export type ReviewsResult = { status: "success"; reviews: Review[] } | { status: "unavailable" };

export interface ReviewsAdapter {
  getReviews(productId: string): Promise<ReviewsResult>;
}
