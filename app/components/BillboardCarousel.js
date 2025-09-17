// app/components/BillboardCarousel.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const W = Dimensions.get("window").width;
const CARD_W = W - 32;        // same horizontal padding as pages
const CARD_H = 160;

const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft1: "#EEF0FF",
  primaryBorder: "#DADFFE",
  accent: "#FFCE31",
};

const FALLBACK_IMG = "https://placehold.co/1200x700/png?text=Riyadh+Air";

const FLAGS = {
  "Saudi Arabia": "🇸🇦",
  Japan: "🇯🇵",
  Oman: "🇴🇲",
  Georgia: "🇬🇪",
};
const flagOf = (country) => FLAGS[country] || "🏳️";

/**
 * Props:
 *  - type: "activity" | "game"
 *  - data: [{ id, title, city?, country?, image, type? ("solo"|"group"), rating?, subtitle? }]
 *  - onPressPrimary: (item) => void
 *  - autoplay?: boolean (default true)
 */
export default function BillboardCarousel({
  type = "activity",
  data = [],
  onPressPrimary = () => {},
  autoplay = true,
}) {
  const scRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [w, setW] = useState(CARD_W);

  // auto-advance
  useEffect(() => {
    if (!autoplay || data.length <= 1) return;
    const t = setInterval(() => {
      const next = (idx + 1) % data.length;
      scRef.current?.scrollTo({ x: next * w, y: 0, animated: true });
      setIdx(next);
    }, 4200);
    return () => clearInterval(t);
  }, [idx, w, data.length, autoplay]);

  if (!data || data.length === 0) return null;

  return (
    <View style={{ marginHorizontal: 5, marginBottom: 4 }}>
      <ScrollView
        ref={scRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const i = Math.round(x / w);
          if (i !== idx) setIdx(i);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{}}
      >
        {data.map((item) => (
          <Card key={item.id} type={type} item={item} onPress={() => onPressPrimary(item)} />
        ))}
      </ScrollView>

      {/* dots */}
      <View style={st.dotsRow}>
        {data.map((_, i) => (
          <Dot key={i} active={i === idx} />
        ))}
      </View>
    </View>
  );
}

function Card({ item, type, onPress }) {
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState(false);

  return (
    <View style={st.card}>
      <Image
        source={{ uri: err ? FALLBACK_IMG : item.image }}
        style={st.img}
        resizeMode="cover"
        onLoad={() => setOk(true)}
        onError={() => setErr(true)}
      />
      {!ok && <View style={st.skel} />}

      {/* soft gradient for legibility */}
      <View style={st.shadeTop} />
      <View style={st.shadeBot} />

      {/* top-left: pill (type/group) for activities */}
      {type === "activity" && (
        <View style={st.pill}>
          <Text style={st.pillTxt}>{item.type === "solo" ? "Solo" : "Group"}</Text>
        </View>
      )}

      {/* body: title + location/subtitle */}
      <View style={st.body}>
        <Text numberOfLines={2} style={st.title}>
          {item.title}
        </Text>

        {type === "activity" ? (
          <View style={st.row}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={st.metaTxt}>
              {flagOf(item.country)} {item.city}, {item.country}
            </Text>
          </View>
        ) : (
          <Text numberOfLines={1} style={[st.metaTxt, { opacity: 0.9 }]}>
            {item.subtitle || "Quick fun rounds"}
          </Text>
        )}

        {/* rating chip for activities */}
        {type === "activity" && item.rating != null && (
          <View style={st.rateChip}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={st.rateTxt}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      {/* CTA */}
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={st.cta}>
        <Text style={st.ctaTxt}>{type === "activity" ? "Add to Plan" : "Play"}</Text>
        <Ionicons name="arrow-forward" size={14} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function Dot({ active }) {
  const s = useRef(new Animated.Value(active ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(s, {
      toValue: active ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [active]);
  const w = s.interpolate({ inputRange: [0, 1], outputRange: [6, 22] });
  const bg = s.interpolate({
    inputRange: [0, 1],
    outputRange: ["#DADFFE", COLORS.text],
  });
  return <Animated.View style={[st.dot, { width: w, backgroundColor: bg }]} />;
}

const st = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 4,
  },
  img: { ...StyleSheet.absoluteFillObject },
  skel: { ...StyleSheet.absoluteFillObject, backgroundColor: "#ECEEF6" },
  shadeTop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 60,
    backgroundColor: "rgba(0,0,0,0.20)",
  },
  shadeBot: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  pill: {
    position: "absolute",
    top: 10,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  pillTxt: { fontSize: 12, fontWeight: "800", color: COLORS.text },

  body: { position: "absolute", left: 12, right: 12, bottom: 52 },
  title: { color: "#fff", fontSize: 16, fontWeight: "900", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaTxt: { color: "#fff", fontWeight: "700" },

  rateChip: {
    marginTop: 6,
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 8,
  },
  rateTxt: { color: "#fff", fontWeight: "800", fontSize: 12 },

  cta: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  ctaTxt: { color: "#fff", fontWeight: "800" },

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 6,
  },
  dot: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#DADFFE",
  },
});
