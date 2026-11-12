# Validation — 4 November 2026

## Passed

- `npm run check`: Expo ESLint, TypeScript, and five model/art tests.
- Expo Doctor: 20/20 checks passed.
- Android JavaScript/Hermes assets export: successful (about 2.8 MB JavaScript bundle). No native APK compiled.
- Twenty-six style variants generated and parsed as valid SVG XML.
- Browser interaction: hairstyle/colour changes, outfit selection, glasses selection, wink expression, save named character, open collection, and reopen saved character for editing.
- Collection persistence verified by reloading `/collection` and finding the saved “Sakura” character.
- Undo and redo verified with the transparent-background switch changing off and on.
- Actual browser PNG downloads verified: 1024 × 1024; transparent export has alpha 0 at the corners and visible opaque character pixels.
- Visual inspection at 390 × 844: portrait stays visible while scrolling editing options. Desktop layout inspected at 1440 × 1000. Temporary viewport override reset afterward.
- First-render empty-text-node warning was fixed by making conditional view children explicitly boolean.

## Pending

- Native APK build, installation, and actual phone testing.
- Native PNG capture and Android/iOS share sheet, including transparent export, on physical devices.
- Full native Back/keyboard behavior, device accessibility, and larger collections.
- Art catalogue expansion, target audience choice, live ad integration, consent, store/provider approval, and real monetisation measurements.
- Store name/package availability, store assets, privacy-policy hosting, submission, and publication.

The prototype has no live advertisements or payments and generates no revenue. Its only artwork is the original vector drawing code in `src/art.ts`. This initial style is for user review before committing to a large asset catalogue.

## Refined artwork update

- Replaced the drawing geometry and shading while preserving the avatar data model and existing saved combinations.
- Lint, TypeScript, and all five tests pass after the renderer update.
- Thirty-two variations covering every hairstyle, eye expression, mouth, outfit, accessory, and skin tone parse as SVG XML.
- Browser checks covered the revised face with a darker skin tone, colour-relative gradients, glasses alignment, reset, and a real 1024 × 1024 PNG download.
- Updated app icon assets from the actual exported drawing.
- Android JavaScript/assets export completed successfully. A native APK and native rendering still require testing.
- An image-generation reference is saved separately with its exact prompt in `assets/art-direction/PROMPT.md`. It is an art reference; the app continues to render customisable vector illustrations.
