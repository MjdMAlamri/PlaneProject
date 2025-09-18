// app/smart.js
// Smart Booking — matches your Home page structure & styles (JS)

import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Pressable,
  Alert,
  Animated,
  Easing,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const W = Dimensions.get("window").width;

/** --- Theme (mirrors Home) --- */
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

const FALLBACK_IMG = "https://placehold.co/1600x900/jpg?text=V-aiR";

/** Lightweight list (local/offline), used only for the quick suggestion card */
const DESTS = [
  {
    id: "alula",
    name: "AlUla",
    country: "Saudi Arabia",
    vibe: "nature",
    clima: "mild",
    img: "https://www.arabnews.com/sites/default/files/shorthand/1601001/DMZf8wornc/assets/9NnB9hQBAB/madin-saleh-2560x1440.jpeg",
    budget: [1800, 4500],
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    vibe: "city",
    clima: "mild",
    img: "https://www.advantour.com/img/georgia/images/tbilisi.jpg",
    budget: [2200, 5000],
  },
  {
    id: "salalah",
    name: "Salalah",
    country: "Oman",
    vibe: "nature",
    clima: "cool",
    img: "https://res.cloudinary.com/ddjuftfy2/image/upload/f_webp,c_fill,q_auto/memphis/xlarge/274158227_Salalah%20City.jpg",
    budget: [2500, 5200],
  },
];

