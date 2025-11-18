import { Stack } from "expo-router";

export default function MedicationLayout() {
  return (
    <Stack>
      <Stack.Screen name="create-medication" options={{ headerShown: false }} />
      <Stack.Screen name="create-treatment" options={{ headerShown: false }} />
      <Stack.Screen name="medication-detail" options={{ headerShown: false }} />
      <Stack.Screen name="medication-treatment-detail" options={{ headerShown: false }} />
      <Stack.Screen name="treatment-detail" options={{ headerShown: false }} />
      <Stack.Screen name="medication-notes-detail" options={{ headerShown: false }} />
      <Stack.Screen name="medication-notes-list" options={{ headerShown: false }} />

      <Stack.Screen
        name="share-medication"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
