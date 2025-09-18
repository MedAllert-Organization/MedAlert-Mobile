import Colors from "@/constants/Colors";
import type { ReactNode } from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

type Props = TextProps & {
  children: ReactNode;
  style?: TextStyle;
  testID?: string;
};

export default function Subtitle({ children, style, testID, ...rest }: Props) {
  return (
    <Text testID={testID} style={[styles.subtitle, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: Colors["light"].text,
  },
});
