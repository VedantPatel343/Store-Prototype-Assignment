import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { catalogImages } from "../data/productImages";

function inkFor(hex: string): string {
  const raw = hex.replace("#", "");
  if (raw.length !== 6) {
    return "#F7F7F5";
  }
  const red = Number.parseInt(raw.slice(0, 2), 16);
  const green = Number.parseInt(raw.slice(2, 4), 16);
  const blue = Number.parseInt(raw.slice(4, 6), 16);
  const luma = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luma > 0.62 ? "#1A1A1A" : "#F7F7F5";
}

export function ProductImage({
  imageKey,
  fallbackColor,
  label,
  style,
  radius = 0,
}: {
  imageKey?: string;
  fallbackColor: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  radius?: number;
}) {
  const source = imageKey ? catalogImages[imageKey] : undefined;
  const [failed, setFailed] = useState(!source && Boolean(imageKey));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(!source && Boolean(imageKey));
    setLoaded(false);
  }, [imageKey, source]);

  const showPhoto = Boolean(source) && !failed;
  const isHero = imageKey?.endsWith("-hero") ?? false;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={failed && imageKey ? `${label}. Image unavailable` : label}
      style={[styles.frame, { backgroundColor: showPhoto && !isHero ? "#DAD8D4" : fallbackColor, borderRadius: radius }, style]}
    >
      {showPhoto && source ? (
        <Image
          source={source}
          style={styles.image}
          resizeMode={isHero ? "cover" : "contain"}
          onLoadEnd={() => setLoaded(true)}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : null}
      {showPhoto && !loaded ? (
        <View style={styles.loading} pointerEvents="none">
          <View style={styles.spinner}>
            <ActivityIndicator color="#1A1A1A" />
          </View>
        </View>
      ) : null}
      {!showPhoto && imageKey ? (
        <Text style={[styles.fallback, { color: inkFor(fallbackColor) }]}>Image unavailable</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Bundled images have intrinsic pixel dimensions. Override both dimensions
  // so native layout scales the bitmap to its frame instead of clipping it.
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  frame: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});
