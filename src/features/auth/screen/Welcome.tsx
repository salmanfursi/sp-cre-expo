

import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const Welcome = ({ onVerify }) => {
  const { width } = Dimensions.get("window");

  return (
    <View className="flex-1 bg-white justify-center items-center px-4 ">
        <StatusBar barstyle="auto" />
      {/* Logo Section */}
      <View className="justify-center items-center mb-12 mt-56">
        <Image
          source={require("./../../../assets/solutionprovider_logo-removebg-preview.png")}
          style={{
            width: width * 0.8,
            height: undefined,
            aspectRatio: 5.5,
          }}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text Section */}
      <View className="items-center mb-8">
        <Image
          source={require("./../../../assets/varify_your_identity.png")}
          style={{
            width: width * 0.5,
            height: undefined,
            aspectRatio: 3,
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        onPress={onVerify}
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("./../../../assets/varify_button.png")}
          style={{
            width: width * 0.7,
            height: undefined,
            aspectRatio: 3,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>

      {/* Footer Text */}
      <Text className="text-xs p-2 text-center text-sky-700 mt-4">
        © Solution Provider reserves all rights to this app under copyright law.
      </Text>
    </View>
  );
};

export default Welcome;
