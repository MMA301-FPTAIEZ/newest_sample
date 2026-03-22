import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { useStorageContext } from "../provider/StorageProvider";

const ModelDetail = ({ route }) => {
    const { model } = route.params;
    const { storageData, addStorageData, removeStorageData } = useStorageContext()

    const convertMinutesToHours = (minutes) => {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        const convertedHours = hours === 0 ? "" : `${hours} hour${hours > 1 ? "s" : ""}`;
        const convertedMinutes = remainingMinutes === 0 ? "" : `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`;

        return `${convertedHours} ${convertedMinutes}`.trim();
    }

    const handleAddToFavorite = async (model) => {
        if (storageData?.some(item => item.id === model.id)) {
            await removeStorageData(model.id);
        } else {
            await addStorageData(model);
        }
    }

    return (
        <View style={{
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            width: "100%",
            borderRadius: 15,
            margin: 2,
        }}>
            <Text style={{
                fontSize: 24,
                fontWeight: 700
            }}>{model.modelName}</Text>
            <Image source={{ uri: model.imageUri }} style={{ width: 200, height: 200 }} />
            <Text>{model.progress * 100}%</Text>
            <Text>{model.difficulty}</Text>
            <Text>{convertMinutesToHours(model.foldingTime)}</Text>

            <FlatList data={model.colors} keyExtractor={(item, index) => index.toString()} horizontal renderItem={({ item }) => (
                <View style={{
                    padding: 5,
                    borderWidth: 1,
                    borderColor: "#ccc",
                    width: "auto",
                    borderRadius: 15,
                    margin: 2,
                }}>
                    <Text>{item}</Text>
                </View>
            )} />

            <Text>{model.designer}</Text>

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
    );
};

export default ModelDetail;
