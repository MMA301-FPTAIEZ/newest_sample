import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Favorite from "../screens/Favorite";
import Gourmet from "../screens/Gourmet";
import FoodDetail from "../screens/FoodDetail";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="Favorite" component={Favorite} />
      <Tabs.Screen name="Gourmet" component={Gourmet} />
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
        <Stack.Screen name="FoodDetail" component={FoodDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
