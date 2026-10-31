import { MockReviewsAdapter } from "./MockReviewsAdapter";
import type { ReviewsAdapter } from "./ReviewsAdapter";

export const reviewsAdapter: ReviewsAdapter = new MockReviewsAdapter();
