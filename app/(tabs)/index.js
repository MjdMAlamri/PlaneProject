// app/index.js
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
  Pressable,
  Alert,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const W = Dimensions.get("window").width;
const HERO_H = 430; // tall, “stretched” hero

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

const USER_NAME = "Daniel";
const HERO_IMG =
  // ⬇️ replace with your Riyadh Air airplane hero image (sky+plane)
  "/Users/m/Desktop/GDP/PlaneProject/my-travel-app/assets/images/Background_img.png";
const FALLBACK_IMG = "https://placehold.co/1600x900/jpg?text=Riyadh+Air";

const IMG = {
  vr: "https://plus.unsplash.com/premium_photo-1661402170986-1b47b4b397ab?q=80&w=2342&auto=format&fit=crop",
  games:
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=60",
  hub: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=2340&auto=format&fit=crop",
};

export default function Home() {
  const router = useRouter();

  // Countdown
  const DEPART_AT = new Date(Date.now() + 1000 * 60 * 90);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(DEPART_AT));
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft(DEPART_AT)), 1000);
    return () => clearInterval(t);
  }, []);

  // Smart-Booking: Route state
  const [from, setFrom] = useState("RUH · Riyadh");
  const [to, setTo] = useState("ULH · Al-Ula");
  const swap = () => {
    setFrom((f) => {
      const prev = f;
      setTo(prev);
      return to;
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* ===================== FULL-BLEED HERO ===================== */}
        <Hero
          timeLeft={timeLeft}
          onBell={() => router.push("/notifications")}
          onPressCamera={() => router.push("/ar")}
        />

        {/* ===================== BOOK YOUR FLIGHT ===================== */}
        <View style={s.panel}>
          <View style={s.headerRowIcon}>
            <Ionicons name="airplane-outline" size={18} color={COLORS.primary} />
            <Text style={s.sectionTitle}>Book your flight</Text>
          </View>

          <SelectorRowSB
            icon="location-outline"
            label="From"
            value={from}
            onPress={() => setFrom(from === "RUH · Riyadh" ? "JED · Jeddah" : "RUH · Riyadh")}
            rightAddon={<RoundBtnTiny icon="swap-vertical" onPress={swap} />}
            onChevron={() => router.push("/book")}
          />

          <SelectorRowSB
            icon="flag-outline"
            label="To"
            value={to}
            onPress={() => setTo(to === "ULH · Al-Ula" ? "ULH · Al-Ula" : "ULH · Al-Ula")}
            onChevron={() => router.push("/book")}
          />

          <TouchableOpacity
            style={s.btnShowFlights}
            activeOpacity={0.9}
            onPress={() => router.push("/book")}
          >
            <Text style={s.btnShowTxt}>Show Flights</Text>
          </TouchableOpacity>
        </View>

        {/* Smart booking shiny CTA */}
        <View style={s.actionsWrap}>
          <SmartCtaShiny onPress={() => router.push("/smart")} />
        </View>

        {/* What makes Riyadh Air Special */}
        <View style={s.panel}>
          <View style={s.sectionHeaderRow}>
            <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
            <Text style={s.sectionTitle}>What makes Riyadh Air Special</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 6, paddingRight: 4 }}
          >
            <FeatureBanner
              title="VR in the Plane"
              icon="eye-outline"
              image={IMG.vr}
              bullets={[
                "Plan your activities while in the sky",
                "Watch movies in VR",
                "Explore destination + smart suggestions",
                "Play our games in VR",
              ]}
              onPress={() => router.push("/BookVR")}
            />

            <FeatureBanner
              title="In-flight Games"
              icon="game-controller-outline"
              image={IMG.games}
              bullets={[
                "Play with other passengers",
                "Earn badges & points",
                "Badge for every new city",
              ]}
              onPress={() => router.push("/hub?tab=games")}
            />

            <FeatureBanner
              title="The Hub"
              icon="apps-outline"
              image={IMG.hub}
              bullets={[
                "Discover activities",
                "Recommended activities for you",
                "In-flight games",
              ]}
              onPress={() => router.push("/hub")}
            />
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.tabbar}>
        <TabIcon active icon={<Ionicons name="home" size={22} color={COLORS.text} />} label="Home" />
        <TabIcon icon={<Ionicons name="airplane-outline" size={22} color="#666" />} label="Trips" onPress={() => router.push("/Trips")} />
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" onPress={() => router.push("/hub")} />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/Profile")} />
      </View>
    </SafeAreaView>
  );
}

