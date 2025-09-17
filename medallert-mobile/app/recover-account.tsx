import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import LinkText from "@/components/LinkText";
import Subtitle from "@/components/Subtitle";
import TextField from "@/components/TextField";
import Title from "@/components/Title";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecoverAccount() {
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const { sendPasswordRecoveryCode, isLoading } = useAuth();

  const handleAccountRecovery = async () => {
    if (!email) {
      Alert.alert("Erro", "Preencha o seu email!");
      return;
    }
    try {
      await sendPasswordRecoveryCode({ email });
      router.push({ pathname: "/change-password", params: { email } });
    } catch {
      Alert.alert("Houve um erro ao enviar o código de recuperação.");
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
          <Subtitle>Inicie o processo de recuperacão de senha.</Subtitle>

          <TextField
            placeholder="E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ButtonPrimary
            title="Recuperar conta"
            loading={isLoading}
            onPress={handleAccountRecovery}
          />

          <LinkText
            onPress={() => router.push("/create-account")}
            disabled={isLoading}
          >
            Não possui uma conta? Cadastre-se
          </LinkText>

          <LinkText onPress={() => router.push("/login")} disabled={isLoading}>
            Entrar na sua conta
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
