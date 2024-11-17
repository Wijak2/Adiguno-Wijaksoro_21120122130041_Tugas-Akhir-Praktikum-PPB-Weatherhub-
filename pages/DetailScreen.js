import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import Header from "../components/Header";

function DetailScreen({ route }) {
  const { city, country, weather } = route.params || {}; // Menerima data dari route.params
  const [forecastData, setForecastData] = useState([]);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_KEY = "a07acda33e845e6c32f68feff440b49d"; // Ganti dengan API key Anda

  useEffect(() => {
    if (!city || !country) {
      console.log("City or Country is missing!"); // Log error jika parameter tidak ada
      setLoading(false); // Berhenti loading jika data tidak ada
    } else {
      fetchWeatherForecast();
    }
  }, [city, country]);

  const fetchWeatherForecast = () => {
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${API_KEY}&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "200") {
          setForecastData(data.list.slice(0, 5));
          fetchAirQuality(data.city.coord.lat, data.city.coord.lon);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching weather forecast:", error);
        setLoading(false);
      });
  };

  const fetchAirQuality = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        setAirQualityData(data.list[0]);
      })
      .catch((error) => {
        console.error("Error fetching air quality:", error);
      });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!forecastData || forecastData.length === 0 || !airQualityData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load weather and air quality data.</Text>
      </View>
    );
  }

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastTime}>{new Date(item.dt * 1000).toLocaleTimeString()}</Text>
      <Text style={styles.forecastTemp}>{item.main.temp}°C</Text>
      <Text style={styles.forecastDescription}>{item.weather[0].description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header headerText="Detail Cuaca" flexPosition="center" />

      <Text style={styles.title}>{city}, {country}</Text>

      {/* Weather forecast section */}
      <FlatList
        data={forecastData}
        renderItem={renderForecastItem}
        keyExtractor={(item) => item.dt.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Air quality section */}
      <View style={styles.airQualityContainer}>
        <Text style={styles.sectionTitle}>Air Quality</Text>
        <Text style={styles.airQualityText}>AQI: {airQualityData.main.aqi}</Text>
        <Text style={styles.airQualityText}>CO: {airQualityData.components.co} µg/m³</Text>
        <Text style={styles.airQualityText}>NO: {airQualityData.components.no} µg/m³</Text>
        <Text style={styles.airQualityText}>NO₂: {airQualityData.components.no2} µg/m³</Text>
        <Text style={styles.airQualityText}>O₃: {airQualityData.components.o3} µg/m³</Text>
        <Text style={styles.airQualityText}>PM₂.₅: {airQualityData.components.pm2_5} µg/m³</Text>
        <Text style={styles.airQualityText}>PM₁₀: {airQualityData.components.pm10} µg/m³</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  listContainer: {
    marginBottom: 20,
  },
  forecastItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  forecastTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  forecastTemp: {
    fontSize: 20,
    color: "tomato",
  },
  forecastDescription: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  airQualityContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  airQualityText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default DetailScreen;
