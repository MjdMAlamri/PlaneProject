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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const W = Dimensions.get("window").width;

/** --- Theme --- */
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

const IMG = {
  vr: "https://plus.unsplash.com/premium_photo-1661402170986-1b47b4b397ab?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  games: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=60",
  hub: "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};
const NEXT_TRIP_BG =
  "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const NEXT_TRIP_BG_FALLBACK = "https://placehold.co/1600x900/jpg?text=Next+Trip";
const FALLBACK_IMG = "https://placehold.co/1600x900/jpg?text=V-aiR";



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
      const oldFrom = f;
      setTo(oldFrom);
      return to;
    });
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

        {/* Greeting */}
        <Text style={s.greeting}>Hello Najd!</Text>

        {/* === NEXT TRIP (with image bg) === */}
        <NextTripPanel timeLeft={timeLeft} onPressCamera={() => router.push("/ar")} />

        {/* === SMART BOOKING → Route === */}
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

          {/* Show Flights (pill) */}
          <TouchableOpacity
            style={s.btnShowFlights}
            activeOpacity={0.9}
            onPress={() => router.push("/book")}
          >
            <Text style={s.btnShowTxt}>Show Flights</Text>
          </TouchableOpacity>
        </View>

        {/* --- CTA UNDER ROUTE (single, shiny) --- */}
        <View style={s.actionsWrap}>
          <SmartCtaShiny onPress={() => router.push("/smart")} />
        </View>

        {/* === Special Features (ads) WITH IMAGES === */}
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
              onPress={() => router.push("/game")}
            />
            <FeatureBanner
              title="The Hub"
              icon="apps-outline"
              image={IMG.hub}
              bullets={[
                "Post trips & activities",
                "Comment & chat with travelers",
                "Your world map of visited cities",
              ]}
              onPress={() => {}}
            />
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Nav (visual mock) */}
      <View style={s.tabbar}>
        <TabIcon active icon={<Ionicons name="home" size={22} color={COLORS.text} />} label="Home" />
        <TabIcon
  icon={<Ionicons name="airplane-outline" size={22} color="#666" />}
  label="Trips"
  onPress={() => router.push("/Trips")}
/>
        <TabIcon icon={<Ionicons name="apps-outline" size={22} color="#666" />} label="Hub" />
        <TabIcon icon={<Ionicons name="person-outline" size={22} color="#666" />} label="Profile" onPress={() => router.push("/Profile")}/>
      </View>
    </SafeAreaView>
  );
}

/* ===== helpers/components ===== */

function SmartCtaShiny({ onPress }) {
  const shineX = useRef(new Animated.Value(-0.6)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shineX, {
        toValue: 1.6,
        duration: 2600,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [shineX, pulse]);

  const translateX = shineX.interpolate({
    inputRange: [-0.6, 1.6],
    outputRange: [-W, W],
  });

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.28, 0] });

  return (
    <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={{ alignSelf: "stretch" }}>
      <View style={[s.smartCta, { backgroundColor: "#eef0ff" }]}>
        {/* Lightning with soft pulse */}
        <View style={s.badgeWrap}>
          <Animated.View
            style={[s.pulseRing, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
          />
          <View style={s.lightningBadge}>
            <Ionicons name="flash" size={18} color={COLORS.accent} />
          </View>
        </View>

        <Text style={s.smartCtaTxt}>Book flight using smart booking?</Text>

        {/* Info button → alert */}
        <Pressable
          hitSlop={10}
          onPress={() =>
            Alert.alert(
              "What is Smart Booking?",
              "Tell us your budget, preferred weather, and vibe (nature or city) and we’ll suggest the perfect destination for you!"
            )
          }
        >
          <View style={s.smartCtaInfo}>
            <Ionicons name="information" size={12} color="#fff" />
          </View>
        </Pressable>

        {/* Moving shine highlight */}
        <Animated.View
          pointerEvents="none"
          style={[s.shine, { transform: [{ rotate: "15deg" }, { translateX }] }]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1, borderRadius: 999 }}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

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

function Tooltip({ title, body, children }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ position: "relative" }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        onLongPress={() => setOpen(true)}
        onHoverIn={() => setOpen(true)}
        onHoverOut={() => setOpen(false)}
        hitSlop={8}
      >
        {children}
      </Pressable>
      {open && (
        <View style={tt.container} pointerEvents="none">
          <View style={tt.bubble}>
            <Text style={tt.title}>{title}</Text>
            <Text style={tt.body}>{body}</Text>
          </View>
          <View style={tt.caret} />
        </View>
      )}
    </View>
  );
}

