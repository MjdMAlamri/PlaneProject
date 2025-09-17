// app/(tabs)/hub.js
import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BillboardCarousel from "../components/BillboardCarousel"; // NOTE path: app/(tabs) -> app/components

/** Theme */
const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft1: "#EEF0FF",
  primarySoft2: "#E9ECFF",
  primaryBorder: "#DADFFE",
  accent: "#FFCE31",
};
const FALLBACK_IMG = "https://placehold.co/1200x800/jpg?text=Riyadh+Air";

const FLAGS = { "Saudi Arabia": "🇸🇦", Japan: "🇯🇵", Oman: "🇴🇲", Georgia: "🇬🇪" };
const flagOf = (c) => FLAGS[c] || "🏳️";

/** Demo data */
const DATA = [
  {
    id: "tokyo-teamlab",
    title: "teamLab Planets (Immersive Art)",
    city: "Tokyo",
    country: "Japan",
    type: "group",
    rating: 5.0,
    capacity: 6,
    booked: 0,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "osaka-matcha",
    title: "Traditional Matcha Ceremony Experience",
    city: "Osaka",
    country: "Japan",
    type: "solo",
    rating: 4.9,
    capacity: 3,
    booked: 2,
    image:
      "https://images.unsplash.com/photo-1541845153-9f1d8bfa9a93?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "osaka-shuriken",
    title: "Shuriken (Ninja Star) Making Experience",
    city: "Osaka",
    country: "Japan",
    type: "group",
    rating: 4.7,
    capacity: 5,
    booked: 5,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop",
  },
];

const sorters = {
  recommended: (a, b) => {
    const r = b.rating - a.rating;
    if (r !== 0) return r;
    return b.capacity - b.booked - (a.capacity - a.booked);
  },
  rating_desc: (a, b) => b.rating - a.rating,
  rating_asc: (a, b) => a.rating - b.rating,
};

