// app/HongKong.js  ← route: /HongKong

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

export default function HongKong() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <Image
          source={{
            uri:
              "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
          }}
          style={styles.hero}
        />

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Hong Kong</Text>
          <Text style={styles.subtitle}>Skylines, street food, and neon nights ✨</Text>
        </View>

        {/* Best Months (new style) */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Best Months to Visit</Text>
          </View>

          {/* Row 1: Oct → Dec */}
          <View style={bm.row}>
            <MonthIcon label="Oct" />
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} style={bm.arrow} />
            <MonthIcon label="Dec" />
          </View>

          {/* Row 2: Mar → Apr */}
          <View style={bm.row}>
            <MonthIcon label="Mar" />
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} style={bm.arrow} />
            <MonthIcon label="Apr" />
          </View>

          <Text style={[styles.text, { marginTop: 10, textAlign: "center" }]}>
            Dry, clear weather and pleasant temperatures great for views and markets.
          </Text>
        </View>

        {/* Activities Carousel (smaller banners) */}
        <ActivitiesCarousel
          title="Popular Activities"
          items={[
            {
              title: "Victoria Peak Tram",
              caption: "Sunset skyline panoramas",
              image:
                "https://images.unsplash.com/photo-1543966888-7f2b4613f0d2?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Star Ferry Ride",
              caption: "Harbor breeze + skyline shots",
              image:
                "https://images.unsplash.com/photo-1497954318647-6f2aaf36c3f3?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Temple Street Market",
              caption: "Neon nights & street food",
              image:
                "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Ngong Ping 360",
              caption: "Cable car to Big Buddha",
              image:
                "https://images.unsplash.com/photo-1541580621-cb3117c45c2b?q=80&w=1600&auto=format&fit=crop",
            },
            {
              title: "Sai Kung Hike",
              caption: "Beaches & blue waters",
              image:
                "https://images.unsplash.com/photo-1520781359717-3eb98461c9f0?q=80&w=1600&auto=format&fit=crop",
            },
          ]}
        />

        {/* History */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="book-outline" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Historical Highlights</Text>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.text}>A crossroads of East and West:</Text>

            <HistoryItem
              icon="time-outline"
              text="From a small fishing village to a major trading port in the 19th century."
            />
            <HistoryItem
              icon="git-branch-outline"
              text="Unique East–West blend shaped by Chinese heritage and British influence."
            />
            <HistoryItem
              icon="business-outline"
              text="Evolved into a leading global finance, logistics, and tourism hub."
            />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Reusable bits ===== */
function MonthIcon({ label }) {
  return (
    <View style={bm.item}>
      <Ionicons name="calendar-outline" size={48} color={COLORS.text} />
      <Text style={bm.label}>{label}</Text>
    </View>
  );
}

function HistoryItem({ icon, text }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primary}
        style={{ marginRight: 8, marginTop: 2 }}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

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

      <View style={ac.dotsRow}>
        {Array.from({ length: Math.min(5, items.length) }).map((_, i) => (
          <View key={i} style={[ac.dot, i === index && ac.dotActive]} />
        ))}
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { width: W, height: 220 },
  header: { padding: 16 },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.muted, marginTop: 4 },
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
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  text: { fontSize: 14, color: COLORS.muted, lineHeight: 20 },
});

const bm = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginVertical: 8 },
  item: { alignItems: "center", justifyContent: "center", gap: 6, minWidth: 110 },
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
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, marginBottom: 6 },
  headerText: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  card: {
    width: 320,
    height: 150,
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
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D5DAE6" },
  dotActive: { width: 18, borderRadius: 5, backgroundColor: COLORS.primary },
});
