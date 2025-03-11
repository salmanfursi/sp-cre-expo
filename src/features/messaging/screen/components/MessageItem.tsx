import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Audio, Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

// Function to determine file type based on URL
const getFileTypeFromURL = (url) => {
    if (!url) return null;
  
    try {
      // ✅ Special case for Messenger voice messages (even if they are .mp4)
      if (url.includes("audioclip")) {
        return "audio";
      }
  
      // ✅ Extract actual file extension
      const cleanUrl = url.split("?")[0]; // Remove query parameters
      const extensionMatch = cleanUrl.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
  
      if (extensionMatch) {
        const extension = extensionMatch[1].toLowerCase();
  
        // ✅ Map extensions to correct file types
        const extensionToType = {
          jpg: "image",
          jpeg: "image",
          png: "image",
          gif: "image",
          mp4: "video",
          mov: "video",
          avi: "video",
          mp3: "audio",
          wav: "audio",
          ogg: "audio",
        };
  
        return extensionToType[extension] || null;
      }
  
      return null;
    } catch (error) {
      console.error("Error extracting file type:", error);
      return null;
    }
  };


const MessageItem = ({ message }) => {
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const soundRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);

  // const formattedDate = moment(message.date).format("hh:mm A");
  // const formattedDate = moment(message.date, "MMMM D, YYYY h:mm A").format("hh:mm A");
  const formattedDate = moment(message.date, [
    moment.ISO_8601,
    "MMMM D, YYYY h:mm A"
  ]).format("hh:mm A");
  

// console.log('formatteddate',message.date)
  // Check for media URLs
  const fileUrls = message?.fileUrl || [];

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Handle Audio Play/Pause
  const handlePlayAudio = async (url) => {
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync({ uri: url });
        soundRef.current = sound;
        await sound.playAsync();
        setIsPlaying(true);
        setLoading(false);

        // Stop when the audio is finished
        sound.setOnPlaybackStatusUpdate((status) => {
          setPlaybackStatus(status);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        maxWidth: "75%",
        padding: 10,
        marginVertical: 4,
        borderRadius: 8,
        alignSelf: message.sentByMe ? "flex-end" : "flex-start",
        backgroundColor: message.sentByMe ? "#DCF8C6" : "#FFFFFF",
      }}
    >
      {/* Render Media Messages */}
      {fileUrls.length > 0 ? (
        fileUrls.map((url, index) => {
          const fileType = getFileTypeFromURL(url);

          if (fileType === "audio") {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePlayAudio(url)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 10,
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Ionicons
                    name={isPlaying ? "pause-circle" : "play-circle"}
                    size={32}
                    color="black"
                  />
                )}
                <Text style={{ marginLeft: 8 }}>Voice Message</Text>
              </TouchableOpacity>
            );
          } else if (fileType === "video") {
            return (
              <View
                key={index}
                style={{
                  width: 200,
                  height: 120,
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "black",
                }}
              >
                <Video
                  ref={videoRef}
                  source={{ uri: url }}
                  style={{ width: "100%", height: "100%" }}
                  useNativeControls
                  resizeMode="contain"
                  shouldPlay={false}
                />
              </View>
            );
          } else if (fileType === "image") {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setImageModalVisible(true)}
              >
                <Image
                  source={{ uri: url }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}
                />

                {/* Full Screen Image Modal */}
                <Modal
                  visible={isImageModalVisible}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setImageModalVisible(false)}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.9)",
                    }}
                    activeOpacity={1}
                    onPress={() => setImageModalVisible(false)}
                  >
                    <Image
                      source={{ uri: url }}
                      style={{
                        width: "90%",
                        height: "90%",
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                </Modal>
              </TouchableOpacity>
            );
          }
          return null;
        })
      ) : (
        // Render Text Message
        <Text style={{ fontSize: 16, color: "#333" }}>
          {message.content || "👍"}
        </Text>
      )}

      {/* Message Timestamp */}
      <Text style={{ fontSize: 12, color: "gray", textAlign: "right", marginTop: 5 }}>
        {formattedDate}
      </Text>
    </View>
  );
};

export default MessageItem;












