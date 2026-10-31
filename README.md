# Store prototype

A shared Expo app that renders two sample Shopify-style stores from one set of screens. Apex Athletics is a dark athletic store priced in USD. Northline is a light outerwear store priced in JPY. Gymshark is a visual reference only: this project does not use that name, logo, photography, or catalog.

Live Shopify, login, and payment are not connected. Product and cart GraphQL for a future Storefront integration is in `src/data/shopify/operations.ts`. The architecture write-up is in `docs/ARCHITECTURE.md`.

## Run

```bash
npm install
npm start
```

Android:

```bash
npm run android
```

iOS, from macOS:

```bash
npm run ios
```

Typecheck:

```bash
npm run typecheck
```

Use Expo Go on a device, or an Android emulator. This project was developed on Windows.

## Walkthrough

1. Welcome shows the active brand, both stores, and Skip. Skip opens Apex Athletics. Choosing Northline resets the stack to Home and swaps brand, currency, and catalog.
2. Home has the same switcher. Switching stores returns to Home so a product from the previous store cannot stay open.
3. Open a product, choose a variant, and add it. Size 11 of Stride Runner, X-Large of Flex Hoodie, Olive of Training Tee, Large of Ridge Parka, and X-Large of Wool Sock are unavailable and cannot be added.
4. The cart updates quantity, blocks a quantity below 1, removes lines, and shows a subtotal in the store currency. Adding the same variant again increases quantity.
5. Checkout opens a demo sheet. It explains production checkout and does not take payment. Missing or unavailable saved lines must be removed before checkout.
6. Force-close the app and reopen it. Each store still has its own cart.
7. Reviews on Apex: Stride Runner shows sample reviews. Flex Hoodie shows an unavailable message. Northline has reviews turned off, so the section is absent.
8. Prototype actions: Simulate catalog error, then Retry. Simulate product error, then Retry. Open unknown product. On the cart, simulate a saved unavailable item and a missing saved item.

Prices are integer minor units. USD uses 2 decimal places. JPY uses none.

## Platforms tested

- TypeScript: `npm run typecheck` passed.
- Currency and cart rules were executed in Node. `$128.00` is 12800 USD minor units, `¥24,800` is 24800 JPY minor units, and a 3-decimal currency such as BHD formats `1.234` from 1234 minor units. Duplicate adds merge, unavailable variants are rejected, quantity cannot fall below 1, and missing or unavailable saved lines stay out of the subtotal and checkout.
- Android: Metro bundled the Android JavaScript successfully (891 modules). A Motorola phone was attached through adb. `npx expo start --android` started Metro and tried to open the project on that phone, then stalled while downloading Expo Go. Expo Go was not installed, no virtual device is configured, and the only JDK found is Java 8, which cannot build the current native app. The shopping flow was not clicked through on a device.
- iOS: not run. This computer is Windows.

## Submission notes

- AI tools: Cursor with Grok 4.7, used to implement this prototype from the assignment brief.
- Issue corrected: the home list footer passed `null`, which TypeScript rejects for `FlatList`. It now passes `undefined` when the prototype actions are hidden. Cart writes also wait until AsyncStorage hydration finishes, so an add during restore is not overwritten by the saved cart.
- Time spent: one working session covering the prototype, architecture document, and verification above.
- Unfinished: the three-minute walkthrough recording. Live Shopify, authentication, and payments are intentionally not connected. Android and iOS were not launched on this machine.

## Project layout

```text
App.tsx
src/config/stores.ts
src/config/StoreContext.tsx
src/navigation/RootNavigator.tsx
src/data/ProductRepository.ts
src/data/MockProductRepository.ts
src/data/sampleCatalog.ts
src/data/cartStore.ts
src/data/resolveCartLines.ts
src/data/shopify/operations.ts
src/integrations/ReviewsAdapter.ts
src/integrations/MockReviewsAdapter.ts
src/screens/WelcomeScreen.tsx
src/screens/HomeScreen.tsx
src/screens/ProductScreen.tsx
src/screens/CartScreen.tsx
docs/ARCHITECTURE.md
```
