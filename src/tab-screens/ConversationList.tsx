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

const ConversationList = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900 mr-2">
            Conversations
          </Text>
          <TouchableOpacity 
          onPress={()=> { 
            Alert.alert('dfdfdfdf')
           }}
          >
            <Image
              source={require("../assets/836.jpg")}
              className="flex w-16 h-16 rounded-full"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const limit = 100;
  const observerRef = useRef(null);

  const { data, error, isLoading, isFetching, refetch } =
    useGetAllConversationsQuery({
      page: currentPage,
      limit,
    });
  const lead = data?.leads;
  // console.log('sorted message',data?.leads.map(c => console.log(c)))

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
          // onError={() => console.log("Image load error:", profilePictureUrl)}
          // onLoad={() => console.log("Image loaded successfully:", profilePictureUrl)}
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

  if (isLoading && currentPage === 1) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-lg text-gray-500">Loading conversations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg text-red-500">
          Failed to load conversations.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-blue-400 p-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-white">Conversations</Text>
        {/* drop should appear bottom sheet modal ok  */}
        <Image
          source={require("../assets/836.jpg")}
          className="rounded-full h-10 w-10"
        />
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
    </View>
  );
};

export default ConversationList;
