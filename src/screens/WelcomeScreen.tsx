import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { defaultStoreId, stores } from "../config/stores";
import { useStore } from "../config/StoreContext";

export function WelcomeScreen() {
  const { store, selectStore } = useStore();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: store.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={[styles.kicker, { color: store.colors.muted }]}>Independent stores</Text>
          <Text style={[styles.brand, { color: store.colors.text, fontFamily: store.displayFont }]}>{store.name}</Text>
          <Text style={[styles.tagline, { color: store.colors.muted }]}>{store.tagline}</Text>
        </View>
        <View style={styles.actions}>
          <Text style={[styles.choose, { color: store.colors.muted }]}>Choose a store</Text>
          {stores.map((option) => (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              onPress={() => selectStore(option.id)}
              style={[
                styles.storeButton,
                {
                  backgroundColor: option.colors.surface,
                  borderColor: option.colors.line,
                  borderRadius: option.radius,
                },
              ]}
            >
              <View style={[styles.swatch, { backgroundColor: option.colors.accent }]} />
              <View style={styles.storeCopy}>
                <Text style={[styles.storeName, { color: option.colors.text, fontFamily: option.displayFont }]}>
                  {option.name}
                </Text>
                <Text style={[styles.storeTag, { color: option.colors.muted }]}>{option.tagline}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" onPress={() => selectStore(defaultStoreId)} style={styles.skip}>
            <Text style={[styles.skipText, { color: store.colors.text }]}>Skip</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
    justifyContent: "space-between",
  },
  hero: {
    paddingTop: 64,
    gap: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  brand: {
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  tagline: {
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 320,
  },
  actions: {
    gap: 12,
  },
  choose: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  storeButton: {
    minHeight: 76,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  swatch: {
    width: 8,
    alignSelf: "stretch",
  },
  storeCopy: {
    flex: 1,
    gap: 3,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "800",
  },
  storeTag: {
    fontSize: 13,
    lineHeight: 18,
  },
  skip: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
