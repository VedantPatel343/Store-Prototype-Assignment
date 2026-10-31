import { Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";
import { formatMoney } from "../data/money";
import type { Product } from "../data/types";
import { ProductImage } from "./ProductImage";

export function lowestPriceMinor(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.priceMinor));
}

export function ProductCard({
  product,
  width,
  onPress,
}: {
  product: Product;
  width: number;
  onPress: () => void;
}) {
  const { store } = useStore();
  const prices = product.variants.map((variant) => variant.priceMinor);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const priceLabel = low === high ? formatMoney(low, store.currency) : `From ${formatMoney(low, store.currency)}`;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, { width }]}>
      <ProductImage
        imageKey={product.imageKey}
        fallbackColor={product.imageColor}
        label={product.title}
        radius={store.radius}
        style={{ width, height: Math.round(width * 1.28) }}
      />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.price, { color: store.colors.text }]}>{priceLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
  },
  copy: {
    gap: 4,
    minHeight: 62,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "700",
    minHeight: 38,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
