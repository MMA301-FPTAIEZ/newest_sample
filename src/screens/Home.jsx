import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useAppContext } from "../provider/AppProvider";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from "../provider/StorageProvider";

const Home = () => {
  const { models } = useAppContext()
  const { storageData, addStorageData, removeStorageData } = useStorageContext()
  const [designer, setDesigner] = useState("")
  const navigation = useNavigation();

  const designers = new Set(models?.map(model => model.designer))
  const filteredModels = models?.filter(model => !designer || model.designer === designer).sort((a, b) => b.foldingTime - a.foldingTime)

  const handleNavigateToModelDetail = (model) => {
    navigation.navigate("ModelDetail", { model })
  }

  const handleAddToFavorite = async (model) => {
    await addStorageData(model);
  }

  return (
    <View>
      <FlatList
        data={Array.from(designers)}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10, minHeight: 300 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            if (designer === item) {
              setDesigner("")
            } else {
              setDesigner(item)
            }
          }} style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            width: "40%",
            borderRadius: 15,
            margin: 2,
            backgroundColor: designer === item ? "#ddd" : "#fff"
          }}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
      />

      <ScrollView style={{ marginVertical: 10 }}
      >
        {filteredModels?.map((model, index) => (
          <View key={index} style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            width: "100%",
            borderRadius: 15,
            margin: 2,
          }}>
            <TouchableOpacity onPress={() => handleNavigateToModelDetail(model)}>
              <Text style={{
                fontSize: 24,
                fontWeight: 700
              }}>{model.modelName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToModelDetail(model)}>
              <Text>{model.imageUri}</Text>
            </TouchableOpacity>
            <Text>{model.progress * 100}%</Text>
            <Text>{model.isSingleSheet ? "Single Sheet" : "Not Single Sheet"}</Text>
            <TouchableOpacity onPress={() => handleAddToFavorite(model)}
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                width: "40%",
                borderRadius: 15,
                margin: 2,
                backgroundColor: storageData?.some(item => item.id === model.id) ? "#f00" : "#0f0"
              }}
            >
              <Text>
                {storageData?.some(item => item.id === model.id) ? "Added to Favorite" : "Add to Favorite"}
              </Text>
            </TouchableOpacity>
          </View>
        ))
        }
      </ScrollView >
    </View >
  );
};

export default Home;
