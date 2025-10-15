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
import LinkText from "@/components/LinkText";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextField from "@/components/TextField";
import Title from "@/components/Title";
import Subtitle from "@/components/Subtitle";
import Background from "@/components/Background";
import env from "@/config/env";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      console.log(env.BASE_URL)
      await login({ email, password });
      router.push("/tabs/initial");
    } catch (e) {
      console.error(e);
      Alert.alert("Houve um erro durante o login.");
    }
  };

  return (
    <Background style={styles.container}>
 
          <Title>MedAllert</Title>
          <Subtitle>Bem-vindo! Faça login para continuar.</Subtitle>

          <TextField
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="email-input"
          />

          <TextField
            placeholder="Senha"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <ButtonPrimary
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            testID="login-button"
          />

          <LinkText
            onPress={() => router.push("/create-account")}
            disabled={isLoading}
          >
            Não possui uma conta? Cadastre-se
          </LinkText>

          <LinkText
            onPress={() => router.push("/recover-account")}
            disabled={isLoading}
          >
            Esqueceu a sua senha?
          </LinkText>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});