/* ===================== HERO ===================== */

function Hero({ timeLeft, onBell, onPressCamera, useBlur = true }) {
  const [uri, setUri] = useState(HERO_IMG);

  return (
    <View style={h.wrap}>
      {/* Background sky/plane image (stretched, full-bleed) */}
      <Image source={{ uri }} onError={() => setUri(FALLBACK_IMG)} style={h.bg} resizeMode="cover" />

      {/* Soft top/bottom gradients for readability but keep the sky visible */}
      <LinearGradient
        colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.35 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.12)"]}
        start={{ x: 0, y: 0.6 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Top row: bell */}
<View style={h.topRow}>
  <TouchableOpacity onPress={onBell} activeOpacity={0.8} style={h.bell}>
    <Ionicons name="notifications-outline" size={20} color="#fff" />
  </TouchableOpacity>
</View>


      {/* Welcome text on the sky */}
      <View style={h.welcomeBlock}>
        <Text style={h.welcomeName}>{USER_NAME},</Text>
        <Text style={h.welcomeBack}>WELCOME BACK</Text>
      </View>

      {/* Transparent “Next Trip” overlay, anchored to bottom */}
      {useBlur ? (
        <BlurView intensity={28} tint="light" style={h.nextTripCard}>
          <NextTripInner timeLeft={timeLeft} onPressCamera={onPressCamera} lightOnDark />
        </BlurView>
      ) : (
        <View style={[h.nextTripCard, { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.45)" }]}>
          <NextTripInner timeLeft={timeLeft} onPressCamera={onPressCamera} lightOnDark />
        </View>
      )}
    </View>
  );
}

function NextTripInner({ timeLeft, onPressCamera, lightOnDark }) {
  const white = lightOnDark ? "#fff" : COLORS.text;
  const sub = lightOnDark ? "rgba(255,255,255,0.9)" : COLORS.muted;

  return (
    <View style={{ padding: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <View style={[h.pip, { backgroundColor: white }]} />
        <Text style={[h.headerTxt, { color: white }]}>Next Trip</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={h.iconBox}>
          <Ionicons name="time-outline" size={20} color={COLORS.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[h.lead, { color: white }]}>Leave your house in…</Text>
          <Text style={[h.sub, { color: sub }]}>Time to leave for your flight</Text>
        </View>
        <View style={h.timerPill}>
          <Text style={h.timerTxt}>{timeLeft}</Text>
        </View>
      </View>

      <View style={h.divider} />

      <Text style={[h.airportTitle, { color: white }]}>Already at the airport?</Text>
      <View style={h.arRow}>
        <TouchableOpacity onPress={onPressCamera} activeOpacity={0.9}>
          <View style={h.camOuter}>
            <View style={h.camInner}>
              <Ionicons name="camera" size={24} color="#6F73A8" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={[h.arText, { color: white }]}>Turn the camera on for AR navigation</Text>
      </View>
    </View>
  );
}

/* ===================== Small pieces ===================== */

function FeatureBanner({ title, icon, bullets = [], image, onPress }) {
  const [uri, setUri] = useState(image);
  useEffect(() => {
    setUri(image);
    Image.prefetch(image).catch(() => {});
  }, [image]);

  return (
    <TouchableOpacity style={s.featureCard} activeOpacity={0.9} onPress={onPress}>
      <View style={s.featureImgWrap}>
        <Image source={{ uri }} style={s.featureImg} resizeMode="cover" onError={() => setUri(FALLBACK_IMG)} />
        <LinearGradient
          colors={["rgba(255,255,255,0.82)", "rgba(255,255,255,0.45)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.featureShade}
        />
      </View>

      <View style={s.featureBody}>
        <View style={s.featureTop}>
          <View style={s.featureIcon}>
            <Ionicons name={icon} size={18} color={COLORS.text} />
          </View>
          <Text style={s.featureTitle}>{title}</Text>
        </View>

        <View style={{ gap: 4, marginTop: 6 }}>
          {bullets.map((b, i) => (
            <Text key={i} style={s.featureBullet}>• {b}</Text>
          ))}
        </View>

        <View style={s.featureCtaRow}>
          <Text style={s.featureCta}>Learn more</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SelectorRowSB({ icon, label, value, rightAddon, onPress, onChevron }) {
  return (
    <TouchableOpacity style={sb.row} activeOpacity={0.9} onPress={onPress}>
      <View style={sb.left}>
        <View style={sb.iconBox}>
          <Ionicons name={icon} size={18} color={COLORS.text} />
        </View>
        <View>
          <Text style={sb.label}>{label}</Text>
          <Text style={sb.value}>{value}</Text>
        </View>
      </View>

      <View style={sb.right}>
        {rightAddon ? <View style={{ marginRight: 8 }}>{rightAddon}</View> : null}
        <TouchableOpacity hitSlop={8} onPress={onChevron}>
          <Ionicons name="chevron-forward" size={18} color="#7A8197" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function RoundBtnTiny({ icon, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={sb.swapBtn}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
    </TouchableOpacity>
  );
}

function SmartCtaShiny({ onPress }) {
  const shineX = useRef(new Animated.Value(-0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineX, { toValue: 1.6, duration: 2600, easing: Easing.inOut(Easing.quad), useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shineX, pulse]);

  const translateX = shineX.interpolate({ inputRange: [-0.6, 1.6], outputRange: [-W, W] });
  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0] });

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={{ alignSelf: "stretch" }}>
      <View style={[s.smartCta, { backgroundColor: "#eef0ff" }]}>
        <View style={s.badgeWrap}>
          <Animated.View style={[s.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]} />
          <View style={s.lightningBadge}>
            <Ionicons name="flash" size={18} color={COLORS.accent} />
          </View>
        </View>
        <Text style={s.smartCtaTxt}>Book flight using smart booking?</Text>
        <Pressable hitSlop={10} onPress={() => Alert.alert("What is Smart Booking?", "Tell us your budget, preferred weather, and vibe (nature or city) and we’ll suggest the perfect destination for you!")}>
          <View style={s.smartCtaInfo}>
            <Ionicons name="information" size={12} color="#fff" />
          </View>
        </Pressable>
        <Animated.View pointerEvents="none" style={[s.shine, { transform: [{ rotate: "15deg" }, { translateX }] }]} />
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

/* ===================== Helpers ===================== */
function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ===================== Styles ===================== */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { paddingHorizontal: 16, paddingBottom: 130 },

  panel: {
    backgroundColor: COLORS.panel, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: COLORS.border, marginTop: 10, marginBottom: 14,
    shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 2,
  },

  headerRowIcon: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionPip: { width: 6, height: 18, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  actionsWrap: { alignItems: "center", gap: 10, marginTop: -4, marginBottom: 20 },

  btnShowFlights: {
    paddingHorizontal: 22, paddingVertical: 10, borderRadius: 999,
    backgroundColor: COLORS.primarySoft1, borderWidth: 1, borderColor: COLORS.primaryBorder, alignSelf: "center",
  },
  btnShowTxt: { fontSize: 16, fontWeight: "700", color: COLORS.text },

  // Smart CTA
  smartCta: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderRadius: 999, paddingVertical: 12, paddingHorizontal: 12,
    shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 10 }, shadowRadius: 16, elevation: 6,
  },
  badgeWrap: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  lightningBadge: { width: 36, height: 36, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(0,0,0,0.15)" },
  smartCtaTxt: { flex: 1, marginLeft: 10, color: COLORS.text, fontSize: 16, fontWeight: "800" },
  smartCtaInfo: { width: 18, height: 18, borderRadius: 11, backgroundColor: "#000", alignItems: "center", justifyContent: "center", marginLeft: 7, marginRight: 10, opacity: 0.9 },
  shine: { position: "absolute", top: -8, bottom: -8, left: -100, width: 140, opacity: 0.55, backgroundColor: "transparent" },
  pulseRing: { position: "absolute", width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff" },

  // Feature banners
  featureCard: {
    width: W * 0.72, height: 200, marginRight: 12, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.primaryBorder, overflow: "hidden", backgroundColor: "#fff",
  },
  featureImgWrap: { ...StyleSheet.absoluteFillObject },
  featureImg: { ...StyleSheet.absoluteFillObject },
  featureShade: { ...StyleSheet.absoluteFillObject },
  featureBody: { flex: 1, padding: 14, justifyContent: "space-between" },
  featureTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.primaryBorder },
  featureTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  featureBullet: { fontSize: 12.5, color: COLORS.muted, lineHeight: 18 },
  featureCtaRow: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginTop: 8 },

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

/* HERO styles */
const h = StyleSheet.create({
  wrap: {
    height: HERO_H,
    marginHorizontal: -16, // full-bleed (ignores ScrollView padding)
    width: W,
    //borderBottomLeftRadius: 28,
    //borderBottomRightRadius: 28,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  bg: { ...StyleSheet.absoluteFillObject },

  topRow: {
    marginTop: Platform.OS === "ios" ? 6 : 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "right",
    justifyContent: "space-between",
    position: 'absolute',
    top: 12,        // tweak
    right: 16,      // tweak
    zIndex: 10,
  },
  brandLogo: {height: 40, width: 180, marginright:50 },
  bell: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.35)",
  },

  welcomeBlock: { paddingHorizontal: 16, marginTop: 40 },
  welcomeName: { color: "#fff", fontSize: 26, fontWeight: "800" },
  welcomeBack: { color: "#fff", fontSize: 27, fontWeight: "900", letterSpacing: 0.5, marginTop: 2 },

  nextTripCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    // BlurView supplies the background; if no blur, we’ll set rgba on container
  },

  pip: { width: 6, height: 18, borderRadius: 4 },
  headerTxt: { fontSize: 16, fontWeight: "900" },

  iconBox: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.6)",
  },
  lead: { fontSize: 14, fontWeight: "900" },
  sub: { fontSize: 12, marginTop: 2 },

  timerPill: {
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.7)",
  },
  timerTxt: { fontSize: 14, fontWeight: "900", letterSpacing: 0.5, color: COLORS.text },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.35)", marginVertical: 12 },

  airportTitle: { fontSize: 16, fontWeight: "900" },
  arRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  camOuter: {
    width: 70, height: 70, borderRadius: 40,
    borderWidth: 3, borderColor: "rgba(255,255,255,0.65)",
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center", justifyContent: "center",
  },
  camInner: {
    width: 55, height: 55, borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.65)",
  },
  arText: { flex: 1, fontSize: 14, fontWeight: "800" },
});

/* Booking row styles */
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
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 2, fontWeight: "700" },
  value: { fontSize: 14, color: COLORS.text, fontWeight: "800", flexShrink: 1 },
  right: { flexDirection: "row", alignItems: "center" },
  swapBtn: {
    width: 32, height: 32, borderRadius: 12, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.primarySoft2,
  },
});
