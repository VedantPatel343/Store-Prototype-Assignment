import { Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";
import { formatMoney } from "../data/money";
import type { Variant } from "../data/types";

export function VariantPicker({
  variants,
  selectedId,
  currency,
  onSelect,
}: {
  variants: Variant[];
  selectedId: string;
  currency: string;
  onSelect: (variantId: string) => void;
}) {
  const { store } = useStore();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: store.colors.muted }]}>Options</Text>
      <View style={styles.row}>
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          return (
            <Pressable
              key={variant.id}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: !variant.available }}
              onPress={() => onSelect(variant.id)}
              style={[
                styles.chip,
                {
                  borderRadius: store.radius,
                  borderColor: selected ? store.colors.accent : store.colors.line,
                  backgroundColor: selected ? store.colors.accent : store.colors.surface,
                  borderStyle: variant.available ? "solid" : "dashed",
                  opacity: variant.available || selected ? 1 : 0.72,
                },
              ]}
            >
              <Text
                style={[
                  styles.name,
                  {
                    color: selected ? store.colors.onAccent : store.colors.text,
                    textDecorationLine: variant.available ? "none" : "line-through",
                  },
                ]}
              >
                {variant.name}
              </Text>
              <Text style={[styles.meta, { color: selected ? store.colors.onAccent : store.colors.muted }]}>
                {formatMoney(variant.priceMinor, currency)}
              </Text>
              {variant.available ? null : (
                <Text style={[styles.soldOut, { color: selected ? store.colors.onAccent : store.colors.warning }]}>
                  Sold out
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    minHeight: 72,
    minWidth: 104,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
  soldOut: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 4,
  },
});
