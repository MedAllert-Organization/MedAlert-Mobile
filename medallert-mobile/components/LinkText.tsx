import Colors from "@/constants/Colors";
import type { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  type GestureResponderEvent,
  type TextProps,
  type TextStyle,
} from "react-native";

type Props = {
  children: ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: TextStyle;
  testID?: string;
} & Partial<TextProps>;

export default function LinkText({
  children,
  onPress,
  disabled,
  style,
  testID,
  ...rest
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      testID={testID}
      activeOpacity={0.8}
    >
      <Text style={[styles.link, style]} {...rest}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    textAlign: "center",
    marginTop: 10,
    color: Colors["light"].tint,
    fontSize: 14,
  },
});
