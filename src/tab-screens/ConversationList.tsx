import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
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
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/auth/authSlice";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "../hooks/useAuth";
import { getSocket } from "../hooks/getSocket";

const ConversationList = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
   const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const { user, token, loading } = useAuth();
const creId=user?._id
console.log('user creId----->',user,'loading',loading)


  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 100;
  const observerRef = useRef(null);

  const { data, error, isLoading, isFetching, refetch } =
    useGetAllConversationsQuery({
      page: currentPage,
      limit,
      creId
    });
  const lead = data?.leads;

 
const socket = getSocket();
console.log('is socket available',socket)

console.log('📡 Is socket available?', socket?.connected ? '✅ Yes' : '❌ No');

  const [markAsSeen] = useMarkAsSeenMutation();

  const handleLoadMore = useCallback(() => {
    if (!isFetching && !isLoading && currentPage < (data?.totalPages || 1)) {
      setIsFetchingMore(true);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, isLoading, currentPage, data]);

  const handleSelectConversation = (selectedLeadId) => {
    navigation.navigate("inbox", { conversationId: selectedLeadId, lead });
    // markAsSeen({id: selectedLeadId});
  };

  const renderItem = ({ item }) => {
    const profilePictureUrl = item.pageInfo.pageProfilePicture.replace(
      "localhost",
      "192.168.0.112"
    );

    return (
      <Pressable
        className="flex-row items-center p-4 border-b border-gray-200"
        onPress={() => handleSelectConversation(item._id)}
      >
        <Image
          source={{ uri: profilePictureUrl }}
          className="w-12 h-12 rounded-full mb-1"
         />

        <View className="flex-row items-center space-x-2"></View>

        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            {/* <Text className="text-xs text-gray-500">{formattedTime(item.lastMessageTime)}</Text> */}
            <Text className="text-xs text-gray-500">
              {moment(item.lastMessageTime).fromNow()}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mt-1">
            <Text
              className="text-sm text-gray-600 flex-1 mr-2"
              numberOfLines={1}
            >
              {item.sentByMe ? "You: " : ""}
              {item.lastMessage}
            </Text>
            {!item.messagesSeen && (
              <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs text-white font-bold">1</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  if (error || isLoading || !data?.leads) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold text-red-600 px-6">
          {error
            ? "Failed to load conversations. Please check your connection."
            : "No conversations found."}
        </Text>
  
        <View className="mt-4">
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text className="text-md text-red-500">
              {error?.error || "An error occurred. Please try again."}
            </Text>
          )}
        </View>
  
        <TouchableOpacity
          onPress={() => refetch()}
          disabled={isLoading} // Disable while loading
          className={`mt-4 p-2 px-4 rounded ${
            isLoading ? "bg-gray-400" : "bg-red-700"
          }`}
        >
          <Text className="text-md font-bold text-white">
            {isLoading ? "Reloading..." : "Reload"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Provider>
      <SafeAreaView className="flex-1 bg-white">
        {/* <View className="flex-row justify-between items-center px-4"> */}
        <View className="bg-cyan-600 px-4 py-1 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-white mr-2">
            Conversations
          </Text>

          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Avatar.Image
                  size={50}
                  source={{
                    uri:
                      user?.profilePicture ||
                      "https://via.placeholder.com/35",
                  }}
                />
              </TouchableOpacity>
            }
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <Menu.Item
              onPress={() => {
                // closeMenu();
                navigation.navigate('profile')
              }}
              title="Profile"
              titleStyle={{ color: "#000000" }}
              leadingIcon={() => (
                <Icon name="account-circle-outline" size={20} color="black" />
              )}
            />
            <Menu.Item
              onPress={() => {
                // closeMenu();
                handleLogout();
                // console.log('logout-->')
              }}
              title="Logout"
              titleStyle={{ color: "#000000" }}
              leadingIcon={() => <Icon name="logout" size={20} color="red" />}
            />
          </Menu>
        </View>

        <FlatList
          data={data?.leads}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore && <ActivityIndicator size="small" color="#4CAF50" />
          }
        />
      </SafeAreaView>
    </Provider>
  );
};

export default ConversationList;
