// app/ar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const COLORS = {
  text: "#0F172A",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primaryBorder: "#DADFFE",
  bubbleBg: "#EEF0FFEE",
};

export default function ARMockScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <Image
        source={require("../assets/images/Camera.jpg")}
        style={s.mockImage}
        resizeMode="cover"
      />

      {/* Overlay */}
      <SafeAreaView style={StyleSheet.absoluteFill}>
        {/* Top bar */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.topBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={s.topTitle}>AR Navigation</Text>
          <View style={s.topBtn} />
        </View>

        {/* Suggestions bubble */}
        <View style={s.bubble}>
          <Text style={s.bubbleTitle}>Suggested nearby places</Text>

          {/* Prayer room -> navigates to /ar-prayer */}
          <TouchableOpacity style={s.row} activeOpacity={0.8} onPress={() => router.push("/ar-prayer")}>
            <View style={s.dot} />
            <Text style={s.item}>Prayer room</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.text} style={{ marginLeft: "auto" }} />
          </TouchableOpacity>

          {/* Gate [ ] with "choose" affordance */}
          <TouchableOpacity style={s.row} activeOpacity={0.7}>
            <View style={s.dot} />
            <Text style={s.item}>Gate&nbsp;[&nbsp;]</Text>
            <View style={s.choosePill}>
              <Text style={s.chooseTxt}>Choose</Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          {/* Coffee shop (no nav for now) */}
          <View style={s.row}>
            <View style={s.dot} />
            <Text style={s.item}>Coffee shop</Text>
          </View>
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

  bubble: {
    position: "absolute",
    top: "35%",
    alignSelf: "center",
    width: Math.min(width * 0.8, 340),
    backgroundColor: COLORS.bubbleBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  bubbleTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },
  item: { color: COLORS.text, fontSize: 16, fontWeight: "700" },

  choosePill: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  chooseTxt: { color: COLORS.text, fontSize: 12, fontWeight: "800" },
});
