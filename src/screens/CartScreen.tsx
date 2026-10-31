import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../components/CartButton";
import { CheckoutDemoModal } from "../components/CheckoutDemoModal";
import { ProductImage } from "../components/ProductImage";
import { PrototypeTesting } from "../components/PrototypeTesting";
import { DelayedLoading, EmptyState, ErrorState, LoadingState } from "../components/StateViews";
import { useStore } from "../config/StoreContext";
import { useCartHydrated, useCartStore, useStoreCartLines } from "../data/cartStore";
import { cartCount } from "../data/cartLogic";
import { formatMoney } from "../data/money";
import { demoControls, productRepository } from "../data/repository";
import { canCheckout, resolveCartLines, subtotalMinor } from "../data/resolveCartLines";
import { useAsyncResource } from "../hooks/useAsyncResource";

export function CartScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openProduct = (productId?: string) => {
    if (productId) navigation.push("Product", { productId });
  };
  const { store } = useStore();
  const hydrated = useCartHydrated();
  const lines = useStoreCartLines(store.id);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeLine = useCartStore((state) => state.removeLine);
  const insertSavedLine = useCartStore((state) => state.insertSavedLine);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const loader = useCallback(() => productRepository.getCollection(store.id), [store.id]);
  const catalog = useAsyncResource(`cart:${store.id}`, loader);
  const resolved = catalog.data ? resolveCartLines(catalog.data, lines) : [];
  const subtotal = subtotalMinor(resolved);
  const checkoutAllowed = catalog.phase === "ready" && canCheckout(resolved);
  const hasBlockingLine = resolved.some((line) => line.status !== "ready");
  const count = cartCount(lines);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: store.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <Text style={[styles.kicker, { color: store.colors.muted }]}>{store.name}</Text>
        <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]}>Cart</Text>
        {hydrated && lines.length > 0 ? (
          <Text style={[styles.count, { color: store.colors.muted }]}>
            {count} {count === 1 ? "item" : "items"}
          </Text>
        ) : null}
        {!hydrated ? (
          <LoadingState label="Restoring your cart…" />
        ) : catalog.phase === "error" ? (
          <ErrorState message={catalog.error ?? "The cart could not be loaded."} onRetry={() => void catalog.retry()} />
        ) : catalog.phase === "loading" || !catalog.data ? (
          <DelayedLoading phase="loading" label="Loading cart…" />
        ) : lines.length === 0 ? (
          <EmptyState title="Your cart is empty" body="Add a product from the collection. It will stay here after a restart." />
        ) : (
          <View style={styles.lines}>
            {resolved.map((line) => (
              <View
                key={line.variantId}
                style={[
                  styles.line,
                  {
                    borderColor: store.colors.line,
                    backgroundColor: store.colors.surface,
                    borderRadius: store.radius,
                  },
                ]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View ${line.title ?? "saved item"} details`}
                  disabled={!line.productId}
                  onPress={() => openProduct(line.productId)}
                >
                  <ProductImage
                    imageKey={line.imageKey}
                    fallbackColor={line.imageColor ?? store.colors.line}
                    label={line.title ?? "Saved item"}
                    radius={store.radius}
                    style={styles.thumb}
                  />
                </Pressable>
                <View style={styles.lineBody}>
                  <View style={styles.titlePrice}>
                    <Pressable
                      style={styles.productLink}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${line.title ?? "saved item"} details`}
                      disabled={!line.productId}
                      onPress={() => openProduct(line.productId)}
                    >
                      <Text style={[styles.lineTitle, { color: store.colors.text }]} numberOfLines={2}>
                        {line.status === "missing" ? "Saved item" : line.title}
                      </Text>
                    </Pressable>
                    {line.status === "ready" && line.lineTotalMinor !== undefined ? (
                      <Text style={[styles.lineTotal, { color: store.colors.text }]}>
                        {formatMoney(line.lineTotalMinor, store.currency)}
                      </Text>
                    ) : null}
                  </View>
                  {line.status === "missing" ? (
                    <Text style={[styles.note, { color: store.colors.muted }]}>
                      This saved item is no longer in the catalog.
                    </Text>
                  ) : (
                    <Text style={[styles.note, { color: store.colors.muted }]}>
                      {line.variantName}
                      {line.unitPriceMinor !== undefined ? ` · ${formatMoney(line.unitPriceMinor, store.currency)}` : ""}
                    </Text>
                  )}
                  {line.status === "unavailable" ? (
                    <Text style={[styles.warning, { color: store.colors.warning }]}>
                      Unavailable. Remove it before checkout. It is excluded from the subtotal.
                    </Text>
                  ) : null}
                  <View style={styles.actions}>
                    {line.status === "ready" ? (
                      <View style={[styles.stepper, { borderColor: store.colors.line, borderRadius: store.radius }]}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Decrease quantity"
                          disabled={line.quantity <= 1}
                          onPress={() => setQuantity(store.id, line.variantId, line.quantity - 1)}
                          style={[styles.step, { opacity: line.quantity <= 1 ? 0.35 : 1 }]}
                        >
                          <Text style={{ color: store.colors.text, fontSize: 18 }}>−</Text>
                        </Pressable>
                        <Text style={[styles.qty, { color: store.colors.text }]}>{line.quantity}</Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Increase quantity"
                          onPress={() => setQuantity(store.id, line.variantId, line.quantity + 1)}
                          style={styles.step}
                        >
                          <Text style={{ color: store.colors.text, fontSize: 18 }}>+</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <View />
                    )}
                    <Pressable accessibilityRole="button" onPress={() => removeLine(store.id, line.variantId)} hitSlop={6}>
                      <Text style={[styles.remove, { color: store.colors.text }]}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
            <View style={[styles.summary, { borderTopColor: store.colors.line }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: store.colors.muted }]}>Subtotal</Text>
                <Text style={[styles.subtotal, { color: store.colors.text }]}>{formatMoney(subtotal, store.currency)}</Text>
              </View>
              {hasBlockingLine ? (
                <Text style={[styles.note, { color: store.colors.warning }]}>
                  Remove unavailable or missing items before checkout.
                </Text>
              ) : null}
              <Pressable
                accessibilityRole="button"
                disabled={!checkoutAllowed}
                onPress={() => setCheckoutOpen(true)}
                style={[
                  styles.checkout,
                  {
                    backgroundColor: checkoutAllowed ? store.colors.accent : store.colors.line,
                    borderRadius: store.radius,
                  },
                ]}
              >
                <Text
                  style={[styles.checkoutText, { color: checkoutAllowed ? store.colors.onAccent : store.colors.muted }]}
                >
                  Checkout
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {hydrated && catalog.data ? (
          <PrototypeTesting
            actions={[
              {
                label: "Simulate a saved unavailable item",
                onPress: () => {
                  const unavailable = catalog.data
                    ?.flatMap((product) => product.variants)
                    .find((variant) => !variant.available);
                  if (unavailable) {
                    insertSavedLine(store.id, unavailable.id);
                  }
                },
              },
              {
                label: "Simulate a missing saved item",
                onPress: () => insertSavedLine(store.id, "removed-variant"),
              },
            ]}
          />
        ) : null}
      </ScrollView>
      <CheckoutDemoModal
        visible={checkoutOpen}
        subtotal={subtotal}
        onClose={() => setCheckoutOpen(false)}
        lines={resolved.flatMap((line) =>
          line.status === "ready" && line.title && line.variantName && line.lineTotalMinor !== undefined
            ? [
                {
                  key: line.variantId,
                  title: line.title,
                  variantName: line.variantName,
                  quantity: line.quantity,
                  lineTotalMinor: line.lineTotalMinor,
                },
              ]
            : [],
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 8,
    paddingBottom: 40,
  },
  kicker: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  count: {
    fontSize: 14,
    marginBottom: 8,
  },
  lines: {
    gap: 12,
    marginTop: 8,
  },
  line: {
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  thumb: {
    width: 88,
    height: 112,
  },
  lineBody: {
    flex: 1,
    gap: 6,
  },
  titlePrice: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  lineTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },
  productLink: {
    flex: 1,
    minHeight: 44,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
  },
  warning: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  actions: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  step: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
  },
  remove: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  lineTotal: {
    fontSize: 14,
    fontWeight: "800",
  },
  summary: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  subtotal: {
    fontSize: 22,
    fontWeight: "800",
  },
  checkout: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  checkoutText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
