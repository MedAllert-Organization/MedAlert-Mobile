import Background from "@/components/Background";
import { DeleteButton } from "@/components/DeleteButton";
import env from "@/config/env";
import Colors from "@/constants/Colors";
import styles from "@/utils/styles";
import { router, useFocusEffect } from "expo-router";
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
import { getToken, useAuth } from "@/providers/auth-provider";

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
  const { logout, token } = useAuth();


  const fetchTimezones = useCallback(async () => {
    const res = await fetch(`${env.BASE_URL}/timezone`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTimezones(data.timezones ?? []);
  }, []);

  useEffect(() => {
    fetchTimezones();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentTimezone();
      fetchTimezones();
    }, [])
  );

  const fetchCurrentTimezone = useCallback(async () => {
    try {
      const res = await fetch(`${env.BASE_URL}/user/timezone/current`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Falha ao buscar timezone atual");

      const data = await res.json();
      setCurrentTimezone(data.timezone);

      console.log("Timezone atual:", data.timezone);
    } catch (err) {
      console.log("Erro ao buscar timezone atual:", err);
    }
  }, []);

  const updateUserTimezone = async (timezoneId: string) => {
    try {
      const token = await getToken();

      const res = await fetch(`${env.BASE_URL}/user/timezone/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ timezoneId }),
      }
      );

      if (!res.ok) throw new Error("Falha ao atualizar timezone");

      setCurrentTimezone(timezoneId);
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
        onPress={() => setModalVisible(true)
        }
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>
          Timezone atual:
        </Text>
        <Text style={{ color: theme.text, opacity: 0.7 }}>
          {currentTimezone ?? "Não definido"}
        </Text>
      </TouchableOpacity>

      <DeleteButton title="Sair da Conta" onPress={logout} />


      <DeleteButton
        title="Apagar Compartilhamentos"
        onPress={() =>
          Alert.alert(
            "Apagar Compartilhamentos",
            "Deseja realmente remover os compartilhamentos?",
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Apagar", style: "destructive", onPress: () => { } },
            ]
          )
        }
      />

      <DeleteButton title="Apagar Conta" onPress={deleteAccount} />


      <Modal visible={modalVisible} animationType="fade" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              maxHeight: "70%",
              backgroundColor: theme.background,
              borderRadius: 16,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                marginBottom: 16,
                fontWeight: "bold",
                color: theme.text,
                textAlign: "center",
              }}
            >
              Escolha seu Timezone
            </Text>

            <FlatList
              data={timezones}
              keyExtractor={(t) => t.id}
              contentContainerStyle={{ paddingBottom: 10 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    borderBottomWidth: 0.5,
                    borderColor: theme.text + "33",
                  }}
                  onPress={() => updateUserTimezone(item.id)}
                >
                  <Text style={{ color: theme.text, fontSize: 16 }}>
                    {item.label} (UTC {item.utcOffset})
                  </Text>
                </TouchableOpacity>
              )}
            />

            {/* Botão fechar */}
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
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </Background>
  );
}
