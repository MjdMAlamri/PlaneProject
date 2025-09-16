// app/profile.js
// Profile page — colorful world map header with visited/unvisited chips,
// badges, favorites, year recap (keeps your Home styling)

import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const W = Dimensions.get("window").width;

/** Theme — mirrors Home */
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
  dark: "#0B0B0B",
};

const MAP_ILLUSTRATION =
  "/Users/m/Desktop/GDP/LastProject/my-travel-app/assets/MAP2.png";
const FALLBACK_IMG = "https://placehold.co/1600x900/jpg?text=V-aiR";
const AVATAR =
  "https://www.womenofinfluence.ca/wp-content/uploads/2021/02/Jessica_ketwaroo_green-1-e1692387031590.png";

const USER = { name: "Najd" };

/** Demo country sets (kept for chips only) */
const VISITED = ["SA", "JP", "FR", "AE", "GE", "TR"];
const UNVISITED_SUGGEST = ["IT", "PE", "ES"];

/** Favorites & Badges demo data (same structure as before) */
const FAVORITES = [
  {
    id: "vr1",
    title: "Mount Fuji",
    bullets: ["City vibes", "Top food picks", "Hidden alleys"],
    icon: "eye-outline",
    image:
      "https://media.cnn.com/api/v1/images/stellar/prod/230908155626-05-mount-fuji-overtourism.jpg?c=original",
  },
  {
    id: "vr2",
    title: "Shibuya Night Walk",
    bullets: ["City vibes", "Top food picks", "Hidden alleys"],
    icon: "walk-outline",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2400&auto=format&fit=crop",
  },
];

