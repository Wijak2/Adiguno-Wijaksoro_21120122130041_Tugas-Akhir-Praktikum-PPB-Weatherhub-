import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert, TouchableOpacity, Image } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header"; // Sesuaikan path ini sesuai struktur proyek Anda

function HomeScreen({ route }) {
  const [country, setCountry] = useState("ID"); // Set default country ke "ID"
  const [city, setCity] = useState("Semarang"); // Set default city ke "Semarang"
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(route.params?.favorites || []);
  const navigation = useNavigation();
  const API_KEY = "a07acda33e845e6c32f68feff440b49d";

  useEffect(() => {
    if (route.params?.favorites) {
      setFavorites(route.params.favorites);
    }
  }, [route.params?.favorites]);

  useEffect(() => {
    fetchWeather(); // Fetch cuaca secara otomatis saat aplikasi pertama kali dibuka
  }, [country, city]);

  const countries = [
    { label: "United States", value: "US" },
    { label: "Indonesia", value: "ID" },
  ];

  const cities = {
    US: [{ label: "New York", value: "New York" }, { label: "Los Angeles", value: "Los Angeles" }],
    ID: [{ label: "Jakarta", value: "Jakarta" }, { label: "Surabaya", value: "Surabaya" }, { label: "Semarang", value: "Semarang" }],
  };

  const fetchWeather = () => {
    if (!city || !country) return;

    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      });
  };

  const handleNavigateToDetail = () => {
    navigation.navigate("Detail", { city, country });
  };

  const addToFavorites = () => {
    const newFavorite = { city, country };
    if (favorites.some((fav) => fav.city === city && fav.country === country)) {
      Alert.alert("Already a Favorite", `${city}, ${country} is already in your favorites.`);
    } else {
      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      navigation.setParams({ favorites: updatedFavorites });
      Alert.alert("Added to Favorites", `${city}, ${country} has been added to your favorites.`);
    }
  };

  const getBackgroundColor = (weatherCondition) => {
    switch (weatherCondition) {
      case 'Clear':
        return 'rgba(0, 255, 252, 0.5)'; // Warna cerah untuk cuaca cerah
      case 'Clouds':
        return 'rgba(200, 200, 200, 0.6)'; // Warna abu-abu untuk cuaca berawan
      case 'Rain':
        return 'rgba(0, 119, 190, 0.7)'; // Warna biru gelap untuk hujan
      case 'Snow':
        return 'rgba(255, 250, 250, 1)'; // Warna putih untuk salju
      case 'Thunderstorm':
        return 'rgba(80, 80, 180, 0.8)'; // Warna ungu gelap untuk badai
      case 'Drizzle':
        return 'rgba(173, 216, 230, 0.8)'; // Warna biru muda untuk gerimis
      default:
        return 'rgba(0, 255, 252, 0.5)'; // Warna default (biru muda) untuk kondisi cuaca lain
    }
  };

  return (
    <View style={[styles.container,]}>
      <Header headerText="Home" flexPosition="center" />

      <Text style={styles.title}>Pilih Lokasi</Text>

      <RNPickerSelect
        onValueChange={(value) => {
          setCountry(value);
          setCity(null);
          setWeather(null);
        }}
        items={countries}
        placeholder={{ label: "Select a country", value: null }}
        value={country} // Menambahkan default value untuk country
      />

      {country && (
        <RNPickerSelect
          onValueChange={(value) => {
            setCity(value);
            setWeather(null);
          }}
          items={cities[country] || []}
          placeholder={{ label: "Select a city", value: null }}
          value={city} // Menambahkan default value untuk city
        />
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {weather && (
        <TouchableOpacity style={[
          styles.weatherContainer,
          { backgroundColor: getBackgroundColor(weather.weather[0].main) },
        ]} onPress={handleNavigateToDetail}>
          <View style={styles.row}>
            <Text style={styles.temperature}>{weather.main.temp}°C</Text>
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
              }}
              style={styles.weatherIcon}
            />
          </View>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.detail}>ketuk untuk melihat detail</Text>
        </TouchableOpacity>
      )}


      <Button title="Add to Favorites" onPress={addToFavorites} disabled={!weather} />
      <Button title="Go to Favorites" onPress={() => navigation.navigate("Favorites", { favorites, setFavorites })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  weatherContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    paddingVertical: 90,
    padding: 40,
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  city: {
    fontSize: 32,
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 48,
    color: "tomato",
  },
  description: {
    fontSize: 24,
    fontStyle: "italic",
  },
});

export default HomeScreen;
