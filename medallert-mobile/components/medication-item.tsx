import { styles } from "@/utils/remedyStyles";
import { Text, TouchableOpacity, View } from "react-native";

export default function MedicationItem({
  name,
  onPress,
}: {
  name: string;
  onPress: () => Promise<void>;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.medName}>{name}</Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </TouchableOpacity>
  );
}
