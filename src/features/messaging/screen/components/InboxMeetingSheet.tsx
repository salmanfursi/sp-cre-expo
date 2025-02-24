
import React, {forwardRef, useState} from 'react';
import {View, Text, Image, Alert, TouchableOpacity} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import {Dropdown} from 'react-native-element-dropdown';

import img from '../../../../assets/836.jpg';

const InboxMeetingSheet = forwardRef((props, ref) => {
  const [selectedTeam, setSelectedTeam] = useState(''); // Sales team selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(''); // Time slot selection
  const snapPoints = ['25%', '50%', '75%'];

  const salesTeamsData = [
    {label: 'Emon', value: 'emon', image: img},
    {label: 'Supto', value: 'supto', image: img},
    {label: 'Rahat', value: 'rahat', image: img},
    {label: 'Yeasin', value: 'yeasin', image: img},
  ];

  const timeSlotData = [
    {label: '10:00 AM - 11:00 AM', value: '10-11'},
    {label: '11:00 AM - 12:00 PM', value: '11-12'},
    {label: '12:00 PM - 1:00 PM', value: '12-1'},
    {label: '1:00 PM - 2:00 PM', value: '1-2'},
    {label: '2:00 PM - 3:00 PM', value: '2-3'},
    {label: '3:00 PM - 4:00 PM', value: '3-4'},
    {label: '4:00 PM - 5:00 PM', value: '4-5'},
    {label: '5:00 PM - 6:00 PM', value: '5-6'},
  ];

  // Function to handle submission
  const handleSubmit = () => {
    if (selectedTeam && selectedTimeSlot) {
      Alert.alert(
        'Meeting Scheduled',
        `Your meeting with ${selectedTeam} at ${selectedTimeSlot} has been scheduled.`,
      );
    } else {
      Alert.alert('Error', 'Please select both a sales team and a time slot.');
    }
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      onDismiss={props.onClose}
      backdropComponent={props.onBackdropPress}
      >
      <BottomSheetView>
        <View className="p-4">
          <Text className="text-xl text-black font-bold ">
            Schedule meeting
          </Text>
          <Text className="text-lg text-black">
            choose sales team and timeslot for meeting
          </Text>
        </View>
        <View className="p-4 space-y-4">
          {/* Sales Team Dropdown */}
          <View>
            <Text className="text-lg text-black font-semibold mb-2">
              Select Sales Team
            </Text>
            <Dropdown
              className="h-12 text-red-500 bg-slate-400 border border-gray-300 rounded-md px-4"
              placeholder="Select Sales Team"
              data={salesTeamsData}
              labelField="label"
              valueField="value"
              value={selectedTeam}
              onChange={item => setSelectedTeam(item.value)}
              renderItem={item => (
                <View className="flex-row items-center py-2 px-4">
                  <Image
                    source={item.image}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <Text className="text-black">{item.label}</Text>
                </View>
              )}
            />
              
          </View>

          {/* Time Slot Dropdown */}
          <View>
            <Text className="text-lg text-black font-semibold mb-2">
              Select Time Slot
            </Text>
            <Dropdown
              className="h-12 bg-white bg-slate-400 border border-gray-300 rounded-md px-4"
              placeholder="Select Time Slot"
              data={timeSlotData}
              labelField="label"
              valueField="value"
              value={selectedTimeSlot}
              onChange={item => setSelectedTimeSlot(item.value)}
              renderItem={item => (
                <View className="flex-row items-center py-2 px-4">
                  <Text className="text-black">{item.label}</Text>
                </View>
              )}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className="mt-4 bg-blue-600 text-white py-3 px-6 rounded-md"
            onPress={handleSubmit}>
            <Text className="text-center text-white font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default InboxMeetingSheet;
