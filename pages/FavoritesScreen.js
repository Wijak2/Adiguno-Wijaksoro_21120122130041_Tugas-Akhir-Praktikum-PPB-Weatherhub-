import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert, ActivityIndicator } from "react-native";
import Header from "../components/Header";

function FavoritesScreen({ route, navigation }) {
  const { favorites: initialFavorites, setFavorites: updateFavoritesInHome } = route.params;
  const [favorites, setFavorites] = useState(initialFavorites);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const API_KEY = "a07acda33e845e6c32f68feff440b49d";

  // Fetch weather data for a given city and country
  const fetchWeather = (city, country) => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData((prevState) => ({
          ...prevState,
          [`${city},${country}`]: data,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      });
  };

  // Fetch weather data for all favorite locations
  useEffect(() => {
    favorites.forEach((favorite) => {
      fetchWeather(favorite.city, favorite.country);
    });
  }, [favorites]);

  const removeFavorite = (city, country) => {
    Alert.alert(
      "Remove Favorite",
      `Are you sure you want to remove ${city}, ${country} from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const updatedFavorites = favorites.filter(
              (fav) => !(fav.city === city && fav.country === country)
            );
            setFavorites(updatedFavorites);
            updateFavoritesInHome(updatedFavorites);
            navigation.setParams({ favorites: updatedFavorites });
          },
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => {
    const weather = weatherData[`${item.city},${item.country}`];
    return (
      <View style={styles.favoriteItem}>
        <Text
          style={styles.city}
          onPress={() =>
            navigation.navigate("Detail", {
              city: item.city,
              country: item.country,
              weather,
            })
          }
        >
          {item.city}, {item.country}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          weather && (
            <View>
              <Text style={styles.temperature}>{weather.main.temp}°C</Text>
              <Text style={styles.description}>{weather.weather[0].description}</Text>
            </View>
          )
        )}
        <Button title="Remove" onPress={() => removeFavorite(item.city, item.country)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header headerText="Lokasi Favorit" flexPosition="center" />

      <Text style={styles.title}>Favorite Locations</Text>
      {favorites && favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No favorites added yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    width: "100%",
  },
  favoriteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  city: {
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  },
  temperature: {
    fontSize: 16,
    color: "tomato",
  },
  description: {
    fontSize: 14,
    fontStyle: "italic",
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});

export default FavoritesScreen;
