// app/book.js  ← route: /book
import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

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
  primaryBorder: "#C9CEFF",
};

/* ---------- Small UI pieces ---------- */
function TabIcon({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity style={s.tabItem} onPress={onPress} activeOpacity={0.9}>
      <View style={[s.tabIcon, active && s.tabIconActive]}>{icon}</View>
      <Text style={s.tabLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function RoundBtnSmall({ icon, onPress, accessibilityLabel }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.85}
      style={s.roundBtnSmall}
    >
      <Ionicons name={icon} size={16} color={COLORS.text} />
    </TouchableOpacity>
  );
}

function RoundBtn({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={s.roundBtn}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
    </TouchableOpacity>
  );
}

function CounterRow({ label, value, onDec, onInc }) {
  return (
    <View style={s.counterRow}>
      <Text style={s.selectorLabel}>{label}</Text>
      <View style={s.counterBtns}>
        <RoundBtn icon="remove" onPress={onDec} />
        <Text style={s.counterValue}>{value}</Text>
        <RoundBtn icon="add" onPress={onInc} />
      </View>
    </View>
  );
}

function SelectorRow({ icon, label, value, onPress, rightElement }) {
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
      <View style={s.selectorRight}>
        {rightElement ? <View style={{ marginRight: 6 }}>{rightElement}</View> : null}
        <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
      </View>
    </TouchableOpacity>
  );
}

/**
 * ChipRow supports an optional priceGetter(opt) that returns a string.
 * When provided, a tiny price line is rendered beneath each chip label.
 */
function ChipRow({ label, value, options, onSelect, priceGetter }) {
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={s.selectorLabel}>{label}</Text> : null}
      <View style={s.chips}>
        {options.map((opt) => {
          const active = value === opt;
          const price = priceGetter ? priceGetter(opt) : null;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              activeOpacity={0.9}
              style={[s.chip, active && s.chipActive]}
            >
              <Text style={[s.chipTxt, active && s.chipTxtActive]}>{opt}</Text>
              {price ? <Text style={s.chipPrice}>{price}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ToggleTile({ title, subtitle, icon, priceLabel, active, onPress, info, onInfo }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[s.tile, active && s.tileActive]}>
      <View style={s.tileIcon}>
        <Ionicons name={icon} size={20} color={active ? COLORS.primary : COLORS.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.tileTitle, active && { color: COLORS.text }]}>{title}</Text>
        <Text style={s.tileSub}>{subtitle}</Text>
      </View>

      {priceLabel ? <Text style={s.pricePill}>{priceLabel}</Text> : null}

      {info ? (
        <TouchableOpacity onPress={onInfo} hitSlop={8} style={{ marginLeft: 8 }}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.muted} />
        </TouchableOpacity>
      ) : null}

      <Ionicons
        name={active ? "checkmark-circle" : "ellipse-outline"}
        size={18}
        color={active ? COLORS.primary : "#C7CCDA"}
        style={{ marginLeft: 8 }}
      />
    </TouchableOpacity>
  );
}

function BreakdownRow({ label, value, bold, muted }) {
  return (
    <View style={s.breakRow}>
      <Text style={[s.breakLabel, muted && { color: COLORS.muted }, bold && { fontWeight: "900" }]}>
        {label}
      </Text>
      <Text style={[s.breakValue, bold && { fontWeight: "900" }]}>{value}</Text>
    </View>
  );
}

