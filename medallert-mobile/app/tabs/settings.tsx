import { useColorScheme, ScrollView, Text, View, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/Colors";

export default function Settings() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#61AEF0", colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2", colorScheme === "dark" ? "#1a1a1a" : "#f2f2f2"]}
                style={{ flex: 1 }}
                >

            </LinearGradient>
        </View>
    );
}