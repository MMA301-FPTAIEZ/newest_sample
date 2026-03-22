import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useAppContext } from "../provider/AppProvider";
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from "../provider/StorageProvider";

const Explore = () => {
    const { models } = useAppContext()
    const { storageData, addStorageData, removeStorageData } = useStorageContext()
    const navigation = useNavigation();

    const filteredModels = models?.filter(model => model.designer === "Traditional" && (model.foldingTime > 5 && model.foldingTime < 6 * 60) && model.colors.includes("Green")).sort((a, b) => {
        if (a.progress === b.progress) {
            return b.modelName.localeCompare(a.modelName)
        } else {
            return a.progress - b.progress
        }
    })

    const handleNavigateToModelDetail = (model) => {
        navigation.navigate("ModelDetail", { model })
    }

    const handleAddToFavorite = async (model) => {
        await addStorageData(model);
    }

    return (
        <View>
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

export default Explore;
