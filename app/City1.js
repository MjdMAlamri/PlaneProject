// app/City1.js  ← route will be /City1 (case-sensitive on web)

import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const W = Dimensions.get("window").width;

const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft1: "#EEF0FF",
  primarySoft2: "#E9ECFF",
};

export default function City1() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_as_seen_from_the_Tour_Saint-Jacques_2011_07.jpg",
          }}
          style={styles.hero}
        />

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Paris</Text>
          <Text style={styles.subtitle}>The City of Light ✨</Text>
        </View>

        {/* Best Months (new style) */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Best Months to Visit</Text>
          </View>

          {/* Row 1: April → June */}
          <View style={bm.row}>
            <MonthIcon label="April" />
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} style={bm.arrow} />
            <MonthIcon label="June" />
          </View>

          {/* Row 2: Sep → Nov */}
          <View style={bm.row}>
            <MonthIcon label="Sep" />
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} style={bm.arrow} />
            <MonthIcon label="Nov" />
          </View>

          <Text style={[styles.text, { marginTop: 10, textAlign: "center" }]}>
            The weather is mild and the city is less crowded.
          </Text>
        </View>

        {/* Activities Carousel (smaller banners) */}
        <ActivitiesCarousel
          title="Popular Activities"
          items={[
            {
              title: "Eiffel Tower & Louvre",
              caption: "Iconic landmarks in one day",
              image:
                "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Seine River Cruise",
              caption: "Sunset views of Paris",
              image:
                "https://images.unsplash.com/photo-1562585195-97a21743fb01?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Café Hopping",
              caption: "Saint-Germain & Montparnasse",
              image:
                "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Champs-Élysées Shopping",
              caption: "Arc de Triomphe to Concorde",
              image:
                "https://images.unsplash.com/photo-1543352445-4bbb0734a1fa?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Montmartre Walk",
              caption: "Artists’ square & Sacré-Cœur",
              image:
                "https://images.unsplash.com/photo-1516542076529-1ea3854896e1?q=80&w=1600&auto=format&fit=crop",
            },
          ]}
        />

        {/* History */}
        {/* History */}
<View style={styles.card}>
  <View style={styles.sectionHeaderRow}>
    <Ionicons name="book-outline" size={18} color={COLORS.primary} />
    <Text style={styles.sectionTitle}>Historical Highlights</Text>
  </View>

  <View style={{ gap: 10 }}>
  <Text style={styles.text}>
  Paris has been a cultural and political hub for centuries,
      </Text>
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Ionicons
        name="time-outline"
        size={18}
        color={COLORS.primary}
        style={{ marginRight: 8, marginTop: 2 }}
      />
      <Text style={styles.text}>
        Founded in the 3rd century BC by a Celtic tribe.
      </Text>
    </View>

    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Ionicons
        name="color-palette-outline"
        size={18}
        color={COLORS.primary}
        style={{ marginRight: 8, marginTop: 2 }}
      />
      <Text style={styles.text}>
        Later became a hub of art, philosophy, and revolution.
      </Text>
    </View>

    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Ionicons
        name="home-outline"
        size={18}
        color={COLORS.primary}
        style={{ marginRight: 8, marginTop: 2 }}
      />
      <Text style={styles.text}>
        Iconic landmarks include Notre-Dame Cathedral, Arc de Triomphe, and the Palace of Versailles.
      </Text>
    </View>
  </View>
</View>


        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Best Months tiny component ===== */
function MonthIcon({ label }) {
  return (
    <View style={bm.item}>
      <Ionicons name="calendar-outline" size={48} color={COLORS.text} />
      <Text style={bm.label}>{label}</Text>
    </View>
  );
}

/* =======================
   Activities Carousel
   ======================= */
function ActivitiesCarousel({ title, items }) {
  const [index, setIndex] = useState(0);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length) setIndex(viewableItems[0].index ?? 0);
  }).current;

  return (
    <View style={ac.wrap}>
      <View style={ac.headerRow}>
        <Ionicons name="bicycle-outline" size={18} color={COLORS.primary} />
        <Text style={ac.headerText}>{title}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it, i) => `${it.title}-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => (
          <View style={ac.card}>
            <Image source={{ uri: item.image }} style={ac.img} />
            <LinearGradient
              colors={["rgba(0,0,0,0.05)", "rgba(0,0,0,0.55)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={ac.captionBox}>
              <Text style={ac.title}>{item.title}</Text>
              {item.caption ? <Text style={ac.caption}>{item.caption}</Text> : null}
            </View>
          </View>
        )}
      />

      {/* 5 dots */}
      <View style={ac.dotsRow}>
        {Array.from({ length: Math.min(5, items.length) }).map((_, i) => (
          <View key={i} style={[ac.dot, i === index && ac.dotActive]} />
        ))}
      </View>
    </View>
  );
}

/* =======================
   Styles
   ======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hero: {
    width: W,
    height: 220,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  text: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 20,
  },
});

const bm = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 8,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 110,
  },
  label: { fontSize: 16, color: COLORS.text, fontWeight: "600" },
  arrow: { marginHorizontal: 6 },
});

const ac = StyleSheet.create({
  wrap: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  headerText: { fontSize: 18, fontWeight: "700", color: COLORS.text },

  // Smaller banners per your request
  card: {
    width: 320,          // you can also use: W - 32 for full width
    height: 150,         // ← adjust this to shrink/grow banners
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  img: { width: "100%", height: "100%" },
  captionBox: { position: "absolute", left: 12, right: 12, bottom: 12 },
  title: { color: "#fff", fontWeight: "800", fontSize: 16, marginBottom: 2 },
  caption: { color: "#EAEAEA", fontSize: 12 },

  dotsRow: { flexDirection: "row", alignSelf: "center", gap: 6, marginTop: 10 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D5DAE6",
  },
  dotActive: {
    width: 18,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
});