const BADGE_SETS = {
  Cities: [
    { id: "jp", name: "Japan", img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=800&auto=format&fit=crop", done: 3, total: 8, pct: 0.68, flag: "🇯🇵" },
    { id: "fr", name: "France", img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=800&auto=format&fit=crop", done: 2, total: 6, pct: 0.45, flag: "🇫🇷" },
    { id: "pe", name: "Peru", img: "https://images.unsplash.com/photo-1546530967-21531b891dd4?q=80&w=800&auto=format&fit=crop", done: 4, total: 4, pct: 1.0, flag: "🇵🇪" },
    { id: "it", name: "Italy", img: "https://assaggioboston.com/news/wp-content/uploads/2023/03/shutterstock_1218364807.jpg", done: 1, total: 7, pct: 0.25, flag: "🇮🇹" },
  ],
  Games: [
    { id: "vr-arcade", name: "VR Arcade", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", done: 6, total: 10, pct: 0.6, flag: "🎮" },
    { id: "trivia", name: "Air Trivia", img: "https://images.unsplash.com/photo-1515165562835-c3b8c1b5a3d7?q=80&w=800&auto=format&fit=crop", done: 8, total: 12, pct: 0.67, flag: "🧠" },
  ],
  Challenges: [
    { id: "steps", name: "10k Steps", img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=800&auto=format&fit=crop", done: 10, total: 10, pct: 1.0, flag: "🏅" },
    { id: "photos", name: "100 Photos", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop", done: 35, total: 100, pct: 0.35, flag: "📸" },
  ],
};

export default function Profile() {
  const router = useRouter();
  const [tab, setTab] = useState("Cities");
  const badges = useMemo(() => BADGE_SETS[tab] ?? [], [tab]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* Top App Bar */}
        <View style={s.appbar}>
          <Text style={s.brand}>
            Riyadh V-aiR<Text style={{ color: COLORS.primary }}>.</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity style={s.iconBtn} onPress={() => router.push("/settings")}>
              <Ionicons name="settings-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Static World Map Header (no pins) ===== */}
        <View style={hdr.wrap}>
          <Image source={{ uri: MAP_ILLUSTRATION }} style={hdr.bg} resizeMode="cover" />
          <LinearGradient
            colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.25)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={hdr.tint}
          />

          {/* Avatar + Name row */}
          <View style={hdr.headerRow}>
            <View style={hdr.avatarFrame}>
              <Image source={{ uri: AVATAR }} style={hdr.avatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={hdr.name}>{USER.name}</Text>
              <Text style={hdr.sub}>Traveler since 2022</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Favorites (VR banners) ===== */}
        <View style={s.panel}>
          <View style={s.sectionHeaderRow}>
            <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
            <Text style={s.sectionTitle}>Favorites</Text>
          </View>

          <ScrollRow>
            {FAVORITES.map((f) => (
              <FavoriteBanner
                key={f.id}
                title={f.title}
                image={f.image}
                icon={f.icon}
                bullets={f.bullets}
                onPress={() => Alert.alert("Open", `Opening "${f.title}" in VR…`)}
              />
            ))}
          </ScrollRow>
        </View>

        {/* ===== Badges (Cities / Games / Challenges) ===== */}
        <View style={s.panel}>
          <LinearGradient
            colors={["#A855F7", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={badgeHdr.wrap}
          >
            <Text style={badgeHdr.title}>Badges</Text>
            <Text style={badgeHdr.sub}>Your travel achievements</Text>

            <View style={tabs.row}>
              {["Cities", "Games", "Challenges"].map((k) => (
                <TouchableOpacity
                  key={k}
                  style={[tabs.chip, tab === k && tabs.active]}
                  onPress={() => setTab(k)}
                  activeOpacity={0.9}
                >
                  <Text style={[tabs.chipTxt, tab === k && { color: "#fff" }]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          <View style={{ marginTop: 10 }}>
            {badges.map((b, i) => (
              <BadgeRow
                key={b.id}
                name={`${b.flag} ${b.name}`}
                leftImg={b.img}
                progress={b.pct}
                detail={`${b.done}/${b.total} ${tab === "Cities" ? "cities" : "levels"}`}
                onPress={() => Alert.alert("Badge", `${b.name} details`)}
                preview={i === 0 && tab === "Cities"}
              />
            ))}
          </View>
        </View>

        {/* ===== Year Recap (Home-style gradient card) ===== */}
        <View style={s.panel}>
          <View style={s.sectionHeaderRow}>
            <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
            <Text style={s.sectionTitle}>2024 Year Recap</Text>
          </View>

          <LinearGradient
            colors={["#A855F7", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={recap.wrap}
          >
            <Text style={recap.title}>Your Epic Year!</Text>

            <View style={recap.grid}>
              <RecapStat big label="Miles Traveled" value="28,540" />
              <RecapStat big label="Countries Visited" value="8" />
              <RecapStat label="Cities Explored" value="24" />
              <RecapStat label="Badges Earned" value="47" />
            </View>

            <Text style={recap.line}>
              <Text style={{ fontWeight: "800" }}>Favorite Destination:</Text> Tokyo, Japan
            </Text>
            <Text style={recap.line}>
              <Text style={{ fontWeight: "800" }}>Longest Adventure:</Text> 14 days in Southeast Asia
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              style={recap.cta}
              onPress={() => Alert.alert("Share", "Shared to your feed!")}
            >
              <Text style={recap.ctaTxt}>Share Your Recap</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom Nav — Profile active */}
      <View style={s.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" onPress={() => router.push("/hub")} />
        <TabIcon
          active
          icon={<Ionicons name="person-outline" size={22} color={COLORS.text} />}
          label="Profile"
          onPress={() => router.push("/Profile")}
        />
      </View>
    </SafeAreaView>
  );
}

/* ===== Shared small components ===== */

function ScrollRow({ children }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>{children}</View>
    </ScrollView>
  );
}

function CountryChip({ code, visited }) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[chips.wrap, visited ? chips.visited : chips.unvisited]}
      onPress={() =>
        visited ? Alert.alert("Visited", `${code} already in your map`) : Alert.alert("Add Country", `Add ${code}`)
      }
    >
      <Text style={[chips.code, visited ? { color: COLORS.text } : { color: "#7A8197" }]}>{code}</Text>
      {!visited && (
        <View style={chips.plus}>
          <Ionicons name="add" size={12} color="#7A8197" />
        </View>
      )}
    </TouchableOpacity>
  );
}

function FavoriteBanner({ title, bullets = [], icon, image, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={fav.card}>
      <Image source={{ uri: image || FALLBACK_IMG }} style={fav.bg} resizeMode="cover" />
      <LinearGradient
        colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.55)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={fav.shade}
      />
      <View style={fav.inner}>
        <View style={fav.titleRow}>
          <View style={fav.iconBox}>
            <Ionicons name={icon} size={16} color={COLORS.text} />
          </View>
          <Text style={fav.title}>{title}</Text>
        </View>
        <View style={{ gap: 4, marginTop: 6 }}>
          {bullets.slice(0, 4).map((b, i) => (
            <Text key={i} style={fav.bullet}>• {b}</Text>
          ))}
        </View>
        <View style={fav.ctaRow}>
          <Text style={fav.ctaTxt}>Open</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function RecapStat({ label, value, big }) {
  return (
    <View style={[recap.stat, big && { marginBottom: 10 }]}>
      <Text style={[recap.value, big && { fontSize: 28 }]}>{value}</Text>
      <Text style={recap.label}>{label}</Text>
    </View>
  );
}

function BadgeRow({ name, leftImg, detail, progress, onPress, preview }) {
  const pct = Math.max(0, Math.min(1, progress || 0));
  return (
    <TouchableOpacity style={br.row} activeOpacity={0.9} onPress={onPress}>
      <Image source={{ uri: leftImg || FALLBACK_IMG }} style={br.thumb} />
      <View style={{ flex: 1 }}>
        <View style={br.top}>
          <Text style={br.name} numberOfLines={1}>{name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={br.pctTxt}>{Math.round(pct * 100)}%</Text>
            <Ionicons name="chevron-forward" size={16} color="#7A8197" />
          </View>
        </View>
        <Text style={br.sub}>{detail}</Text>
        <View style={br.track}>
          <View style={[br.fill, { width: `${pct * 100}%` }]} />
        </View>
      </View>
      {preview && (
        <View style={br.preview}>
          <Text style={br.previewTxt}>Preview</Text>
        </View>
      )}
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

/* ===== Styles ===== */

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 130 },

  // app bar
  appbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  iconBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  // panels
  panel: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },

  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionPip: { width: 6, height: 18, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  // bottom tab
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

/* Map header (static image only) */
const hdr = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    marginBottom: 14,
    backgroundColor: COLORS.primarySoft1,
    height: 180,
  },
  bg: { width: "100%", height: "100%" },
  tint: { ...StyleSheet.absoluteFillObject },

  // Avatar/title row sits on top of the map
  headerRow: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarFrame: {
    width: 74, height: 74, borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2, borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  name: { fontSize: 22, fontWeight: "900", color: COLORS.dark },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },

  // Chips row floats near the top edge
  chipsRow: { position: "absolute", left: 12, right: 12, top: 8 },
});

/* Country chips */
const chips = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  visited: {
    backgroundColor: "#fff",
    borderColor: COLORS.primaryBorder,
  },
  unvisited: {
    backgroundColor: "#F4F5F8",
    borderColor: COLORS.border,
  },
  code: { fontSize: 12, fontWeight: "800" },
  plus: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#fff", borderWidth: 1, borderColor: COLORS.border,
    alignItems: "center", justifyContent: "center", marginLeft: 6,
  },
});

/* Favorites banners */
const fav = StyleSheet.create({
  card: {
    width: W * 0.72,
    height: 200,
    marginRight: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  bg: { ...StyleSheet.absoluteFillObject },
  shade: { ...StyleSheet.absoluteFillObject },
  inner: { flex: 1, padding: 14, justifyContent: "space-between" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBox: {
    width: 30, height: 30, borderRadius: 10, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.primaryBorder,
  },
  title: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  bullet: { fontSize: 12.5, color: COLORS.muted, lineHeight: 18 },
  ctaRow: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#FFF", paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginTop: 8,
  },
  ctaTxt: { fontSize: 12, fontWeight: "800", color: COLORS.text },
});

/* Recap */
const recap = StyleSheet.create({
  wrap: { borderRadius: 16, padding: 14 },
  title: { color: "#fff", fontWeight: "900", fontSize: 18, marginBottom: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginBottom: 10 },
  stat: { width: (W - 16 * 2 - 14) / 2 - 4 },
  value: { color: "#fff", fontWeight: "900", fontSize: 22 },
  label: { color: "rgba(255,255,255,0.95)", fontSize: 12, marginTop: 2 },
  line: { color: "#fff", marginTop: 4 },
  cta: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ctaTxt: { color: "#fff", fontWeight: "800" },
});

/* Badge header */
const badgeHdr = StyleSheet.create({
  wrap: { borderRadius: 12, padding: 12 },
  title: { color: "#fff", fontWeight: "900", fontSize: 16 },
  sub: { color: "rgba(255,255,255,0.9)", marginTop: 2, marginBottom: 8, fontSize: 12 },
});

/* Tabs */
const tabs = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 999, backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.5)",
  },
  chipTxt: { color: "#0F172A", fontWeight: "800", fontSize: 12.5 },
  active: { backgroundColor: "#0F172A", borderColor: "#0F172A" },
});

/* Badge rows */
const br = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  thumb: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#EEE" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  name: { fontSize: 14, fontWeight: "800", color: COLORS.text, maxWidth: W * 0.5 },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2, marginBottom: 8 },
  track: { height: 7, borderRadius: 999, backgroundColor: "#E3E6EF", overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#0F172A", borderRadius: 999 },
  pctTxt: { fontSize: 12, color: COLORS.muted, fontWeight: "800" },
  preview: {
    position: "absolute",
    right: 12,
    top: 8,
    backgroundColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    opacity: 0.8,
  },
  previewTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },
});s
