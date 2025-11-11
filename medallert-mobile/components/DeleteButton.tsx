import type { TouchableOpacityProps } from "react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DeleteButtonProps = { title: string } & TouchableOpacityProps;

export function DeleteButton({ title, ...rest }: DeleteButtonProps) {
  return (
    <TouchableOpacity {...rest}>
      <View style={styles.deleteAccount}>
        <Text style={styles.deleteText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteAccount: {
    padding: 16,
    backgroundColor: "#ffe8ea",
    borderRadius: 8,
    marginTop: 8,
  },
  deleteText: {
    color: "#F45B69",
    fontWeight: "bold",
  },
});
