// app/game.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import BillboardCarousel from "./components/BillboardCarousel"; // NOTE path: app -> app/components

const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primaryBorder: "#DADFFE",
};

const FEATURED_GAMES = [
  {
    id: "sudoku",
    title: "Sudoku",
    subtitle: "Number puzzles",
    image:
      "https://images.unsplash.com/photo-1519974719765-e6559eac2575?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "chess",
    title: "Chess",
    subtitle: "Solo or 2-player",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    subtitle: "Quick fun rounds",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function GamesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      {/* hide the default stack header */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* App bar with logo */}
      <View style={s.appbar}>
        <Image
          source={require("../assets/images/Riyadh_Air_Logo.png")}
          style={s.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Riyadh Air"
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={s.bell}
            onPress={() => Alert.alert("In-flight games", "Quick games you can play offline.")}
          >
            <Ionicons name="information-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={s.bell} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* NEW: Featured billboard */}
      <BillboardCarousel
        type="game"
        data={FEATURED_GAMES}
        onPressPrimary={(item) => Alert.alert("Play", `Launching ${item.title}…`)}
      />

      {/* Segmented switch (no filter/sort here) */}
      <View style={s.segContainer}>
        <View style={s.segTrack}>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/hub")}
            style={[s.segButton]}
          >
            <Text style={s.segText}>Activities</Text>
          </TouchableOpacity>
          <View style={[s.segButton, s.segButtonActive, s.segRight]}>
            <Text style={[s.segText, s.segTextActive]}>In-flight games</Text>
          </View>
        </View>
        {/* no tools on the right */}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <View style={s.panel}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <View style={{ width: 6, height: 18, backgroundColor: "#6E5DFF", borderRadius: 4 }} />
            <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}>In-flight games</Text>
          </View>

          {/* Simple grid of cards (placeholders hook to router or Alert) */}
          <View style={s.grid}>
            {FEATURED_GAMES.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={s.gameCard}
                activeOpacity={0.9}
                onPress={() => Alert.alert("Preview", `Preview ${g.title}`)}
              >
                <Image source={{ uri: g.image }} style={s.cardImg} />
                <View style={s.cardShade} />
                <Text style={s.cardTitle}>{g.title}</Text>
                <Text style={s.cardSub}>{g.subtitle}</Text>
                <View style={s.previewBtn}>
                  <Text style={s.previewTxt}>Preview</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 8,
  },
  brandLogo: { width: 240, height: 42, marginLeft: -60 },
  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  segContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  segTrack: {
    flexDirection: "row",
    backgroundColor: "#ECEFF5",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  segButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999 },
  segRight: { marginLeft: 6 },
  segButtonActive: { backgroundColor: COLORS.text },
  segText: { fontWeight: "800", color: COLORS.text, fontSize: 13 },
  segTextActive: { color: "#fff" },

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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gameCard: {
    width: "48%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    backgroundColor: "#fff",
  },
  cardImg: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
  cardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  cardTitle: { position: "absolute", left: 10, top: 10, color: "#fff", fontWeight: "900" },
  cardSub: { position: "absolute", left: 10, top: 28, color: "#fff", opacity: 0.9, fontWeight: "700", fontSize: 12 },
  previewBtn: {
    position: "absolute",
    left: 10,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,166,0,0.95)",
  },
  previewTxt: { color: "#fff", fontWeight: "900", fontSize: 12 },
});
