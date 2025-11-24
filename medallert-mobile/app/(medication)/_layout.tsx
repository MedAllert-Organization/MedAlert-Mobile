import { Stack } from "expo-router";

export default function MedicationLayout() {
  return (
    <Stack>
      <Stack.Screen name="create-medication" options={{ headerShown: false }} />
      <Stack.Screen name="create-treatment" options={{ headerShown: false }} />
      <Stack.Screen name="detail-medication" options={{ headerShown: false }} />
      <Stack.Screen name="detail-treatment" options={{ headerShown: false }} />
      <Stack.Screen name="detail-medication-notes" options={{ headerShown: false }} />
      <Stack.Screen name="list-medication-notes" options={{ headerShown: false }} />

      <Stack.Screen
        name="share-medication"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
