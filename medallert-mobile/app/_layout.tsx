import { Stack } from "expo-router";
import { AppProvider } from "@/providers/app-provider";
import { useAuth } from "@/providers/auth-provider";

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <AppProvider>
      <Stack>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="create-account"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="verify-email" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}
