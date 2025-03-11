import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useGetAllConversationsQuery,
  useMarkAsSeenMutation,
} from "../redux/conversation/conversationApi";
import moment from "moment";
import { Avatar, Menu, Provider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/auth/authSlice";
import { StatusBar } from "expo-status-bar";
import ConversationFilter from "../features/messaging/screen/ConversationFilter";
import ConversationItem from "../features/messaging/screen/components/ConversationItem";

const ConversationList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const creId = user?._id;

  const [menuVisible, setMenuVisible] = useState(false);
  const [filters, setFilters] = useState({ statuses: [], creNames: [], pages: [] });
  const [filteredConversations, setFilteredConversations] = useState([]);

  const { data, error, isLoading, refetch } = useGetAllConversationsQuery({
    page: 1,
    limit: 500,
    creId,
  });

  

  const [markAsSeen] = useMarkAsSeenMutation();

  // ✅ Apply Filters Function
  useEffect(() => {
    if (!data?.leads) return;

    const applyFilters = () => {
      let updatedList = [...data.leads];

      if (filters.statuses.length > 0) {
        updatedList = updatedList.filter((item) => filters.statuses.includes(item.status));
      }

      if (filters.creNames.length > 0) {
        updatedList = updatedList.filter((item) => filters.creNames.includes(item.creName?._id));
      }

      if (filters.pages.length > 0) {
        updatedList = updatedList.filter((item) => filters.pages.includes(item.pageInfo?.pageId));
      }

      setFilteredConversations(updatedList);
    };

    applyFilters();
  }, [filters, data?.leads]);

  const handleSelectConversation = (selectedLeadId) => {
    navigation.navigate("inbox", { conversationId: selectedLeadId });
    markAsSeen({ id: selectedLeadId });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (error || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold text-gray-600 px-6">
          {error ? "Failed to load conversations. Please check your connection." : "Loading conversations..."}
        </Text>
        <ActivityIndicator size="large" color="#0000ff" />
        <TouchableOpacity onPress={refetch} className="mt-4 p-2 px-4 rounded bg-primary">
          <Text className="text-md font-bold text-white">Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
// console.log('filters---->',data.leads[0].messagesSeen)
   return (
    <Provider>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="auto" />

        {/* Header */}
        <View className="bg-cyan-600 px-4 py-1 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white mr-2">Conversations</Text>
          <Menu visible={menuVisible} onDismiss={() => setMenuVisible(false)} anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              {user && <Avatar.Image size={50} source={{ uri: user?.profilePicture || "https://via.placeholder.com/35" }} />}
            </TouchableOpacity>
          }>
            <Menu.Item onPress={() => navigation.navigate("profile")} title="Profile" leadingIcon={() => <Icon name="account-circle-outline" size={20} color="black" />} />
            <Menu.Item onPress={handleLogout} title="Logout" leadingIcon={() => <Icon name="logout" size={20} color="red" />} />
          </Menu>
        </View>

        {/* Filter Component */}
        <ConversationFilter availableFilters={data.filters} setFilters={setFilters} filters={filters} data={data} />

        {/* ✅ Pass Filtered Data to FlatList */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <ConversationItem
              item={item}
              handleSelectConversation={() => handleSelectConversation(item._id)}
            />
          )}
        />
      </SafeAreaView>
    </Provider>
  );
};

export default ConversationList;