/* ---------- Main Screen ---------- */
export default function SmartBooking() {
  const router = useRouter();

  // ---- form state ----
  const [from, setFrom] = useState("RUH · Riyadh");
  const [to, setTo] = useState("ULH · Al-Ula");
  const [trip, setTrip] = useState("Round trip"); // One way | Round trip
  const [depart, setDepart] = useState("Sep 19, 2025");
  const [returnDate, setReturnDate] = useState("Sep 27, 2025");

  const [passengers, setPassengers] = useState(1);
  const [cabin, setCabin] = useState("Economy"); // Economy | Premium | Business | First
  const [extras, setExtras] = useState(["Seat selection"]); // first add-on is free in calc

  // ---- price model ----
  const BASE_ONE_WAY = 220;
  const TRIP_MUL = trip === "Round trip" ? 1.8 : 1;

  const cabinMulFor = (c) =>
    c === "Premium" ? 1.4 : c === "Business" ? 2.2 : c === "First" ? 3 : 1;

  const CABIN_MUL = cabinMulFor(cabin);

  // VR is priced on its own page (don’t include in estimate here)
  const nonVRExtras = extras.filter((e) => e !== "VR booking");
  const ADDON_UNIT = 8; // each extra after first is +$8
  const addOnsCost = Math.max(0, nonVRExtras.length - 1) * ADDON_UNIT;

  const pricePerPaxForCabin = (c) =>
    Math.round(BASE_ONE_WAY * TRIP_MUL * cabinMulFor(c));

  const perPax = Math.round(BASE_ONE_WAY * TRIP_MUL * CABIN_MUL);
  const flightSubtotal = perPax * passengers;
  const estimateTotal = flightSubtotal + addOnsCost;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const toggleExtra = (name) => {
    setExtras((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const search = () => {
    Alert.alert(
      "Searching flights…",
      `${trip}
${from} → ${to}
Depart: ${depart}${trip === "Round trip" ? `\nReturn: ${returnDate}` : ""}
Passengers: ${passengers}
Cabin: ${cabin}
Extras: ${extras.join(", ")}

Estimated from $${estimateTotal}`,
    [
      {
        text: "Continue",
        onPress: () => {
          Alert.alert(
            "Payment Confirmed",
            "Thank you for choosing Riyadh Air! Your payment is confirmed.",
            [{ text: "OK", onPress: () => router.push("/") }]
          );
        },
      },
    ]
  );
};

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[COLORS.primarySoft1, COLORS.primarySoft2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          <Text style={s.heroTitle}>Flight Booking</Text>
          <Text style={s.heroSub}>Plan your flight and trip in one flow.</Text>
        </LinearGradient>

        {/* From / To */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="airplane-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Route</Text>
          </View>

          <SelectorRow
            icon="location-outline"
            label="From"
            value={from}
            onPress={() => setFrom(from === "RUH · Riyadh" ? "JED · Jeddah" : "RUH · Riyadh")}
            rightElement={
              <RoundBtnSmall icon="swap-vertical" onPress={swap} accessibilityLabel="Swap" />
            }
          />

          <SelectorRow
            icon="flag-outline"
            label="To"
            value={to}
            onPress={() => setTo(to === "ULH · Al-Ula" ? "ULH · Al-Ula" : "ULH · Al-Ula")}
          />
        </View>

        {/* Trip type & dates */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Dates</Text>
          </View>

          <ChipRow value={trip} options={["One way", "Round trip"]} onSelect={setTrip} />

          <View style={{ height: 8 }} />

          <SelectorRow
            icon="calendar-number-outline"
            label="Depart"
            value={depart}
            onPress={() =>
              setDepart(depart === "Sep 19, 2025" ? "Oct 03, 2025" : "Sep 19, 2025")
            }
          />
          {trip === "Round trip" && (
            <SelectorRow
              icon="calendar-outline"
              label="Return"
              value={returnDate}
              onPress={() =>
                setReturnDate(returnDate === "Sep 27, 2025" ? "Oct 12, 2025" : "Sep 27, 2025")
              }
            />
          )}
        </View>

        {/* Travelers & Cabin */}
        <View style={s.card}>
          <View style={[s.sectionHeaderRow, { alignItems: "center" }]}>
            <Ionicons name="people-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Travelers & Cabin</Text>
            <View style={{ flex: 1 }} />
            <View style={s.priceBadge}>
              <Text style={s.priceBadgeTop}>${perPax}</Text>
              <Text style={s.priceBadgeSub}>per passenger</Text>
            </View>
          </View>

          <CounterRow
            label="Passengers"
            value={passengers}
            onDec={() => setPassengers((v) => Math.max(1, v - 1))}
            onInc={() => setPassengers((v) => Math.min(9, v + 1))}
          />

          <View style={{ height: 8 }} />
          <ChipRow
            label="Cabin class"
            value={cabin}
            options={["Economy", "Premium", "Business", "First"]}
            onSelect={setCabin}
            priceGetter={(opt) => `$${pricePerPaxForCabin(opt)}`}
          />

          <View style={s.subtotalRow}>
            <Text style={s.subtotalLabel}>Flight subtotal</Text>
            <Text style={s.subtotalValue}>${flightSubtotal}</Text>
          </View>
        </View>

        {/* Smart add-ons */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="sparkles-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Smart add-ons</Text>
          </View>

          <View style={s.tileStack}>
            <ToggleTile
              title="Seat selection"
              subtitle="Choose seats together"
              icon="grid-outline"
              priceLabel="+$8"
              active={extras.includes("Seat selection")}
              onPress={() => toggleExtra("Seat selection")}
            />
            <ToggleTile
              title="Fast security"
              subtitle="Skip long lines where available"
              icon="flash-outline"
              priceLabel="+$8"
              active={extras.includes("Fast security")}
              onPress={() => toggleExtra("Fast security")}
            />
            <ToggleTile
              title="Extra bag"
              subtitle="Add 1 checked bag"
              icon="briefcase-outline"
              priceLabel="+$8"
              active={extras.includes("Extra bag")}
              onPress={() => toggleExtra("Extra bag")}
            />
            <ToggleTile
              title="VR booking"
              subtitle="In-flight VR experience"
              icon="eye-outline"
              priceLabel="From $20"
              info
              onInfo={() =>
                Alert.alert(
                  "VR booking",
                  "Optional in-flight VR experience: plan activities, watch movies, explore your destination, and play games. Book and price on the VR page."
                )
              }
              active={extras.includes("VR booking")}
              onPress={() => toggleExtra("VR booking")}
            />
          </View>

          <Text style={s.noteInline}>
            * Flight estimate includes add-ons (first add-on free, then additional cost)
          </Text>
        </View>

        {/* Price breakdown */}
        <View style={s.card}>
          <View style={s.sectionHeaderRow}>
            <Ionicons name="receipt-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Price breakdown</Text>
          </View>

          <BreakdownRow label="Base fare (one-way per pax)" value={`$${BASE_ONE_WAY}`} />
          <BreakdownRow
            label={`Trip type (${trip === "Round trip" ? "×1.8" : "×1.0"})`}
            value={`$${Math.round(BASE_ONE_WAY * TRIP_MUL - BASE_ONE_WAY)}`}
            muted
          />
          <BreakdownRow
            label={`Cabin class (${cabin}, ×${CABIN_MUL})`}
            value={`$${Math.round(BASE_ONE_WAY * TRIP_MUL * CABIN_MUL - BASE_ONE_WAY * TRIP_MUL)}`}
            muted
          />
          <BreakdownRow label={`Subtotal per passenger`} value={`$${perPax}`} />
          <BreakdownRow label={`Passengers × ${passengers}`} value={`$${flightSubtotal}`} />
          <BreakdownRow label={`Add-ons`} value={`$${addOnsCost}`} />
          <View style={s.divider} />
          <BreakdownRow label="Estimated total" value={`$${estimateTotal}`} bold />
        </View>

        {/* Summary / CTA */}
        <View style={s.card}>
          <View style={s.summaryRow}>
            <View>
              <Text style={s.summaryLead}>Estimated total</Text>
              <Text style={s.summarySub}>Before taxes & carrier fees</Text>
            </View>
            <Text style={s.summaryAmt}>${estimateTotal}</Text>
          </View>

          <TouchableOpacity style={s.cta} activeOpacity={0.9} onPress={search}>
            <Text style={s.ctaTxt}>Apple Pay</Text>
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
          active
          icon={<Ionicons name="home" size={22} color={COLORS.text} />}
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

/* -------- styles -------- */
const s = StyleSheet.create({
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

  hero: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primarySoft2,
    backgroundColor: COLORS.primarySoft1,
    marginBottom: 14,
  },
  heroTitle: { color: COLORS.text, fontSize: 18, fontWeight: "800" },
  heroSub: { color: COLORS.muted, fontSize: 14, marginTop: 2 },

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

  // Selectors
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primarySoft1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft2,
    marginBottom: 8,
  },
  selectorLeft: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  selectorRight: { flexDirection: "row", alignItems: "center" },
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
  selectorLabel: { fontSize: 13, color: COLORS.muted, marginBottom: 2, fontWeight: "700" },
  selectorValue: { fontSize: 14, color: COLORS.text, fontWeight: "700", flexShrink: 1 },

  roundBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Counter
  counterRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  counterBtns: { flexDirection: "row", alignItems: "center", gap: 10 },
  counterValue: { fontSize: 16, fontWeight: "800", color: COLORS.text, width: 24, textAlign: "center" },
  roundBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F4F5F8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBEDF3",
  },

  // Chips
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    borderWidth: 1,
    borderColor: "#EBEDF3",
    alignItems: "center",
  },
  chipActive: { backgroundColor: COLORS.primarySoft1, borderColor: COLORS.primarySoft2 },
  chipTxt: { fontSize: 13, color: "#4B5563", fontWeight: "700" },
  chipTxtActive: { color: COLORS.text },
  chipPrice: { fontSize: 10, color: COLORS.muted, marginTop: 2, fontWeight: "700" },

  // Travelers price badge + subtotal
  priceBadge: {
    alignItems: "flex-end",
    backgroundColor: "#F4F5F8",
    borderWidth: 1,
    borderColor: "#EBEDF3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceBadgeTop: { fontSize: 14, fontWeight: "900", color: COLORS.text, lineHeight: 16 },
  priceBadgeSub: { fontSize: 10, color: COLORS.muted, marginTop: 2 },

  subtotalRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subtotalLabel: { color: COLORS.muted, fontSize: 13, fontWeight: "700" },
  subtotalValue: { color: COLORS.text, fontSize: 16, fontWeight: "900" },

  // Tiles
  tileStack: { gap: 10 },
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
  tileActive: {
    backgroundColor: COLORS.primarySoft1,
    borderColor: COLORS.primarySoft2,
  },
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
  pricePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F4F5F8",
    borderWidth: 1,
    borderColor: "#EBEDF3",
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  // Breakdown
  breakRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  breakLabel: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  breakValue: { color: COLORS.text, fontSize: 13, fontWeight: "700" },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 6 },
  noteInline: { marginTop: 10, color: COLORS.muted, fontSize: 12 },

  // Summary & CTA
  summaryRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
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
    backgroundColor: COLORS.dark,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  ctaTxt: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.4 },
  ctaIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1d2129",
  },
});