function getTimeLeft(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const s = Math.floor(diff / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* === NextTripPanel (image bg + tint) === */
function NextTripPanel({ timeLeft, onPressCamera }) {
  return (
    <View style={np2.wrap}>
      {/* Background image */}
      <Image
        source={{ uri: NEXT_TRIP_BG }}
        style={np2.bgImg}
        resizeMode="cover"
        blurRadius={3}     // ↓ less blur so the image is visible
        onError={(e) => {
          e.currentTarget?.setNativeProps?.({ src: [{ uri: NEXT_TRIP_BG_FALLBACK }] });
        }}
      />

      {/* Lighter purple tint so photo shows through */}
      <LinearGradient
        colors={["rgba(238,240,255,0.55)", "rgba(233,236,255,0.35)"]} // ↓ lighter
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={np2.bgShade}
      />

      {/* Foreground content */}
      <View style={np2.inner}>
        <View style={np2.headerRow}>
          <View style={np2.pip} />
          <Text style={np2.headerTxt}>Next Trip</Text>
        </View>

        <View style={np2.countRow}>
          <View style={np2.iconBox}>
            <Ionicons name="time-outline" size={22} color="#0F172A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={np2.lead}>Leave your house in…</Text>
            <Text style={np2.sub}>Time to leave for your flight</Text>
          </View>
          <View style={np2.timerPill}>
            <Text style={np2.timerTxt}>{timeLeft}</Text>
          </View>
        </View>

        <View style={np2.divider} />

        <Text style={np2.airportTitle}>Already at the airport?</Text>
        <View style={np2.arRow}>
          <TouchableOpacity onPress={onPressCamera} activeOpacity={0.9} accessibilityLabel="Open AR page">
            <View style={np2.camOuter}>
              <View style={np2.camInner}>
                <Ionicons name="camera" size={26} color="#8B8FAE" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={np2.arText}>Turn the camera on for AR navigation</Text>
        </View>
      </View>
    </View>
  );
}


/* --- Smart Booking rows --- */
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

/* --- small components used elsewhere --- */
function BookingCard({ title, subtitle, date, image, onPress = () => {} }) {
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.9} onPress={onPress}>
      <Image source={{ uri: image }} style={s.cardImg} />
      <View style={s.cardShade} />
      <Text style={s.cardTitle}>{title}</Text>
      <Text style={s.cardSub}>{subtitle}</Text>
      <View style={s.dateBadge}>
        <Text style={s.dateTxt}>{date}</Text>
      </View>
      <View style={s.arrowCorner}>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
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

/* --- styles --- */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { padding: 16, paddingBottom: 130 },

  // app bar
  appbar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  brand: { fontSize: 24, fontWeight: "800", color: COLORS.text },
  bell: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F1F2F6", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#EBEDF3" },

  greeting: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 10 },

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
  
  brandLogo: {
  height: 42,
  width: 240,
  marginLeft: -60,  // tweak -6 to -14 depending on the file
  },

  appbarEdge: {
  marginHorizontal: 0,   // cancels ScrollView's 16 padding
  paddingHorizontal: 0,   // keeps the internal spacing consistent
  },



  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  headerRowIcon: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionPip: { width: 6, height: 18, borderRadius: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },

  // CTA container under route
  actionsWrap: { alignItems: "center", gap: 10, marginTop: -4, marginBottom:20 },

  // "Show Flights" pill
  btnShowFlights: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.primarySoft1,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignSelf: "center",
  },
  btnShowTxt: { fontSize: 16, fontWeight: "700", color: COLORS.text },

  // Shiny CTA styles
  smartCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 6,
  },
  badgeWrap: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  pulseRing: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    opacity: 0.25,
    shadowColor: "#6E5DFF",
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  lightningBadge: {
    width: 36, height: 36, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(0,0,0,0.15)",
  },
  smartCtaTxt: { flex: 1, marginLeft: 10, color: COLORS.text, fontSize: 16, fontWeight: "800" },
  smartCtaInfo: {
    width: 18, height: 18, borderRadius: 11,
    backgroundColor: "#000", alignItems: "center", justifyContent: "center",
    marginLeft: 7, opacity: 0.9, marginRight:10,
  },
  shine: { position: "absolute", top: -8, bottom: -8, left: -100, width: 140, opacity: 0.55 },

  // feature banners
  featureCard: { width: W * 0.72, height: 200, marginRight: 12, borderRadius: 16, borderWidth: 1, borderColor: COLORS.primaryBorder, overflow: "hidden", backgroundColor: "#fff" },
  featureImgWrap: { ...StyleSheet.absoluteFillObject },
  featureImg: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
  featureShade: { ...StyleSheet.absoluteFillObject },
  featureBody: { flex: 1, padding: 14, justifyContent: "space-between" },
  featureTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#FFF", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.primaryBorder },
  featureTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  featureBullet: { fontSize: 12.5, color: COLORS.muted, lineHeight: 18 },
  featureCtaRow: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFF", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginTop: 8 },
  featureCta: { fontSize: 12, fontWeight: "800", color: COLORS.text },

  // cards (kept for other sections if needed)
  card: { width: W * 0.66, height: 160, borderRadius: 16, overflow: "hidden", backgroundColor: "#fff", marginRight: 12, borderWidth: 1, borderColor: COLORS.border },
  cardImg: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  cardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.28)" },
  cardTitle: { position: "absolute", left: 12, top: 12, color: "#fff", fontWeight: "800", fontSize: 14 },
  cardSub: { position: "absolute", left: 12, top: 32, color: "#EDEDED", fontSize: 12 },
  dateBadge: { position: "absolute", left: 12, bottom: 12, backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  dateTxt: { fontSize: 12, fontWeight: "800", color: COLORS.text },
  arrowCorner: { position: "absolute", right: 0, bottom: 0, padding: 8, backgroundColor: "rgba(0,0,0,0.45)", borderTopLeftRadius: 12 },

  // tab bar
  tabbar: {
    position: "absolute",
    left: 16, right: 16, bottom: 18, height: 64,
    backgroundColor: COLORS.panel, borderRadius: 20,
    flexDirection: "row", alignItems: "center", justifyContent: "space-around",
    borderWidth: 1, borderColor: COLORS.border,
    shadowColor: "#000", shadowOpacity: 0.12, shadowOffset: { width: 0, height: 10 }, shadowRadius: 14, elevation: 10,
    paddingHorizontal: 10,
  },
  tabItem: { alignItems: "center", justifyContent: "center", },
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
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 2, fontWeight: "700" },
  value: { fontSize: 14, color: COLORS.text, fontWeight: "800", flexShrink: 1 },
  right: { flexDirection: "row", alignItems: "center" },
  swapBtn: {
    width: 32, height: 32, borderRadius: 12, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: COLORS.primarySoft2,
  },
});

