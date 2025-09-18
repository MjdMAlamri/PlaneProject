import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
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
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BillboardCarousel from "../components/BillboardCarousel";

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

/** Banner sizing - FIXED */
const { width: screenWidth } = Dimensions.get('window');
const BANNER_HORIZONTAL_PADDING = 16;  // padding from FlatList contentContainerStyle
const BANNER_WIDTH = 300;  // Full width minus padding
const BANNER_ASPECT = 16 / 3;;           // height = width / aspect

const FALLBACK_IMG = "https://placehold.co/1200x800/jpg?text=Riyadh+Air";
const FLAGS = { "Saudi Arabia": "🇸🇦", Japan: "🇯🇵", Oman: "🇴🇲", Georgia: "🇬🇪", "United Arab Emirates": "🇦🇪" };
const flagOf = (c) => FLAGS[c] || "🏳️";

/** Country list (≤5) for the dropdown */
const COUNTRIES = ["Japan", "Saudi Arabia", "Oman", "Georgia", "United Arab Emirates"];

/** Demo data (Activities) */
const DATA = [
  {
    id: "tokyo-teamlab",
    title: "TeamLab Planets (Immersive Art)",
    city: "Tokyo",
    country: "Japan",
    type: "group",
    rating: 5.0,
    capacity: 6,
    booked: 0,
    image:
      "https://imagedelivery.net/b5EBo9Uo-OK6SM09ZTkEZQ/89JNH3JuCgHZcGbACeD2vU/width=3840,quality=80",
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
      "https://cdn.shopify.com/s/files/1/0003/9596/8567/t/33/assets/tea-ceremony-tools-1689272217231.jpg?v=1689272218",
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
      "https://home.akihabara.kokosil.net/wp-content/uploads/2018/11/main.png",
  },
];

/** Games: now with images to match the Activities look */
const GAMES = [
  {
    id: "trivia",
    title: "Overcooked 2",
    players: "multiplayer",
    rating: 4.8,
    image:
      "https://cdn1.epicgames.com/salesEvent/salesEvent/egs-overcooked2-Wide_2560x1440-808fbab09ed3ab49d6d0107683cbba8b?resize=1&w=480&h=270&quality=medium",
  },
  {
    id: "word-hunt",
    title: "Slither.io",
    players: "solo",
    rating: 4.6,
    image:
      "https://imgs.crazygames.com/games/slitherio/cover-1587331280441.png?format=auto&quality=100&metadata=none&width=1200",
  },
  {
    id: "city-quiz",
    title: "Fall Guys",
    players: "multiplayer",
    rating: 4.7,
    image:
      "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/23474062/fall_guys_free_to_play.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100",
  },
];

