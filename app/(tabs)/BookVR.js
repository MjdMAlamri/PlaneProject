// app/vr-booking.js  ← route: /vr-booking

import React, { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const W = Dimensions.get("window").width;

/** Theme — mirrors your Home page */
const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft1: "#EEF0FF",
  primarySoft2: "#E9ECFF",
  accent: "#FFCE31",
  dark: "#0B0B0B",
};

function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={s.tabItem} activeOpacity={0.85} onPress={onPress}>
      <View style={[s.tabIcon, active && s.tabIconActive]}>{icon}</View>
      <Text style={[s.tabLabel, active && { color: COLORS.text, fontWeight: "600" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function VRBooking() {
  const router = useRouter();

  // ----- form state -----
  const [flight, setFlight] = useState("RYD123 → ULH");
  const [headset, setHeadset] = useState("Bring my own");               // Rent | Bring my own
  const [slot, setSlot] = useState("First 2 hours");            // First 2 hours | Middle 2 hours | Full flight
  const [activities, setActivities] = useState(["Plan activities"]);

  // ----- prices (for display + calc) -----
  const BASE_PRICE = 20;                                        // activities base
  const ADDON_PER_ACTIVITY = 2;                                 // each extra activity
  const HEADSET_PRICES = { Rent: 8, "Bring my own": 0 };
  const SLOT_PRICES = { "First 2 hours": 0, "Middle 2 hours": 0, "Full flight": 10 };

  // total
  const price = useMemo(() => {
    const headsetFee = HEADSET_PRICES[headset] ?? 0;
    const slotFee = SLOT_PRICES[slot] ?? 0;
    const activityAdd = Math.max(0, activities.length - 1) * ADDON_PER_ACTIVITY;
    return BASE_PRICE + headsetFee + slotFee + activityAdd;
  }, [headset, slot, activities]);

  const toggleActivity = (name) => {
    setActivities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const submit = () => {
    if (!flight) {
      Alert.alert("Missing info", "Please choose a flight.");
      return;
    }
    Alert.alert(
      "VR booked 🎉",
      `Flight: ${flight}
Headset: ${headset}
Time slot: ${slot}
Activities: ${activities.join(", ")}

Total: $﷼{price.toFixed(2)}`,
      [{ text: "Done", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
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



        {/* Header / Hero */}
        <LinearGradient
          colors={[COLORS.dark, "#0E0E10"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <View style={s.heroRow}>
            <View style={s.vrBadge}>
              <Text style={s.vrBadgeTxt}>VR</Text>
            </View>
            <Text style={s.heroTitle}>VR in the Plane</Text>
          </View>
          <Text style={s.heroSub}>Plan, watch, and explore from your seat!</Text>
        </LinearGradient>

        {/* Flight selector */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="airplane-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Flight</Text>
          </View>

          <SelectorRow
            icon="swap-horizontal-outline"
            label="Selected flight"
            value={flight}
            onPress={() => setFlight(flight === "RYD123 → ULH" ? "RYD456 → ULH" : "RYD123 → ULH")}
          />
        </View>

        {/* Headset (shows price per option) */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="headset-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Headset</Text>
          </View>
          <ChipRow
            value={headset}
            options={["Bring my own", "Rent"]}
            prices={HEADSET_PRICES}
            onSelect={setHeadset}
          />
          <View style={s.note}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.muted} />
            <Text style={s.noteTxt}>Rental includes sanitization kit and quick-start help.</Text>
          </View>
        </View>

        {/* Time slot (shows price per option) */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Time Slot</Text>
          </View>
          <ChipRow
            value={slot}
            options={["First 2 hours", "Middle 2 hours", "Full flight"]}
            prices={SLOT_PRICES}
            onSelect={setSlot}
          />
        </View>

        {/* Summary */}
        <View style={s.card}>
          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryLead}>Total</Text>
              <Text style={s.summarySub}>Taxes & fees included</Text>
            </View>
            <Text style={s.summaryAmt}>{price.toFixed(2)}﷼</Text>
          </View>

          <TouchableOpacity style={s.cta} activeOpacity={0.9} onPress={submit}>
            <Text style={s.ctaTxt}>Book your VR</Text>
            <View style={s.ctaIcon}>
              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

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
          onPress={() => router.push("/hub")}
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

/* ---------- Small components ---------- */
function SelectorRow({ icon, label, value, onPress }) {
  return (
    <TouchableOpacity style={s.selectorRow} onPress={onPress} activeOpacity={0.9}>
      <View style={s.selectorLeft}>
        <View style={s.selectorIcon}>
          <Ionicons name={icon} size={18} color={COLORS.text} />
        </View>
        <View>
          <Text style={s.selectorLabel}>{label}</Text>
          <Text style={s.selectorValue}>{value}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
    </TouchableOpacity>
  );
}

/** ChipRow now supports a `prices` map to show cost next to each option */
function ChipRow({ label, value, options, prices = {}, onSelect }) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={s.selectorLabel}>{label}</Text> : null}
      <View style={s.chips}>
        {options.map((opt) => {
          const active = value === opt;
          const p = prices[opt] ?? 0;
          const priceText = p > 0 ? `+$0﷼` : "+0﷼";
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              activeOpacity={0.9}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipTxt, active && s.chipTxtActive]}>
                {opt} · {priceText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ActivityTile({ title, subtitle, icon, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[s.tile, active && s.tileActive]}
    >
      <View style={s.tileIcon}>
        <Ionicons name={icon} size={20} color={active ? COLORS.primary : COLORS.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.tileTitle, active && { color: COLORS.text }]}>{title}</Text>
        <Text style={s.tileSub}>{subtitle}</Text>
      </View>
      <Ionicons
        name={active ? "checkmark-circle" : "ellipse-outline"}
        size={18}
        color={active ? COLORS.primary : "#C7CCDA"}
      />
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */
const s = StyleSheet.create({
  // app bar
  appbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  bell: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F1F2F6", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EBEDF3" },
 brandLogo: {
  height: 42,
  width: 240,
  marginLeft: -60,  // tweak -6 to -14 depending on the file
  },
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 120 },

  hero: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#16181F",
    backgroundColor: COLORS.dark,
    marginBottom: 14,
  },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  vrBadge: {
    paddingHorizontal: 6,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  vrBadgeTxt: { color: COLORS.text, fontSize: 12, fontWeight: "800" },
  heroTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  heroSub: { color: "#E5E7EB", fontSize: 14 },

  card: {
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },

  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  selectorLabel: { fontSize: 13, color: COLORS.muted, marginBottom: 4, fontWeight: "700" },
  selectorValue: { fontSize: 14, color: COLORS.text, fontWeight: "700" },

  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primarySoft1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft2,
  },
  selectorLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  selectorIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    borderWidth: 1,
    borderColor: "#EBEDF3",
  },
  chipActive: { backgroundColor: COLORS.primarySoft1, borderColor: COLORS.primarySoft2 },
  chipTxt: { fontSize: 13, color: "#4B5563", fontWeight: "700" },
  chipTxtActive: { color: COLORS.text },

  priceNote: { marginTop: 2, marginBottom: 8, color: COLORS.muted, fontSize: 12, fontWeight: "700" },

  activityGrid: { gap: 10 },
  tile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#FFF",
  },
  tileActive: { backgroundColor: COLORS.primarySoft1, borderColor: COLORS.primarySoft2 },
  tileIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F4F5F8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBEDF3",
  },
  tileTitle: { fontSize: 14, fontWeight: "800", color: COLORS.text },
  tileSub: { fontSize: 12, color: COLORS.muted },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLead: { color: COLORS.muted, fontSize: 13, fontWeight: "700" },
  summarySub: { color: COLORS.muted, fontSize: 11 },
  summaryAmt: { fontSize: 22, fontWeight: "900", color: COLORS.text },

  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    paddingLeft: 18,
    paddingRight: 8,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 14,
    elevation: 3,
  },
  ctaTxt: { color: COLORS.text, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  ctaIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFE082",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFD24D",
  },
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