export default function HubActivities() {
  const router = useRouter();
  const [items, setItems] = useState(DATA);

  // filters / sort
  const [availability, setAvailability] = useState(null);
  const [minRating, setMinRating] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [activeTab, setActiveTab] = useState("Activities");

  // sheets
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const filterActiveCount =
    (availability ? 1 : 0) + (minRating ? 1 : 0) + (typeFilter ? 1 : 0);

  const spotsLeft = (it) => Math.max(0, it.capacity - it.booked);

  const filtered = useMemo(() => {
    return items
      .filter((it) => {
        if (availability === "available" && spotsLeft(it) <= 0) return false;
        if (availability === "full" && spotsLeft(it) > 0) return false;
        if (minRating != null && it.rating < minRating) return false;
        if (typeFilter && it.type !== typeFilter) return false;
        return true;
      })
      .sort(sorters[sortBy]);
  }, [items, availability, minRating, typeFilter, sortBy]);

  const onAddToPlan = (id) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        if (spotsLeft(it) <= 0) {
          Alert.alert("Fully booked", "No spots left for this activity.");
          return it;
        }
        Toast.show("Added to Plan");
        return { ...it, booked: it.booked + 1 };
      })
    );
  };

  const keyExtractor = useCallback((it) => it.id, []);
  const getItemLayout = useCallback((_, index) => {
    const H = 196; // height + gap
    return { length: H, offset: H * index, index };
  }, []);

  const renderStars = (r) => {
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        {Array.from({ length: full }).map((_, i) => (
          <Ionicons key={`f${i}`} name="star" size={14} color={COLORS.accent} />
        ))}
        {half && <Ionicons name="star-half" size={14} color={COLORS.accent} />}
        {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
          <Ionicons key={`o${i}`} name="star-outline" size={14} color={COLORS.accent} />
        ))}
        <Text style={styles.ratingText}>{r.toFixed(1)}</Text>
      </View>
    );
  };

  const ActivityCard = ({ item }) => {
    const [imgOk, setImgOk] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    return (
      <View
        style={styles.card}
        accessible
        accessibilityLabel={`${item.title}. ${item.city}, ${item.country}. Rating ${item.rating}.`}
      >
        <Image
          source={{ uri: imgErr ? FALLBACK_IMG : item.image }}
          style={styles.cardImage}
          onLoad={() => setImgOk(true)}
          onError={() => setImgErr(true)}
        />
        {!imgOk && <View style={styles.skelWrap} />}

        <View style={styles.cardTopRow}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{item.type === "solo" ? "Solo" : "Group"}</Text>
          </View>

          <TouchableOpacity
            onPress={() => onAddToPlan(item.id)}
            activeOpacity={0.9}
            style={[styles.signupBtn, spotsLeft(item) <= 0 && { opacity: 0.6 }]}
            disabled={spotsLeft(item) <= 0}
          >
            <Text style={styles.signupText}>
              {item.booked}/{item.capacity} | {spotsLeft(item) > 0 ? "Add to Plan" : "Full"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardBottom}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {item.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.locationText}>
              {flagOf(item.country)} {item.city}, {item.country}
            </Text>
          </View>
          {renderStars(item.rating)}
        </View>
      </View>
    );
  };

  /** Header (logo + billboard + segments + tools) */
  const Header = (
    <>
      {/* App bar with Riyadh Air logo on the far left */}
      <View style={styles.appbar}>
        <Image
          source={require("../../assets/images/Riyadh_Air_Logo.png")}
          style={styles.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Riyadh Air"
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={styles.bell}
            onPress={() =>
              Alert.alert(
                "Hub",
                "Discover activities, traveler plans, and in-flight games. Save favorites and add them to your trip."
              )
            }
          >
            <Ionicons name="information-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bell} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* NEW: Featured billboard */}
      <BillboardCarousel
        type="activity"
        data={filtered.slice(0, 3)}            // top recommendations from current filter/sort
        onPressPrimary={(item) => onAddToPlan(item.id)}
      />

      {/* Segmented tabs + tools (filters only for Activities) */}
      <View style={styles.segContainer}>
        <View style={styles.segTrack}>
          <TouchableOpacity
            onPress={() => setActiveTab("Activities")}
            style={[styles.segButton, activeTab === "Activities" && styles.segButtonActive]}
          >
            <Text style={[styles.segText, activeTab === "Activities" && styles.segTextActive]}>
              Activities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/game")}
            style={[styles.segButton, styles.segRight, activeTab !== "Activities" && styles.segButtonActive]}
          >
            <Text style={[styles.segText, activeTab !== "Activities" && styles.segTextActive]}>
              In-flight games
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "Activities" && (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowSort(false);
                  setShowFilter((v) => !v);
                }}
                style={styles.iconBtn}
              >
                <Ionicons name="filter-outline" size={18} color={COLORS.text} />
              </TouchableOpacity>
              {filterActiveCount > 0 && (
                <View style={styles.dotBadge}>
                  <Text style={styles.dotTxt}>{filterActiveCount}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowFilter(false);
                setShowSort((v) => !v);
              }}
              style={styles.iconBtn}
            >
              <Ionicons name="swap-vertical-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Country label */}
      <Text style={styles.country}>Japan</Text>
      <View style={[styles.panel, { paddingTop: 10, paddingBottom: 6, marginBottom: 12 }]} />
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <ActivityCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <View style={[styles.panel, { marginTop: -6 }]}>
            <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 6 }}>
              No activities match your filters.
            </Text>
            <Text style={{ color: COLORS.muted, marginBottom: 10 }}>
              Try clearing filters or switching tabs.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setAvailability(null);
                setMinRating(null);
                setTypeFilter(null);
              }}
              style={styles.clearBtn}
            >
              <Text style={styles.clearTxt}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        }
        removeClippedSubviews
        windowSize={8}
        getItemLayout={getItemLayout}
      />

      {/* FILTER SHEET */}
      {showFilter && (
        <Pressable style={styles.sheetOverlay} onPress={() => setShowFilter(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>Filter</Text>

            <Text style={styles.sheetSection}>Spots</Text>
            <View style={styles.rowWrap}>
              <Chip
                label="Available"
                active={availability === "available"}
                onPress={() => setAvailability((v) => (v === "available" ? null : "available"))}
              />
              <Chip
                label="Full"
                active={availability === "full"}
                onPress={() => setAvailability((v) => (v === "full" ? null : "full"))}
              />
            </View>

            <Text style={styles.sheetSection}>Rating</Text>
            <View style={styles.rowWrap}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Chip
                  key={n}
                  label={`${n}★+`}
                  active={minRating === n}
                  onPress={() => setMinRating((r) => (r === n ? null : n))}
                />
              ))}
            </View>

            <Text style={styles.sheetSection}>Type</Text>
            <View style={styles.rowWrap}>
              <Chip
                label="Solo"
                active={typeFilter === "solo"}
                onPress={() => setTypeFilter((t) => (t === "solo" ? null : "solo"))}
              />
              <Chip
                label="Group"
                active={typeFilter === "group"}
                onPress={() => setTypeFilter((t) => (t === "group" ? null : "group"))}
              />
            </View>
          </Pressable>
        </Pressable>
      )}

      {/* SORT SHEET */}
      {showSort && (
        <Pressable style={styles.sheetOverlay} onPress={() => setShowSort(false)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>Sort by</Text>
            <SortRow label="Rating: Low → High" active={sortBy === "rating_asc"} onPress={() => setSortBy("rating_asc")} />
            <SortRow label="Rating: High → Low" active={sortBy === "rating_desc"} onPress={() => setSortBy("rating_desc")} />
            <SortRow label="Recommended" active={sortBy === "recommended"} onPress={() => setSortBy("recommended")} />
          </Pressable>
        </Pressable>
      )}

      {/* Toast */}
      <Toast.Slot />

      {/* Bottom nav (Hub highlighted) */}
      <View style={styles.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/index")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon active icon={<Ionicons name="apps-outline" size={22} color={COLORS.text} />} label="Hub" />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
  );
}

