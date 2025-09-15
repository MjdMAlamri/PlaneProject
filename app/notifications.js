// app/notifications.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/** Same palette & panel vibe as Home */
const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primarySoft: "#EEF0FF",
  primaryBorder: "#DADFFE",
};

const DATA = [
    { id: "1", time: "6:15AM 17-04-2024", msg: "You need to leave your house in 1 hour." },
    {
      id: "2",
      time: "6:15AM 17-02-2024",
      msg: "Tomorrow you need to leave your house by 7:15AM.",
    },
    { id: "3", time: "9:32AM 01-11-2024", msg: "Your booking is confirmed! Have a nice trip." },
  ];
  

export default function Notifications() {
  const router = useRouter();

  const renderItem = ({ item, index }: any) => (
    <View>
      {index !== 0 && <View style={s.divider} />}
      <View style={s.row}>
        <Text style={s.time}>{item.time}</Text>
        <Text style={s.msg}>{item.msg}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Panel wrapper like Home */}
      <View style={s.panel}>
        <View style={s.sectionHeaderRow}>
          <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
          <Text style={s.sectionTitle}>Notification Center</Text>
        </View>

        <FlatList
          data={DATA}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 6 }}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  appbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 18, fontWeight: "800", color: COLORS.text },

  panel: {
    flex: 1,
    margin: 16,
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

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // center the pip + title as a group
    marginBottom: 8,
  },
  sectionPip: {
    width: 6,
    height: 18,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 8,           // sits right beside the text
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,       // no flex/textAlign so it hugs the pip
  },
  
  

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
    marginVertical: 2,
  },

  row: {
    paddingVertical: 16,
    paddingHorizontal: 6,
  },
  time: {
    alignSelf: "flex-end",
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  msg: {
    color: COLORS.text,
    fontSize: 16,         // clean, readable; matches Home scale
    lineHeight: 24,
    fontWeight: "600",
  },
});
