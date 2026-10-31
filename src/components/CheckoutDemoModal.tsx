import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";
import { formatMoney } from "../data/money";

type CheckoutLine = {
  key: string;
  title: string;
  variantName: string;
  quantity: number;
  lineTotalMinor: number;
};

export function CheckoutDemoModal({
  visible,
  lines,
  subtotal,
  onClose,
}: {
  visible: boolean;
  lines: CheckoutLine[];
  subtotal: number;
  onClose: () => void;
}) {
  const { store } = useStore();
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: store.colors.surface,
              borderColor: store.colors.line,
              borderTopLeftRadius: Math.max(store.radius, 16),
              borderTopRightRadius: Math.max(store.radius, 16),
            },
          ]}
        >
          <Text style={[styles.kicker, { color: store.colors.muted }]}>Demo only</Text>
          <Text style={[styles.title, { color: store.colors.text, fontFamily: store.displayFont }]}>Checkout demo</Text>
          <Text style={[styles.body, { color: store.colors.muted }]}>
            No payment will be taken and no order will be placed.
          </Text>
          <View style={styles.lines}>
            {lines.map((line) => (
              <View key={line.key} style={styles.row}>
                <Text style={[styles.lineTitle, { color: store.colors.text }]}>
                  {line.title} · {line.variantName} × {line.quantity}
                </Text>
                <Text style={[styles.linePrice, { color: store.colors.text }]}>
                  {formatMoney(line.lineTotalMinor, store.currency)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={[styles.subtotal, { color: store.colors.text }]}>
            Subtotal {formatMoney(subtotal, store.currency)}
          </Text>
          <Text style={[styles.body, { color: store.colors.muted }]}>
            In production this app would create or update a cart with the Shopify Storefront API, read checkoutUrl
            from that cart, and open Shopify hosted checkout with a supported integration such as Checkout Sheet
            Kit.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.button, { backgroundColor: store.colors.accent, borderRadius: store.radius }]}
          >
            <Text style={[styles.buttonText, { color: store.colors.onAccent }]}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    gap: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
  },
  lines: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  lineTitle: {
    flex: 1,
    fontSize: 14,
  },
  linePrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  subtotal: {
    fontSize: 18,
    fontWeight: "800",
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
