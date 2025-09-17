// app/game.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BillboardCarousel from "./components/BillboardCarousel"; // app -> app/components

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
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "chess",
    title: "Chess",
    subtitle: "Solo or 2-player",
    image:
      "https://images.unsplash.com/photo-1519981593452-666cf05569a9?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    subtitle: "Classic cards",
    image:
      "https://images.unsplash.com/photo-1518002171953-a080ee817e1e?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function GamePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={st.safe}>
      {/* Hide the native header bar */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* App bar */}
      <View style={st.appbar}>
        <Image
          source={require("../assets/images/Riyadh_Air_Logo.png")}
          style={st.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Riyadh Air"
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={st.bell}>
            <Ionicons name="information-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={st.bell}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured billboard for games */}
      <BillboardCarousel
        type="game"
        data={GAMES}
        onPressPrimary={(g) => console.log("Play", g.id)}
      />

      {/* Segmented pill bar (Games active) */}
      <View style={st.segWrap}>
        <View style={st.segTrack}>
          <TouchableOpacity
            onPress={() => router.replace("/hub")}
            style={st.segBtn}
            activeOpacity={0.9}
          >
            <Text style={st.segTxt}>Activities</Text>
          </TouchableOpacity>
          <View style={[st.segBtn, st.segBtnActive]}>
            <Text style={[st.segTxt, st.segTxtActive]}>In-flight games</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        <View style={st.panel}>
          <Text style={st.h2}>In-flight games</Text>
          {/* …your grid/list of game cards goes here… */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* styles (match other pages) */
const st = StyleSheet.create({
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

  segWrap: { paddingHorizontal: 16, marginTop: 6 },
  segTrack: {
    flexDirection: "row",
    backgroundColor: "#ECEFF5",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  segBtnActive: { backgroundColor: COLORS.text },
  segTxt: { fontWeight: "800", color: COLORS.text, fontSize: 13 },
  segTxtActive: { color: "#fff" },

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
  h2: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
});
