import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../provider/AppProvider';
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { useStorageContext } from '../provider/StorageProvider';

const StarRating = ({ rating, size = 16, color = '#FFC107' }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimal = rating - fullStars;
    const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
    const roundsUpToFull = decimal >= 0.75;
    const totalFull = roundsUpToFull ? fullStars + 1 : fullStars;

    for (let i = 0; i < 5; i++) {
        if (i < totalFull) {
            stars.push(<Ionicons key={i} name="star" size={size} color={color} />);
        } else if (i === totalFull && hasHalfStar) {
            stars.push(<Ionicons key={i} name="star-half" size={size} color={color} />);
        } else {
            stars.push(<Ionicons key={i} name="star-outline" size={size} color={color} />);
        }
    }

    return <View style={styles.starRow}>{stars}</View>;
};

const Home = () => {
    const { foods } = useAppContext();
    const navigation = useNavigation();
    const [selectedNation, setSelectedNation] = useState(null);
    const { storageData, addStorageData, removeStorageData, clearStorageData } = useStorageContext()


    const nations = [...new Set(foods.map((food) => food.nation))];
    const filteredFoods = foods
        ?.filter((food) => food.isVegetarian && food.rating >= 4.0 && food.calories > 800)
        .sort((a, b) => a.nation.charAt(0) - b.nation.charAt(0));

    const handleNationSelect = (nation) => {
        setSelectedNation(selectedNation === nation ? null : nation);
    };

    const handleNavigateToFoodDetail = (food) => {
        navigation.navigate("FoodDetail", { food })
    }

    const handleAddToFavorite = async (food) => {
        Alert.alert(
            'Add to Favorites',       // title
            'Are you sure you want to add this item to your favorites?', // message
            [
                {
                    text: 'Cancel',
                    style: 'cancel',           // gray/neutral button (iOS)
                    onPress: () => console.log('Cancelled'),
                },
                {
                    text: 'Add',
                    style: 'destructive',      // red text (iOS only)
                    onPress: async () => {
                        // your actual action here
                        await addStorageData(food);
                    },
                },
            ],

            { cancelable: true }           // tapping outside dismisses it (Android)
        );
    }

    const handleRemoveFromFavorite = async (food) => {
        Alert.alert(
            'Remove from Favorites',       // title
            'Are you sure you want to remove this item from your favorites?', // message
            [
                {
                    text: 'Cancel',
                    style: 'cancel',           // gray/neutral button (iOS)
                    onPress: () => console.log('Cancelled'),
                },
                {
                    text: 'Remove',
                    style: 'destructive',      // red text (iOS only)
                    onPress: async () => {
                        // your actual action here
                        await removeStorageData(food.id);
                    },
                },
            ],

            { cancelable: true }           // tapping outside dismisses it (Android)
        );
    }

    const handleClearFavorite = async (food) => {
        Alert.alert(
            'Clear Favorites',       // title
            'Are you sure you want to remove all items from your favorites?', // message
            [
                {
                    text: 'Cancel',
                    style: 'cancel',           // gray/neutral button (iOS)
                    onPress: () => console.log('Cancelled'),
                },
                {
                    text: 'Remove',
                    style: 'destructive',      // red text (iOS only)
                    onPress: async () => {
                        // your actual action here
                        await clearStorageData();
                    },
                },
            ],

            { cancelable: true }           // tapping outside dismisses it (Android)
        );
    }

    return (
        <FlatList
            data={filteredFoods}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
                <>
                    <Text style={styles.sectionTitle}>Gourmet Foods</Text>
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => handleClearFavorite()}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>
                            Clear All
                        </Text>
                    </TouchableOpacity>
                </>
            }
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <TouchableOpacity onPress={() => handleNavigateToFoodDetail(item)}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                    <View style={styles.cardBody}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => handleNavigateToFoodDetail(item)}>
                                <Text style={styles.foodName} numberOfLines={1}>
                                    {item.foodName}
                                </Text>
                            </TouchableOpacity>
                            {item.isVegetarian ? (
                                <View style={[styles.badge, styles.vegBadge]}>
                                    <Text style={styles.badgeText}>🌱 Veg</Text>
                                </View>
                            ) : (
                                <View style={[styles.badge, styles.nonVegBadge]}>
                                    <Text style={styles.badgeText}>🍖 Non-Veg</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.ratingRow}>
                            <StarRating rating={item.rating} />
                            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                        </View>

                        <View style={styles.caloriesRow}>
                            <Ionicons name="flame-outline" size={16} color="#FF7043" />
                            <Text style={styles.caloriesText}>{item.calories} kcal</Text>
                        </View>

                        <TouchableOpacity style={{ marginVertical: 10 }} activeOpacity={1}>
                            <Ionicons
                                name={storageData.some((food) => food.id === item.id) ? "heart" : "heart-outline"}
                                size={24}
                                color={storageData.some((food) => food.id === item.id) ? "#FF6B6B" : "#888"}
                                onPress={() => {
                                    if (storageData.some((food) => food.id === item.id)) {
                                        handleRemoveFromFavorite(item);
                                    } else {
                                        handleAddToFavorite(item);
                                    }
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View >
            )}
        />
    );
};

export default Home;

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
        backgroundColor: '#F7F7F8',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        marginTop: 10,
        marginLeft: 14,
        color: '#1A1A1A',
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    chipActive: {
        backgroundColor: '#1A1A1A',
        borderColor: '#1A1A1A',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    chipTextActive: {
        color: '#fff',
    },
    card: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 16,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardBody: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    foodName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    vegBadge: {
        backgroundColor: '#E8F5E9',
    },
    nonVegBadge: {
        backgroundColor: '#FFEBEE',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 6,
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    caloriesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caloriesText: {
        marginLeft: 4,
        fontSize: 13,
        color: '#666',
    },
    clearButton: {
        alignSelf: 'flex-end',
        marginRight: 14,
        marginBottom: 10,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#FF6B6B',
        borderRadius: 20,
    },
});