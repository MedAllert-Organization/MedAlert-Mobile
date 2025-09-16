// import
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

// funcao de login
export default function VerifyEmail() {
  const { email } = useLocalSearchParams();
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const { confirmAccount, isLoading } = useAuth();

  // tratamento de erro
  const handleConfirmation = () => {
    if (!confirmationCode) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    try {
      confirmAccount({ email: email as string, code: confirmationCode });
      router.push("/");
    } catch {
      Alert.alert("Houve um erro na confirmação da conta.");
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
              Informe o código enviado por email para continuar.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Código"
              placeholderTextColor="#999"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirmation}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/create-account")}
              disabled={isLoading}
            >
              <Text style={[styles.forgotLink, { color: theme.tint }]}>
                Não possui uma conta?
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
