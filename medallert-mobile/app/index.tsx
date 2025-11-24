import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import * as Notifications from "expo-notifications";


export default function Index() {
  const router = useRouter();
  const { isReady, isLoggedIn } = useAuth();

  useEffect(() => {
  async function registerPush() {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();

      if (newStatus !== "granted") {
        console.log("❌ Permissão NEGADA, não dá para agendar notificações.");
        return;
      }
    }

    console.log("✅ Permissão concedida!");
  }

  registerPush();
}, []);


   Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    if (!isReady) return;

    if (isLoggedIn) {
      router.replace("/tabs/initial");
    } else {
      router.replace("/login");
    }
  }, [isReady, isLoggedIn, router]);

  if (!isReady) return <ActivityIndicator size="large" />;

  return null;
}



