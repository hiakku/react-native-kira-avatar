import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
export const C = {
  ink: "#383044",
  muted: "#817889",
  purple: "#796095",
  line: "#E8E2EB",
  bg: "#F8F6F3",
  white: "#FFFFFF",
  accent: "#F1B799",
};
export type IconName = React.ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 19,
  color = C.ink,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
export function IconButton({
  name,
  label,
  onPress,
  disabled = false,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.iconBtn,
        { opacity: disabled ? 0.28 : pressed ? 0.55 : 1 },
      ]}
    >
      <Icon name={name} />
    </Pressable>
  );
}
export function Button({
  label,
  icon,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      {icon && (
        <Icon name={icon} size={16} color={secondary ? C.ink : "white"} />
      )}
      <Text style={[s.buttonLabel, secondary && { color: C.ink }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function Brand() {
  return (
    <View style={s.row}>
      <View style={s.brandIcon}>
        <Icon name="star" color="white" size={20} />
      </View>
      <Text style={s.brand}>
        kira<Text style={{ color: C.purple }}>.</Text>
      </Text>
      <Text style={s.brandLabel}>AVATAR STUDIO</Text>
    </View>
  );
}
export function SideBar({
  collection = false,
  count = 0,
  onAbout,
}: {
  collection?: boolean;
  count?: number;
  onAbout: () => void;
}) {
  return (
    <View style={s.sidebar}>
      <Brand />
      <Text style={s.sidebarLabel}>YOUR LITTLE CREATIVE SPACE</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/")}
        style={[s.nav, !collection && s.navActive]}
      >
        <Icon name="edit-3" color={C.purple} />
        <Text style={s.navLabel}>Create a character</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/collection")}
        style={[s.nav, collection && s.navActive]}
      >
        <Icon name="grid" color={C.purple} />
        <Text style={s.navLabel}>My collection</Text>
        <Text style={s.count}>{count}</Text>
      </Pressable>
      <View style={{ flex: 1 }} />
      <View style={s.sideCard}>
        <Icon name="feather" color={C.purple} />
        <Text style={s.sideTitle}>Made of little details.</Text>
        <Text style={s.small}>
          A new hairstyle. Your favourite colour. A character that feels like
          you.
        </Text>
      </View>
      <Pressable accessibilityRole="button" style={s.nav} onPress={onAbout}>
        <Icon name="info" size={16} color={C.muted} />
        <Text style={s.small}>About Kira</Text>
      </Pressable>
      <Text style={s.version}>A LITTLE WORLD OF YOUR OWN</Text>
    </View>
  );
}
export function Dialog({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <ScrollView
          style={{ width: "100%", maxWidth: 440, maxHeight: "90%" }}
          contentContainerStyle={s.dialog}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}
export function About({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog visible={visible} onClose={onClose}>
      <View style={s.between}>
        <Text style={s.dialogTitle}>A little about Kira.</Text>
        <IconButton name="x" label="Close about" onPress={onClose} />
      </View>
      <Text style={[s.body, { marginVertical: 20 }]}>
        Make an original character, one little detail at a time. All artwork is
        drawn from original vector shapes. No photos or account needed.
      </Text>
      <View style={s.noteBox}>
        <Icon name="lock" color={C.purple} />
        <Text style={[s.small, { flex: 1 }]}>
          Your draft and collection stay on this device. Clearing app data or
          uninstalling removes them. Export your favourites as PNGs to keep a
          copy.
        </Text>
      </View>
      <Text style={[s.small, { marginVertical: 20 }]}>
        This first version has no ads, purchases, or analytics. Hair, face,
        outfits, and accessories are all included.
      </Text>
      <Button label="Back to creating" onPress={onClose} />
    </Dialog>
  );
}
export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  shell: { flex: 1, flexDirection: "row" },
  row: { flexDirection: "row", alignItems: "center", gap: 9 },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sidebar: {
    width: 238,
    borderRightWidth: 1,
    borderRightColor: C.line,
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: "#FBFAF8",
  },
  brandIcon: {
    width: 33,
    height: 35,
    backgroundColor: C.purple,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 33, fontWeight: "800", letterSpacing: -1.5, color: C.ink },
  brandLabel: { fontSize: 7, letterSpacing: 1.3, color: C.muted, marginTop: 8 },
  sidebarLabel: {
    fontSize: 8,
    letterSpacing: 1.3,
    color: "#A098A6",
    marginTop: 52,
    marginBottom: 20,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginBottom: 8,
  },
  navActive: { backgroundColor: "#EDE6F2" },
  navLabel: { fontSize: 12, fontWeight: "600", color: C.ink, flex: 1 },
  count: {
    fontSize: 10,
    color: C.purple,
    backgroundColor: "#E7DDEF",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  sideCard: {
    padding: 17,
    backgroundColor: "#F0EAF3",
    gap: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  sideTitle: { fontSize: 12, fontWeight: "600", color: C.ink },
  small: { fontSize: 11, lineHeight: 18, color: C.muted },
  version: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: "#ABA2AF",
    textAlign: "center",
    marginTop: 20,
  },
  content: {
    padding: 36,
    maxWidth: 1260,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 32,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: "700",
    color: C.purple,
    marginBottom: 9,
  },
  title: {
    fontSize: 36,
    color: C.ink,
    fontWeight: "700",
    letterSpacing: -1.3,
    lineHeight: 43,
  },
  subtitle: { fontSize: 13, color: C.muted, lineHeight: 22, marginTop: 9 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  button: {
    minHeight: 44,
    backgroundColor: C.purple,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  secondary: { backgroundColor: "white", borderWidth: 1, borderColor: C.line },
  buttonLabel: { fontSize: 12, fontWeight: "600", color: "white" },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  workspace: {
    flexDirection: "row",
    gap: 24,
    marginTop: 30,
    alignItems: "flex-start",
  },
  previewCol: { flex: 1, minWidth: 0 },
  previewWrap: {
    backgroundColor: "#F0EBF4",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E6DDEC",
    alignItems: "center",
    width: "100%",
  },
  stageTop: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tinyLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    fontWeight: "600",
    color: "#93819E",
  },
  stageTag: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "#FFFFFF88",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  stage: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "transparent",
  },
  checker: { backgroundColor: "#ECE7ED" },
  previewBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  toolGroup: { flexDirection: "row", gap: 2, alignItems: "center" },
  random: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFFB0",
    borderRadius: 9,
  },
  randomLabel: { fontSize: 11, color: C.purple, fontWeight: "600" },
  previewCaption: {
    fontSize: 10,
    color: "#9A8EA2",
    textAlign: "center",
    marginTop: 15,
    lineHeight: 17,
  },
  closet: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
    padding: 22,
    width: 370,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: C.ink,
    letterSpacing: -0.4,
  },
  tabs: { flexDirection: "row", gap: 6, paddingBottom: 16, paddingTop: 20 },
  category: {
    alignItems: "center",
    gap: 7,
    width: 51,
    paddingVertical: 10,
    borderRadius: 10,
  },
  categoryActive: { backgroundColor: "#EFE8F5" },
  categoryText: { fontSize: 8, color: C.muted, fontWeight: "500" },
  divider: { height: 1, backgroundColor: C.line },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: C.muted,
    marginTop: 22,
    marginBottom: 14,
    letterSpacing: 0.7,
  },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  option: {
    width: "30.8%",
    borderWidth: 1.5,
    borderColor: C.line,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FAF8FB",
    alignItems: "center",
    paddingBottom: 9,
  },
  optionActive: { borderColor: C.purple, backgroundColor: "#F3EEF8" },
  optionText: { fontSize: 9, color: C.muted, marginTop: 5 },
  selectedDot: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: C.purple,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  palette: { flexDirection: "row", flexWrap: "wrap", gap: 11 },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  swatchSelected: {
    borderColor: "white",
    outlineWidth: 1.5,
    outlineColor: C.purple,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  toggleLabel: { fontSize: 11, color: C.ink },
  starters: { marginTop: 30 },
  starterRow: { flexDirection: "row", gap: 12, paddingVertical: 16 },
  starter: {
    width: 92,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
    alignItems: "center",
    paddingBottom: 8,
  },
  starterText: { fontSize: 10, color: C.muted, marginTop: 6 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: { fontSize: 10, color: "#A29AA7" },
  notice: {
    marginTop: 16,
    padding: 13,
    borderRadius: 9,
    backgroundColor: "#EAEFE8",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  error: { backgroundColor: "#F8E5DF" },
  noticeText: { fontSize: 12, color: C.ink, flex: 1, lineHeight: 19 },
  overlay: {
    flex: 1,
    backgroundColor: "#30213FC0",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
  },
  dialog: {
    padding: 26,
    backgroundColor: C.bg,
    borderRadius: 18,
    width: "100%",
  },
  dialogTitle: {
    fontSize: 23,
    fontWeight: "600",
    color: C.ink,
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  body: { fontSize: 13, color: C.muted, lineHeight: 23 },
  nameInput: {
    borderColor: C.line,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    backgroundColor: "white",
    fontSize: 16,
    color: C.ink,
    marginTop: 20,
    marginBottom: 22,
  },
  noteBox: {
    backgroundColor: "#EEE8F3",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    gap: 12,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 28,
  },
  galleryCard: {
    backgroundColor: "white",
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.line,
  },
  galleryInfo: { padding: 15 },
  galleryName: { fontSize: 15, fontWeight: "600", color: C.ink },
  galleryDate: { fontSize: 10, color: C.muted, marginTop: 5 },
  empty: {
    paddingVertical: 55,
    paddingHorizontal: 25,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D8CEDF",
    alignItems: "center",
    gap: 18,
    marginTop: 35,
  },
});
