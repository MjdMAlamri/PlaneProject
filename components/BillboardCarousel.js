// components/BillboardCarousel.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const W = Dimensions.get("window").width;

export default function BillboardCarousel({
  items = [],
  autoPlay = true,
  interval = 3400,
  theme,
}) {
  const COLORS = {
    bg: "#F6F7FB",
    text: "#0F172A",
    muted: "#5B667A",
    border: "#E4E7EE",
    panel: "#FFFFFF",
    primary: "#6E5DFF",
    primaryBorder: "#DADFFE",
    accent: "#FFCE31",
    ...(theme || {}),
  };

  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  // auto-advance
  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const t = setInterval(() => {
      const next = (index + 1) % items.length;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      setIndex(next);
    }, interval);
    return () => clearInterval(t);
  }, [index, autoPlay, interval, items.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      const i = viewableItems[0].index ?? 0;
      setIndex(i);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  const renderItem = ({ item }) => (
    <View style={[st.card, { width: W - 32, borderColor: COLORS.border }]}>
      <Image source={{ uri: item.image }} style={st.img} />
      <LinearGradient
        colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.55)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={st.shade}
      />

      {/* badge (optional) */}
      {item.badge ? (
        <View style={[st.badge, { borderColor: COLORS.primaryBorder }]}>
          <Text style={st.badgeTxt}>{item.badge}</Text>
        </View>
      ) : null}

      {/* text + CTA */}
      <View style={st.body}>
        <Text numberOfLines={1} style={st.title}>{item.title}</Text>
        {!!item.subtitle && (
          <Text numberOfLines={1} style={st.sub}>{item.subtitle}</Text>
        )}

        <TouchableOpacity
          onPress={item.onPress}
          activeOpacity={0.9}
          style={[
            st.cta,
            { backgroundColor: COLORS.accent, borderColor: "rgba(0,0,0,0.15)" },
          ]}
        >
          <Text style={st.ctaTxt}>
            {item.ctaLabel ??
              (item.type === "activity" ? "Add to Plan" : "Play")}
          </Text>
          <Ionicons
            name={item.type === "activity" ? "add" : "play"}
            size={16}
            color="#0F172A"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        ref={listRef}
        data={items}
        renderItem={renderItem}
        keyExtractor={(it) => it.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.9}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* dots */}
      {items.length > 1 && (
        <View style={st.dotsRow}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                st.dot,
                {
                  width: i === index ? 22 : 6,
                  backgroundColor: i === index ? "#6E5DFF" : "#DADFFE",
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    height: 124,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    marginRight: 12,
  },
  img: { ...StyleSheet.absoluteFillObject, resizeMode: "cover" },
  shade: { ...StyleSheet.absoluteFillObject },
  body: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
  },
  title: { color: "#fff", fontSize: 16, fontWeight: "900" },
  sub: { color: "#EAEAEA", marginTop: 2, fontWeight: "700" },

  badge: {
    position: "absolute",
    left: 12,
    top: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeTxt: { color: "#0F172A", fontWeight: "800", fontSize: 12 },

  cta: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 8,
  },
  ctaTxt: { color: "#0F172A", fontWeight: "800" },

  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
});
