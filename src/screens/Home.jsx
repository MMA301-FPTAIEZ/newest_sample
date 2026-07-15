import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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
  const { storageData, addStorageData, removeStorageData } = useStorageContext()


  const nations = [...new Set(foods.map((food) => food.nation))];
  const filteredFoods = foods
    ?.filter((food) => !selectedNation || food.nation === selectedNation)
    .sort((a, b) => b.calories - a.calories);

  const handleNationSelect = (nation) => {
    setSelectedNation(selectedNation === nation ? null : nation);
  };

  const handleNavigateToFoodDetail = (food) => {
    navigation.navigate("FoodDetail", { food })
  }

  const handleAddToFavorite = async (food) => {
    await addStorageData(food);
  }

  return (
    <FlatList
      data={filteredFoods}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <>
          <Text style={styles.sectionTitle}>Nations</Text>
          <FlatList
            data={nations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => {
              const isActive = selectedNation === item;
              return (
                <TouchableOpacity
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => handleNationSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Foods</Text>
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
                    removeStorageData(item.id);
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
});