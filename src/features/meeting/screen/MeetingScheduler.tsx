// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import TimeSlotRow from '../components/TimeSlotRow';
// import SalesTeamList from '../components/SalesTeamList';
// import MeetingGrid from '../components/MeetingGrid';

// const MeetingScheduler = () => {
//   const [activeSlot, setActiveSlot] = useState("11:00 AM");
//   const [meetings, setMeetings] = useState([
//     { id: 1, title: "Meeting with Client X", timeSlot: "11:00 AM", team: "Team A" },
//     { id: 2, title: "Discussion with Client Y", timeSlot: "2:00 PM", team: "Team B" },
//   ]);

//   const timeSlots = ["11:00 AM", "2:00 PM", "4:00 PM"];
//   const teams = ["Team A", "Team B", "Team C"];

//   const handleDragEnd = (updatedMeetings) => {
//     setMeetings(updatedMeetings);
//   };

//   return (
//     <View style={styles.container}>
//       <TimeSlotRow
//         timeSlots={timeSlots}
//         activeSlot={activeSlot}
//         onSelectSlot={setActiveSlot}
//       />
//       <View style={styles.scheduler}>
//         <SalesTeamList teams={teams} />
//         <MeetingGrid data={meetings} onDragEnd={handleDragEnd} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//   },
//   scheduler: {
//     flex: 1,
//     flexDirection: 'row',
//   },
// });

// export default MeetingScheduler;
