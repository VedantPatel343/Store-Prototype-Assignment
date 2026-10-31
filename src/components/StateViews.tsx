import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useStore } from "../config/StoreContext";

export function LoadingState({ label }: { label: string }) {
  const { store } = useStore();
  return (
    <View style={styles.block}>
      <Text style={[styles.title, { color: store.colors.text }]}>{label}</Text>
    </View>
  );
}

export function DelayedLoading({ phase, label }: { phase: "loading" | "ready" | "error"; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (phase !== "loading") {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase !== "loading" || !visible) {
    return null;
  }
  return <LoadingState label={label} />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { store } = useStore();
  return (
    <View style={styles.block}>
      <Text style={[styles.title, { color: store.colors.text }]}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onRetry}
        style={[styles.button, { backgroundColor: store.colors.accent, borderRadius: store.radius }]}
      >
        <Text style={[styles.buttonText, { color: store.colors.onAccent }]}>Retry</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  const { store } = useStore();
  return (
    <View style={styles.block}>
      <Text style={[styles.title, { color: store.colors.text }]}>{title}</Text>
      <Text style={[styles.body, { color: store.colors.muted }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 28,
    gap: 12,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  body: {
    fontSize: 15,
    lineHeight: 21,
  },
  button: {
    alignSelf: "flex-start",
    minHeight: 48,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