const np2 = StyleSheet.create({
  wrap: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DADFFE",
    marginBottom: 14,
    overflow: "hidden",
    backgroundColor: COLORS.primarySoft1,
  },
  bgImg: { ...StyleSheet.absoluteFillObject },
  bgShade: { ...StyleSheet.absoluteFillObject },
  inner: { padding: 12 },

  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  pip: { width: 6, height: 18, borderRadius: 4, backgroundColor: "#6E5DFF" },
  headerTxt: { fontSize: 16, fontWeight: "800", color: "#0F172A" },

  countRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#E6E9F6",
  },
  lead: { fontSize: 14, fontWeight: "800", color: "#0F172A" },
  sub: { fontSize: 12, color: "#5B667A", marginTop: 2 },

  timerPill: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1, borderColor: "#DADFFE",
  },
  timerTxt: { fontSize: 14, fontWeight: "900", letterSpacing: 0.5, color: "#0F172A" },

  divider: { height: 1, backgroundColor: "rgba(231,233,253,0.9)", marginVertical: 12 },

  airportTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  arRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  camOuter: {
    width: 70, height: 70, borderRadius: 40,
    borderWidth: 4, borderColor: "#CBCFF8",
    backgroundColor: "rgba(242,243,255,0.85)",
    alignItems: "center", justifyContent: "center",
  },
  camInner: {
    width: 55, height: 55, borderRadius: 32,
    backgroundColor: "rgba(233,235,255,0.9)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#D7DAFF",
  },
  arText: { flex: 1, fontSize: 14, fontWeight: "700", color: "#0F172A" },
});

const tt = StyleSheet.create({
  container: { position: "absolute", bottom: 44, right: -8, zIndex: 1000, alignItems: "flex-end" },
  bubble: {
    width: 260, backgroundColor: "#FFFFFF", borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "#DADFFE",
    shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 8 }, shadowRadius: 14, elevation: 3,
  },
  title: { fontSize: 14, fontWeight: "800", color: "#0F172A", marginBottom: 6 },
  body: { fontSize: 13, lineHeight: 18, color: "#5B667A" },
  caret: {
    position: "absolute", bottom: 36, right: 22, width: 12, height: 12,
    backgroundColor: "#FFFFFF", borderLeftWidth: 1, borderTopWidth: 1, borderColor: "#DADFFE",
    transform: [{ rotate: "45deg" }],
  },
});
