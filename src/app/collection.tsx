import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AvatarImage } from "../AvatarImage";
import { useStudio } from "../store";
import { SavedAvatar } from "../model";
import {
  About,
  Brand,
  Button,
  C,
  Dialog,
  Icon,
  IconButton,
  s,
  SideBar,
} from "../ui";
export default function Collection() {
  const studio = useStudio();
  const { width } = useWindowDimensions();
  const wide = width >= 1100;
  const [about, setAbout] = useState(false);
  const [pending, setPending] = useState<SavedAvatar | null>(null);
  const cardWidth = wide ? 240 : Math.min(260, (width - 64) / 2);
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.shell}>
        {wide && (
          <SideBar
            collection
            count={studio.saved.length}
            onAbout={() => setAbout(true)}
          />
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[s.content, !wide && { padding: 22 }]}
        >
          {!wide && (
            <View style={[s.between, { marginBottom: 28 }]}>
              <Brand />
              <IconButton
                name="arrow-left"
                label="Back to studio"
                onPress={() => router.replace("/")}
              />
            </View>
          )}
          <View style={[s.between, { flexWrap: "wrap", gap: 18 }]}>
            <View>
              <Text style={s.eyebrow}>ALL YOUR LITTLE ALTER EGOS</Text>
              <Text style={s.title}>Made by you.</Text>
              <Text style={s.subtitle}>
                {studio.saved.length}{" "}
                {studio.saved.length === 1 ? "character" : "characters"} in your
                collection. A whole world of possibilities.
              </Text>
            </View>
            <Button
              label="Back to creating"
              icon="plus"
              onPress={() => router.replace("/")}
            />
          </View>
          {!!studio.error && (
            <View style={[s.notice, s.error]}>
              <Text style={s.noticeText}>{studio.error}</Text>
              <Pressable onPress={studio.retry}>
                <Text style={{ color: C.purple }}>Retry</Text>
              </Pressable>
            </View>
          )}
          {!studio.ready ? (
            <Text style={[s.body, { marginTop: 30 }]}>
              Opening your collection…
            </Text>
          ) : studio.saved.length === 0 ? (
            <View style={s.empty}>
              <Icon name="heart" size={36} color={C.purple} />
              <Text style={s.sectionTitle}>
                Your world starts with one character.
              </Text>
              <Text style={s.body}>
                Save a character in the studio and you’ll find it here.
              </Text>
              <Button
                label="Make my first character"
                onPress={() => router.replace("/")}
              />
            </View>
          ) : (
            <View style={s.galleryGrid}>
              {studio.saved.map((item) => (
                <View
                  key={item.id}
                  style={[s.galleryCard, { width: cardWidth }]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${item.name}`}
                    onPress={() => {
                      studio.open({ ...item.avatar });
                      router.replace("/");
                    }}
                  >
                    <AvatarImage avatar={item.avatar} size={cardWidth} />
                  </Pressable>
                  <View style={s.galleryInfo}>
                    <Text numberOfLines={1} style={s.galleryName}>
                      {item.name}
                    </Text>
                    <View>
                      <Text style={s.galleryDate}>
                        {new Date(item.updatedAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </Text>
                      <View style={s.row}>
                        <IconButton
                          name="edit-3"
                          label={`Edit ${item.name}`}
                          onPress={() => {
                            studio.open({ ...item.avatar });
                            router.replace("/");
                          }}
                        />
                        <IconButton
                          name="trash-2"
                          label={`Delete ${item.name}`}
                          onPress={() => setPending(item)}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
      <About visible={about} onClose={() => setAbout(false)} />
      <Dialog visible={!!pending} onClose={() => setPending(null)}>
        <Text style={s.dialogTitle}>Remove this character?</Text>
        <Text style={[s.body, { marginVertical: 20 }]}>
          “{pending?.name}” will be removed from your collection. Your current
          draft stays in the studio. This cannot be undone.
        </Text>
        <Button label="Keep character" onPress={() => setPending(null)} />
        <View style={{ height: 12 }} />
        <Button
          label="Remove character"
          secondary
          onPress={() => {
            if (pending) studio.remove(pending.id);
            setPending(null);
          }}
        />
      </Dialog>
    </SafeAreaView>
  );
}
