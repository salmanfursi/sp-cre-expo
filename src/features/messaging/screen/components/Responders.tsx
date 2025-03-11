// import React, { useState } from "react";
// import {
//   TextInput,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   Platform,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// // import DocumentPicker from 'react-native-document-picker';
// import * as DocumentPicker from "expo-document-picker";

// import RNFS from "react-native-fs";

// import {
//   useSendMessageMutation,
//   useSendFileMessageMutation,
// } from "../../../../redux/message/messageApi";
// import RNBlobUtil from "react-native-blob-util";

// const Responders = ({ leadId }) => {
//   const [message, setMessage] = useState("");
//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const [sendFileMessage, { isLoading: isFileLoading }] =
//     useSendFileMessageMutation();

//   // Handle text message send
//   const handleSendMessage = async () => {
//     console.log('sendmessage isTextLoading',isLoading);
//     if (message.trim() === "") return;
//     try {
//       await sendMessage({
//         leadId,
//         messageType: "text",
//         content: { text: message },
//       }).unwrap();

//       setMessage(""); // Clear input after sending
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       Alert.alert("Error", "Failed to send message");
//     }
//   };

//   const handleAttachFile = async () => {
//     try {
//       // Pick a file using Expo Document Picker
//       const file = await DocumentPicker.getDocumentAsync({
//         type: "*/*", // Allow all file types
//         copyToCacheDirectory: true, // Required for proper file handling
//         multiple: false, // Ensure only one file is picked
//       });

//       if (file.canceled) {
//         console.log("User canceled document picking.");
//         return;
//       }

//       const pickedFile = file.assets[0]; // Expo returns an array of files

//       console.log("Picked file:", pickedFile);

//       // Validate file size (Max 10MB)
//       if (pickedFile.size > 10 * 1024 * 1024) {
//         Alert.alert("Error", "File size exceeds 10MB");
//         return;
//       }

//       // Create FormData
//       const formData = new FormData();
//       formData.append("file", {
//         uri: pickedFile.uri, // Use Expo's file URI
//         name: pickedFile.name,
//         type: pickedFile.mimeType || "application/octet-stream", // Ensure a valid type
//       });

//       // Send File API Call
//       const response = await sendFileMessage({
//         leadId,
//         file: formData,
//       }).unwrap();

//       Alert.alert("Success", "File sent successfully");
//     } catch (error) {
//       console.error("File upload error:", error);
//       Alert.alert("Error", `Failed to upload file: ${error.message}`);
//     }
//   };

//   return (
//     <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
//       {/* Attach File Icon */}
//       <TouchableOpacity
//         className="px-2 py-2 rounded-full"
//         onPress={handleAttachFile}
//         disabled={isFileLoading}
//       >
//         <Text className={`${isFileLoading} ? text-gray-400 : text-cyan-600`}>
//           <Icon
//             name="attach-file"
//             size={24}
//             // color={isFileLoading ? "#A0AEC0" : "bg-cyan-600"}
//           />
//         </Text>
//       </TouchableOpacity>

//       {/* Mic Icon */}
//       <TouchableOpacity className="px-2 py-2 rounded-full ">
//         <Text className="text-cyan-600">
//           <Icon name="mic" size={24} />
//         </Text>
//       </TouchableOpacity>

//       {/* Text Input */}
//       <TextInput
//         className="flex-1 h-10 border text-gray-600 font-sans border-gray-300 rounded-full px-4 mr-2"
//         placeholder="Type a message..."
//         value={message}
//         onChangeText={setMessage}
//       />

//       {/* Send Button */}
//       <TouchableOpacity
//         className="px-2 py-2 rounded-full  "
//         onPress={handleSendMessage}
//         disabled={isLoading} // Disable button when sending
//       >
//         <Text className={`${isLoading} ? text-gray-400 : text-cyan-600`}>
//           {/* <Text className={`text-blue-500`}> */}
//           <Icon name="send" size={24} />
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Responders;





























// jsut image not send everything is correct

import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Animated,
  ActivityIndicator,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as DocumentPicker from 'expo-document-picker';

import {
  useSendMessageMutation,
} from "../../../../redux/message/messageApi";

import {
  useUploadFileMutation,
} from "../../../../redux/upload/upload"; // Corrected upload API import

