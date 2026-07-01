# HouseOfEdtechClone

A high-fidelity React Native (Expo) clone inspired by Disney+ Hotstar, built as a production-style content streaming app with a Home feed, a rich Detail screen, and a Profile/Settings screen.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Expo (managed workflow, SDK 56) |
| Language | TypeScript (strict mode) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Navigation | React Navigation (Native Stack + Bottom Tabs) |
| Component library | React Native Paper |
| Animation | react-native-reanimated |

## Features

- **Home** — auto-advancing hero carousel, search + genre filtering, horizontal content rows, a paginated "Popular" grid with infinite scroll, and pull-to-refresh.
- **Detail** — dynamic/sticky header that fades in on scroll, rating/duration/year metadata, Play/My List/Download actions, cast list, and related titles.
- **Profile** — account stats, grouped settings (including a working Dark Mode toggle), and a sign-out flow.
- **Loading/error/empty states** — every screen has a skeleton loader, a retry-able error state, and (on Home) an empty-results state for when search/filters return nothing.
- **Theming** — a real light/dark theme engine (toggle in Profile → Appearance), not just a system-default switch.
- **Mock data layer** — all content is served through an async service layer (`src/api/`) with artificial network delay, so screens are fully data-driven with no hardcoded UI copy.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- The [Expo Go](https://expo.dev/go) app on your phone (easiest way to run it), or Android Studio / Xcode if you want a simulator

### Install & Run

```bash
git clone https://github.com/alanjoseph77/House_of_EdtechProject.git
cd BundleTest
npm install
npx expo start
```

Then either:
- Scan the QR code with the Expo Go app (Android) or the Camera app (iOS), or
- Press `a` for an Android emulator, or `i` for an iOS simulator (requires Android Studio / Xcode), or
- Press `w` to run it in a browser (uses `react-native-web`).

No environment variables or API keys are required — all data is local mock JSON.

## Project Structure

```
src/
  api/            Mock service layer (fetchHomeFeed, fetchContentDetail, fetchPopularPage, fetchProfile)
  data/           Mock JSON data (content.json, profile.json)
  types/          Shared TypeScript types for content + profile domains
  navigation/     Stack + bottom tab navigators, custom tab bar
  screens/        HomeScreen, DetailScreen, ProfileScreen
  components/     Shared UI (ContentCard, ContentRow, CastRow, Skeleton, EmptyState, ...)
    home/         Home-screen-specific components (HeroCarousel, SearchBar, GenreChips, ...)
    detail/       Detail-screen-specific components (ActionsRow, MetadataRow, DetailHeaderBar, ...)
    profile/      Profile-screen-specific components
  theme/          ThemeContext — light/dark engine
  utils/          Small formatting helpers
```

## Architecture & Design Decisions

**Why React Native Paper.** It gave production-ready, accessible primitives (Button, Switch, Chip, IconButton) out of the box, so component-level effort could go into the custom UI (carousels, cards, skeletons) that actually differentiates the app, rather than re-building basic controls.

**Why NativeWind.** Tailwind's utility classes keep styling co-located with markup and easy to scan, and NativeWind's `darkMode: "class"` support is what makes the theme engine possible — colors are defined once as CSS variables (`global.css`) and every screen that uses the semantic tokens (`bg-base`, `text-fg`, `text-fg-muted`, etc.) repaints automatically when the theme is toggled. A few colors (`accent`, `ink`, `overlay-fg`) are intentionally **not** theme-reactive — they're used for text painted over image scrims/backdrops, which must stay legible regardless of the app's theme.

**Data layer abstraction.** Every screen calls into `src/api/*Service.ts`, never into the JSON files directly. Each function awaits an artificial delay before resolving, mimicking a real network call. This means swapping the mock layer for a real backend later only touches three files, not every screen.

**Performance.**
- All lists use `FlatList`/`SectionList`-equivalent patterns with `keyExtractor`, `initialNumToRender`, and `removeClippedSubviews` tuned per list.
- The Home screen is a single root `FlatList` (header = hero/search/rows, data = the paginated Popular grid) rather than a `ScrollView` wrapping disabled nested `FlatList`s — avoiding the classic "VirtualizedList nested in ScrollView" anti-pattern while also enabling real `onEndReached` pagination and `RefreshControl`.
- `React.memo` wraps every list-item-level component (`ContentCard`, `ContentRow`, `CastRow`, etc.), and handlers passed into them are wrapped in `useCallback` so list re-renders don't cascade into every card.
- Images go through `expo-image`, which handles caching, downsampling, and placeholder/transition behavior for free.

**Skeletons over spinners.** Each screen has a purpose-built skeleton (`HomeSkeleton`, `DetailSkeleton`, `ProfileSkeleton`) built from one reusable animated `Skeleton` primitive, shaped to match the real layout — so the loading state doesn't visually "jump" once data arrives.

## Notes on the Mock Data

- Posters/backdrops are real artwork pulled from [TMDB](https://www.themoviedb.org/) (The Movie Database), not stock photos — every image URL was verified before being committed.
- The "Popular" grid's infinite scroll is simulated by cycling the same small mock catalog across a fixed number of pages (clearly ending with a "You've reached the end" footer, not an endless fake loop) — there's no real backend to paginate against.

## Sharing / Deployment

You have two practical options to hand this off for review. **EAS Build (Option A)** is the more reliable one since it doesn't depend on a live dev server or on Expo Go's App Store approval status — anyone can just install the APK.

### Option A — Build a shareable Android APK (recommended)

1. Install the EAS CLI and log in (a free Expo account is enough):
   ```bash
   npm install --global eas-cli
   eas login
   ```
2. Configure the project for EAS Build (run once):
   ```bash
   eas build:configure
   ```
3. Make sure your `eas.json` has an internal-distribution Android profile that produces an APK (not an AAB), e.g.:
   ```json
   {
     "build": {
       "preview": {
         "distribution": "internal",
         "android": { "buildType": "apk" }
       }
     }
   }
   ```
4. Kick off the build:
   ```bash
   eas build --platform android --profile preview
   ```
5. When it finishes, EAS prints a shareable download link (also visible on your [expo.dev](https://expo.dev) dashboard) — anyone can open that link on an Android phone and install the APK directly.

### Option B — Quick live Expo Go link (good for the demo recording itself)

```bash
npx expo start --tunnel
```

This prints a `exp://...` link and QR code that anyone on the internet (not just your Wi-Fi) can open in Expo Go, for as long as your dev server keeps running. Good for a live walkthrough; not good as a persistent submission link since it dies when you close the terminal.

## Pushing to GitHub

From the project root:

```bash
git add -A
git commit -m "Initial commit: House of Edtech assessment submission"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

