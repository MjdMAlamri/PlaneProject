// app/ar-prayer.tsx
import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function ARPrayerRoute() {
  const router = useRouter();

  // simple perspective-like trail (nearer arrows larger/brighter)
  const ARROWS = new Array(6).fill(0).map((_, i) => {
    const idx = i;                       // 0 (far) -> 5 (near)
    const size = 20 + idx * 8;
    const opacity = 0.35 + idx * 0.1;
    const bottom = 120 + idx * 52;       // spacing up the screen
    return { key: `a-${i}`, size, opacity, bottom };
  });

  return (
    <View style={s.root}>
      <Image source={require("../assets/images/Camera.jpg")} style={s.mockImage} resizeMode="cover" />

      <SafeAreaView style={StyleSheet.absoluteFill}>
        {/* Top bar */}
        <View style={s.topBar}>
          <View style={s.topBtn} onTouchEnd={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </View>
          <Text style={s.topTitle}>Route to prayer room</Text>
          <View style={s.topBtn} />
        </View>

        {/* “Ground” arrows (center column) */}
        {ARROWS.map(({ key, size, opacity, bottom }) => (
          <Ionicons
            key={key}
            name="chevron-up"
            size={size}
            color="#FFFFFF"
            style={{
              position: "absolute",
              left: width / 2 - size / 2,
              bottom,
              opacity,
              textShadowColor: "rgba(0,0,0,0.6)",
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 8,
            }}
          />
        ))}

        {/* Destination marker */}
        <View style={s.marker}>
          <Ionicons name="location" size={16} color="#6E5DFF" />
          <Text style={s.markerTxt}>Prayer room</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  mockImage: { width: "100%", height: "100%" },

  topBar: {
    paddingHorizontal: 12,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  topTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },

  marker: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#EEF0FFEE",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DADFFE",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markerTxt: { color: "#0F172A", fontWeight: "800" },
});