const Responders = ({ leadId }) => {
  console.log('DocumentPicker--->',DocumentPicker)
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [uploadFile] = useUploadFileMutation();
  const scrollViewRef = useRef(null);

  // 📌 Auto-scroll when messages update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 📌 Function to show a toast/snackbar for errors
  const showErrorToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    Animated.timing(toastOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowToast(false));
      }, 3000);
    });
  };

  // 📌 Handle text message send
  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    try {
      const response = await sendMessage({
        leadId,
        messageType: "text",
        content: { text: message },
      }).unwrap();

      setMessages((prev) => [...prev, { ...response, local: true }]); // Add to UI instantly
      setMessage(""); // Clear input
    } catch (error) {
      console.error("Failed to send message:", error);
      showErrorToast("Failed to send message.");
    }
  };

  // 📌 Handle file selection
  const handleAttachFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (file.canceled) return;
      const pickedFile = file.assets[0];

      if (pickedFile.size > 10 * 1024 * 1024) {
        showErrorToast("File size exceeds 10MB.");
        return;
      }

      setSelectedFile(pickedFile);
    } catch (error) {
      console.error("File selection error:", error);
      showErrorToast("Failed to select a file.");
    }
  };

  // 📌 Handle file uploading
  const handleUploadFile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || "application/octet-stream",
      });

      const response = await uploadFile(formData).unwrap();
