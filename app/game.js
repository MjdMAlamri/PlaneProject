// app/game.js
// In-flight Games — grid with consistent header & SAME bottom nav.
// If your (tabs)/_layout already renders a Tab bar, comment out the local tabbar at the bottom to avoid two bars.

import React, { useState } from "react";
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
import { useRouter } from "expo-router";

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
  dark: "#0B0B0B",
};

const GAMES = [
  {
    id: "sudoku",
    title: "Sudoku",
    sub: "Number puzzles",
    img: "https://images.unsplash.com/photo-1554774853-b415df9eeb92?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "chess",
    title: "Chess",
    sub: "Solo or 2-player",
    img: "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "wordsearch",
    title: "Word Search",
    sub: "Find hidden words",
    img: "https://images.unsplash.com/photo-1485053363070-41c7bd1e12ab?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    sub: "Classic cards",
    img: "https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "memory",
    title: "Memory Match",
    sub: "Flip & remember",
    img: "https://images.unsplash.com/photo-1542838686-73da91b86c36?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    sub: "Quick fun rounds",
    img: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function Games() {
  const router = useRouter();
  const [activeTab] = useState("In-flight games");

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* App bar */}
        <View style={s.appbar}>
          <Text style={s.brand}>
            Riyadh V-aiR<Text style={{ color: COLORS.primary }}>.</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              style={s.bell}
              onPress={() => {}}
            >
              <Ionicons name="information-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={s.bell} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View style={s.headerRow}>
          <Text style={s.h1}>Hub</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={s.iconBtn} onPress={() => {}}>
              <Ionicons name="filter-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={() => {}}>
              <Ionicons name="swap-vertical-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Segmented tabs */}
        <View style={s.segments}>
          <Segment label="Activities" active={false} onPress={() => router.push("/(tabs)/hub")} />
          <Segment label="In-flight games" active onPress={() => {}} />
        </View>

        <View style={[s.panel, { paddingTop: 12 }]}>
          <View style={s.panelHeader}>
            <View style={s.pip} />
            <Text style={s.sectionTitle}>In-flight games</Text>
          </View>

          {/* Grid 2 columns */}
          <View style={s.grid}>
            {GAMES.map((g) => (
              <TouchableOpacity key={g.id} activeOpacity={0.9} style={s.gameCard} onPress={() => {}}>
                <Image source={{ uri: g.img }} style={s.gameImg} />
                <View style={s.gameShade} />
                <View style={s.gameBody}>
                  <Text style={s.gameTitle}>{g.title}</Text>
                  <Text style={s.gameSub}>{g.sub}</Text>

                  <View style={s.previewBtn}>
                    <Text style={s.previewTxt}>Preview</Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav — Hub highlighted */}
      <View style={s.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/index")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon
          active
          icon={<Ionicons name="apps-outline" size={22} color={COLORS.text} />}
          label="Hub"
          onPress={() => router.push("/(tabs)/hub")}
        />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
  );
}

function Segment({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[s.seg, active ? s.segActive : s.segInactive]}>
      <Text style={[s.segTxt, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={s.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[s.tabIcon, active && s.tabIconActive]}>{icon}</View>
      <Text style={[s.tabLabel, active && { color: COLORS.text, fontWeight: "600" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 130 },

  appbar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 8,
  },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  headerRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 6,
  },
  h1: { fontSize: 18, fontWeight: "800", color: COLORS.text },

  segments: { flexDirection: "row", gap: 8, marginBottom: 10 },
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
  panelHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  pip: { width: 6, height: 18, borderRadius: 4, backgroundColor: COLORS.primary },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gameCard: {
    width: "48%",
    aspectRatio: 3 / 2,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  gameImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  gameShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  gameBody: { position: "absolute", left: 10, right: 10, bottom: 10 },
  gameTitle: { color: "#fff", fontWeight: "900", fontSize: 14 },
  gameSub: { color: "#F0F1F6", fontSize: 11, marginTop: 2, marginBottom: 8 },

  previewBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#FFB000",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // bottom tab bar (same as others)
  tabbar: {
    position: "absolute",
    left: 16, right: 16, bottom: 18, height: 64,
    backgroundColor: COLORS.panel, borderRadius: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-around",
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 10 }, shadowRadius: 14, elevation: 10,
    paddingHorizontal: 10,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F4F5F8", alignItems: "center", justifyContent: "center" },
  tabIconActive: { backgroundColor: COLORS.primarySoft1, borderWidth: 1, borderColor: COLORS.primaryBorder },
  tabLabel: { fontSize: 11, color: "#666", marginTop: 4 },
});
