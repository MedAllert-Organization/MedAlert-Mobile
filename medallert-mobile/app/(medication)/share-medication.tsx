import { BackButton } from "@/components/BackButton";
import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextField from "@/components/TextField";
import env from "@/config/env";
import { getToken } from "@/providers/auth-provider";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { Text, View, Alert, StyleSheet } from "react-native";

type CreateMedicationSharing = { email: string };
type DeleteMedicationSharing = { userId: string };

export interface ListSharingsResult {
  success: boolean;
  users: User[];
}

export interface User {
  user: UserData;
}

export interface UserData {
  userId: string;
  fullName: string;
  email: string;
}

export default function ShareMedication() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [sharing, setSharing] = useState("");
  const [sharingsList, setSharingsList] = useState<User[]>([]);

  const createMedicationSharing = useCallback(
    async (payload: CreateMedicationSharing): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/${id}/share`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erro ao compartilhar medicamento");
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao compartilhar o medicamento!");
        console.log(e);
      }
    },
    [id],
  );

  const handleCreateSharing = async () => {
    if (sharing.length < 4 || !sharing.includes("@")) {
      Alert.alert("Preecha o email corretamente.");
      return;
    }
    await createMedicationSharing({ email: sharing });
    await listMedicationSharings();

    setSharing("");
  };

  const listMedicationSharings = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/${id}/share`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao listar compartilhamentos");

      const result = (await res.json()) as ListSharingsResult;
      setSharingsList(result.users);
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao listar compartilhamentos!");
      console.log(e);
    }
  }, [id]);

  const handleDeleteSharing = async (userId: string) => {
    Alert.alert(
      "Apagar compartilhamento?",
      "Usuário deixará de visualizar medicamento.",
      [
        {
          text: "Apagar",
          onPress: async () => {
            await deleteMedicationSharing({ userId });
            await listMedicationSharings();
          },
          style: "destructive",
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
    );
  };

  const deleteMedicationSharing = useCallback(
    async (payload: DeleteMedicationSharing): Promise<void> => {
      try {
        const token = await getToken();
        const res = await fetch(`${env.BASE_URL}/medication/${id}/share`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erro ao apagar compartilhamento");
      } catch (e) {
        Alert.alert("Erro", "Houve um erro ao apagar compartilhamento!");
        console.log(e);
      }
    },
    [id],
  );

  useEffect(() => {
    (async () => {
      await listMedicationSharings();
    })();
  }, [listMedicationSharings]);

  return (
    <Background>
      <View>
        <BackButton />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Compartilhar Medicamento</Text>
        <Text style={styles.info}>
          Informe o email do usuário com quem você quer que visualize esse
          medicamento
        </Text>
      </View>
      <TextField
        value={sharing}
        onChangeText={setSharing}
        placeholder="email@example.com"
      />
      <ButtonPrimary title="Compartilhar" onPress={handleCreateSharing} />
      <Text style={styles.subtitle}>Usuários Compartilhados</Text>
      {sharingsList.length === 0 ? (
        <View>
          <Text style={styles.noUsersText}>Nenhum usuário compartilhado.</Text>
        </View>
      ) : (
        <FlatList
          data={sharingsList}
          keyExtractor={(item) => item.user.userId}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <View>
                <Text style={styles.name}>{item.user.fullName}</Text>
                <Text style={styles.email}>{item.user.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteSharing(item.user.userId)}
              >
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    paddingVertical: 16,
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
  },
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    opacity: 0.85,
    gap: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  email: {
    fontSize: 14,
  },
  noUsersText: {
    opacity: 0.7,
    padding: 4,
  },
});
