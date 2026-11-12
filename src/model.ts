export const HAIRS = [
  "Cloud bob",
  "Long & lovely",
  "Twin tails",
  "Soft pixie",
  "Moon waves",
  "Space buns",
] as const;
export const EYES = ["Daydream", "Cat eye", "Bright smile", "Wink"] as const;
export const MOUTHS = [
  "Little smile",
  "Happy",
  "Soft pout",
  "Surprised",
] as const;
export const OUTFITS = [
  "Sunday cardigan",
  "Sailor collar",
  "Cozy hoodie",
  "Classic tee",
  "Sweet bow",
  "Midnight knit",
] as const;
export const ACCESSORIES = [
  "Just you",
  "Star clips",
  "Round glasses",
  "Cat ears",
  "Moon earrings",
  "Flower crown",
] as const;
export const SKINS = [
  "#F5D9C7",
  "#EBC3A4",
  "#D9A27F",
  "#BA8060",
  "#936048",
  "#634236",
];
export const HAIR_COLORS = [
  "#554361",
  "#252A3B",
  "#825D45",
  "#D5A969",
  "#D9B2BB",
  "#B8A5D9",
  "#8DAEB0",
  "#D9D0B4",
  "#A95D6A",
  "#F0B58F",
];
export const EYE_COLORS = [
  "#8D73B3",
  "#729C9B",
  "#7795BB",
  "#B98A54",
  "#BE788D",
  "#6A594F",
  "#869561",
  "#6F6F87",
];
export const CLOTH_COLORS = [
  "#AC9CC7",
  "#E7B1B9",
  "#83B3AD",
  "#D5BA82",
  "#7F96B5",
  "#BD7C74",
  "#4D536B",
  "#EEE1CB",
];
export const BACKGROUNDS = [
  "#E8E0F1",
  "#F5E1E6",
  "#DDECE7",
  "#F5EBD9",
  "#DFE8F3",
  "#EAE4DD",
];
export type Avatar = {
  hair: number;
  eyes: number;
  mouth: number;
  outfit: number;
  accessory: number;
  skin: string;
  hairColor: string;
  eyeColor: string;
  clothColor: string;
  background: string;
  transparent: boolean;
  blush: boolean;
};
export type SavedAvatar = {
  id: string;
  name: string;
  avatar: Avatar;
  updatedAt: string;
};
export const DEFAULT: Avatar = {
  hair: 4,
  eyes: 0,
  mouth: 0,
  outfit: 0,
  accessory: 1,
  skin: SKINS[0],
  hairColor: HAIR_COLORS[0],
  eyeColor: EYE_COLORS[0],
  clothColor: CLOTH_COLORS[0],
  background: BACKGROUNDS[0],
  transparent: false,
  blush: true,
};
export const PRESETS: { name: string; avatar: Avatar }[] = [
  { name: "Luna", avatar: { ...DEFAULT } },
  {
    name: "Mochi",
    avatar: {
      ...DEFAULT,
      hair: 0,
      hairColor: HAIR_COLORS[4],
      outfit: 2,
      clothColor: CLOTH_COLORS[1],
      accessory: 3,
      eyes: 3,
      background: BACKGROUNDS[1],
    },
  },
  {
    name: "Kai",
    avatar: {
      ...DEFAULT,
      hair: 3,
      hairColor: HAIR_COLORS[1],
      skin: SKINS[2],
      outfit: 3,
      clothColor: CLOTH_COLORS[2],
      accessory: 2,
      eyes: 1,
      background: BACKGROUNDS[2],
    },
  },
  {
    name: "Hana",
    avatar: {
      ...DEFAULT,
      hair: 2,
      hairColor: HAIR_COLORS[2],
      eyeColor: EYE_COLORS[3],
      outfit: 4,
      accessory: 5,
      mouth: 1,
      clothColor: CLOTH_COLORS[3],
      background: BACKGROUNDS[3],
    },
  },
];
export function randomAvatar(random = Math.random): Avatar {
  const pick = <T>(values: readonly T[]) =>
    values[Math.min(values.length - 1, Math.floor(random() * values.length))];
  return {
    hair: pick([0, 1, 2, 3, 4, 5]),
    eyes: pick([0, 1, 2, 3]),
    mouth: pick([0, 1, 2, 3]),
    outfit: pick([0, 1, 2, 3, 4, 5]),
    accessory: pick([0, 1, 2, 3, 4, 5]),
    skin: pick(SKINS),
    hairColor: pick(HAIR_COLORS),
    eyeColor: pick(EYE_COLORS),
    clothColor: pick(CLOTH_COLORS),
    background: pick(BACKGROUNDS),
    transparent: false,
    blush: true,
  };
}
export function validAvatar(a: unknown): a is Avatar {
  if (!a || typeof a !== "object") return false;
  const x = a as Avatar;
  return (
    (
      [
        ["hair", 6],
        ["eyes", 4],
        ["mouth", 4],
        ["outfit", 6],
        ["accessory", 6],
      ] as const
    ).every(
      ([key, max]) => Number.isInteger(x[key]) && x[key] >= 0 && x[key] < max,
    ) &&
    SKINS.includes(x.skin) &&
    HAIR_COLORS.includes(x.hairColor) &&
    EYE_COLORS.includes(x.eyeColor) &&
    CLOTH_COLORS.includes(x.clothColor) &&
    BACKGROUNDS.includes(x.background) &&
    typeof x.transparent === "boolean" &&
    typeof x.blush === "boolean"
  );
}
export function parseStorage(raw: string): {
  draft: Avatar;
  saved: SavedAvatar[];
} {
  const data = JSON.parse(raw);
  if (
    data?.version !== 1 ||
    !validAvatar(data.draft) ||
    !Array.isArray(data.saved) ||
    !data.saved.every(
      (s: SavedAvatar) =>
        s &&
        typeof s.id === "string" &&
        typeof s.name === "string" &&
        Number.isFinite(Date.parse(s.updatedAt)) &&
        validAvatar(s.avatar),
    )
  )
    throw new Error("Invalid saved collection");
  if (
    new Set(data.saved.map((s: SavedAvatar) => s.id)).size !== data.saved.length
  )
    throw new Error("Duplicate avatar IDs");
  return { draft: data.draft, saved: data.saved };
}
