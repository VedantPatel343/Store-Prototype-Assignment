# Shopify Store to Mobile App

A React Native assignment prototype showing how one shared codebase can power different branded Android and iOS storefronts. Gymshark is the visual reference; the app uses fictional brands, original copy, and AI-generated product imagery, without Gymshark credentials or assets.

**Demo only:** products, prices, stock, and reviews are sample data. Checkout does not place orders or take payment. No Shopify account, API keys, or paid services are required.

## Assignment deliverables

| Deliverable | Location |
|---|---|
| Source code and setup instructions | This repository + [Setup](#setup) below |
| Architecture diagram and integration plan | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · [docs/architecture-diagram.svg](docs/architecture-diagram.svg) |
| Third-party compatibility research | Same architecture doc (reviews, loyalty, subscriptions, search, discounts/bundles, notifications, analytics, support, order tracking, returns) |
| Proposed Storefront GraphQL operations | [src/data/shopify/operations.ts](src/data/shopify/operations.ts) |
| Walkthrough | Coverage: [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md). Recording: [Final walkthrough (1:07)](docs/walkthrough-rerecorded.mp4) |

## Two stores, shared screens

**THREAD & FORM** is a dark clothing and footwear storefront with eight products, USD pricing, and reviews enabled. Its catalog includes Everyday Mesh Sneaker, Essential Pullover Hoodie, Weekend Drawstring Shorts, Classic Crew Tee, Alpine Hooded Parka, Oatmeal Knit Sweater, Ribbed Cuff Beanie, and Cozy Knit Socks.

**STILL HOME** is a warm, light home-goods storefront with JPY pricing and reviews disabled. Its catalog includes Mori Dome Table Lamp, Sunday Stoneware Mug, Terra Arch Vase, and Tempo Oak Wall Clock.

Both stores use the same screen components. [src/config/stores.ts](src/config/stores.ts) controls brand name, tagline, promotional banner, colors, currency, catalog mapping, typography, corner radius, and the reviews feature flag. Internal IDs remain `apex` and `northline` for persistence compatibility; these are not display names.

## Implemented features

- Branded welcome screen with store selection and Skip.
- Two-column collection with store-specific banners and bundled product images.
- Product details, variant selection, variant-specific prices, and unavailable options.
- Separate persistent carts per store, with quantity changes, removal, subtotal, and demo checkout.
- Cart product images and names open product details independently of quantity/removal controls.
- Switching stores returns to the correct collection; tapping the active store does not navigate again.
- Loading, error/retry, empty-cart, missing-product, and missing/unavailable saved-item states.
- Mock reviews demonstrating success, unavailable, and configuration-disabled states.

Money uses integer minor units: USD has two decimal places and JPY has none. Cart rows persist variant IDs and quantities; names, prices, availability, and product links are resolved from the current catalog. Missing or unavailable items are excluded from the subtotal and block checkout until removed. Cart writes wait for AsyncStorage hydration.

## Tech stack

- Expo SDK 58, React Native 0.88, React 19, and TypeScript.
- React Navigation native stack for the current screen flow.
- Zustand and AsyncStorage for cart state and persistence.
- Repository and adapter interfaces separating UI from mock data.

## Setup

Use Node.js compatible with the installed Expo version: `^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0`, plus npm.

```bash
npm ci
npm start
```

Use an Expo Go version compatible with SDK 58 and scan the Metro QR code. If that SDK is not supported by your Expo Go installation, use a native debug build.

### Android

Install Android Studio/Android SDK and a compatible JDK. Start an emulator or connect a phone with USB debugging enabled:

```bash
npm run android
```

For an already-installed debug build on a USB-connected phone:

```bash
adb reverse tcp:8081 tcp:8081
npx expo start --localhost --port 8081
```

Open the installed app and keep Metro running.

### iOS

On macOS with Xcode and its required command-line tools:

```bash
npm ci
npm run ios
```

Native `android/` and `ios/` directories are generated locally by Expo and ignored by Git. Native configuration belongs in `app.json` and config plugins.

### Checks

```bash
npm run typecheck
npx expo lint
```

ESLint is not currently configured. Expo's automatic lint setup could not download dependencies in the restricted development environment, so lint has not passed.

To check Android JavaScript and asset bundling without invoking the Hermes bytecode compiler:

```bash
npx expo export --platform android --no-bytecode --output-dir .expo/catalog-check
```

This validates a JavaScript/assets export, not a production APK or native release build.

## Architecture and production integration

The implemented flow is shared screens -> `ProductRepository` / `ReviewsAdapter` -> local mock data. Cart state lives on-device. Screens consume interfaces instead of importing catalog fixtures directly.

The [architecture plan](docs/ARCHITECTURE.md) covers merchant onboarding, Shopify authorization, secure credentials, backend caching/synchronization, reusable adapters, per-merchant builds, and three technical risks. It distinguishes configurable branding from changes requiring a new binary or custom development. Remote configuration and release automation are proposals, not implemented features.

The [GraphQL file](src/data/shopify/operations.ts) includes collection/product queries and `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, and `cartLinesRemove` mutations. They are not executed by the prototype.

In production, the integration would create/update a Storefront cart and open the returned `checkoutUrl` in Shopify-hosted checkout through a supported mobile integration. Merchant authorization and Admin API credentials belong on the backend. The app does not collect payment details.

The compatibility plan classifies integrations as Shopify-native, reusable provider adapters, web fallbacks, or unsupported features. Liquid widgets and website scripts do not automatically work in native screens.

## Reviews and failure scenarios

On THREAD & FORM, Everyday Mesh Sneaker shows sample reviews. Essential Pullover Hoodie shows the reviews-unavailable fallback while shopping remains usable. STILL HOME hides reviews through `featureReviews: false`.

Expand **Prototype testing > Show** near the bottom of the relevant screen to simulate a collection error, product error, unknown product, unavailable saved cart item, or missing saved cart item. Error screens provide Retry.

Empty the cart to see its empty state. Size 11 of Everyday Mesh Sneaker and the large Mori Dome Table Lamp are examples of unavailable variants. Loading UI is implemented, but local mocks resolve quickly; loading messages wait 200 ms to avoid flashing.

## Walkthrough

Final video chapters and coverage notes: [docs/WALKTHROUGH.md](docs/WALKTHROUGH.md).

1. Shopping journey — welcome → THREAD & FORM collection → product (unavailable + available variant) → cart → demo checkout.
2. Store configuration change — switch to STILL HOME (theme, currency, catalog, independent cart); show `src/config/stores.ts`.
3. Integration fallback — reviews hidden on STILL HOME; reviews unavailable on hoodie while shopping still works; one Prototype testing error + Retry.
4. Show two products per store with short screen holds. The architecture diagram and production integration plan are linked above.

The latest video uses fresh device footage, short configuration callouts, and brief screen holds. It includes the reviews fallback and shopping flow for two products per store. The architecture diagram is provided separately above.

Recording: [Final walkthrough (1:07, captioned MP4)](docs/walkthrough-rerecorded.mp4). Physical Android footage covers the shopping journey, switching the active store configuration, independent carts, and reviews fallback; short callouts explain currency and reviews settings. Product detail demonstrations cover only Everyday Mesh Sneaker, Essential Pullover Hoodie, Mori Dome Table Lamp, and Sunday Stoneware Mug. No voiceover.

## Platforms and validation

- **TypeScript:** `npx tsc --noEmit` passed during implementation.
- **Android export:** JavaScript/assets bundling passed using `--no-bytecode`. Full export previously encountered Windows `spawn EPERM` while invoking Hermes.
- **Android device:** the debug app was launched on a connected physical phone. The refreshed welcome, clothing collection, and product-detail screens were visually checked, including correct image scaling. This was focused visual verification, not a full regression of every flow.
- **Cart logic:** one-off Node checks passed for available/unavailable/missing product-link resolution and subtotal exclusion of unavailable/missing items. These are not a committed automated test suite.
- **Lint:** blocked by missing ESLint configuration and network access during setup.
- **iOS:** not run. Development was performed on Windows; macOS instructions are above.

## AI assistance and corrected issue

The original implementation notes report Cursor with Grok 4.7. Subsequent work used OpenAI Codex for catalog/UI updates, navigation fixes, checks, and documentation, and its built-in image generation tool for product and banner assets. [Asset notes and prompts](assets/catalog/README.md) are included.

One corrected issue was oversized/cropped product images on Android. Bundled bitmaps retained intrinsic dimensions when positioned only with absolute edges. Explicit `width: "100%"` and `height: "100%"` now size them to their frames. Product images use `contain`; promotional banners use `cover`. The fix was visually checked on the connected phone.

## Limitations and remaining work

- Optional: upload the [re-recorded walkthrough](docs/walkthrough-rerecorded.mp4) for a shareable URL. The repository includes the video itself.
- Configure ESLint and complete lint successfully.
- Complete Android end-to-end regression and iOS validation, including persistence, store isolation, and failure states.
- Catalog data, reviews, and generated product imagery are demonstrations, not verified merchant data.
- Live Shopify, customer login, payments, backend services, remote configuration, and per-merchant release automation are not implemented. Live login and payments are not required by the assignment.
- A live repository would also need remote Shopify image URL support in place of the current local image-key mapping.

## Project structure

```text
App.tsx                         App providers and navigation entry
src/config/                     Branding and active-store context
src/navigation/                 Shared native stack and route types
src/screens/                    Welcome, collection, product, and cart
src/components/                 Reusable UI, images, and demo states
src/data/                       Repository, cart, money, and fixtures
src/data/shopify/operations.ts   Proposed Storefront GraphQL operations
src/integrations/               Reviews interface and mock adapter
src/hooks/                      Async loading and retry
assets/catalog/                 Bundled imagery and generation notes
docs/ARCHITECTURE.md             Architecture and integration plan
docs/architecture-diagram.svg    Standalone architecture diagram
docs/WALKTHROUGH.md              Final video chapters and coverage notes
```

