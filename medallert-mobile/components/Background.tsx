import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  keyboardBehavior?: "padding" | "height" | "position" | undefined;
};

export default function Background({
  children,
  style,
  keyboardBehavior,
}: Props) {
  const colorScheme = useColorScheme();
  return (
    <LinearGradient
      colors={[
        "#61AEF0",
        colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
        colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
      ]}
      style={[{ flex: 1, padding: 20}, style]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={
            keyboardBehavior ?? (Platform.OS === "ios" ? "padding" : undefined)
          }
        >
          {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
