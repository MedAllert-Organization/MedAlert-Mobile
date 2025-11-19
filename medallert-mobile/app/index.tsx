import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";


export default function Index() {
  const router = useRouter();
  const { isReady, isLoggedIn } = useAuth();

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
