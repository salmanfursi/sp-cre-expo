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
import { useGetConversationMessagesQuery } from "../../../redux/conversation/conversationApi";
import Icon from "react-native-vector-icons/MaterialIcons";
// import Responders from "./components/Responders";
import MeetingBottomSheet from "./components/InboxMeetingSheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import InboxCallSheet from "./components/InboxCallSheet";
import InfoSidebar from "./components/infobar.tsx/InfoSidebar";
import moment from "moment";
import { StatusBar } from 'expo-status-bar';
import Responders from "./components/Responders";

export default function Inbox() {
  const bottomSheetRef = useRef(null);
  const callSheetRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openCallSheet = () => {
    console.log("call sheet opening ", callSheetRef.current);
    callSheetRef.current?.present();
  };

  const closeCallSheet = () => {
    callSheetRef.current?.dismiss();
  };
  //will be remove letter
  const leadData = {
    name: "John Doe",
    status: "Active Lead",
    avatar: "optional_avatar_url",
    phoneNumbers: [
      { type: "Mobile", number: "+1 (555) 123-4567" },
      { type: "Work", number: "+1 (555) 987-6543" },
    ],
  };

  const handleCallSelect = (phoneNumber: string) => {
    // Implement call logic
    console.log("Selected number:", phoneNumber);
  };

  const openBottomSheet = () => {
    console.log("Opening Bottom Sheet");
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    console.log("Closing Bottom Sheet");
    bottomSheetRef.current?.dismiss();
  };

  const navigation = useNavigation();
  const route = useRoute();
  const { conversationId, lead } = route.params;
  // console.log("inobox conversationId-------->",conversationId)
  // console.log('leads in inbox to send infobar-->', lead);
  const flatListRef = useRef(null);

  const leads = lead?.find((l) => l?._id === conversationId);
  // Fetch conversation messages using RTK Query
  const {
    data: conversation,
    isLoading,
    error,
    refetch,
  } = useGetConversationMessagesQuery(conversationId);

  // Scroll to the bottom whenever new messages are loaded
  useEffect(() => {
    if (conversation?.messages) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  // Handle loading state
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-center mt-4">
          Loading messages...
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text className="bg-red-600 text-white text-center border p-2">
            Loading messages...
          </Text>
        </Pressable>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Text className="text-red-500 text-center mt-4">
        Error: {error?.message}
      </Text>
    );
  }
  // Sort messages from oldest to newest (ascending order)
  const sortedMessages = conversation?.messages
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log("Last message:", sortedMessages[sortedMessages?.length - 1]);

  const renderMessage = ({ item }) => {
    const formattedDate = moment(item.date, "MMMM D, YYYY h:mm A").isValid()
      ? moment(item.date, "MMMM D, YYYY h:mm A").format("hh:mm A") // Format properly
      : moment().format("hh:mm A"); // Fallback to current time if invalid

    return (
      <View
        className={`max-w-3/4 rounded-lg px-3 py-2 my-1 ${
          item.sentByMe ? "bg-green-100 self-end" : "bg-white self-start"
        }`}
      >
        {/* <Text className="text-base text-gray-800">{item.content}</Text> */}
        <Text className="text-base text-gray-800">
          {item.content !== "" ? item.content : "👍"}
        </Text>

        {/* <Text className="text-xs text-gray-500 text-right mt-1">
        {new Date(item.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
         })}
      </Text> */}
        <Text className="text-xs text-gray-500 text-right mt-1">
          {formattedDate}
        </Text>
      </View>
    );
  };

  const truncateText = (name) => {
    const nameString = name.toString().trim();
    if (nameString?.length > 12) {
      const truncated = nameString?.slice(0, 12) + "...";
      console.log("Truncated name:", truncated);
      return truncated;
    }
    return nameString;
  };

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
            <View className="bg-blue-400 p-2 flex-row justify-between">
              <View className="flex-row gap-2 items-center ">
                <Text
                  onPress={() => navigation.goBack()}
                  className="text-2xl font-bold text-white"
                >
                  <Icon name="arrow-back" size={24} />
                </Text>
                <Image
                  source={require("../../../assets/836.jpg")}
                  className="rounded-full h-10 w-10"
                />
                <View className="flex-col item-center">
                  <Text
                    className="font-bold text-lg text-white "
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {truncateText(leads?.name)}
                  </Text>
                  <Text className="text-sm ">{leads?.status}</Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <Icon
                  name="call"
                  size={24}
                  color="#fff"
                  onPress={openCallSheet} // Add this to open the call sheet
                />
                <Icon
                  name="event"
                  onPress={() => {
                    openBottomSheet();
                  }}
                  size={24}
                  color="#fff"
                />
                <Icon
                  onPress={() => {
                    setIsSidebarOpen(true);
                  }}
                  name="info"
                  size={24}
                  color="#fff"
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
            // lead={leads}
            lead={leadData} //will remove
            onCallSelect={handleCallSelect} //will remove
            onClose={closeCallSheet}
          />

          {/* Meeting Bottom Sheet */}
          <MeetingBottomSheet ref={bottomSheetRef} onClose={closeBottomSheet} />
        </InfoSidebar>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}
