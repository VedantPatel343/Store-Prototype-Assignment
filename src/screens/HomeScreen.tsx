import { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { CartButton } from "../components/CartButton";
import { ProductCard } from "../components/ProductCard";
import { ProductImage } from "../components/ProductImage";
import { PrototypeTesting } from "../components/PrototypeTesting";
import { DelayedLoading, EmptyState, ErrorState } from "../components/StateViews";
import { stores } from "../config/stores";
import { useStore } from "../config/StoreContext";
import { demoControls, productRepository } from "../data/repository";
import type { Product } from "../data/types";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { RootStackParamList } from "../navigation/types";

const GUTTER = 16;
const GAP = 10;

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { store, selectStore } = useStore();
  const { width } = useWindowDimensions();
  const cardWidth = (width - GUTTER * 2 - GAP) / 2;
  const heroHeight = Math.min(Math.round(width * 0.72), 340);

  const loader = useCallback(() => productRepository.getCollection(store.id), [store.id]);
  const { phase, data, error, retry } = useAsyncResource(store.id, loader);
  const products = data ?? [];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: store.colors.background }]} edges={["top", "left", "right"]}>
      <FlatList
        key={store.id}
        data={phase === "ready" ? products : []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                <Text style={[styles.kicker, { color: store.colors.muted }]}>Shop</Text>
                <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]}>{store.name}</Text>
              </View>
              <CartButton />
            </View>
            <View
              style={[
                styles.switcher,
                {
                  backgroundColor: store.colors.surface,
                  borderColor: store.colors.line,
                  borderRadius: store.radius,
                },
              ]}
            >
              {stores.map((option) => {
                const selected = option.id === store.id;
                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected, disabled: selected }}
                    disabled={selected}
                    onPress={() => selectStore(option.id)}
                    style={[
                      styles.switchButton,
                      {
                        backgroundColor: selected ? store.colors.accent : "transparent",
                        borderRadius: store.radius,
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.switchLabel,
                        { color: selected ? store.colors.onAccent : store.colors.text },
                      ]}
                    >
                      {option.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={[styles.hero, { height: heroHeight, borderRadius: store.radius }]}>
              <ProductImage
                imageKey={store.heroImageKey}
                fallbackColor={store.colors.surface}
                label={`${store.name} promotion`}
                radius={store.radius}
                style={styles.heroImage}
              />
              <View style={styles.heroScrim} pointerEvents="none" />
              <View style={styles.heroCopy}>
                <Text style={styles.heroKicker}>{store.promoLabel}</Text>
                <Text style={styles.heroTitle}>{store.tagline}</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          phase === "error" ? (
            <ErrorState message={error ?? "The catalog could not be loaded."} onRetry={() => void retry()} />
          ) : phase === "loading" ? (
            <DelayedLoading phase={phase} label="Loading collection…" />
          ) : (
            <EmptyState title="No products yet" body="This store catalog is empty." />
          )
        }
        ListFooterComponent={
          <PrototypeTesting
            actions={[
              {
                label: "Simulate catalog error",
                onPress: () => {
                  demoControls.armCollectionFailure();
                  void retry();
                },
              },
              {
                label: "Open unknown product",
                onPress: () => navigation.navigate("Product", { productId: "missing-product" }),
              },
            ]}
          />
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.cardSlot}>
            <ProductCard
              product={item}
              width={cardWidth}
              onPress={() => navigation.navigate("Product", { productId: item.id })}
            />
          </View>
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
    paddingHorizontal: GUTTER,
    paddingBottom: 36,
  },
  columns: {
    gap: GAP,
  },
  header: {
    gap: 16,
    paddingTop: 8,
    paddingBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  switcher: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  switchButton: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  hero: {
    marginHorizontal: -GUTTER,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  heroImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heroScrim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  heroCopy: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    paddingTop: 48,
    gap: 6,
  },
  heroKicker: {
    color: "#F7F7F5",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#F7F7F5",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -0.4,
    maxWidth: 320,
  },
  cardSlot: {
    marginBottom: 18,
  },
});
