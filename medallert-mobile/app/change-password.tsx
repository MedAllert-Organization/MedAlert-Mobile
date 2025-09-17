import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../constants/Colors";
import { useAuth } from "@/providers/auth-provider";

export default function ChangePassword() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [recoveryCode, setRecoveryCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { changePassword, isLoading } = useAuth();

  const handleChangePassword = () => {
    if (!recoveryCode) {
      Alert.alert("Erro", "Preencha o seu código!");
      return;
    }
    try {
      changePassword({ email, newPassword, code: recoveryCode });
      router.push("/login");
    } catch {
      Alert.alert("Houve um erro ao mudar a senha da conta.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "#61AEF0",
          colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
          colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2",
        ]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={[styles.title, { color: theme.tint }]}>MedAllert</Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Informe o código enviado para {email ?? "o seu email"}.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Código"
              placeholderTextColor="#999"
              value={recoveryCode}
              onChangeText={setRecoveryCode}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Sua nova senha"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Recuperar conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/create-account")}
              disabled={isLoading}
            >
              <Text style={[styles.forgotLink, { color: theme.tint }]}>
                Não possui uma conta? Cadastre-se
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              disabled={isLoading}
            >
              <Text style={[styles.forgotLink, { color: theme.tint }]}>
                Entrar na sua conta
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  button: {
    height: 50,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotLink: {
    textAlign: "center",
    marginTop: 10,
  },
});
