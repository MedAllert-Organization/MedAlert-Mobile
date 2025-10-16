import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import {
  setupNotificationHandler,
  scheduleMedicationReminder,
  cancelAllReminders,
} from "@/utils/notifications";

export default function Index() {
  const router = useRouter();
  const { isReady, isLoggedIn } = useAuth();

  useEffect(() => {
    setupNotificationHandler();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (isLoggedIn) {
      router.replace("/tabs/initial");
      checkAndScheduleReminders();
    } else {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn, router]);

  async function checkAndScheduleReminders() {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/treatment`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar tratamentos");

      const { treatments } = await res.json();

      // 🔄 Cancela antigos alarmes antes de reagendar
      await cancelAllReminders();

      for (const treatment of treatments) {
        if (!treatment.medications) continue;

        for (const med of treatment.medications) {
          if (!med.alertPeriodInHours) continue;
          await scheduleMedicationReminder(
            med.name,
            med.alertPeriodInHours,
          );
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível sincronizar os lembretes.");
    }
  }

  if (!isReady) return <ActivityIndicator size="large" />;

  return null;
}