export default function Smart() {
  const router = useRouter();

  // Inputs
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [weather, setWeather] = useState(null); // "cool" | "mild" | "warm" | "hot"
  const [vibe, setVibe] = useState(null); // "nature" | "city"

  // Result
  const [pick, setPick] = useState(null);
  const [uri, setUri] = useState(null);

  // Static-first suggestion (no need to wait for inputs)
  const suggest = () => {
    // Simple deterministic pick: prefer vibe/ weather if selected, otherwise first item
    let chosen = DESTS[0];
    if (vibe || weather) {
      const scored = DESTS.map((d) => {
        let s = 0;
        if (vibe && d.vibe === vibe) s += 2;
        if (weather && d.clima === weather) s += 2;
        return { ...d, s };
      }).sort((a, b) => b.s - a.s);
      chosen = scored[0];
    }
    setPick({
      ...chosen,
      days: toInt(days) || 4,
      budgetInput: toInt(budget) || null,
      clima: chosen.clima,
    });
    setUri(chosen.img);
  };

  useEffect(() => {
    // Prefetch first image
    Image.prefetch(DESTS[0].img).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
          
{/* Top App Bar */}

<View style={[s.appbar, s.appbarEdge]}>
          <Image
            source={require("../../assets/images/Riyadh_Air_Logo.png")}
            style={s.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Riyadh Air"
          />

          {/* right-side icons... */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={s.bell}
            onPress={() => router.push("/notifications")}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>



          {/* Title */}
          <Text style={s.greeting}>Smart Booking</Text>

          {/* — Panel: Inputs — */}
          <View style={s.panel}>
            <View style={s.headerRowIcon}>
              <Ionicons name="bulb-outline" size={18} color={COLORS.primary} />
              <Text style={s.sectionTitle}>Tell us what you like</Text>
            </View>

            {/* Budget */}
            <View style={sb.row}>
              <View style={sb.left}>
                <View style={sb.iconBox}>
                  <Ionicons name="cash-outline" size={18} color={COLORS.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sb.label}>Budget (﷼)</Text>
                  <TextInput
                    value={budget}
                    onChangeText={(t) => setBudget(sanitizeNum(t))}
                    placeholder="e.g., 3000"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="numeric"
                    style={sb.input}
                  />
                </View>
              </View>
            </View>

            {/* Days */}
            <View style={sb.row}>
              <View style={sb.left}>
                <View style={sb.iconBox}>
                  <Ionicons name="calendar-outline" size={18} color={COLORS.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sb.label}>Number of days</Text>
                  <TextInput
                    value={days}
                    onChangeText={(t) => setDays(sanitizeNum(t))}
                    placeholder="e.g., 5"
                    placeholderTextColor={COLORS.muted}
                    keyboardType="numeric"
                    style={sb.input}
                  />
                </View>
              </View>
            </View>

            {/* Weather */}
            <View style={sb.row}>
              <View style={[sb.left, { alignItems: "flex-start" }]}>
                <View style={sb.iconBox}>
                  <Ionicons name="thermometer-outline" size={18} color={COLORS.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sb.label}>Preferred weather</Text>
                  <View style={sb.rowWrap}>
                    {["cool", "mild", "warm", "hot"].map((w) => (
                      <Chip key={w} label={cap(w)} active={weather === w} onPress={() => setWeather(w)} />
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Vibe */}
            <View style={sb.row}>
              <View style={[sb.left, { alignItems: "flex-start" }]}>
                <View style={sb.iconBox}>
                  <Ionicons name="leaf-outline" size={18} color={COLORS.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sb.label}>Vibe</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <VibeTile
                      title="Nature"
                      icon="leaf"
                      active={vibe === "nature"}
                      onPress={() => setVibe("nature")}
                    />
                    <VibeTile
                      title="City"
                      icon="business"
                      active={vibe === "city"}
                      onPress={() => setVibe("city")}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* CTA: Suggest destination (static-friendly) */}
            <TouchableOpacity style={s.btnShowFlights} activeOpacity={0.9} onPress={suggest}>
              <Text style={s.btnShowTxt}>Suggest destination</Text>
            </TouchableOpacity>
          </View>

          {/* — Result card (appears immediately after pressing) — */}
          {pick && (
            <View style={s.panel}>
              <View style={s.sectionHeaderRow}>
                <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
                <Text style={s.sectionTitle}>Your match</Text>
              </View>

              <View style={res.card}>
                <View style={res.imgWrap}>
                  <Image
                    source={{ uri: uri || FALLBACK_IMG }}
                    style={res.img}
                    resizeMode="cover"
                    onError={() => setUri(FALLBACK_IMG)}
                  />
                  <LinearGradient
                    colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0.55)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={res.shade}
                  />
                </View>

                <View style={res.body}>
                  <View style={res.rowTop}>
                    <View>
                      <Text style={res.title}>{pick.name}</Text>
                      <Text style={res.sub}>{pick.country}</Text>
                    </View>

                    <View style={{ alignItems: "flex-end", gap: 6 }}>
                      <Badge icon="thermometer" text={cap(pick.clima)} />
                      <Badge icon={pick.vibe === "nature" ? "leaf" : "business"} text={cap(pick.vibe)} />
                    </View>
                  </View>

                  <View style={res.metaWrap}>
                    <MetaRow
                      icon="time-outline"
                      label="Trip length"
                      value={`${pick.days} ${pick.days > 1 ? "days" : "day"}`}
                    />
                    <MetaRow
                      icon="cash-outline"
                      label="Typical budget"
                      value={` ${pick.budget[0].toLocaleString()} – ${pick.budget[1].toLocaleString()} ﷼`}
                    />
                    {pick.budgetInput ? (
                      <MetaRow icon="pricetag-outline" label="Your budget" value={`﷼ ${pick.budgetInput}`} />
                    ) : null}
                  </View>

                  <View style={res.actions}>
                    <TouchableOpacity style={res.btnGhost} onPress={() => setPick(null)}>
                      <Text style={res.btnGhostTxt}>Try again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={res.btnFill} onPress={() => router.push("/book")}>
                      <Text style={res.btnFillTxt}>Book</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Nav — same as Home, no highlighted icon here */}
      <View style={s.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/")} />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" />
      </View>
    </SafeAreaView>
  );
}

/* ===== Small UI bits (kept consistent with Home look) ===== */

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        chip.wrap,
        active && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
      ]}
    >
      <Text style={[chip.txt, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function VibeTile({ title, icon, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[tile.wrap, active && tile.active]}
    >
      <Ionicons name={icon} size={20} color={active ? "#fff" : COLORS.text} />
      <Text style={[tile.txt, active && { color: "#fff" }]}>{title}</Text>
    </TouchableOpacity>
  );
}

function Badge({ icon, text }) {
  return (
    <View style={badge.wrap}>
      <Ionicons name={icon} size={14} color={COLORS.text} />
      <Text style={badge.txt}>{text}</Text>
    </View>
  );
}

function MetaRow({ icon, label, value }) {
  return (
    <View style={meta.row}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons name={icon} size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
        <Text style={meta.label}>{label}</Text>
      </View>
      <Text style={meta.value}>{value}</Text>
    </View>
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

/* ===== helpers ===== */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const toInt = (x) => {
  const n = Number(String(x).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const sanitizeNum = (t) => t.replace(/[^\d]/g, "");

/* ===== styles (mirrors Home) ===== */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 130 },
// app bar
appbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
bell: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F1F2F6", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EBEDF3" },
brandLogo: {
height: 42,
width: 240,
marginLeft: -60,  // tweak -6 to -14 depending on the file
},

  // app bar
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  greeting: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 10 },

  // panel
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

  headerRowIcon: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionPip: { width: 6, height: 18, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  // shared button (same pill look as Home's Show Flights)
  btnShowFlights: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primarySoft1,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignSelf: "center",
    marginTop: 4,
  },
  btnShowTxt: { fontSize: 16, fontWeight: "700", color: COLORS.text },

  // bottom tab (same as Home)
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

const sb = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primarySoft1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft2,
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.primarySoft2,
  },
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 6, fontWeight: "700" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 6 }),
    fontSize: 14,
    color: COLORS.text,
    minWidth: 140,
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
});

const chip = StyleSheet.create({
  wrap: {
    borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  txt: { fontSize: 14, color: COLORS.text, fontWeight: "700" },
});

const tile = StyleSheet.create({
  wrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  active: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  txt: { marginTop: 6, fontSize: 15, fontWeight: "800", color: COLORS.text },
});

const res = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  imgWrap: { ...StyleSheet.absoluteFillObject },
  img: { ...StyleSheet.absoluteFillObject },
  shade: { ...StyleSheet.absoluteFillObject },
  body: { padding: 14, gap: 10, minHeight: 180 },
  rowTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  sub: { fontSize: 13, color: COLORS.muted, marginTop: 2 },

  metaWrap: { marginTop: 4, gap: 8 },

  actions: { flexDirection: "row", gap: 10, marginTop: 6 },
  btnGhost: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnGhostTxt: { color: COLORS.text, fontWeight: "700" },
  btnFill: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  btnFillTxt: { color: "#fff", fontWeight: "800" },
});

const badge = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  txt: { fontSize: 12, color: COLORS.text, fontWeight: "800" },
});

const meta = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 14, color: COLORS.muted, fontWeight: "600" },
  value: { fontSize: 14, color: COLORS.text, fontWeight: "800" },
});
