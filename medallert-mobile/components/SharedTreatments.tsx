import { useCallback, useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Alert, TouchableOpacity, useColorScheme } from "react-native";
import { router } from "expo-router";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import Colors from "@/constants/Colors";

interface SharedTreatmentsResponse {
  success: boolean;
  treatments: TreatmentShare[];
}

interface TreatmentShare {
  userId: string;
  createdAt: string;
  treatment: TreatmentPayload;
}

interface TreatmentPayload {
  treatmentId: string;
  name: string;
  description: string;
  user: User;
}

interface User {
  userId: string;
  fullName: string;
}

export function SharedTreatments() {
  const [treatments, setTreatments] = useState<TreatmentShare[]>([]);
    const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const listSharedTreatments = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/shared-with-me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao listar tratamentos compartilhados");

      const result = (await res.json()) as SharedTreatmentsResponse;
      setTreatments(result.treatments);
    } catch (e) {
      Alert.alert(
        "Erro",
        "Houve um erro ao listar tratamentos compartilhados!"
      );
      console.error(e);
    }
  }, []);

  useEffect(() => {
    listSharedTreatments();
  }, [listSharedTreatments]);

  function handlePress(treatmentId: string) {
    router.push({
      pathname: "/detail-treatment",
      params: { id: treatmentId },
    });
  }

  return (
    <View>
     
      {treatments.length === 0 ? (
        <>
       
        </>
      ) : (
        <>
         <Text style={[styles.sectionTitle, { color: theme.text }]}>Tratamentos compartilhados comigo</Text>
        <FlatList
          data={treatments}
          keyExtractor={(item) => item.treatment.treatmentId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={localStyles.card}
              onPress={() => handlePress(item.treatment.treatmentId)}
            >
              <Text style={[localStyles.userInfo, { color: theme.text }]}>
                Compartilhado por: {item.treatment.user.fullName}
              </Text>
              <View style={{ gap: 4 }}>
                <Text style={[localStyles.treatmentName, { color: theme.text }]}>
                  {item.treatment.name}
                </Text>
                {item.treatment.description && (
                  <Text style={[localStyles.treatmentDesc, { color: theme.text }]}>
                    {item.treatment.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
        </>
      )}
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
    gap: 4,
  },
  userInfo: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  treatmentDesc: {
    fontSize: 14,
    opacity: 0.8,
  },
});
