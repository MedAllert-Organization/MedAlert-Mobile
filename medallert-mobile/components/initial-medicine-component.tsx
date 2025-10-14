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

export type Medication = {
  medicationId: string;
  userId: string;
  treatmentId: string | null;
  name: string;
  dose: string | null;
  description: string | null;
  visualTypeId: string | null;
  soundTypeId: string | null;
  alertPeriodInHours: number;
  endTreatmentAt: Date | null;
};

type Props = {
  medicines: Medication[];
};

export default function InitialMedicineComponent({ medicines }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Today's Medicines
      </Text>

      {medicines.length === 0 ? (
        <View style={[localStyles.card, { backgroundColor: theme.background }]}>
          <Text style={{ color: theme.text, textAlign: "center" }}>
            No medications scheduled for today.
          </Text>
        </View>
      ) : (
        <View style={[localStyles.card, { backgroundColor: theme.background }]}>
          {medicines.map((med, idx) => (
            <View
              key={med.medicationId}
              style={[
                localStyles.row,
                {
                  borderBottomWidth: idx !== medicines.length - 1 ? 0.2 : 0,
                  borderBottomColor: theme.text,
                  paddingVertical: 6,
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

              <Text style={{ color: theme.text, opacity: 0.7 }}>
                Every {med.alertPeriodInHours}h
              </Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={() => router.push("/medication")}>
        <View style={[localStyles.card, { backgroundColor: theme.background }]}>
          <Text style={{ color: theme.text, textAlign: "center" }}>+ Add med</Text>
        </View>
      </TouchableOpacity>
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
  },
});
