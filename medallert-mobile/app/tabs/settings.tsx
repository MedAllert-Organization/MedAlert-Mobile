import Background from "@/components/Background";
import { DeleteButton } from "@/components/DeleteButton";
import env from "@/config/env";
import Colors from "@/constants/Colors";
import { getToken } from "@/providers/auth-provider";
import styles from "@/utils/styles";
import { router } from "expo-router";
import { useCallback } from "react";
import { Alert, Text, useColorScheme, View } from "react-native";

export default function Settings() {
  const deleteAccount = useCallback(async (): Promise<void> => {
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
      console.log(e);
    }
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Apagar conta",
      "Sua conta e todos os seus dados serão apagados de forma permanente e irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Apagar",
          style: "destructive",
          onPress: deleteAccount,
        },
      ],
    );
  }, [deleteAccount]);

  const deleteSharedTreatments = useCallback(async (): Promise<void> => {
    try {
      const token = await getToken();
      const res = await fetch(`${env.BASE_URL}/medication/shared`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao apagar compartilhamentos");
    } catch (e) {
      Alert.alert("Erro", "Houve um erro ao apagar compartilhamentos");
      console.log(e);
    }
  }, []);

  const handleDeleteSharedTreatments = useCallback(() => {
    Alert.alert(
      "Apagar Compartilhamentos",
      "Outros usuários deixarão de acessar tratamentos e medicamentos compartilhados.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Apagar",
          style: "destructive",
          onPress: deleteSharedTreatments,
        },
      ],
    );
  }, [deleteSharedTreatments]);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <Background>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Configurações</Text>
      </View>

      <DeleteButton
        title="Apagar Compartilhamentos"
        onPress={handleDeleteSharedTreatments}
      />
      <DeleteButton title="Apagar Conta" onPress={handleDeleteAccount} />
    </Background>
  );
}
