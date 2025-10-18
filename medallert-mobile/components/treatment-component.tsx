import { Medication } from "@/app/(medication)/create-medication";
import { Treatment } from "@/app/(medication)/create-treatment";
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
  treatments: Treatment[];
  title: string;
};

export default function TreatmentComponent({ treatments, title }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  function handlePress(treatmentId: string) {
    router.push({
      pathname: "/treatment-detail",
      params: { id: treatmentId },
    });
  }

  function formatDate(dateString: string | null): string {
    if (!dateString) return "Sem data definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>

      <View style={[localStyles.card, { backgroundColor: theme.background }]}>
        {treatments.map((trea, idx) => (
          <TouchableOpacity
            key={trea.treatmentId}
            onPress={() => handlePress(trea.treatmentId)}
            style={[
              localStyles.row,
              {
                borderBottomWidth: idx !== treatments.length - 1 ? 0.2 : 0,
                borderBottomColor: theme.text,
              },
            ]}
          >
            <View>
              <Text style={{ color: theme.text, fontWeight: "600" }}>
                {trea.name}
              </Text>

              {trea.description && (
                <Text
                  style={{ color: theme.text, opacity: 0.7, fontSize: 13 }}
                  numberOfLines={1}
                >
                  {trea.description}
                </Text>
              )}

              <Text style={{ color: theme.text, opacity: 0.5, fontSize: 12, marginTop: 4 }}>
                Termina em: {formatDate(trea.endAt)}
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
