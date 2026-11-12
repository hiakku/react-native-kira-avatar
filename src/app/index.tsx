import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ACCESSORIES,
  BACKGROUNDS,
  CLOTH_COLORS,
  DEFAULT,
  EYE_COLORS,
  EYES,
  HAIR_COLORS,
  HAIRS,
  MOUTHS,
  OUTFITS,
  PRESETS,
  randomAvatar,
  SKINS,
  type Avatar,
} from "../model";
import { AvatarImage } from "../AvatarImage";
import { avatarSvg } from "../art";
import { exportAvatar } from "../export";
import { useStudio } from "../store";
import {
  About,
  Brand,
  Button,
  C,
  Dialog,
  Icon,
  IconButton,
  IconName,
  s,
  SideBar,
} from "../ui";
const categories: { id: string; label: string; icon: IconName }[] = [
  { id: "hair", label: "Hair", icon: "scissors" },
  { id: "face", label: "Face", icon: "smile" },
  { id: "outfit", label: "Outfits", icon: "shopping-bag" },
  { id: "accessory", label: "Extras", icon: "star" },
  { id: "background", label: "Backdrop", icon: "image" },
];
export default function Studio() {
  const studio = useStudio();
  const { avatar, change, ready } = studio;
  const { width } = useWindowDimensions();
  const wide = width >= 1100;
  const split = width >= 840;
  const [category, setCategory] = useState("hair");
  const [about, setAbout] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const stage = useRef<React.ComponentRef<typeof View>>(null);
  const stageSize = wide
    ? Math.min(414, Math.max(240, width - 238 - 72 - 370 - 24 - 38))
    : split
      ? Math.min(390, width - 476)
      : Math.min(320, width - 82);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);
  const patch = (values: Partial<Avatar>) => change({ ...avatar, ...values });
  const download = async () => {
    if (busy || !ready) return;
    setBusy(true);
    try {
      await exportAvatar(avatarSvg(avatar, "export"), stage);
      setNotice("Your PNG is ready. Save or share it wherever you like.");
    } catch (e) {
      setNotice(
        e instanceof Error
          ? e.message
          : "The image could not be exported. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const palette = (
    label: string,
    values: string[],
    field: "skin" | "hairColor" | "eyeColor" | "clothColor" | "background",
  ) => (
    <View>
      <Text style={s.sectionLabel}>{label}</Text>
      <View style={s.palette}>
        {values.map((value, i) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={`${label.toLowerCase()} ${i + 1}`}
            accessibilityState={{ selected: avatar[field] === value }}
            disabled={!ready}
            onPress={() =>
              patch({
                [field]: value,
                ...(field === "background" ? { transparent: false } : {}),
              })
            }
            style={[
              s.swatch,
              { backgroundColor: value },
              avatar[field] === value && s.swatchSelected,
            ]}
          >
            {avatar[field] === value && (
              <Icon
                name="check"
                size={14}
                color={field === "hairColor" && i < 3 ? "white" : C.ink}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
  const options = (
    labels: readonly string[],
    field: "hair" | "eyes" | "mouth" | "outfit" | "accessory",
    focus?: "hair" | "eyes" | "outfit" | "accessory",
  ) => (
    <View style={s.options}>
      {labels.map((label, i) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Choose ${label}`}
          accessibilityState={{ selected: avatar[field] === i }}
          disabled={!ready}
          key={label}
          onPress={() => patch({ [field]: i })}
          style={[s.option, avatar[field] === i && s.optionActive]}
        >
          <AvatarImage
            avatar={{ ...avatar, [field]: i }}
            size={86}
            focus={focus}
          />
          <Text style={s.optionText}>{label}</Text>
          {avatar[field] === i && (
            <View style={s.selectedDot}>
              <Icon name="check" size={10} color="white" />
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
  const portrait = (
    <>
      <View style={s.previewWrap}>
        <View style={s.stageTop}>
          <Text style={s.tinyLabel}>THE MAIN CHARACTER</Text>
          <View style={s.stageTag}>
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 3,
                backgroundColor: "#93AC8C",
              }}
            />
            <Text style={{ fontSize: 8, color: C.muted }}>
              {ready ? "Live preview" : "Opening studio…"}
            </Text>
          </View>
        </View>
        <View style={[s.stage, { width: stageSize, height: stageSize }]}>
          <View ref={stage} collapsable={false} style={{ width: stageSize, height: stageSize }}>
            <AvatarImage avatar={avatar} size={stageSize} />
          </View>
        </View>
        <View style={s.previewBottom}>
          <View style={s.toolGroup}>
            <IconButton
              name="corner-up-left"
              label="Undo change"
              disabled={!studio.canUndo || !ready}
              onPress={studio.undo}
            />
            <IconButton
              name="corner-up-right"
              label="Redo change"
              disabled={!studio.canRedo || !ready}
              onPress={studio.redo}
            />
            <View
              style={{
                height: 20,
                width: 1,
                backgroundColor: "#DDD2E5",
                marginHorizontal: 4,
              }}
            />
            <IconButton
              name="rotate-ccw"
              label="Reset character"
              disabled={!ready}
              onPress={() => change({ ...DEFAULT })}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Randomise character"
            disabled={!ready}
            onPress={() => change(randomAvatar())}
            style={s.random}
          >
            <Icon name="shuffle" size={15} color={C.purple} />
            <Text style={s.randomLabel}>Surprise me</Text>
          </Pressable>
        </View>
      </View>
      {split && (
        <Text style={s.previewCaption}>
          Made by you, down to the last little detail.{"\n"}PNG · 1024 × 1024 ·
          Yours to share
        </Text>
      )}
    </>
  );
  const inspiration = (
    <View style={s.starters}>
      <View style={s.between}>
        <Text style={s.sectionTitle}>A little inspiration</Text>
        <Text style={s.small}>Start here, make it yours</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.starterRow}
      >
        {PRESETS.map((p) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Start with ${p.name}`}
            key={p.name}
            onPress={() => change({ ...p.avatar })}
            disabled={!ready}
            style={s.starter}
          >
            <AvatarImage avatar={p.avatar} size={90} />
            <Text style={s.starterText}>{p.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
  const closet = (
    <View style={[s.closet, !split && { width: "100%" }]}>
      <View style={s.between}>
        <Text style={s.sectionTitle}>Make it yours</Text>
        <Icon name="sliders" size={16} color="#B0A3B9" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabs}
      >
        {categories.map((c) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityLabel={c.label}
            accessibilityState={{ selected: category === c.id }}
            key={c.id}
            onPress={() => setCategory(c.id)}
            style={[s.category, category === c.id && s.categoryActive]}
          >
            <Icon
              name={c.icon}
              size={18}
              color={category === c.id ? C.purple : "#A79AAF"}
            />
            <Text
              style={[s.categoryText, category === c.id && { color: C.purple }]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.divider} />
      {category === "hair" && (
        <>
          <Text style={s.sectionLabel}>FIND YOUR HAIRSTYLE</Text>
          {options(HAIRS, "hair", "hair")}
          {palette("HAIR COLOUR", HAIR_COLORS, "hairColor")}
        </>
      )}
      {category === "face" && (
        <>
          {palette("SKIN TONE", SKINS, "skin")}
          <Text style={s.sectionLabel}>EYES & EXPRESSIONS</Text>
          {options(EYES, "eyes", "eyes")}
          {palette("EYE COLOUR", EYE_COLORS, "eyeColor")}
          <Text style={s.sectionLabel}>A LITTLE EXPRESSION</Text>
          {options(MOUTHS, "mouth", "eyes")}
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>Rosy cheeks</Text>
            <Switch
              accessibilityLabel="Rosy cheeks"
              disabled={!ready}
              value={avatar.blush}
              onValueChange={(blush) => patch({ blush })}
              trackColor={{ true: C.purple }}
            />
          </View>
        </>
      )}
      {category === "outfit" && (
        <>
          <Text style={s.sectionLabel}>TODAY’S LITTLE LOOK</Text>
          {options(OUTFITS, "outfit", "outfit")}
          {palette("OUTFIT COLOUR", CLOTH_COLORS, "clothColor")}
        </>
      )}
      {category === "accessory" && (
        <>
          <Text style={s.sectionLabel}>THE FINISHING TOUCH</Text>
          {options(ACCESSORIES, "accessory", "accessory")}
          <View style={[s.noteBox, { marginTop: 22 }]}>
            <Icon name="star" size={16} color={C.purple} />
            <Text style={[s.small, { flex: 1 }]}>
              Sometimes one little detail changes everything.
            </Text>
          </View>
        </>
      )}
      {category === "background" && (
        <>
          {palette("SET THE MOOD", BACKGROUNDS, "background")}
          <View style={s.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.toggleLabel}>Transparent background</Text>
              <Text style={s.small}>
                Perfect for stickers and profile edits.
              </Text>
            </View>
            <Switch
              accessibilityLabel="Transparent background"
              disabled={!ready}
              value={avatar.transparent}
              onValueChange={(transparent) => patch({ transparent })}
              trackColor={{ true: C.purple }}
            />
          </View>
          <Text style={[s.small, { marginTop: 18 }]}>
            Your PNG exports at 1024 × 1024 with the background you choose.
            There’s no watermark.
          </Text>
        </>
      )}
      <View style={[s.divider, { marginTop: 25 }]} />
      <View style={[s.row, { marginTop: 17 }]}>
        <Icon name="feather" size={13} color="#AA9AB5" />
        <Text style={s.small}>Original art. Endless little possibilities.</Text>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.shell}>
        {wide && (
          <SideBar count={studio.saved.length} onAbout={() => setAbout(true)} />
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[s.content, !wide && { padding: 22 }]}
          stickyHeaderIndices={!split ? [1] : undefined}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {!wide && (
              <View style={[s.between, { marginBottom: 28 }]}>
                <Brand />
                <View style={s.row}>
                  <IconButton
                    name="grid"
                    label="My collection"
                    onPress={() => router.push("/collection")}
                  />
                  <IconButton
                    name="info"
                    label="About Kira"
                    onPress={() => setAbout(true)}
                  />
                </View>
              </View>
            )}
            <View style={[s.between, { flexWrap: "wrap", gap: 20 }]}>
              <View>
                <Text style={s.eyebrow}>YOUR IMAGINATION. YOUR CHARACTER.</Text>
                <Text
                  style={[s.title, !wide && { fontSize: 31, lineHeight: 38 }]}
                >
                  Meet your next alter ego.
                </Text>
                <Text style={s.subtitle}>
                  A little bit of you. A little bit of make-believe.
                </Text>
              </View>
              <View style={s.headerActions}>
                <Button
                  label="Save character"
                  icon="heart"
                  secondary
                  disabled={!ready}
                  onPress={() => {
                    setName("");
                    setSaveOpen(true);
                  }}
                />
                <Button
                  label={busy ? "Exporting…" : "Export PNG"}
                  icon="download"
                  disabled={!ready || busy}
                  onPress={download}
                />
              </View>
            </View>
            {!!(notice || studio.error) && (
              <View style={[s.notice, studio.error && s.error]}>
                <Icon
                  name={studio.error ? "alert-circle" : "check-circle"}
                  size={16}
                  color={C.purple}
                />
                <Text accessibilityLiveRegion="polite" style={s.noticeText}>
                  {studio.error || notice}
                </Text>
                {!!studio.error && ready && (
                  <Pressable accessibilityRole="button" onPress={studio.retry}>
                    <Text style={{ color: C.purple, fontWeight: "600" }}>
                      Retry
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
          {!split && (
            <View
              style={{
                backgroundColor: C.bg,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              {portrait}
            </View>
          )}
          {split ? (
            <View style={s.workspace}>
              <View style={s.previewCol}>
                {portrait}
                {inspiration}
              </View>
              {closet}
            </View>
          ) : (
            <View style={{ paddingTop: 8 }}>
              {closet}
              {inspiration}
            </View>
          )}
          <View style={s.footer}>
            <Icon name="heart" size={12} color="#AC9BB7" />
            <Text style={s.footerText}>
              Made for the joy of making something yours.
            </Text>
          </View>
        </ScrollView>
      </View>
      <About visible={about} onClose={() => setAbout(false)} />
      <Dialog visible={saveOpen} onClose={() => setSaveOpen(false)}>
        <View style={s.between}>
          <Text style={s.dialogTitle}>Give them a name.</Text>
          <IconButton
            name="x"
            label="Cancel save"
            onPress={() => setSaveOpen(false)}
          />
        </View>
        <Text style={[s.body, { marginTop: 12 }]}>
          Keep this character in your collection. You can open it and create a
          new version any time.
        </Text>
        <TextInput
          accessibilityLabel="Character name"
          value={name}
          onChangeText={setName}
          maxLength={40}
          placeholder="A name that feels right…"
          placeholderTextColor="#AEA2B7"
          style={s.nameInput}
        />
        <Button
          label="Save to my collection"
          icon="heart"
          onPress={() => {
            studio.save(name);
            setSaveOpen(false);
            setNotice("Character saved to your collection.");
          }}
        />
      </Dialog>
    </SafeAreaView>
  );
}
