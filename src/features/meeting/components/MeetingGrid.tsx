



import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const MeetingGrid = ({ meetings, salesTeams, timeSlots, onMeetingTap, onNewMeeting }) => {
  const renderMeetingCell = (team, slot) => {
    const meeting = meetings.find((m) => m.team === team && m.timeSlot === slot);

    return (
      <TouchableOpacity
        key={`${team}-${slot}`}
        className={`w-24 h-20 justify-center items-center border border-gray-300 ${
          meeting
            ? meeting.status === 'confirmed'
              ? 'bg-green-100'
              : meeting.status === 'pending'
              ? 'bg-yellow-100'
              : 'bg-red-100'
            : 'bg-white'
        }`}
        onPress={() => (meeting ? onMeetingTap(meeting) : onNewMeeting(team, slot))}
      >
        {meeting ? <Text className="text-sm font-bold">{meeting.title}</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {salesTeams.map((team) => (
        <View key={team} className="flex-row">
          {timeSlots.map((slot) => renderMeetingCell(team, slot))}
        </View>
      ))}
    </View>
  );
};

export default MeetingGrid;
