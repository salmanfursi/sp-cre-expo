

import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InboxCallSheetProps {
  lead: {
    name: string;
    status: string;
    avatar?: string;
    phoneNumbers: Array<{
      type: string;
      number: string;
    }>;
  };
  onClose?: () => void;
  onCallSelect?: (phoneNumber: string) => void;
}

const InboxCallSheet = forwardRef<BottomSheetModal, InboxCallSheetProps>(
  ({ lead, onClose, onCallSelect }, ref) => {
    const [activeTab, setActiveTab] = useState('history');
    const [selectedNumber, setSelectedNumber] = useState<string | null>(null);

    const snapPoints = ['85%'];

    const callHistoryData = [
      {
        id: '1',
        date: 'Jan 15, 2024',
        time: '10:30 AM',
        duration: 5,
        type: 'outbound'
      },
      {
        id: '2',
        date: 'Jan 10, 2024',
        time: '02:15 PM',
        duration: 3,
        type: 'inbound'
      },
      // Add more sample history items to test scrolling
      ...Array(10).fill(null).map((_, index) => ({
        id: `${index + 3}`,
        date: `Jan ${9 - index}, 2024`,
        time: '02:15 PM',
        duration: 3,
        type: 'inbound'
      }))
    ];

    const callRecordingsData = [
      {
        id: '1',
        date: 'Jan 15, 2024',
        duration: '5:23',
        fileUrl: 'path/to/recording'
      },
      // Add more sample recordings to test scrolling
      ...Array(10).fill(null).map((_, index) => ({
        id: `${index + 2}`,
        date: `Jan ${14 - index}, 2024`,
        duration: '5:23',
        fileUrl: 'path/to/recording'
      }))
    ];

    const renderCallHistoryItem = ({ item }) => (
      <View className='flex-row items-center bg-white p-4 mb-2 rounded-lg'>
        <View className='flex-1'>
          <Text className='text-base font-bold'>
            {item.date} - {item.time}
          </Text>
          <Text className='text-gray-500'>
            {item.type === 'outbound' ? 'Outbound' : 'Inbound'} Call - {item.duration} min
          </Text>
        </View>
        <View 
          className={`w-3 h-3 rounded-full ${
            item.type === 'outbound' 
              ? 'bg-green-500' 
              : item.type === 'inbound' 
              ? 'bg-blue-500' 
              : 'bg-red-500'
          }`}
        />
      </View>
    );

    const renderCallRecordingItem = ({ item }) => (
      <View className='flex-row items-center bg-white p-4 mb-2 rounded-lg'>
        <View className='flex-1'>
          <Text className='text-base font-bold'>Call on {item.date}</Text>
          <Text className='text-gray-500'>{item.duration} duration</Text>
        </View>
        <View className='flex-row'>
          <TouchableOpacity 
            className='bg-orange-500 p-2 rounded-md mr-2'
            onPress={() => {/* Implement play recording */}}
          >
            <Ionicons name="play" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className='bg-blue-500 p-2 rounded-md'
            onPress={() => {/* Implement download */}}
          >
            <Ionicons name="download" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onDismiss={onClose}
      >
        <BottomSheetView className='flex-1'>
          {/* Lead Header with Avatar */}
          <View className='items-center mb-4'>
            {lead?.avatar ? (
              <Image 
                source={{ uri: lead.avatar }} 
                className='w-20 h-20 rounded-full mb-2'
              />
            ) : (
              <View className='w-20 h-20 rounded-full bg-gray-300 items-center justify-center mb-2'>
                <Text className='text-gray-600 text-2xl'>
                  {lead?.name?.[0] || ''}
                </Text>
              </View>
            )}
            <Text className='text-xl font-bold text-gray-800'>
              {lead?.name || 'Lead Details'}
            </Text>
            <Text className='text-gray-500'>{lead?.status || 'Sales Lead'}</Text>
          </View>

          {/* Phone Number Selection */}
          <View className='px-4 mb-4'>
            <Text className='text-base font-semibold mb-2'>Select Number to Call</Text>
            {lead?.phoneNumbers?.map((phone, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center p-3 mb-2 rounded-lg ${
                  selectedNumber === phone.number 
                    ? 'bg-green-100 border border-green-500' 
                    : 'bg-gray-100'
                }`}
                onPress={() => {
                  setSelectedNumber(phone.number);
                  onCallSelect?.(phone.number);
                }}
              >
                <Ionicons 
                  name="call" 
                  size={20} 
                  color={selectedNumber === phone.number ? 'green' : 'gray'} 
                  className='mr-3' 
                />
                <View>
                  <Text className='text-base'>{phone.number}</Text>
                  <Text className='text-xs text-gray-500'>{phone.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Navigation */}
          <View className='flex-row mb-4 bg-gray-100 rounded-lg p-1 mx-4'>
            <TouchableOpacity 
              className={`flex-1 p-2 rounded-lg ${
                activeTab === 'history' ? 'bg-green-500' : 'bg-transparent'
              }`}
              onPress={() => setActiveTab('history')}
            >
              <Text 
                className={`text-center ${
                  activeTab === 'history' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Call History
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 p-2 rounded-lg ${
                activeTab === 'records' ? 'bg-green-500' : 'bg-transparent'
              }`}
              onPress={() => setActiveTab('records')}
            >
              <Text 
                className={`text-center ${
                  activeTab === 'records' ? 'text-white' : 'text-gray-700'
                }`}
              >
                Call Records
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content with Scrolling */}
          <BottomSheetScrollView>
            <FlatList
              data={activeTab === 'history' ? callHistoryData : callRecordingsData}
              renderItem={activeTab === 'history' ? renderCallHistoryItem : renderCallRecordingItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            />
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default InboxCallSheet;