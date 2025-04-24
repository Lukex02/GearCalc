import * as React from "react";
import { BottomNavigation, Text } from "react-native-paper";
import Home from "@views/Home";
import Account from "@views/account/AccountScreen";

const BottomNav = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Nhà", focusedIcon: "home", unfocusedIcon: "home-outline" },
    { key: "account", title: "Nhà", focusedIcon: "account", unfocusedIcon: "account-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    account: Account,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomNav;
