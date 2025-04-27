import { View, Text } from "react-native";
import styles from "@style/MainStyle";

interface HeaderProp {
  leftIcon?: React.JSX.Element;
  rightIcon?: React.JSX.Element;
  title: string;
}

export default function Header({ leftIcon, rightIcon, title }: HeaderProp) {
  const headerStyle =
    leftIcon && !rightIcon
      ? styles.headerLeftIcon
      : !leftIcon && rightIcon
      ? styles.headerRightIcon
      : leftIcon && rightIcon
      ? styles.headerFullStyle
      : styles.headerNoIcon;

  return (
    <View style={headerStyle}>
      {leftIcon}
      <Text style={styles.pageTitle}>{title}</Text>
      {rightIcon}
    </View>
  );
}
