import { useState } from "react";
import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";
import LinkText from "@/components/LinkText";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextField from "@/components/TextField";
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";
import Background from "@/components/Background";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams();
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const router = useRouter();

  const { confirmAccount, isLoading } = useAuth();

  const handleConfirmation = async () => {
    if (!confirmationCode) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      await confirmAccount({ email: email as string, code: confirmationCode });
      router.push("/");
    } catch {
      Alert.alert("Houve um erro na confirmação da conta.");
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Title>MedAllert</Title>
          <Subtitle>
            Informe o código enviado por email para continuar.
          </Subtitle>

          <TextField
            placeholder="Código"
            placeholderTextColor="#999"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ButtonPrimary
            title="Confirmar"
            onPress={handleConfirmation}
            loading={isLoading}
          />

          <LinkText
            onPress={() => router.push("/create-account")}
            disabled={isLoading}
          >
            Não possui uma conta?
          </LinkText>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
});
