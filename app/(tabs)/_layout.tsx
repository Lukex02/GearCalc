import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeTab from "./home";
import CatalogTab from "./catalog";
import AccountTab from "./account";
import TabBar from "@/views/common/TabBar";

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="catalog" component={CatalogTab} />
      <Tab.Screen name="account" component={AccountTab} />
    </Tab.Navigator>
  );
}
