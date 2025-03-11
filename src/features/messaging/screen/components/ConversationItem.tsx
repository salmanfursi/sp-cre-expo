import moment from "moment";
import {
    View,
    Text,
    Image,
    FlatList,
    Pressable,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Dimensions,
  } from "react-native";
  import { FontAwesome } from "@expo/vector-icons";

const ConversationItem = ({ item, handleSelectConversation }) => {
    const isMessageSeen = item.messagesSeen;

    // Calculate time left for response
    const lastCustomerMessageTime = item.lastCustomerMessageTime;
    let timeLeftText = "";
    if (lastCustomerMessageTime) {
      const now = moment();
      const lastMsgTime = moment(lastCustomerMessageTime);
      const elapsed = now.diff(lastMsgTime);
      const total24h = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeLeftMs = total24h - elapsed;
      timeLeftText =
        timeLeftMs > 0 ? moment.utc(timeLeftMs).format("HH:mm") : "Expired";
    }
  
    // Get profile picture URL safely, handling potential localhost references
    const profilePictureUrl = item.pageInfo?.pageProfilePicture
      ? item.pageInfo.pageProfilePicture.replace(
          /localhost|127.0.0.1/g,
          "192.168.0.112"
        )
      : "https://via.placeholder.com/35";
  
      const truncateText = (name) => {
        const nameString = name.toString().trim();
        if (nameString?.length > 12) {
          const truncated = nameString?.slice(0, 12) + "...";
          return truncated;
        }
        return nameString;
      };


  
    return (
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e5e5",
          width: 'auto', // Explicitly set width to screen width
        }}
        // onPress={() => handleSelectConversation(item._id)}
        onPress={handleSelectConversation}
      >
        {/* Page Profile Picture */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 28,
            overflow: "hidden",
            borderWidth: isMessageSeen ? 0 : 2,
            borderColor: "#046289", // primary color
          }}
        >
          <Image
            source={{ uri: profilePictureUrl }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
  
        {/* Main Info */}
        <View style={{ marginLeft: 6, flex: 1 }}>
          {/* Name, Time Left, and Status */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: isMessageSeen ? "#6b7280" : "#046289",
                fontWeight: isMessageSeen ? "normal" : "bold",
              }}
            >
              {truncateText(item.name)}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap:2 }}>
              {lastCustomerMessageTime && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {timeLeftText !== "Expired" && (
                    <FontAwesome
                      name="clock-o"
                      size={12}
                      color={timeLeftText === "Expired" ? "#941F1F" : "#046289"}
                    />
                  )}
                  <Text
                    style={{
                      fontSize: 12,
                      color: timeLeftText === "Expired" ? "#941F1F" : "#046289",
                      fontWeight: timeLeftText === "Expired" ? "bold" : "normal",
                      marginLeft: 4,
                    }}
                  >
                    {timeLeftText}
                  </Text>
                </View>
              )}
              {item.status && (
                <Text
                  style={{
                    fontSize: 10,
                    color: "white",
                    backgroundColor: "#046289",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    width: 80
                  }}
                >
                  {item.status}
                </Text>
              )}
              {item.creName && (
                <Image
                  source={{ uri: item.creName.profilePicture }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#046289",
                  }}
                />
              )}
            </View>
          </View>
  
          {/* Last Message and Time */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: isMessageSeen ? "#6b7280" : "#046289",
                fontWeight: isMessageSeen ? "normal" : "bold",
                flex: 1,
                marginRight: 12,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage}
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              {moment(item.lastMessageTime).fromNow()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

    export default ConversationItem;