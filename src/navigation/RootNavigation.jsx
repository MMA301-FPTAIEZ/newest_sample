import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
