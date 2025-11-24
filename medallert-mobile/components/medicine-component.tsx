import Colors from "@/constants/Colors";
import { Medication } from "@/constants/Models";
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
};

export default function MedicineComponent({ medicines }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  function handlePress(med: Medication) {
    router.push({
      pathname: "/detail-medication",
      params: { med: JSON.stringify(med) },
    });
  }

  return (
    <View>
      <View style={[localStyles.card, { backgroundColor: theme.background }]}>
        {medicines?.length ? (
          medicines.map((med, idx) => (
            <TouchableOpacity
              key={med.medicationId ?? idx}
              onPress={() => handlePress(med)}
              style={[
                localStyles.row,
                {
                  borderBottomWidth: idx !== medicines.length - 1 ? 0.2 : 0,
                  borderBottomColor: theme.text,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: theme.text, fontWeight: "600" }}>
                  {med.name ?? "Sem nome"}
                </Text>

                {med.dose ? (
                  <Text style={{ color: theme.text, opacity: 0.7 }}>
                    Dose: {med.dose}
                  </Text>
                ) : null}

                {med.description ? (
                  <Text
                    style={{
                      color: theme.text,
                      opacity: 0.6,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {med.description}
                  </Text>
                ) : null}

              </View>

              <View style={{ alignItems: "flex-end" }}>
                {typeof med.alertPeriodInMinutes === "number" && (
                  <Text style={{ color: theme.text }}>
                    A cada {med.alertPeriodInMinutes}min
                  </Text>
                )}

                {typeof med.takenQuantity === "number" &&
                  typeof med.totalQuantity === "number" && (
                    <Text style={{ color: theme.text }}>
                      Tomados {med.takenQuantity}/{med.totalQuantity}
                    </Text>
                  )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: theme.text, opacity: 0.6, textAlign: "center" }}>
            Nenhuma medicação encontrada
          </Text>
        )}
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
