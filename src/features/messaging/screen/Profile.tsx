
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const { user, loading } = useAuth();
const navigation=useNavigation()
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Cover Photo */}
      <View className="relative">
        <Image
          source={{ uri: user?.coverPhoto }}
          className="w-full h-40 object-cover"
        />
        {/* Profile Picture */}
        <View className="absolute left-4 bottom-[-30] rounded-full overflow-hidden border-4 border-white">
          <Image
            source={{ uri: user?.profilePicture }}
            className="w-20 h-20 rounded-full"
          />
        </View>
        <TouchableOpacity
        onPress={()=>{
            navigation.goBack()
        }}
        className="absolute left-2 top-2 rounded-md overflow-hidden border-4 border-cyan-800 bg-cyan-700">
          <Icon name="arrowleft" size={30} color="#fff" />;
        </TouchableOpacity>
      </View>

      <View className="p-4 mt-8">
        {/* Name & Role */}
        <Text className="text-xl font-bold text-gray-800">
          {user?.nameAsPerNID}
        </Text>
        <Text className="text-gray-500">{user?.type}</Text>

        {/* Contact Info */}
        <View className="mt-4">
          <Text className="text-gray-700">📧 {user?.email}</Text>
          <Text className="text-gray-700">📞 {user?.personalPhone}</Text>
          {user?.officePhone && (
            <Text className="text-gray-700">🏢 {user?.officePhone}</Text>
          )}
        </View>

        {/* Address */}
        <View className="mt-4">
          <Text className="text-gray-700">🏠 {user?.address}</Text>
        </View>

        {/* Department & Role */}
        <View className="mt-4">
          <Text className="text-gray-700 font-semibold">
            Department: {user?.departmentId}
          </Text>
          <Text className="text-gray-700 font-semibold">
            Role: {user?.roleId}
          </Text>
        </View>

        {/* Guardian Info */}
        {user?.guardian && (
          <View className="mt-6 p-3 bg-white shadow-sm rounded-lg">
            <Text className="text-lg font-semibold">Guardian Info</Text>
            <Text className="text-gray-700">👤 {user?.guardian.name}</Text>
            <Text className="text-gray-700">📞 {user?.guardian.phone}</Text>
            <Text className="text-gray-700">🛡 {user?.guardian.relation}</Text>
          </View>
        )}

        {/* Documents */}
        <View className="mt-6 p-3 bg-white shadow-sm rounded-lg">
          <Text className="text-lg font-semibold">Documents</Text>
          {Object.entries(user?.documents || {}).map(([key, value]) => (
            <Text key={key} className="text-gray-700">
              📜 {key}: {value ? "Uploaded" : "Not Provided"}
            </Text>
          ))}
        </View>

        {/* Status */}
        <View className="mt-4 p-2 rounded-lg bg-green-100">
          <Text className="text-green-700 font-semibold text-center">
            Status: {user?.status}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