/** Banners for the top carousel when Games is active */
const GAMES_BANNERS = [
  {
    id: "bnr-trivia",
    title: "Overcooked 2",
    subtitle: "Compete with passengers near you",
    image:
      "https://cdn1.epicgames.com/salesEvent/salesEvent/egs-overcooked2-Wide_2560x1440-808fbab09ed3ab49d6d0107683cbba8b?resize=1&w=480&h=270&quality=medium",
  },
  {
    id: "bnr-word-hunt",
    title: "Slither.io",
    subtitle: "Quick solo challenges on board",
    image:
      "https://imgs.crazygames.com/games/slitherio/cover-1587331280441.png?format=auto&quality=100&metadata=none&width=1200",
  },
  {
    id: "bnr-city-quiz",
    title: "Fall Guys",
    subtitle: "Guess landmarks before you land",
    image:
      "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/23474062/fall_guys_free_to_play.jpg?quality=90&strip=all&crop=7.8125,0,84.375,100",
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

  // countries
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("Japan");

  // tabs
    const { tab } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState(
      (tab && String(tab).toLowerCase() === "games") ? "Games" : "Activities"
   );
    useEffect(() => {
      if (tab) setActiveTab(String(tab).toLowerCase() === "games" ? "Games" : "Activities");
    }, [tab]);

  // sheets
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const filterActiveCount =
    (availability ? 1 : 0) + (minRating ? 1 : 0) + (typeFilter ? 1 : 0);

  const spotsLeft = (it) => Math.max(0, it.capacity - it.booked);

  const filtered = useMemo(
    () =>
      items
        .filter((it) => it.country === country)
        .filter((it) => {
          if (availability === "available" && spotsLeft(it) <= 0) return false;
          if (availability === "full" && spotsLeft(it) > 0) return false;
          if (minRating != null && it.rating < minRating) return false;
          if (typeFilter && it.type !== typeFilter) return false;
          return true;
        })
        .sort(sorters[sortBy]),
    [items, country, availability, minRating, typeFilter, sortBy]
  );

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
    const H = 196;
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
        <Text style={st.ratingText}>{r.toFixed(1)}</Text>
      </View>
    );
  };

  const ActivityCard = ({ item }) => {
    const [imgOk, setImgOk] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    return (
      <View style={st.card} accessible>
        <Image
          source={{ uri: imgErr ? FALLBACK_IMG : item.image }}
          style={st.cardImage}
          onLoad={() => setImgOk(true)}
          onError={() => setImgErr(true)}
        />
        {!imgOk && <View style={st.skelWrap} />}
        <View pointerEvents="none" style={st.bannerEdgeMask} />

        <View style={st.cardTopRow}>
          <View style={st.typePill}>
            <Text style={st.typePillText}>
              {item.type === "solo" ? "Solo" : "Group"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onAddToPlan(item.id)}
            activeOpacity={0.9}
            style={[st.signupBtn, spotsLeft(item) <= 0 && { opacity: 0.55 }]}
            disabled={spotsLeft(item) <= 0}
          >
            <Text style={st.signupText}>
              {item.booked}/{item.capacity} | {spotsLeft(item) > 0 ? "Add to Plan" : "Full"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={st.cardBottom}>
          <Text numberOfLines={2} style={st.cardTitle}>{item.title}</Text>
          <View style={st.locationRow}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={st.locationText}>
              {flagOf(item.country)} {item.city}, {item.country}
            </Text>
          </View>
          {renderStars(item.rating)}
        </View>
      </View>
    );
  };

  /** Game card mirrors Activity card (with image) */
  const GameRow = ({ item }) => {
    const [imgErr, setImgErr] = useState(false);
    return (
      <View style={st.card}>
        <Image
          source={{ uri: imgErr ? FALLBACK_IMG : item.image }}
          style={st.cardImage}
          onError={() => setImgErr(true)}
        />
        <View pointerEvents="none" style={st.gradientMask} />

        <View style={st.cardTopRow}>
          <View style={st.typePill}>
            <Text style={st.typePillText}>
              {item.players === "multiplayer" ? "Group" : "Solo"}
            </Text>
          </View>

          <TouchableOpacity
            style={[st.signupBtn, { backgroundColor: "rgba(255,255,255,0.92)" }]}
            activeOpacity={0.9}
            onPress={() => Toast.show("Launching game…")}
          >
            <Text style={[st.signupText, { color: COLORS.text }]}>Play</Text>
          </TouchableOpacity>
        </View>

        <View style={st.cardBottom}>
          <Text numberOfLines={2} style={st.cardTitle}>{item.title}</Text>
          <Text style={[st.locationText, { marginBottom: 6 }]}>
            {item.players === "multiplayer" ? "Multiplayer" : "Solo"} • {item.rating.toFixed(1)}★
          </Text>
          {renderStars(item.rating)}
        </View>
      </View>
    );
  };

  /** Country row: dropdown + inline filter/sort (same line) */
  const CountryRow = (
    <View style={st.countryRow}>
      <TouchableOpacity
        style={st.countryDropdown}
        activeOpacity={0.9}
        onPress={() => setCountryOpen((v) => !v)}
      >
        <Text style={st.countryDropdownText}>
          {flagOf(country)} {country}
        </Text>
        <Ionicons name={countryOpen ? "chevron-up" : "chevron-down"} size={16} color={COLORS.text} />
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View>
          <TouchableOpacity
            onPress={() => {
              setShowSort(false);
              setShowFilter((v) => !v);
            }}
            style={st.iconBtn}
            activeOpacity={0.9}
          >
            <Ionicons name="filter-outline" size={18} color={COLORS.text} />
          </TouchableOpacity>
          {filterActiveCount > 0 && (
            <View style={st.dotBadge}>
              <Text style={st.dotTxt}>{filterActiveCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            setShowFilter(false);
            setShowSort((v) => !v);
          }}
          style={st.iconBtn}
          activeOpacity={0.9}
        >
          <Ionicons name="swap-vertical-outline" size={18} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  /** Header */
  const Header = (
    <>
      {/* App bar */}
      <View style={st.appbar}>
        <Image
          source={require("../../assets/images/Riyadh_Air_Logo.png")}
          style={st.brandLogo}
          resizeMode="contain"
          accessibilityLabel="Riyadh Air"
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={st.bell} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section title */}
      <Text style={st.sectionTitle}>
        {activeTab === "Activities" ? "Recommended activities for you" : "Featured in-flight games"}
      </Text>

      {/* FIXED: Banner wrapper with proper padding */}
      <View style={st.bannerWrap}>
        <BillboardCarousel
          data={activeTab === "Activities" ? filtered.slice(0, 3) : GAMES_BANNERS}
          onPressPrimary={
            activeTab === "Activities"
              ? (item) => onAddToPlan(item.id)
              : () => Toast.show("Launching game…")
          }
          autoplay
          loop
          imageAspectRatio={300}
          cardStyle={[st.bannerCard, { width: 300 }]}
        />
      </View>

      {/* Tabs */}
      <View style={st.segWrap}>
        <View style={st.segTrack}>
          <TouchableOpacity
            onPress={() => setActiveTab("Activities")}
            style={[st.segBtn, activeTab === "Activities" && st.segBtnActive]}
            activeOpacity={0.9}
          >
            <Text style={[st.segTxt, activeTab === "Activities" && st.segTxtActive]}>
              Activities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("Games")}
            style={[st.segBtn, activeTab === "Games" && st.segBtnActive]}
            activeOpacity={0.9}
          >
            <Text style={[st.segTxt, activeTab === "Games" && st.segTxtActive]}>
              In-flight games
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Country + inline tools (Activities only) */}
      {activeTab === "Activities" && CountryRow}

      {/* Country dropdown menu */}
      {activeTab === "Activities" && countryOpen && (
        <View style={st.countryMenu}>
          {COUNTRIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={st.countryMenuItem}
              activeOpacity={0.85}
              onPress={() => {
                setCountry(c);
                setCountryOpen(false);
              }}
            >
              <Text style={st.countryMenuText}>
                {flagOf(c)} {c}
              </Text>
              {country === c && <Ionicons name="checkmark" size={16} color={COLORS.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );

  const listData = activeTab === "Activities" ? filtered : GAMES;
  const listRenderer =
    activeTab === "Activities" ? ({ item }) => <ActivityCard item={item} /> : ({ item }) => <GameRow item={item} />;

  return (
    <SafeAreaView style={st.safe}>
      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={listRenderer}
        contentContainerStyle={{ paddingHorizontal: BANNER_HORIZONTAL_PADDING, paddingBottom: 140, gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Header}
        ListEmptyComponent={
          <View style={[st.panel, { marginTop: -6 }]}>
            <Text style={{ color: COLORS.text, fontWeight: "800", marginBottom: 6 }}>
              No items match your filters.
            </Text>
            <Text style={{ color: COLORS.muted, marginBottom: 10 }}>
              Try clearing filters or switching tabs.
            </Text>
            {activeTab === "Activities" && (
              <TouchableOpacity
                onPress={() => {
                  setAvailability(null);
                  setMinRating(null);
                  setTypeFilter(null);
                }}
                style={st.clearBtn}
              >
                <Text style={st.clearTxt}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        removeClippedSubviews
        windowSize={8}
        getItemLayout={activeTab === "Activities" ? getItemLayout : undefined}
      />

      {/* Filter sheet */}
      {showFilter && (
        <Pressable style={st.sheetOverlay} onPress={() => setShowFilter(false)}>
          <Pressable style={st.sheet}>
            <Text style={st.sheetTitle}>Filter</Text>

            <Text style={st.sheetSection}>Spots</Text>
            <View style={st.rowWrap}>
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

            <Text style={st.sheetSection}>Rating</Text>
            <View style={st.rowWrap}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Chip
                  key={n}
                  label={`${n}★+`}
                  active={minRating === n}
                  onPress={() => setMinRating((r) => (r === n ? null : n))}
                />
              ))}
            </View>

            <Text style={st.sheetSection}>Type</Text>
            <View style={st.rowWrap}>
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

      {/* Sort sheet */}
      {showSort && (
        <Pressable style={st.sheetOverlay} onPress={() => setShowSort(false)}>
          <Pressable style={st.sheet}>
            <Text style={st.sheetTitle}>Sort by</Text>
            <SortRow label="Rating: Low → High" active={sortBy === "rating_asc"} onPress={() => setSortBy("rating_asc")} />
            <SortRow label="Rating: High → Low" active={sortBy === "rating_desc"} onPress={() => setSortBy("rating_desc")} />
            <SortRow label="Recommended" active={sortBy === "recommended"} onPress={() => setSortBy("recommended")} />
          </Pressable>
        </Pressable>
      )}

      {/* Toast */}
      <Toast.Slot />

      {/* Bottom nav */}
      <View style={st.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon
          active
          icon={<Ionicons name="apps-outline" size={22} color={COLORS.text} />}
          label="Hub"
          onPress={() => router.push("/hub")}
        />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/Profile")} />
      </View>
    </SafeAreaView>
  );
}

/* — small bits — */
function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[st.chip, active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
    >
      <Text style={[st.chipText, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SortRow({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={st.sortRow} activeOpacity={0.9}>
      <Text style={[st.sortLabel, active && { color: COLORS.primary }]}>{label}</Text>
      {active && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
    </TouchableOpacity>
  );
}

function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={st.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[st.tabIcon, active && st.tabIconActive]}>{icon}</View>
      <Text style={[st.tabLabel, active && { color: COLORS.text, fontWeight: "600" }]}>{label}</Text>
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
      <Animated.View pointerEvents="none" style={[st.toast, { opacity }]}>
        <Text style={st.toastTxt}>{text}</Text>
      </Animated.View>
    );
  },
};

/* — styles — */
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

  sectionTitle: {
    paddingHorizontal: 16,
    color: COLORS.text,
    fontWeight: "900",
    fontSize: 16,
    marginBottom: 10,
  },

  /* FIXED: Banner wrapper - removed paddingHorizontal since we handle it in FlatList */
  bannerWrap: {
    marginBottom: 10,
  },
  bannerCard: {
    borderRadius: 16,
    overflow: "hidden",
    width:300
  },

  /* Segmented bar */
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

  /* Country row: dropdown + inline tools */
  countryRow: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  countryDropdown: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder, 
  },
  countryDropdownText: { color: COLORS.text, fontWeight: "900" },

  countryMenu: {
    marginHorizontal: 16,
    backgroundColor: '#E9ECFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    marginBottom: 8,
  },
  countryMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  countryMenuText: { color: COLORS.text, fontWeight: "800" },

  /* Tools (icons) */
  iconBtn: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F1F2F6", borderWidth: 1, borderColor: "#EBEDF3",
  },
  dotBadge: {
    position: "absolute", right: -2, top: -2,
    minWidth: 16, height: 16, borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 3,
  },
  dotTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },

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

  bannerEdgeMask: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: "transparent",
  },

  gradientMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  
  /* Sheets */
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    width: "92%",
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DADFFE',
    padding: 12,
    maxHeight: "70%",
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

  /* Cards (Activities & Games) */
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
  locationText: { color: "#fff", fontWeight: "700" },
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

  // Toast
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

  // Skeleton
  skelWrap: { ...StyleSheet.absoluteFillObject, backgroundColor: "#EDEFF5" },

  // Bottom nav
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