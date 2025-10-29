import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
} from "react-native";

type Props = Omit<TextInputProps, "style"> & {
  inputStyle?: TextStyle;
  testID?: string;
};

export default function TextField({
  inputStyle,
  secureTextEntry,
  testID,
  ...rest
}: Props) {
  return (
    <TextInput
      testID={testID}
      style={[styles.input, inputStyle]}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      autoCapitalize={
        Platform.OS === "ios"
          ? (rest.autoCapitalize ?? "none")
          : rest.autoCapitalize
      }
      autoCorrect={false}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
});
