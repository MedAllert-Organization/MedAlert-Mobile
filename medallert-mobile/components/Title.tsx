import Colors from "@/constants/Colors";
import type { ReactNode } from "react";
import { StyleSheet, Text, type TextProps, type TextStyle } from "react-native";

type Props = TextProps & {
  children: ReactNode;
  style?: TextStyle;
  testID?: string;
};

export default function Title({ children, style, testID, ...rest }: Props) {
  return (
    <Text
      testID={testID}
      accessibilityRole="header"
      style={[styles.title, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
    color: Colors["light"].tint,
  },
});
