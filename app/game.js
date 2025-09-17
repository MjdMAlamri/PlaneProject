// app/game.js
// Hub → In-flight games (subpage). No native stack header, no bottom tab.

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft1: "#EEF0FF",
  primaryBorder: "#DADFFE",
  accent: "#FFCE31",
};

const GAMES = [
  {
    id: "sudoku",
    title: "Sudoku",
    subtitle: "Number puzzles",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "chess",
    title: "Chess",
    subtitle: "Solo or 2-player",
    image:
      "https://images.unsplash.com/photo-1530543787849-128d94430c6b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "wordsearch",
    title: "Word Search",
    subtitle: "Find hidden words",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    subtitle: "Classic cards",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "memory",
    title: "Memory Match",
    subtitle: "Flip & remember",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    subtitle: "Quick fun rounds",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HubGames() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      {/* Hide the native “← game” header */}
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* Top app bar with Riyadh Air logo */}
        <View style={[s.appbar, s.appbarEdge]}>
          <Image
            source={require("../assets/images/Riyadh_Air_Logo.png")}
            style={s.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Riyadh Air"
          />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={s.iconBtn} onPress={() => {}}>
              <Ionicons name="information-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => router.push("/notifications")}
            >
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Segmented tabs (no filter/sort in Games) */}
        <View style={s.segRow}>
          <TouchableOpacity
            style={[s.seg, s.segInactive]}
            onPress={() => router.replace("/hub")}
          >
            <Text style={s.segTxt}>Activities</Text>
          </TouchableOpacity>
          <View style={[s.seg, s.segActive]}>
            <Text style={[s.segTxt, { color: "#fff" }]}>In-flight games</Text>
          </View>
        </View>

        {/* Games grid */}
        <View style={s.panel}>
          <View style={s.sectionHeaderRow}>
            <View style={[s.pip, { backgroundColor: COLORS.primary }]} />
            <Text style={s.sectionTitle}>In-flight games</Text>
          </View>

          <View style={s.grid}>
            {GAMES.map((g) => (
              <View key={g.id} style={s.gameCard}>
                <Image source={{ uri: g.image }} style={s.cardImg} />
                <View style={s.cardShade} />
                <Text style={s.cardTitle}>{g.title}</Text>
                <Text style={s.cardSub}>{g.subtitle}</Text>

                <TouchableOpacity style={s.previewBtn} activeOpacity={0.9} onPress={() => {}}>
                  <Text style={s.previewTxt}>Preview</Text>
                  <Ionicons name="arrow-forward" size={14} color="#000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 24 },

  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  appbarEdge: { marginHorizontal: 0, paddingHorizontal: 0 },

  // “double and a half” look from earlier tweak
  brandLogo: { height: 42, width: 240, marginLeft: -60 },

  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F2F6",
    borderWidth: 1,
    borderColor: "#EBEDF3",
  },

  segRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  seg: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1 },
  segInactive: { backgroundColor: "#fff", borderColor: COLORS.primaryBorder },
  segActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  segTxt: { fontSize: 13, fontWeight: "800", color: COLORS.text },

  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  pip: { width: 6, height: 18, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gameCard: {
    width: "48%",
    aspectRatio: 1.05,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  cardImg: { ...StyleSheet.absoluteFillObject },
  cardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  cardTitle: {
    position: "absolute",
    left: 10,
    top: 10,
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  cardSub: {
    position: "absolute",
    left: 10,
    top: 30,
    color: "#EDEDED",
    fontSize: 11,
    fontWeight: "600",
  },
  previewBtn: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewTxt: { fontWeight: "800", color: "#000", fontSize: 12 },
});
