import "./global.css";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme, DefaultTheme, type NavigationContainerRef } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";
import type { RootStackParamList } from "./src/navigation/types";
import { SENTRY_DSN } from "./src/constants/sentry";

SplashScreen.preventAutoHideAsync();

const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
});

const navigationDarkTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#000000" },
};
const navigationLightTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#FFFFFF" },
};

function AppShell() {
  const { isDark, paperTheme } = useTheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer
        ref={navigationRef}
        theme={isDark ? navigationDarkTheme : navigationLightTheme}
        onReady={() => navigationIntegration.registerNavigationContainer(navigationRef)}
      >
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
