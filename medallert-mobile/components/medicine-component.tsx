import { Medication } from "@/app/(medication)/create-medication";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  medicines: Medication[];
  title: string;
};

export default function MedicineComponent({ medicines, title }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  function handlePress(medId: string) {
    router.push({
      pathname: "/medication-detail",
      params: { id: medId },
    });
  }

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>

      <View style={[localStyles.card, { backgroundColor: theme.background }]}>
        {medicines.map((med, idx) => (
          <TouchableOpacity
            key={med.medicationId}
            onPress={() => handlePress(med.medicationId)}
            style={[
              localStyles.row,
              {
                borderBottomWidth: idx !== medicines.length - 1 ? 0.2 : 0,
                borderBottomColor: theme.text,
              },
            ]}
          >
            <View>
              <Text style={{ color: theme.text, fontWeight: "600" }}>
                {med.name}
              </Text>
              {med.dose && (
                <Text style={{ color: theme.text, opacity: 0.7 }}>
                  Dose: {med.dose}
                </Text>
              )}
            </View>
            <View>
               <Text style={{ color: theme.text}}>
                A cada {med.alertPeriodInHours} horas
              </Text>
               <Text style={{ color: theme.text }}>
                Tomados {med.takenQuantity}/{med.totalQuantity} 
              </Text>
            </View>
         
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
});
