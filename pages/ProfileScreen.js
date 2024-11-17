import React from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import Header from "../components/Header";

function ProfileScreen({ navigation }) {
  const username = "Bron Jame"; // Ganti dengan username yang relevan

  return (
    <View style={styles.container}>
      <Header headerText="Profil" flexPosition="center" />
      
      <View style={styles.containerProfile}>
        <Image
          source={{ uri: "https://i.ytimg.com/vi/yE7wTJFzrWA/sddefault.jpg" }} // Ganti dengan URL gambar profil Anda
          style={styles.profileImage}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  containerProfile:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75, // Membuat gambar menjadi lingkaran
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ProfileScreen;
