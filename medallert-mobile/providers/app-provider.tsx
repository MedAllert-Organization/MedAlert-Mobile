import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import type { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { AuthProvider } from "./auth-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={theme}>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
