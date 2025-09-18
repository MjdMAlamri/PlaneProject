// app/Trips.js
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/** Theme — mirrors your Hub page */
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

export default function TripDetails() {
  const router = useRouter();
  const [showPassengers, setShowPassengers] = useState(true);
  const [legTab, setLegTab] = useState("out"); // out | ret

  const onCancel = () =>
    Alert.alert(
      "Cancel booking?",
      "This action cannot be undone.",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, cancel", style: "destructive", onPress: () => Alert.alert("Booking canceled") },
      ],
      { userInterfaceStyle: "light" }
    );

  return (
    <SafeAreaView style={st.safe}>
      {/* App bar */}
      <View style={st.appbar}>
        <TouchableOpacity onPress={() => router.back()} style={st.iconCircle}>
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={st.brand}>Riyadh V-aiR.</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* right-side icons... */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={st.bell}
            onPress={() => router.push("/notifications")} >
            <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Curved hero background */}
        <View style={st.hero}>
          {/* Top App Bar */}

        <View style={[st.appbar, st.appbarEdge]}>
          <Image
            source={require("../../assets/images/Riyadh_Air_Logo.png")}
            style={st.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Riyadh Air"
          />
        </View>
            </View>

        {/* Booking card */}
        <View style={[st.panel, st.bookingCard]}>
          <View style={st.bookingHeader}>
            <View>
              <Text style={st.bookNumLabel}>Booking Number</Text>
              <Text style={st.bookNumValue}>251509807793</Text>
            </View>

            <View style={{ gap: 8 }}>
              <SmallBtn label="Modify" onPress={() => Alert.alert("Modify booking")} />
              <SmallBtn
                label="View trip plan"
                onPress={() => router.push("/hub")}
                variant="secondary"
              />
            </View>
          </View>

          <View style={st.routeRow}>
            <View style={{ flex: 1 }}>
              <Text style={st.cityCode}>RYD</Text>
              <Text style={st.cityName}>Riyadh</Text>
              <Chip text="Economy Saver" />
            </View>

            <View style={st.arrowCol}>
              <Ionicons name="airplane" size={20} color="#fff" style={st.arrowIcon} />
            </View>

            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={st.cityCode}>ULH</Text>
              <Text style={st.cityName}>Al-Ula</Text>
              <Chip text="Economy Saver" align="right" />
            </View>
          </View>

          {/* Dates */}
          <View style={[st.rowBetween, { marginTop: 6 }]}>
            <LabelValue label="Outbound" value="19 September, 2025" />
            <LabelValue label="Return" value="27 September, 2025" align="right" />
          </View>

          {/* Legs */}
          <View style={st.legBlock}>
            <Text style={st.legTitle}>Outbound</Text>
            <Leg
              departTime="07:13"
              departCity="Riyadh"
              arriveTime="11:22"
              arriveCity="Dammam"
              duration="4h 9m"
              stops="2 Stops"
              number="RA #106"
            />
          </View>

          <View style={st.divider} />

          <View style={st.legBlock}>
            <Text style={st.legTitle}>Return</Text>
            <Leg
              departTime="15:37"
              departCity="Dammam"
              arriveTime="20:10"
              arriveCity="Riyadh"
              duration="4h 33m"
              stops="2 Stops"
              number="RA #113"
            />
          </View>

          {/* Payment */}
          <View style={[st.rowBetween, { marginTop: 14 }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Image
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" }}
                style={{ width: 34, height: 11, resizeMode: "contain" }}
              />
              <Text style={{ color: COLORS.muted, fontWeight: "700" }}>Credit Card</Text>
            </View>
            <Text style={st.total}> 245.00﷼</Text>
          </View>
        </View>

        {/* Ride CTA */}
        <TouchableOpacity
          style={st.uberBtn}
          activeOpacity={0.88}
          onPress={() => Alert.alert("Blacklane", "Opening Blacklane to reserve your ride…")}
        >
          <Text style={st.uberTxt}>Uber  Reserve Your Ride</Text>
        </TouchableOpacity>

        {/* Small leg tabs */}
        <View style={st.smallTabsWrap}>
          <SmallTab
            label="Riyadh ➝ Dammam"
            active={legTab === "out"}
            onPress={() => setLegTab("out")}
          />
          <SmallTab
            label="Dammam ➝ Riyadh"
            active={legTab === "ret"}
            onPress={() => setLegTab("ret")}
          />
        </View>

        {/* Passengers accordion */}
        <TouchableOpacity
          onPress={() => setShowPassengers((v) => !v)}
          activeOpacity={0.9}
          style={[st.panel, st.accordionHeader]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={st.sectionTitle}>Passengers</Text>
            <View style={st.countPill}>
              <Text style={st.countTxt}>1</Text>
            </View>
          </View>
          <Ionicons
            name={showPassengers ? "chevron-up" : "chevron-down"}
            size={18}
            color={COLORS.muted}
          />
        </TouchableOpacity>

        {showPassengers && (
          <View style={{ gap: 12, paddingHorizontal: 16 }}>
            <View style={[st.panel, { gap: 10 }]}>
              <View style={st.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={st.seatBadge}>
                    <Text style={st.seatTxt}>6E</Text>
                  </View>
                  <View>
                    <Text style={st.name}>Besmeih Alshaalan</Text>
                    <Text style={st.subtle}>Adult</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Ticket", "Opening ticket…")}>
                  <Text style={st.link}>View Ticket →</Text>
                </TouchableOpacity>
              </View>

              <View style={st.rowBetween}>
                <LabelValue label="Baggage" value="10 kg" />
                <LabelValue label="Status" value="Confirmed" align="right" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom nav (Trips highlighted) */}
      <View style={st.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/")} />
        <TabIcon
          active
          icon={<Ionicons name="airplane-outline" size={22} color={COLORS.text} />}
          label="Trips"
          onPress={() => router.push("/Trips")}
        />
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" onPress={() => router.push("/(tabs)/hub")} />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
  );
}

/* — tiny atoms — */
function SmallBtn({ label, onPress, variant = "primary" }) {
  const styles =
    variant === "secondary"
      ? { bg: COLORS.primarySoft1, border: COLORS.primaryBorder, color: COLORS.text }
      : { bg: COLORS.text, border: COLORS.text, color: "#fff" };
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        alignSelf: "flex-end",
        backgroundColor: styles.bg,
        borderWidth: 1,
        borderColor: styles.border,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
      }}
    >
      <Text style={{ color: styles.color, fontWeight: "800", fontSize: 12 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Chip({ text, align = "left" }) {
  return (
    <View style={[st.chip, align === "right" && { alignSelf: "flex-end" }]}>
      <Text style={st.chipTxt}>{text}</Text>
    </View>
  );
}

function LabelValue({ label, value, align = "left" }) {
  return (
    <View style={{ alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      <Text style={st.lvLabel}>{label}</Text>
      <Text style={st.lvValue}>{value}</Text>
    </View>
  );
}

function Leg({ departTime, departCity, arriveTime, arriveCity, duration, stops, number }) {
  return (
    <View style={st.legCard}>
      <View style={st.legLeft}>
        <View style={st.dot} />
        <View style={st.dotted} />
        <View style={[st.dot, { marginTop: 0 }]} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={st.rowBetween}>
          <Text style={st.time}>{departTime}</Text>
          <Text style={st.time}>{arriveTime}</Text>
        </View>
        <View style={st.rowBetween}>
          <Text style={st.place}>{departCity}</Text>
          <Text style={st.place}>{arriveCity}</Text>
        </View>
        <View style={[st.rowBetween, { marginTop: 6 }]}>
          <Text style={st.subtle}>{duration}</Text>
          <Text style={st.subtle}>{stops}</Text>
          <Text style={st.subtle}>{number}</Text>
        </View>
      </View>
    </View>
  );
}

function SmallTab({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[st.smallTab, active && st.smallTabActive]}>
      <Text style={[st.smallTabTxt, active && { color: "#fff" }]}>{label}</Text>
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

/* — styles — */
const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  appbarEdge: { paddingHorizontal: 16, paddingTop: 6 },
  brandLogo: { height: 42, width: 240, marginLeft: -60 },
  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },
  
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    marginBottom: 6,
  },
  brand: { color: COLORS.text, fontWeight: "900", fontSize: 18 },
  iconCircle: {
    width: 34, height: 34, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  hero: {
    height: 120,
    marginHorizontal: 16,
    backgroundColor: "#E4E7EE",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

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
  bookingCard: {
    marginTop: -44,
    marginHorizontal: 16,
    gap: 10,
  },

  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookNumLabel: { color: COLORS.muted, fontWeight: "800", marginBottom: 4 },
  bookNumValue: { color: COLORS.text, fontWeight: "900", fontSize: 16 },

  routeRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cityCode: { color: COLORS.text, fontWeight: "900", fontSize: 28, lineHeight: 30 },
  cityName: { color: COLORS.muted, fontWeight: "700", marginTop: 2 },

  arrowCol: {
    width: 54,
    alignItems: "center",
    marginTop: 6,
  },
  arrowIcon: {
    backgroundColor: "#159293",
    padding: 8,
    borderRadius: 999,
    transform: [{ rotate: "90deg" }],
  },

  chip: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primarySoft1,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 6,
  },
  chipTxt: { color: COLORS.text, fontWeight: "800", fontSize: 11 },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  lvLabel: { color: COLORS.muted, fontWeight: "800", fontSize: 12 },
  lvValue: { color: COLORS.text, fontWeight: "900", marginTop: 2 },

  legBlock: { marginTop: 10 },
  legTitle: { color: COLORS.text, fontWeight: "900", marginBottom: 6 },

  legCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
  },
  legLeft: { width: 12, alignItems: "center" },
  dot: {
    width: 7, height: 7, borderRadius: 6, backgroundColor: "#1EA1A1",
    marginTop: 2, marginBottom: 4,
  },
  dotted: {
    flex: 1,
    borderLeftWidth: 2,
    borderStyle: "dashed",
    borderColor: "#B9E5E5",
    marginVertical: 2,
  },
  time: { color: COLORS.text, fontWeight: "900" },
  place: { color: COLORS.muted, fontWeight: "800" },
  subtle: { color: COLORS.muted, fontWeight: "700" },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 10,
  },

  total: { color: COLORS.text, fontWeight: "900" },

  uberBtn: {
    marginTop: 12,
    marginHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  uberTxt: { color: "#fff", fontWeight: "900" },

  smallTabsWrap: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    gap: 8,
  },
  smallTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    backgroundColor: "#fff",
  },
  smallTabActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  smallTabTxt: { color: COLORS.text, fontWeight: "800", fontSize: 12 },

  accordionHeader: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { color: COLORS.text, fontWeight: "900" },
  countPill: {
    backgroundColor: COLORS.primarySoft1,
    borderColor: COLORS.primaryBorder,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countTxt: { color: COLORS.text, fontWeight: "900", fontSize: 12 },

  name: { color: COLORS.text, fontWeight: "900" },
  link: { color: COLORS.text, fontWeight: "900", textDecorationLine: "underline" },
  seatBadge: {
    width: 36, height: 28, borderRadius: 8,
    backgroundColor: COLORS.primarySoft1, borderWidth: 1, borderColor: COLORS.primaryBorder,
    alignItems: "center", justifyContent: "center",
  },
  seatTxt: { color: COLORS.text, fontWeight: "900" },

  bigBtn: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bigBtnTxt: { fontWeight: "900" },

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
