import Background from "@/components/Background";
import { DeleteButton } from "@/components/DeleteButton";
import env from "@/config/env";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
  Modal,
  FlatList,
} from "react-native";
import { getToken } from "@/providers/auth-provider";

type Timezone = {
  id: string;
  name: string;
  label: string;
  utcOffset: number;
};

export default function Settings() {
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [currentTimezone, setCurrentTimezone] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  // ---------------------------------------
  // Buscar timezone atual do usuário
  // ---------------------------------------
  const fetchUser = useCallback(async () => {
    const token = await getToken();
    const res = await fetch(`${env.BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setCurrentTimezone(data.user?.timezone?.name ?? null);
  }, []);

  // ---------------------------------------
  // Buscar timezones disponíveis
  // ---------------------------------------
  const fetchTimezones = useCallback(async () => {
    const res = await fetch(`${env.BASE_URL}/timezone`);
    const data = await res.json();
    setTimezones(data.timezones ?? []);
  }, []);

  useEffect(() => {
    fetchUser();
    fetchTimezones();
  }, []);


  const updateTimezone = async (timezoneName: string) => {
    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/user/timezone`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ timezoneName }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar timezone");

      setCurrentTimezone(timezoneName);
      setModalVisible(false);

      Alert.alert("Sucesso", "Timezone atualizado!");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o timezone.");
    }
  };

  const deleteAccount = useCallback(async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/user/account`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao apagar a conta");

      router.replace("/login");
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao apagar a conta");
    }
  }, []);

  return (
    <Background>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Configurações
        </Text>
      </View>

   
      <TouchableOpacity
        style={{
          padding: 14,
          margin: 10,
          borderRadius: 10,
          backgroundColor: theme.background,
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Timezone atual:
        </Text>
        <Text style={{ color: theme.text, opacity: 0.7 }}>
          {currentTimezone ?? "Não definido"}
        </Text>
      </TouchableOpacity>

      <DeleteButton
        title="Apagar Compartilhamentos"
        onPress={() =>
          Alert.alert(
            "Apagar Compartilhamentos",
            "Deseja realmente remover os compartilhamentos?",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Apagar", style: "destructive", onPress: () => {} },
            ]
          )
        }
      />

      <DeleteButton title="Apagar Conta" onPress={deleteAccount} />


      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text
            style={{
              fontSize: 20,
              marginBottom: 20,
              fontWeight: "bold",
              color: theme.text,
            }}
          >
            Escolha seu timezone
          </Text>

          <FlatList
            data={timezones}
            keyExtractor={(t) => t.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderBottomWidth: 0.5,
                  borderColor: theme.text,
                }}
                onPress={() => updateTimezone(item.name)}
              >
                <Text style={{ color: theme.text, fontSize: 16 }}>
                  {item.label} (UTC {item.utcOffset / 60})
                </Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 10,
              backgroundColor: theme.tint,
            }}
            onPress={() => setModalVisible(false)}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontSize: 16 }}
            >
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Background>
  );
}
