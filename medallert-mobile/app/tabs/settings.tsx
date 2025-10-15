import { useColorScheme, ScrollView, Text, View, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";
import Background from "@/components/Background";

export default function Settings() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
           <Background>
            <Text>Configurações</Text>
            </Background>
    );
}