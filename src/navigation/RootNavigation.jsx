import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Favorite from "../screens/Favorite";
import Explore from "../screens/Explore";
import ModelDetail from "../screens/ModelDetail";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Favorite" component={Favorite} />
      <Tabs.Screen name="Explore" component={Explore} />
    </Tabs.Navigator>
  );
};

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Tabs"
          component={BottomTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="ModelDetail" component={ModelDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
