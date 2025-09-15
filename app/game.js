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
      "https://images.unsplash.com/photo-1601288496920-b6154fe3620b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "chess",
    title: "Chess",
    tagline: "Solo or 2-player on one device",
    image:
      "https://images.unsplash.com/photo-1529694157871-0d0d4a3c4f2b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "wordsearch",
    title: "Word Search",
    tagline: "Find hidden words offline",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "solitaire",
    title: "Solitaire",
    tagline: "Classic cards, no Wi-Fi",
    image:
      "https://images.unsplash.com/photo-1593030668930-5c0f4e0d9b5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "memory",
    title: "Memory Match",
    tagline: "Flip & remember the pairs",
    image:
      "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    tagline: "Quick facts & fun rounds",
    image:
      "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function GamesHub() {
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
});
