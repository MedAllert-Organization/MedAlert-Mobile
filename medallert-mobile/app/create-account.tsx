import { useState } from "react";
import {
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/providers/auth-provider";
import LinkText from "@/components/LinkText";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextField from "@/components/TextField";
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";
import Background from "@/components/Background";

export default function CreateAccount() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const router = useRouter();
  const { createAccount, isLoading } = useAuth();

  const handleCreateAccount = async () => {
    if (!email || !password || !phone || !fullName) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    // validações extras
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Erro", "Digite um e-mail válido!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      Alert.alert("Erro", "Digite apenas números no telefone!");
      return;
    }

    try {
      await createAccount({ email, password, phone, fullName });
      router.push({ pathname: "/verify-email", params: { email } });
    } catch {
      Alert.alert("Erro", "Houve um erro na criação da conta.");
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
          <Subtitle>Crie sua conta</Subtitle>

          <TextField
            placeholder="Nome Completo"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!isLoading}
            returnKeyType="next"
          />

          <TextField
            placeholder="Telefone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!isLoading}
            returnKeyType="next"
          />

          <TextField
            placeholder="E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="next"
          />

          <TextField
            placeholder="Senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            returnKeyType="done"
          />

          <ButtonPrimary
            title="Criar Conta"
            onPress={handleCreateAccount}
            loading={isLoading}
            disabled={isLoading}
            testID="create-account-button"
          />

          <LinkText onPress={() => router.push("/login")} disabled={isLoading}>
            Já possui uma conta?
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