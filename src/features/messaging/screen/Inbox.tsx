import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  useGetConversationMessagesQuery,
  useGetSingleLeadQuery,
} from "../../../redux/conversation/conversationApi";
import Icon from "react-native-vector-icons/MaterialIcons";
import MeetingBottomSheet from "./components/InboxMeetingSheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import InboxCallSheet from "./components/InboxCallSheet";
import InfoSidebar from "./components/infobar.tsx/InfoSidebar";
import { StatusBar } from "expo-status-bar";
import Responders from "./components/Responders";
import MessageItem from "./components/MessageItem";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Inbox() {
  const bottomSheetRef = useRef(null);
  const callSheetRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId } = route.params;

  const { data: lead } = useGetSingleLeadQuery(conversationId, {
    skip: !conversationId,
  });
  const { data: conversation, isLoading, error } =
    useGetConversationMessagesQuery(conversationId);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (conversation?.messages) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const openCallSheet = () => {
    callSheetRef.current?.present();
  };

  const closeCallSheet = () => {
    callSheetRef.current?.dismiss();
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const handleCallSelect = (phoneNumber) => {
    console.log("Selected number:", phoneNumber);
  };

  if (isLoading) {
    return (
      <View className="flex-1 gap-2 items-center justify-center">
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="bg-green-500 text-white text-center p-2 rounded-md">
            Loading messages...
          </Text>
        </Pressable>
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="bg-black text-white text-center p-2 rounded-md">
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <Text className="text-red-500 text-center mt-4">
        Error: {error?.message}
      </Text>
    );
  }

  const sortedMessages = conversation?.messages
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderMessage = ({ item }) => <MessageItem message={item} />;

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <BottomSheetModalProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <InfoSidebar
          isOpen={isSidebarOpen}
          onOpen={openSidebar}
          onClose={closeSidebar}
          conversationId={conversationId}
        >
          <StatusBar style="auto" />
          <View className="flex-1 bg-gray-200">
            <View className="bg-cyan-600 p-2 flex-row justify-between">
              <View className="flex-row gap-2 items-center">
                <Text
                  onPress={() => navigation.goBack()}
                  className="text-2xl font-bold text-white"
                >
                  <Icon name="arrow-back" size={24} />
                </Text>
                {/* <Image
                      source={{ uri: dynamicImageUrl }}

                  className="rounded-full h-10 w-10"
                /> */}
                <View className="flex-col item-center">
                  <Text
                    className="font-bold text-lg text-white"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {lead?.name}
                  </Text>
                  <Text className="text-sm">{lead?.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <Icon
                  name="call"
                  size={24}
                  color="#fff"
                  onPress={openCallSheet}
                />
                <Icon
                  name="event"
                  size={24}
                  color="#fff"
                  onPress={openBottomSheet}
                />
                <Icon
                  name="info"
                  size={24}
                  color="#fff"
                  onPress={() => setIsSidebarOpen(true)}
                />
              </View>
            </View>
            <FlatList
              ref={flatListRef}
              data={sortedMessages}
              keyExtractor={(item) => item.messageId}
              renderItem={renderMessage}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 10,
              }}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />
            <Responders leadId={conversationId} />
          </View>
          <InboxCallSheet
            ref={callSheetRef}
            lead={lead}
            onCallSelect={handleCallSelect}
            onClose={closeCallSheet}
          />
          <MeetingBottomSheet
            ref={bottomSheetRef}
            onClose={closeBottomSheet}
          />
        </InfoSidebar>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}
