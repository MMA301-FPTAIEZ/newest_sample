import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../provider/AppProvider';
import { useStorageContext } from '../provider/StorageProvider';

const StarRating = ({ rating, size = 20, color = '#FFC107' }) => {
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

// Calories color-coding: 700-900 green (healthy), 901-1300 yellow (mild warning), >1300 red (strong warning)
const getCalorieStyle = (calories) => {
    if (calories <= 900) {
        return { bg: '#E8F5E9', text: '#2E7D32', label: 'Healthy' };
    } else if (calories <= 1300) {
        return { bg: '#FFF8E1', text: '#F9A825', label: 'Mild Warning' };
    } else {
        return { bg: '#FFEBEE', text: '#C62828', label: 'High Calorie' };
    }
};

const FoodDetail = ({ route }) => {
    const { food } = route.params;
    const { storageData, addStorageData, removeStorageData } = useStorageContext()

    const isFavorite = storageData?.some((f) => f.id === food.id);
    const calorieStyle = getCalorieStyle(food.calories);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View>
                <Image source={{ uri: food.imageUrl }} style={styles.image} resizeMode="cover" />
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => {
                        if (isFavorite) {
                            removeStorageData(food.id);
                        } else {
                            addStorageData(food);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={26}
                        color={isFavorite ? '#E53935' : '#1A1A1A'}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                    {food.isVegetarian ? (
                        <View style={[styles.badge, styles.vegBadge]}>
                            <Text style={styles.badgeText}>🌱 Veg</Text>
                        </View>
                    ) : (
                        <View style={[styles.badge, styles.nonVegBadge]}>
                            <Text style={styles.badgeText}>🍖 Non-Veg</Text>
                        </View>
                    )}
                </View>

                {food.nation && (
                    <View style={styles.nationRow}>
                        <Ionicons name="location-outline" size={16} color="#888" />
                        <Text style={styles.nationText}>{food.nation}</Text>
                    </View>
                )}

                <View style={styles.ratingRow}>
                    <StarRating rating={food.rating} />
                    <Text style={styles.ratingText}>{food.rating.toFixed(1)} / 5.0</Text>
                </View>

                <View style={styles.divider} />

                {/* Calories - color coded by range */}
                <View style={[styles.calorieCard, { backgroundColor: calorieStyle.bg }]}>
                    <Ionicons name="flame" size={26} color={calorieStyle.text} />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={[styles.calorieValue, { color: calorieStyle.text }]}>
                            {food.calories} kcal
                        </Text>
                        <Text style={[styles.calorieLabel, { color: calorieStyle.text }]}>
                            {calorieStyle.label}
                        </Text>
                    </View>
                </View>

                {food.foodDescription && (
                    <>
                        <View style={styles.divider} />
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.description}>{food.foodDescription}</Text>
                    </>
                )}

                <TouchableOpacity
                    style={[styles.favoriteBar, isFavorite && styles.favoriteBarActive]}
                    onPress={() => {
                        if (isFavorite) {
                            removeStorageData(food.id);
                        } else {
                            addStorageData(food);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite ? '#fff' : '#1A1A1A'}
                    />
                    <Text style={[styles.favoriteBarText, isFavorite && styles.favoriteBarTextActive]}>
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default FoodDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F8',
    },
    image: {
        width: '100%',
        height: 280,
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#fff',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    content: {
        backgroundColor: '#fff',
        marginTop: -24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    foodName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
    },
    vegBadge: {
        backgroundColor: '#E8F5E9',
    },
    nonVegBadge: {
        backgroundColor: '#FFEBEE',
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    nationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    nationText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#888',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 18,
    },
    calorieCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
    },
    calorieValue: {
        fontSize: 17,
        fontWeight: '700',
    },
    calorieLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#555',
        lineHeight: 21,
    },
    favoriteBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#1A1A1A',
    },
    favoriteBarActive: {
        backgroundColor: '#E53935',
        borderColor: '#E53935',
    },
    favoriteBarText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    favoriteBarTextActive: {
        color: '#fff',
    },
});