console.log('uploadfile log',response?.fileUrl);
      if (response?.fileUrl) {
        await handleSendFileMessage(response.fileUrl);
      } else {
        showErrorToast("File upload failed.");
      }
    } catch (error) {
      console.error("File upload error:", error);
      showErrorToast("Failed to upload file.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  // 📌 Send the message after uploading the file
  const handleSendFileMessage = async (fileUrl) => {
    try {
      const response = await sendMessage({
        leadId,
        messageType: "file",
        content: { urls: [fileUrl] },
      }).unwrap();
console.log('handleSendFileMessage images',response);
      setMessages((prev) => [...prev, { ...response, local: true }]); // Add to UI instantly
      // Alert.alert("Success", "File sent successfully");
    } catch (error) {
      console.error("Failed to send file message:", error);
      showErrorToast("Failed to send file message.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
      className="bg-white border-t border-gray-200 p-2"
    >
      {selectedFile && (
        <View className="flex-row items-center bg-gray-100 p-2 rounded">
          <Text className="text-gray-800 mr-2 flex-1">{selectedFile.name}</Text>
          <TouchableOpacity onPress={() => setSelectedFile(null)}>
            <Icon name="close" size={20} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row items-center bg-white p-2 rounded-full border border-gray-300">
        <TouchableOpacity onPress={handleAttachFile} disabled={isUploading}>
          <Icon name="attach-file" size={24} color={isUploading ? "gray" : "#177591"} />
        </TouchableOpacity>

        <TextInput
          className="flex-1 px-3 text-gray-700"
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          editable={!isLoading && !isUploading}
        />

        <TouchableOpacity
          onPress={selectedFile ? handleUploadFile : handleSendMessage}
          disabled={isLoading || isUploading}
        >
          {isLoading || isUploading ? (
            <ActivityIndicator size="small" color="#177591" />
          ) : (
            <Icon name="send" size={24} color="#177591" />
          )}
        </TouchableOpacity>
      </View>

      {showToast && (
        <Animated.View
          style={{
            opacity: toastOpacity,
            position: "absolute",
            top: 50,
            left: 10,
            right: 10,
            zIndex: 999,
          }}
          className="bg-red-600 p-3 rounded-md"
        >
          <Text className="text-white text-sm">{toastMessage}</Text>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};

export default Responders;


















































// import React, { useState, useEffect, useRef } from "react";
// import {
//   TextInput,
//   Text,
//   TouchableOpacity,
//   View,
//   Alert,
//   ScrollView,
//   Animated,
//   ActivityIndicator,
//   Easing,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";

// import * as DocumentPicker from "expo-document-picker";

// import {
//   useSendMessageMutation,
// } from "../../../../redux/message/messageApi";

// import {
//   useUploadMultipleImagesMutation, // Use the correct mutation for image uploads
// } from "../../../../redux/upload/upload"; 

// const Responders = ({ leadId }) => {
//   const [message, setMessage] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const toastOpacity = useRef(new Animated.Value(0)).current;

//   const [sendMessage, { isLoading }] = useSendMessageMutation();
//   const [uploadMultipleImages] = useUploadMultipleImagesMutation();
//   const scrollViewRef = useRef(null);

//   // 📌 Auto-scroll when messages update
//   useEffect(() => {
//     scrollViewRef.current?.scrollToEnd({ animated: true });
//   }, [messages]);

//   // 📌 Function to show a toast/snackbar for errors
//   const showErrorToast = (message) => {
//     setToastMessage(message);
//     setShowToast(true);
//     Animated.timing(toastOpacity, {
//       toValue: 1,
//       duration: 200,
//       useNativeDriver: true,
//       easing: Easing.out(Easing.quad),
//     }).start(() => {
//       setTimeout(() => {
//         Animated.timing(toastOpacity, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: true,
//         }).start(() => setShowToast(false));
//       }, 3000);
//     });
//   };

//   // 📌 Handle text message send
//   const handleSendMessage = async () => {
//     if (message.trim() === "") return;
//     try {
//       const response = await sendMessage({
//         leadId,
//         messageType: "text",
//         content: { text: message },
//       }).unwrap();

//       setMessages((prev) => [...prev, { ...response, local: true }]); // Add to UI instantly
//       setMessage(""); // Clear input
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       showErrorToast("Failed to send message.");
//     }
//   };

//   // 📌 Handle image selection
//   const handleAttachImage = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: "image/*", // Only allow image selection
//         copyToCacheDirectory: true,
//         multiple: false, // expo-document-picker doesn't support multiple selection
//       });
  
//       if (result.canceled) {
//         console.log("User canceled document picking.");
//         return;
//       }
  
//       const pickedFile = result.assets[0]; // Extract the selected file
  
//       setSelectedImages([
//         {
//           uri: pickedFile.uri,
//           name: pickedFile.name || `image.jpg`,
//           type: pickedFile.mimeType || "image/jpeg",
//         },
//       ]);
//     } catch (error) {
//       console.error("Error selecting images:", error);
//       showErrorToast("Failed to select images.");
//     }
//   };

//   // 📌 Handle image uploading
//   const handleUploadImages = async () => {
//     if (selectedImages.length === 0) return;

//     try {
//       setIsUploading(true);

//       const formData = new FormData();
//       selectedImages.forEach((image) => {
//         formData.append("images", {
//           uri: image.uri,
//           name: image.name,
//           type: image.type,
//         });
//       });

//       const response = await uploadMultipleImages(formData).unwrap();
//       console.log("Uploaded images response:", response);

//       if (response?.fileUrls) {
//         await handleSendImageMessage(response.fileUrls);
//       } else {
//         showErrorToast("Image upload failed.");
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//       showErrorToast("Failed to upload images.");
//     } finally {
//       setIsUploading(false);
//       setSelectedImages([]);
//     }
//   };

//   // 📌 Send the message after uploading images
//   const handleSendImageMessage = async (fileUrls) => {
//     try {
//       const response = await sendMessage({
//         leadId,
//         messageType: "image",
//         content: { urls: fileUrls },
//       }).unwrap();

//       console.log("Image message sent:", response);

//       setMessages((prev) => [...prev, { ...response, local: true }]); // Add to UI instantly
//       Alert.alert("Success", "Image sent successfully");
//     } catch (error) {
//       console.error("Failed to send image message:", error);
//       showErrorToast("Failed to send image message.");
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}
//       className="bg-white border-t border-gray-200 p-2"
//     >
//       {selectedImages.length > 0 && (
//         <ScrollView horizontal className="flex-row items-center bg-gray-100 p-2 rounded">
//           {selectedImages.map((image, idx) => (
//             <View key={idx} className="relative mr-3">
//               <Text className="text-gray-800 mr-2 flex-1">{image.name}</Text>
//               <TouchableOpacity onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}>
//                 <Icon name="close" size={20} color="red" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       )}

//       <View className="flex-row items-center bg-white p-2 rounded-full border border-gray-300">
//         <TouchableOpacity onPress={handleAttachImage} disabled={isUploading}>
//           <Icon name="photo" size={24} color={isUploading ? "gray" : "#06b6d4"} />
//         </TouchableOpacity>

//         <TextInput
//           className="flex-1 px-3 py-2 text-gray-700"
//           placeholder="Type a message..."
//           value={message}
//           onChangeText={setMessage}
//           editable={!isLoading && !isUploading}
//         />

//         <TouchableOpacity
//           onPress={selectedImages.length > 0 ? handleUploadImages : handleSendMessage}
//           disabled={isLoading || isUploading}
//         >
//           {isLoading || isUploading ? (
//             <ActivityIndicator size="small" color="#06b6d4" />
//           ) : (
//             <Icon name="send" size={24} color="#06b6d4" />
//           )}
//         </TouchableOpacity>
//       </View>

//       {showToast && (
//         <Animated.View
//           style={{
//             opacity: toastOpacity,
//             position: "absolute",
//             top: 50,
//             left: 10,
//             right: 10,
//             zIndex: 999,
//           }}
//           className="bg-red-600 p-3 rounded-md"
//         >
//           <Text className="text-white text-sm">{toastMessage}</Text>
//         </Animated.View>
//       )}
//     </KeyboardAvoidingView>
//   );
// };

// export default Responders;
