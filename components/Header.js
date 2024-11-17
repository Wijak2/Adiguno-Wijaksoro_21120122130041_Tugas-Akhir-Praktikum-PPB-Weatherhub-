import { Text, View } from "react-native";

const Header = ({ headerText, flexPosition }) => {
    const flexPositionStyle = flexPosition ? flexPosition : "center";
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: flexPositionStyle,
                backgroundColor: '#63D2FF', // Warna ungu
                alignItems: "center",
                marginBottom: 16,
                marginTop: 32,
                width: "100%", // Lebar penuh layar
                paddingHorizontal: 16, // Memberikan padding kiri dan kanan
                paddingVertical: 8, // Memberikan padding atas dan bawah
            }}
        >
            <Text style={{
                marginRight: 8,
                fontSize: 18,
                fontWeight: "600",
                color: "black" // Mengubah warna teks menjadi putih agar kontras dengan latar belakang ungu
            }}>
                {headerText}
            </Text>
        </View>
    );
};

export default Header;
