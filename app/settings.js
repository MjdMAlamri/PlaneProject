// app/settings.tsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/** Same theme as Home */
const COLORS = {
  bg: "#F6F7FB",
  text: "#0F172A",
  muted: "#5B667A",
  border: "#E4E7EE",
  panel: "#FFFFFF",
  primary: "#6E5DFF",
  primaryBorder: "#DADFFE",
};

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.panel}>
        {/* header row just like Home */}
        <View style={s.sectionHeaderRow}>
          <View style={[s.sectionPip, { backgroundColor: COLORS.primary }]} />
          <Text style={s.sectionTitle}>Settings</Text>
        </View>

        {/* list */}
        <SettingsRow
          icon="person-outline"
          label="Personal Account"
          onPress={() => Alert.alert("Personal Account", "Open profile & contact info")}
        />
        <Divider />

        <SettingsRow
          icon="globe-outline"
          label="Language"
          right="English"
          onPress={() => Alert.alert("Language", "Open language selector")}
        />
        <Divider />

        <SettingsRow
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={() => Alert.alert("Privacy Policy", "Open privacy policy")}
        />
        <Divider />

        <SettingsRow
          icon="document-text-outline"
          label="Terms & Conditions"
          onPress={() => Alert.alert("Terms & Conditions", "Open terms and conditions")}
        />
        <Divider />

        <SettingsRow
          icon="help-circle-outline"
          label="FAQ"
          onPress={() => Alert.alert("FAQ", "Open frequently asked questions")}
        />
        <Divider />

        <SettingsRow
          icon="log-out-outline"
          label="Log out"
          danger
          onPress={() => Alert.alert("Log out", "You have been logged out (demo)")}
        />
      </View>

    </SafeAreaView>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

function SettingsRow({ icon, label, right, danger, onPress }) {
  return (
    <TouchableOpacity style={s.row} activeOpacity={0.9} onPress={onPress}>
      <View style={s.left}>
        <View style={s.iconWrap}>
          <Ionicons name={icon} size={18} color="#111" />
        </View>
        <Text style={[s.label, danger ? { color: "#B91C1C" } : null]}>
          {label}
        </Text>
      </View>

      <View style={s.right}>
        {right ? <Text style={s.rightText}>{right}</Text> : null}
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(15, 23, 42, 0.45)"
        />
      </View>
    </TouchableOpacity>
  );
}


const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  panel: {
    margin: 16,
    backgroundColor: COLORS.panel,
    borderRadius: 16,
    padding: 12,
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F1F2F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBEDF3",
  },
  label: { color: COLORS.text, fontSize: 15, fontWeight: "700" },

  right: { flexDirection: "row", alignItems: "center", gap: 8 },
  rightText: { color: "#5B667A", fontSize: 12, fontWeight: "700" },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },

  backWrap: {
    position: "absolute",
    left: 12,
    top: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
