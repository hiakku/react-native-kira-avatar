import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT,
  PRESETS,
  parseStorage,
  validAvatar,
  randomAvatar,
} from "../src/model.ts";
import { avatarSvg } from "../src/art.ts";
test("every starter character and random boundary combination is a supported avatar", () => {
  for (const a of [
    ...PRESETS.map((p) => p.avatar),
    randomAvatar(() => 0),
    randomAvatar(() => 0.999999),
  ])
    assert.equal(validAvatar(a), true);
});
test("empty collections and transparent drafts survive storage round trips", () => {
  const draft = { ...DEFAULT, transparent: true, blush: false };
  assert.deepEqual(
    parseStorage(JSON.stringify({ version: 1, draft, saved: [] })),
    { draft, saved: [] },
  );
});
test("corrupt data, unsupported palette values and invalid item indices are rejected", () => {
  for (const change of [
    { hair: -1 },
    { outfit: 6 },
    { eyes: 1.5 },
    { hairColor: "url(invalid)" },
    { transparent: "yes" },
  ])
    assert.equal(validAvatar({ ...DEFAULT, ...change }), false);
  for (const raw of [
    "null",
    "{",
    '{"version":2}',
    '{"version":1,"draft":null,"saved":[]}',
  ])
    assert.throws(() => parseStorage(raw));
});
test("saved names and avatars survive serialization; duplicate IDs are rejected", () => {
  const item = {
    id: "a",
    name: "星 🌸",
    avatar: DEFAULT,
    updatedAt: "2026-11-04T10:00:00Z",
  };
  assert.equal(
    parseStorage(JSON.stringify({ version: 1, draft: DEFAULT, saved: [item] }))
      .saved[0].name,
    "星 🌸",
  );
  assert.throws(() =>
    parseStorage(
      JSON.stringify({ version: 1, draft: DEFAULT, saved: [item, item] }),
    ),
  );
});
test("transparent exports omit the background and isolate gradient IDs between avatars", () => {
  const xml = avatarSvg({ ...DEFAULT, transparent: true }, "one");
  assert.equal(xml.includes('<rect width="400"'), false);
  assert.ok(xml.includes('id="onehair"'));
  assert.ok(!avatarSvg(DEFAULT, "two").includes("url(#onehair)"));
  assert.ok(xml.includes('width="1024" height="1024"'));
});
