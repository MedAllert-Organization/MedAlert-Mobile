import { Stack } from "expo-router";

export default function MedicationLayout() {
  return (
    <Stack>
      <Stack.Screen name="medication" options={{ headerShown: false }} />
      <Stack.Screen name="treatment" options={{ headerShown: false }} />
    </Stack>
  );
}
