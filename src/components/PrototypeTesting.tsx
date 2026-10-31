import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";
import { demoControls } from "../data/repository";

export function PrototypeTesting({
  actions,
}: {
  actions: { label: string; onPress: () => void }[];
}) {
  const { store } = useStore();
  const [open, setOpen] = useState(false);

  if (!demoControls.enabled || actions.length === 0) {
    return null;
  }

  return (
    <View style={[styles.box, { borderColor: store.colors.line, borderRadius: store.radius }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        style={styles.header}
      >
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: store.colors.text }]}>Prototype testing</Text>
          <Text style={[styles.hint, { color: store.colors.muted }]}>Hidden from the shop layout</Text>
        </View>
        <Text style={[styles.toggle, { color: store.colors.text }]}>{open ? "Hide" : "Show"}</Text>
      </Pressable>
      {open ? (
        <View style={[styles.body, { borderTopColor: store.colors.line }]}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              onPress={action.onPress}
              style={[styles.action, { borderColor: store.colors.line, borderRadius: store.radius }]}
            >
              <Text style={[styles.actionText, { color: store.colors.text }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 28,
    borderWidth: 1,
    overflow: "hidden",
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 12,
  },
  toggle: {
    fontSize: 13,
    fontWeight: "700",
  },
  body: {
    borderTopWidth: 1,
    padding: 12,
    gap: 8,
  },
  action: {
    minHeight: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
