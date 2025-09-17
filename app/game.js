// app/game.js
// In-flight Games (Hub sub-tab) — same brand header & segmented control,
// NO native back header, NO filter/sort, bottom nav same as other pages.

import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";

const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primaryBorder: "#DADFFE",
};

export default function Games() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      {/* Hide the native back bar for this page */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* App bar (brand) */}
      <View style={[s.appbar, s.appbarEdge]}>
        <Image
          source={require("../assets/images/Riyadh_Air_Logo.png")}
          style={s.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Riyadh Air"
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={s.bell}
            onPress={() => {}}
            accessibilityLabel="Info"
          >
            <Ionicons name="information-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={s.bell} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Segmented control (Games active) */}
      <View style={s.segTrack}>
        <TouchableOpacity
          style={s.segBtn}
          activeOpacity={0.9}
          onPress={() => router.replace("/hub")}   // back to Activities without reloading header
        >
          <Text style={s.segLabel}>Activities</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.segBtn, s.segBtnActive]} activeOpacity={1}>
          <Text style={[s.segLabel, s.segLabelActive]}>In-flight games</Text>
        </TouchableOpacity>
      </View>

      {/* Games grid (your existing content kept) */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        <View style={s.panel}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <View style={{ width: 6, height: 18, borderRadius: 4, backgroundColor: COLORS.primary }} />
            <Text style={s.h1}>In-flight games</Text>
          </View>

          {/* Replace these cards with your real game items; structure kept same */}
          <View style={s.grid}>
            {[
              { t: "Sudoku", img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1200&auto=format&fit=crop" },
              { t: "Chess", img: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=1200&auto=format&fit=crop" },
              { t: "Word Search", img: "https://images.unsplash.com/photo-1553531768-7bee3ad34864?q=80&w=1200&auto=format&fit=crop" },
              { t: "Solitaire", img: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=1200&auto=format&fit=crop" },
              { t: "Memory Match", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" },
              { t: "Trivia Quiz", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" },
            ].map((g, i) => (
              <View key={i} style={s.gameCard}>
                <Image source={{ uri: g.img }} style={s.gameImg} />
                <View style={s.gameShade} />
                <Text style={s.gameTitle}>{g.t}</Text>
                <TouchableOpacity style={s.previewBtn} onPress={() => {}}>
                  <Text style={s.previewTxt}>Preview</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav — keep same bar; Hub highlighted */}
      <View style={s.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/index")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon active icon={<Ionicons name="apps-outline" size={22} color={COLORS.text} />} label="Hub" onPress={() => router.replace("/hub")} />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
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

  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    marginBottom: 10,
  },
  appbarEdge: { marginHorizontal: 0, paddingHorizontal: 0 },

  brandLogo: {
    height: 42,
    width: 240,
    marginLeft: -60,
  },

  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  // Segmented control
  segTrack: {
    flexDirection: "row",
    backgroundColor: "#ECEEF3",
    borderRadius: 999,
    padding: 4,
    marginHorizontal: 16,
    gap: 4,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  segBtnActive: { backgroundColor: COLORS.text },
  segLabel: { fontSize: 13, fontWeight: "800", color: COLORS.text, opacity: 0.65 },
  segLabelActive: { color: "#fff", opacity: 1 },

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
  h1: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  gameCard: {
    width: "48.2%",
    height: 150,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 4,
    padding: 10,
  },
  gameImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  gameShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  gameTitle: { position: "absolute", left: 12, top: 12, color: "#fff", fontWeight: "900" },
  previewBtn: {
    position: "absolute",
    left: 10, bottom: 10,
    backgroundColor: "#F59E0B",
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
    flexDirection: "row", alignItems: "center", gap: 6,
  },
  previewTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  // bottom nav
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
  tabIconActive: { backgroundColor: "#EEF0FF", borderWidth: 1, borderColor: COLORS.primaryBorder },
  tabLabel: { fontSize: 11, color: "#666", marginTop: 4 },
});
