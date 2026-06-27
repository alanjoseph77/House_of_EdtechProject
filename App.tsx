import "./global.css";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import RootNavigator from "./src/navigation/RootNavigator";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer theme={isDark ? navigationDarkTheme : navigationLightTheme}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
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
