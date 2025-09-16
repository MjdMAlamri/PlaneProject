// app/games.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const W = Dimensions.get("window").width;

/** Same palette as Home */
const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft: "#EEF0FF",
  primaryBorder: "#DADFFE",
  accent: "#FFCE31",
};

const GAMES = [
  {
    id: "sudoku",
    title: "Sudoku",
    tagline: "Relaxing number puzzles",
    image:
      "https://escape-sudoku.com/fmc/orig/c461/5064/573f/sudoku-image.webp",
  },
  {
    id: "chess",
    title: "Chess",
    tagline: "Solo or 2-player on one device",
    image:
      "https://fortune.com/img-assets/wp-content/uploads/2025/03/GettyImages-2148071253-e1741362105367.jpg?w=1440&q=75",
  },
  {
    id: "wordsearch",
    title: "Word Search",
    tagline: "Find hidden words offline",
    image:
      "https://images.unsplash.com/photo-1684335269060-55d7440b5d8c?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    tagline: "Classic cards, no Wi-Fi",
    image:
      "https://images.unsplash.com/photo-1589666671470-5c52fbff4142?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "memory",
    title: "Memory Match",
    tagline: "Flip & remember the pairs",
    image:
      "https://plus.unsplash.com/premium_photo-1676879781067-75642b342eb1?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    tagline: "Quick facts & fun rounds",
    image:
      "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=1200&auto=format&fit=crop",
  },
];

function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={s.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[s.tabIcon, active && s.tabIconActive]}>{icon}</View>
      <Text style={[s.tabLabel, active && { color: COLORS.text, fontWeight: "600" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function GamesHub() {
  const router = useRouter();
  const onOpen = (item) => {
    Alert.alert(item.title, "Demo only — gameplay coming soon ✈️");
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.panel}>
        {/* Section header (matches Home) */}
        <View style={s.sectionHeaderRow}>
          <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
          <Text style={s.sectionTitle}>In-flight Games</Text>
        </View>

        <FlatList
          data={GAMES}
          keyExtractor={(it) => it.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.9} onPress={() => onOpen(item)} style={s.card}>
              <ImageBackground source={{ uri: item.image }} style={s.cardImg} imageStyle={s.cardImgInner}>
                <View style={s.shade} />
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardSub}>{item.tagline}</Text>
                <View style={s.cta}>
                  <Text style={s.ctaTxt}>Preview</Text>
                  <Ionicons name="arrow-forward" size={14} color="#111" />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 6 }}
        />
      </View>

      {/* Bottom Nav (visual mock) — screen level so router is in scope */}
<View style={s.tabbar}>
        <TabIcon
          icon={<Ionicons name="home" size={22} color="#666" />}
          label="Home"
          onPress={() => router.push("/")}
        />
        <TabIcon
          icon={<Ionicons name="airplane-outline" size={22} color="#666" />}
          label="Trips"
          onPress={() => router.push("/Trips")}
        />
        <TabIcon
          icon={<Ionicons name="apps-outline" size={22} color="#666" />}
          label="Hub"
          onPress={() => router.push("/Hub")}
        />
        <TabIcon
          icon={<Ionicons name="person-outline" size={22} color="#666" />}
          label="Profile"
          onPress={() => router.push("/Profile")}
        />
      </View>

    </SafeAreaView>
  );
}

/* --- styles --- */
const CARD_W = (W - 16 /*screen pad left*/ - 16 /*screen pad right*/ - 14 /*panel pad left*/
  - 14 /*panel pad right*/ - 12 /*gap*/) / 2;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  panel: {
    flex: 1,
    margin: 16,
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

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // center the pip + title as a group
    marginBottom: 8,
  },
  sectionPip: {
    width: 6,
    height: 18,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,           // sits right beside the text
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,       // no flex/textAlign so it hugs the pip
  },
  card: {
    width: CARD_W,
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    backgroundColor: COLORS.primarySoft,
  },
  cardImg: { flex: 1, padding: 10, justifyContent: "flex-end" },
  cardImgInner: { resizeMode: "cover" },
  shade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },

  cardTitle: { color: "#fff", fontWeight: "900", fontSize: 16, letterSpacing: 0.2 },
  cardSub: { color: "#F1F5F9", fontSize: 12, marginTop: 2 },

  cta: {
    marginTop: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  ctaTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },
  // tab bar
  tabbar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 64,
    backgroundColor: COLORS.panel,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 10,
    paddingHorizontal: 10,
  },
  tabItem: { alignItems: "center", justifyContent: "center" },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F4F5F8",
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconActive: {
    backgroundColor: COLORS.primarySoft1,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  tabLabel: { fontSize: 11, color: "#666", marginTop: 4 },

  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 120 },
});
