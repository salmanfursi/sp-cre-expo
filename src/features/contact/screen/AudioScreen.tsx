// import { View } from "react-native";
// import { Text, } from "react-native";

// const AudioScreen = () => {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Audio Tab</Text>
//         <Text className='text-green-700'>HistoryScreen</Text>
//       </View>
//     );
//   };
//   export default AudioScreen;
















import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const audioMessages = [
  { id: '1', sender: 'John', duration: '0:30', timestamp: '10:30 AM' },
  { id: '2', sender: 'You', duration: '1:15', timestamp: '11:45 AM' },
  { id: '3', sender: 'Sarah', duration: '0:45', timestamp: '2:20 PM' },
  { id: '4', sender: 'You', duration: '0:20', timestamp: '3:10 PM' },
  { id: '5', sender: 'Mike', duration: '2:00', timestamp: '5:30 PM' },
];

const AudioMessage = ({ item, isPlaying, onPlayPause }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 16,
      marginBottom: 8,
      borderRadius: 8,
    }}
  >
    {/* Sender Icon */}
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: item.sender === 'You' ? '#3b82f6' : '#d1d5db',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {item.sender[0]}
      </Text>
    </View>

    {/* Message Details */}
    <View style={{ flex: 1 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.sender}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        {/* Play/Pause Button */}
        <TouchableOpacity onPress={() => onPlayPause(item.id)}>
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
            color={item.sender === 'You' ? '#3b82f6' : '#4b5563'}
          />
        </TouchableOpacity>

        {/* Progress Bar */}
        <View
          style={{
            flex: 1,
            height: 4,
            backgroundColor: '#e5e7eb',
            marginHorizontal: 12,
            borderRadius: 2,
          }}
        >
          <View
            style={{
              width: '30%', // Static width for progress
              height: '100%',
              backgroundColor: item.sender === 'You' ? '#3b82f6' : '#9ca3af',
              borderRadius: 2,
            }}
          />
        </View>

        {/* Duration */}
        <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.duration}</Text>
      </View>
    </View>

    {/* Timestamp */}
    <Text style={{ fontSize: 12, color: '#9ca3af' }}>{item.timestamp}</Text>
  </View>
);

export default function AudioScreen() {
  const [playingId, setPlayingId] = useState(null); // Track which message is playing

  const handlePlayPause = (id) => {
    setPlayingId(playingId === id ? null : id); // Toggle play/pause
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* List of Audio Messages */}
      <FlatList
        data={audioMessages}
        renderItem={({ item }) => (
          <AudioMessage
            item={item}
            isPlaying={playingId === item.id}
            onPlayPause={handlePlayPause}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Recording Button */}
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        }}
      >
        <TouchableOpacity
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#3b82f6',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
          onPress={() => alert('Start recording (Static Action)')}
        >
          <Icon name="mic" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
