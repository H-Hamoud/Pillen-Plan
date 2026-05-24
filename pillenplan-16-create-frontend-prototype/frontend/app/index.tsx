import { Link } from "expo-router";
import { Button, Text, View } from "react-native";
import Overview from "./screens/overview";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Overview></Overview>
    </View>
    
  );
}
