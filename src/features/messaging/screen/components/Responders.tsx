

import React, {useState} from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import DocumentPicker from 'react-native-document-picker';
import * as DocumentPicker from 'expo-document-picker';

import RNFS from 'react-native-fs';

import {
  useSendMessageMutation,
  useSendFileMessageMutation,
} from '../../../../redux/message/messageApi';
import RNBlobUtil from 'react-native-blob-util';
 
const Responders = ({leadId}) => {
  const [message, setMessage] = useState('');
  const [sendMessage, {isLoading: isTextLoading}] = useSendMessageMutation();
  const [sendFileMessage, {isLoading: isFileLoading}] =
    useSendFileMessageMutation();

  // Handle text message send
  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    try {
      await sendMessage({
        leadId,
        messageType: 'text',
        content: {text: message},
      }).unwrap();

      setMessage(''); // Clear input after sending
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };
  
  const handleAttachFile = async () => {
    try {
        // Pick a file using Expo Document Picker
        const file = await DocumentPicker.getDocumentAsync({
            type: '*/*', // Allow all file types
            copyToCacheDirectory: true, // Required for proper file handling
            multiple: false, // Ensure only one file is picked
        });

        if (file.canceled) {
            console.log('User canceled document picking.');
            return;
        }

        const pickedFile = file.assets[0]; // Expo returns an array of files

        console.log('Picked file:', pickedFile);

        // Validate file size (Max 10MB)
        if (pickedFile.size > 10 * 1024 * 1024) {
            Alert.alert('Error', 'File size exceeds 10MB');
            return;
        }

        // Create FormData
        const formData = new FormData();
        formData.append('file', {
            uri: pickedFile.uri, // Use Expo's file URI
            name: pickedFile.name,
            type: pickedFile.mimeType || 'application/octet-stream', // Ensure a valid type
        });

        // Send File API Call
        const response = await sendFileMessage({
            leadId,
            file: formData,
        }).unwrap();

        Alert.alert('Success', 'File sent successfully');
    } catch (error) {
        console.error('File upload error:', error);
        Alert.alert('Error', `Failed to upload file: ${error.message}`);
    }
};

  return (
    <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
      {/* Attach File Icon */}
      <TouchableOpacity
        className="px-2 py-2 rounded-full"
        onPress={handleAttachFile}
        disabled={isFileLoading}>
        <Icon
          name="attach-file"
          size={24}
          color={isFileLoading ? '#A0AEC0' : '#3B82F6'}
        />
      </TouchableOpacity>

      {/* Mic Icon */}
      <TouchableOpacity className="px-2 py-2 rounded-full text-blue-400">
        <Text className="text-blue-500">
          <Icon name="mic" size={24} />
        </Text>
      </TouchableOpacity>

      {/* Text Input */}
      <TextInput
        className="flex-1 h-10 border text-gray-600 font-sans border-gray-300 rounded-full px-4 mr-2"
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />

      {/* Send Button */}
      <TouchableOpacity
        className="px-2 py-2 rounded-full  "
        onPress={handleSendMessage}
        // disabled={isLoading} // Disable button when sending
      >
        {/* <Text className={`${isLoading }?  "text-blue-200 " : text-blue-400 `}> */}
        <Text className={`text-blue-500`}>
          <Icon name="send" size={24} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Responders;
