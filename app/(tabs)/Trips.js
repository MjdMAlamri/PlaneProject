// app/Trips.js
// "Your trips" — with image background info cards (matches Home style)

import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const W = Dimensions.get("window").width;

/** --- Theme (mirror Home) --- */
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
};

const IMG = {
  airport:
    "https://www.timeoutriyadh.com/cloud/timeoutriyadh/2024/06/04/king-khalid-international-airport.jpg",
  history:
    "https://www.experiencealula.com/content/dam/rcudxp/global/places-to-go/elephant-rock/hero/elephant-rock-place-to-go-hero-01.jpg",
  plans:
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2344&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  tips:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop",
};

export default function Trips() {
  const router = useRouter();
  const [trips] = useState([
    { id: "1", code: "RYD123", from: "RYD", to: "ULH", when: "Tomorrow 10:20" },
    { id: "2", code: "RYD123", from: "RYD", to: "ULH", when: "Fri 18:45" },
  ]);

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* Top App Bar (scrolls with page) */}
        <View style={s.appbar}>
          <Text style={s.brand}>
            Riyadh V-aiR<Text style={{ color: COLORS.primary }}>.</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={s.iconBtn}
              onPress={() =>
                Alert.alert(
                  "Trips",
                  "See your upcoming flights and quick info about the destination and airport."
                )
              }
            >
              <Ionicons name="information-outline" size={18} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={s.iconBtn} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <Text style={s.h1}>Your trips</Text>

        {/* Upcoming trips */}
        <View style={s.panel}>
          <Text style={s.sectionTitle}>Upcoming trips:</Text>
          <View style={s.divider} />
          <View style={{ gap: 10 }}>
            {trips.map((t) => (
              <UpcomingTripCard
                key={t.id}
                code={t.code}
                from={t.from}
                to={t.to}
                when={t.when}
                onPress={() => router.push("/book")}
              />
            ))}
          </View>
        </View>

        {/* Info about your next trip (image background cards) */}
        <View style={s.panel}>
          <Text style={s.sectionTitle}>Info about your next trip:</Text>

          <View style={i.grid}>
            <InfoCardBG
              image={IMG.airport}
              icon="airplane-outline"
              title="From King Khalid International Airport"
              bullets={[
                "Terminal maps & gates",
                "Parking & drop-off info",
                "Check-in & security tips",
              ]}
              onPress={() => Alert.alert("Airport", "Terminal maps, parking, check-in tips")}
            />
            <InfoCardBG
              image={IMG.history}
              icon="globe-outline"
              title="Historical Info about the city"
              bullets={[
                "Top landmarks",
                "Local culture & customs",
                "Must-try foods",
              ]}
              onPress={() => Alert.alert("City", "A quick history & culture overview")}
            />
            <InfoCardBG
              image={IMG.plans}
              icon="people-outline"
              title="See other people plans"
              bullets={[
                "Community itineraries",
                "Best-rated spots",
                "Hidden gems",
              ]}
              onPress={() => router.push("/hub")}
            />
            <InfoCardBG
              image={IMG.tips}
              icon="bulb-outline"
              title="See tips for planning the trip"
              bullets={[
                "Packing checklist",
                "Money, roaming & apps",
                "Safety & transport",
              ]}
              onPress={() => Alert.alert("Tips", "Packing list, money/roaming, safety & apps")}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav — Trips active */}
      <View style={s.tabbar}>
        <TabIcon icon={<Ionicons name="home" size={22} color="#666" />} label="Home" onPress={() => router.push("/")} />
        <TabIcon
          active
          icon={<Ionicons name="airplane-outline" size={22} color={COLORS.text} />}
          label="Trips"
          onPress={() => {}}
        />
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" onPress={() => router.push("/hub")} />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
  );
}

/* ===== Components ===== */

function UpcomingTripCard({ code, from, to, when, onPress }) {
  return (
    <TouchableOpacity style={u.card} activeOpacity={0.9} onPress={onPress}>
      <View style={u.left}>
        <View style={u.iconBox}>
          <Ionicons name="swap-horizontal" size={18} color="#6E5DFF" />
        </View>
        <View>
          <Text style={u.title}>Selected flight</Text>
          <Text style={u.route}>
            {code} <Text style={{ color: "#0F172A", fontWeight: "900" }}>{from} → {to}</Text>
          </Text>
          <Text style={u.when}>{when}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#7A8197" />
    </TouchableOpacity>
  );
}

/** Image background info card (2x2 grid) — like your screenshot */
function InfoCardBG({ image, icon, title, bullets = [], onPress }) {
  return (
    <TouchableOpacity style={i.card} activeOpacity={0.9} onPress={onPress}>
      {/* Background image */}
      <Image source={{ uri: image }} style={i.bg} resizeMode="cover" />
      {/* Soft blur/tint overlay */}
      <LinearGradient
        colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.55)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={i.shade}
      />

      {/* Content */}
      <View style={i.inner}>
        {/* Small icon + title in a pill */}
        <View style={i.titleRow}>
          <View style={i.iconPill}>
            <Ionicons name={icon} size={16} color="#0F172A" />
          </View>
          <Text style={i.titleTxt} numberOfLines={2}>
            {title}
          </Text>
        </View>

        {/* Bullets */}
        <View style={{ marginTop: 6, gap: 4 }}>
          {bullets.slice(0, 3).map((b, idx) => (
            <Text key={idx} style={i.bullet}>• {b}</Text>
          ))}
        </View>

        {/* CTA */}
        <View style={i.ctaRow}>
          <Text style={i.ctaTxt}>Learn more</Text>
          <Ionicons name="arrow-forward" size={14} color="#0F172A" />
        </View>
      </View>
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

  // App bar
  appbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  iconBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#F1F2F6",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#EBEDF3",
  },

  h1: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 10 },

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
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#E7E9FD", marginBottom: 12 },

  // Bottom tab
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

const u = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.primarySoft1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primarySoft2,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  iconBox: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.primarySoft2,
  },
  title: { fontSize: 12.5, color: COLORS.muted, fontWeight: "700", marginBottom: 2 },
  route: { fontSize: 14, color: COLORS.text, fontWeight: "800" },
  when: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
});

const CARD_W = 343
const i = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: CARD_W,
    height: 170,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    backgroundColor: "#fff",
  },
  bg: { ...StyleSheet.absoluteFillObject },
  shade: { ...StyleSheet.absoluteFillObject },
  inner: { flex: 1, padding: 12, justifyContent: "space-between" },

  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconPill: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.border,
  },
  titleTxt: { flex: 1, fontSize: 14, fontWeight: "800", color: COLORS.text },

  bullet: { fontSize: 12.5, color: "#212633", opacity: 0.85 },

  ctaRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  ctaTxt: { fontSize: 12, fontWeight: "800", color: COLORS.text },
});
