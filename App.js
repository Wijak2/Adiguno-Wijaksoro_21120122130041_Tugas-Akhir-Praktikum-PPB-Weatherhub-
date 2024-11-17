import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Octicons } from "@expo/vector-icons";
import HomeScreen from "./pages/HomeScreen";
import ProfileScreen from "./pages/ProfileScreen";
import DetailScreen from "./pages/DetailScreen";
import FavoritesScreen from "./pages/FavoritesScreen";
import WeatherMapScreen from "./pages/WeatherMapScreen";
import Header from "./components/Header";

const BottomTabNavigator = createBottomTabNavigator();
const StackNavigator = createStackNavigator();

export default function App() {
  const [favorites, setFavorites] = useState([]);

  const MainTabNavigator = () => (
    <BottomTabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          display: "flex",
          alignItems: "center",
          backgroundColor: '#63D2FF',
          borderWidth: 0,
          borderColor: "lightgray",
          marginHorizontal: 0,
          borderRadius: 0,
          height: 84,
          marginBottom: 0,
          paddingTop: 20,
          shadowOpacity: 0,
          elevation: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "person";
          } else if (route.name === "WeatherMap") {
            iconName = "globe";
          }
          color = focused ? "black" : "lightgray";
          return <Octicons name={iconName} size={24} color={color} />;
        },
        headerShown: false,
      })}
    >
      <BottomTabNavigator.Screen name="Home" component={HomeScreen} />
      <BottomTabNavigator.Screen name="WeatherMap" component={WeatherMapScreen} />
      <BottomTabNavigator.Screen name="Profile" component={ProfileScreen} />
    </BottomTabNavigator.Navigator>
  );

  return (
    <NavigationContainer>
      <StackNavigator.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tab Navigator */}
        <StackNavigator.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Stack screens */}
        <StackNavigator.Screen
          name="Detail"
          component={DetailScreen}
        />

        <StackNavigator.Screen
          name="Favorites"
          component={FavoritesScreen}
          initialParams={{ favorites, setFavorites }}
        />
        
      </StackNavigator.Navigator>
    </NavigationContainer>
  );
}
