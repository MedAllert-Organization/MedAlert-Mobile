import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}
