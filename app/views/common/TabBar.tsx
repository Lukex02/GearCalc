import React, { useEffect } from "react";
import { View, TouchableOpacity, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
import { Colors } from "@/src/style/Colors";

export default function TabBar({ state, descriptors, navigation }: any) {
  const { width } = Dimensions.get("window");
  const tabWidth = width / state.routes.length;
  const offset = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    offset.value = withTiming(state.index * tabWidth, { duration: 250 });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#121212",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        height: scale(60),
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            height: 2,
            width: tabWidth / 3,
            marginHorizontal: tabWidth / 3,
            backgroundColor: Colors.border.accent,
            bottom: verticalScale(15),
            borderRadius: 10,
          },
          indicatorStyle,
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: "home" | "book" | "account" = "home";
        if (route.name === "catalog") iconName = "book";
        else if (route.name === "account") iconName = "account";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={25}
              color={isFocused ? Colors.border.accent : Colors.unselected}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
