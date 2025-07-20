import { View, Text } from "react-native";

const Home = () => {
  return (
    <View>
      <Text>{process.env.EXPO_PUBLIC_TEST}</Text>
    </View>
  );
};

export default Home;
