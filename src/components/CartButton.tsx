import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../config/StoreContext";
import { cartCount } from "../data/cartLogic";
import { useStoreCartLines } from "../data/cartStore";
import type { RootStackParamList } from "../navigation/types";

export function CartButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { store } = useStore();
  const lines = useStoreCartLines(store.id);
  const count = cartCount(lines);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cart, ${count} items`}
      onPress={() => navigation.navigate("Cart")}
      style={[
        styles.button,
        {
          borderColor: store.colors.line,
          backgroundColor: store.colors.surface,
          borderRadius: store.radius === 0 ? 0 : 22,
        },
      ]}
    >
      <Text style={[styles.label, { color: store.colors.text }]}>Cart</Text>
      <View style={[styles.badge, { backgroundColor: store.colors.accent }]}>
        <Text style={[styles.badgeText, { color: store.colors.onAccent }]}>{count}</Text>
      </View>
    </Pressable>
  );
}

export function BackButton() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { store } = useStore();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.goBack()}
      hitSlop={8}
      style={[
        styles.backBtn,
        {
          backgroundColor: store.colors.surface,
          borderColor: store.colors.line,
          borderRadius: store.radius === 0 ? 0 : 22,
        },
      ]}
    >
      <Text style={[styles.back, { color: store.colors.text }]}>Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  backBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  back: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
