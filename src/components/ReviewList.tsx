import { StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";
import type { Review } from "../integrations/ReviewsAdapter";

function stars(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const { store } = useStore();
  return (
    <View style={styles.list}>
      {reviews.map((review) => (
        <View
          key={review.id}
          style={[
            styles.card,
            {
              borderColor: store.colors.line,
              backgroundColor: store.colors.surface,
              borderRadius: store.radius,
            },
          ]}
        >
          <View style={styles.metaRow}>
            <Text style={[styles.author, { color: store.colors.text }]}>{review.author}</Text>
            <Text style={[styles.rating, { color: store.colors.text }]}>{stars(review.rating)}</Text>
          </View>
          <Text style={[styles.body, { color: store.colors.muted }]}>{review.body}</Text>
        </View>
      ))}
    </View>
  );
}

export function ReviewsFallback({ message }: { message: string }) {
  const { store } = useStore();
  return (
    <View
      style={[
        styles.fallback,
        {
          backgroundColor: store.colors.surface,
          borderColor: store.colors.line,
          borderRadius: store.radius,
        },
      ]}
    >
      <Text style={[styles.body, { color: store.colors.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  author: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },
  rating: {
    fontSize: 13,
    letterSpacing: 1,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  fallback: {
    borderWidth: 1,
    padding: 14,
  },
});
