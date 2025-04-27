// // src/screens/HomeScreen.js
// import { Text, View, Button } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { setValue } from "../redux/homeSlice";
// import { db } from "../firebase/config";
// import { collection, getDocs } from "firebase/firestore";

// export default function HomeScreen() {
//   const dispatch = useDispatch();
//   const data = useSelector((state) => state.yourData.value);

//   const fetchData = async () => {
//     const querySnapshot = await getDocs(collection(db, "yourCollection"));
//     const items = [];
//     querySnapshot.forEach((doc) => {
//       items.push(doc.data());
//     });
//     dispatch(setValue(items));
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Button title="Load Data" onPress={fetchData} />
//       {data.map((item, index) => (
//         <Text key={index}>{JSON.stringify(item)}</Text>
//       ))}
//     </View>
//   );
// }
// src/screens/HomeScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  const handleStartLearning = () => {
    // Sau này sẽ dùng để điều hướng
    console.log("Bắt đầu học!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math For Kids 🧮</Text>
      <Button title="Bắt đầu học" onPress={handleStartLearning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff", // màu xanh nhạt
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
});
