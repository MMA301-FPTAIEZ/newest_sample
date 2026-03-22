import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useAppContext } from "../provider/AppProvider";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from "../provider/StorageProvider";

const Favorite = () => {
    const navigation = useNavigation();
    const { storageData, addStorageData, clearStorageData } = useStorageContext()

    const handleNavigateToModelDetail = (model) => {
        navigation.navigate("ModelDetail", { model })
    }

    const handleAddToFavorite = async (model) => {
        await addStorageData(model);
    }

    return (
        <View>
            <TouchableOpacity onPress={() => clearStorageData()}
                style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    width: "40%",
                    borderRadius: 15,
                    margin: 2,
                    backgroundColor: "#f00"
                }}
            >
                <Text style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fff"
                }}>Clear Favorite</Text>
            </TouchableOpacity>
            <ScrollView style={{ marginVertical: 10 }}
            >
                {storageData?.map((model, index) => (
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

export default Favorite;
