import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BackButton, CartButton } from "../components/CartButton";
import { ProductImage } from "../components/ProductImage";
import { PrototypeTesting } from "../components/PrototypeTesting";
import { ReviewList, ReviewsFallback } from "../components/ReviewList";
import { DelayedLoading, ErrorState } from "../components/StateViews";
import { VariantPicker } from "../components/VariantPicker";
import { useStore } from "../config/StoreContext";
import { useCartStore } from "../data/cartStore";
import { formatMoney } from "../data/money";
import { demoControls, productRepository } from "../data/repository";
import type { Product } from "../data/types";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { ReviewsResult } from "../integrations/ReviewsAdapter";
import { reviewsAdapter } from "../integrations/reviews";
import type { RootStackParamList } from "../navigation/types";

type ProductLoad = { kind: "found"; product: Product } | { kind: "missing" };

const GUTTER = 20;

export function ProductScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Product">>();
  const { productId } = route.params;
  const { store } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const addVariant = useCartStore((state) => state.addVariant);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const productLoader = useCallback(async (): Promise<ProductLoad> => {
    const product = await productRepository.getProduct(store.id, productId);
    return product ? { kind: "found", product } : { kind: "missing" };
  }, [store.id, productId]);

  const reviewsLoader = useCallback(async (): Promise<ReviewsResult | null> => {
    if (!store.featureReviews) {
      return null;
    }
    return reviewsAdapter.getReviews(productId);
  }, [store.featureReviews, productId]);

  const productResource = useAsyncResource(`${store.id}:${productId}`, productLoader);
  const reviewsResource = useAsyncResource(
    `${store.id}:${productId}:${store.featureReviews ? "reviews" : "off"}`,
    reviewsLoader,
  );

  const product = productResource.data?.kind === "found" ? productResource.data.product : null;
  const selected = product?.variants.find((variant) => variant.id === selectedId) ?? product?.variants[0];
  const imageHeight = Math.min(Math.round(width * 1.15), 560);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safe, { backgroundColor: store.colors.background }]}>
      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.content}>
          {product && selected ? (
            <View style={styles.details}>
              <View style={[styles.hero, { height: imageHeight, marginHorizontal: -GUTTER, borderRadius: store.radius }]}>
                <ProductImage
                  imageKey={product.imageKey}
                  fallbackColor={product.imageColor}
                  label={product.title}
                  radius={store.radius}
                  style={styles.heroImage}
                />
                <View style={styles.topBar}>
                  <BackButton />
                  <CartButton />
                </View>
              </View>
              <Text style={[styles.kicker, { color: store.colors.muted }]}>{store.name}</Text>
              <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]}>{product.title}</Text>
              <Text style={[styles.price, { color: store.colors.text }]}>
                {formatMoney(selected.priceMinor, store.currency)}
              </Text>
              <Text style={[styles.description, { color: store.colors.muted }]}>{product.description}</Text>
              <VariantPicker
                variants={product.variants}
                selectedId={selected.id}
                currency={store.currency}
                onSelect={(variantId) => {
                  setSelectedId(variantId);
                  setAdded(false);
                }}
              />
              {store.featureReviews ? (
                <View style={styles.reviews}>
                  <Text style={[styles.section, { color: store.colors.text, fontFamily: store.displayFont }]}>Reviews</Text>
                  {reviewsResource.phase === "error" || reviewsResource.data?.status === "unavailable" ? (
                    <ReviewsFallback message="Reviews are unavailable right now. You can still add this product to the cart." />
                  ) : reviewsResource.phase === "loading" ? (
                    <DelayedLoading phase={reviewsResource.phase} label="Loading reviews…" />
                  ) : reviewsResource.data?.status === "success" ? (
                    <ReviewList reviews={reviewsResource.data.reviews} />
                  ) : null}
                </View>
              ) : null}
              <PrototypeTesting
                actions={[
                  {
                    label: "Simulate product error",
                    onPress: () => {
                      demoControls.armProductFailure();
                      void productResource.retry();
                    },
                  },
                ]}
              />
            </View>
          ) : (
            <View>
              <View style={styles.plainBar}>
                <BackButton />
                <CartButton />
              </View>
              {productResource.phase === "error" ? (
                <ErrorState
                  message={productResource.error ?? "The product could not be loaded."}
                  onRetry={() => void productResource.retry()}
                />
              ) : productResource.phase === "loading" ? (
                <DelayedLoading phase={productResource.phase} label="Loading product…" />
              ) : (
                <View style={styles.missing}>
                  <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]}>
                    Product not found
                  </Text>
                  <Text style={[styles.description, { color: store.colors.muted }]}>
                    This product is not in the current store catalog.
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
        {product && selected ? (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: Math.max(insets.bottom, 12),
                backgroundColor: store.colors.background,
                borderTopColor: store.colors.line,
              },
            ]}
          >
            <View style={styles.footerPrice}>
              <Text style={[styles.footerLabel, { color: store.colors.muted }]}>{selected.name}</Text>
              <Text style={[styles.footerAmount, { color: store.colors.text }]}>
                {formatMoney(selected.priceMinor, store.currency)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={!selected.available}
              onPress={() => {
                addVariant(store.id, selected.id, selected.available);
                if (selected.available) {
                  setAdded(true);
                }
              }}
              style={[
                styles.addButton,
                {
                  backgroundColor: selected.available ? store.colors.accent : store.colors.line,
                  borderRadius: store.radius,
                },
              ]}
            >
              <Text style={[styles.addText, { color: selected.available ? store.colors.onAccent : store.colors.muted }]}>
                {!selected.available ? "Unavailable" : added ? "Added to cart" : "Add to cart"}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingHorizontal: GUTTER,
    paddingBottom: 28,
  },
  plainBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  details: {
    gap: 12,
  },
  hero: {
    overflow: "hidden",
    marginBottom: 8,
  },
  heroImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  topBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
  },
  reviews: {
    marginTop: 16,
    gap: 12,
  },
  section: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  missing: {
    gap: 8,
    paddingVertical: 24,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  footerPrice: {
    minWidth: 96,
    gap: 2,
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  footerAmount: {
    fontSize: 16,
    fontWeight: "800",
  },
  addButton: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  addText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
