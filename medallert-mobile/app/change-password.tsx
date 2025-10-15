import Background from "@/components/Background";
import ButtonPrimary from "@/components/ButtonPrimary";
import LinkText from "@/components/LinkText";
import Subtitle from "@/components/Subtitle";
import TextField from "@/components/TextField";
import Title from "@/components/Title";
import { useAuth } from "@/providers/auth-provider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePassword() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [recoveryCode, setRecoveryCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const router = useRouter();

  const { changePassword, isLoading } = useAuth();

  const handleChangePassword = async () => {
    if (!recoveryCode) {
      Alert.alert("Erro", "Preencha o seu código!");
      return;
    }
    try {
      await changePassword({ email, newPassword, code: recoveryCode });
      router.push("/login");
    } catch {
      Alert.alert("Houve um erro ao mudar a senha da conta.");
    }
  };

  return (
    <Background>
      
          <Title>MedAllert</Title>
          <Subtitle>
            Informe o código enviado para {email ?? "o seu email"}.
          </Subtitle>

          <TextField
            placeholder="Código"
            placeholderTextColor="#999"
            value={recoveryCode}
            onChangeText={setRecoveryCode}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextField
            placeholder="Sua nova senha"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <ButtonPrimary
            title="Recuperar conta"
            loading={isLoading}
            onPress={handleChangePassword}
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
    </Background>
  );
}