/* — small components — */
function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.chip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
    >
      <Text style={[styles.chipText, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SortRow({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.sortRow} activeOpacity={0.9}>
      <Text style={[styles.sortLabel, active && { color: COLORS.primary }]}>{label}</Text>
      {active && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
    </TouchableOpacity>
  );
}

function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</View>
      <Text style={[styles.tabLabel, active && { color: COLORS.text, fontWeight: "600" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* Tiny toast */
const Toast = {
  ref: null,
  show(msg = "Saved") {
    if (Toast.ref) Toast.ref.current?.show(msg);
  },
  Slot() {
    const api = useRef({ show: () => {} });
    const opacity = useRef(new Animated.Value(0)).current;
    const [text, setText] = useState("");
    const show = (m) => {
      setText(m);
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    };
    api.current.show = show;
    Toast.ref = api;
    return (
      <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
        <Text style={styles.toastTxt}>{text}</Text>
      </Animated.View>
    );
  },
};

/* — styles — */
const styles = StyleSheet.create({
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

  // Segmented switch row + tools
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
  segButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  segRight: { marginLeft: 6 },
  segButtonActive: { backgroundColor: COLORS.text },
  segText: { fontWeight: "800", color: COLORS.text, fontSize: 13 },
  segTextActive: { color: "#fff" },

  iconBtn: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F1F2F6", borderWidth: 1, borderColor: "#EBEDF3",
  },
  dotBadge: {
    position: "absolute", right: -2, top: -2, minWidth: 16, height: 16, borderRadius: 9,
    backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: 3,
  },
  dotTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },

  country: { marginLeft: 16, marginBottom: 8, color: COLORS.text, fontSize: 16, fontWeight: "800" },

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

  /* Sheets */
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 10,
  },
  sheet: {
    width: "92%",
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
  sheetSection: { fontSize: 12, fontWeight: "800", color: COLORS.muted, marginTop: 8, marginBottom: 4 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#FFF",
  },
  chipText: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  sortRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sortLabel: { color: COLORS.text, fontWeight: "800" },

  /* Cards */
  card: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardImage: { ...StyleSheet.absoluteFillObject },
  cardTopRow: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  typePill: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  typePillText: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  signupBtn: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  signupText: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  cardBottom: { position: "absolute", left: 12, right: 12, bottom: 10, zIndex: 2 },
  cardTitle: { color: "#FFF", fontWeight: "900", fontSize: 16, marginBottom: 6 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  locationText: { color: "#FFF", fontWeight: "700" },
  ratingText: {
    color: "#FFF",
    fontWeight: "800",
    marginLeft: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },

  clearBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primarySoft1,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  clearTxt: { color: COLORS.text, fontWeight: "800" },

  // toast
  toast: {
    position: "absolute",
    bottom: 96,
    alignSelf: "center",
    backgroundColor: "#0F172A",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  toastTxt: { color: "#fff", fontWeight: "800" },

  // skeleton
  skelWrap: { ...StyleSheet.absoluteFillObject, backgroundColor: "#EDEFF5" },

  // bottom nav
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
  tabIconActive: { backgroundColor: COLORS.primarySoft1, borderWidth: 1, borderColor: COLORS.primaryBorder },
  tabLabel: { fontSize: 11, color: "#666", marginTop: 4 },
});
