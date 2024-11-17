import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import Header from "../components/Header";

const WeatherMapScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: -6.9669, // Koordinat Semarang
    longitude: 110.4194, // Koordinat Semarang
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const API_KEY = "a07acda33e845e6c32f68feff440b49d"; // Ganti dengan API Key Anda

  const fetchWeatherData = (latitude, longitude) => {
    setLoading(true);
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      )
      .then((response) => {
        const data = response.data;
        setWeatherData({
          latitude: data.coord.lat,
          longitude: data.coord.lon,
          city: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
          clouds: data.clouds.all, // Informasi awan
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      });
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setMapRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    fetchWeatherData(latitude, longitude); // Mendapatkan data cuaca untuk lokasi yang dipilih
  };

  useEffect(() => {
    // Mendapatkan cuaca untuk Semarang ketika komponen pertama kali dimuat
    fetchWeatherData(mapRegion.latitude, mapRegion.longitude);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>

    <Header headerText="Peta Cuaca" flexPosition="center" />  

      {/* Map */}
      <MapView
        style={styles.map}
        region={mapRegion} // Gunakan state region untuk mengatur peta
        onPress={handleMapPress} // Menangani press pada peta
        showsUserLocation={true} // Menampilkan lokasi pengguna (optional)
        followsUserLocation={true} // Mengikuti lokasi pengguna (optional)
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Selected Location"
            description={`Temperature: ${weatherData?.temperature}°C\nCondition: ${weatherData?.description}\nCloudiness: ${weatherData?.clouds}%`}
          />
        )}
      </MapView>

      {/* Weather Details */}
      {weatherData && selectedLocation && (
        <View style={styles.weatherDetails}>
          <Text style={styles.city}>{weatherData.city}</Text>
          <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
          <Text style={styles.description}>{weatherData.description}</Text>
          <Text style={styles.clouds}>Cloudiness: {weatherData.clouds}%</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "60%",
  },
  weatherDetails: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    width: "90%",
  },
  city: {
    fontSize: 20,
    fontWeight: "bold",
  },
  temperature: {
    fontSize: 30,
    color: "tomato",
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
  },
  clouds: {
    fontSize: 18,
    color: "#555",
  },
});

export default WeatherMapScreen;
