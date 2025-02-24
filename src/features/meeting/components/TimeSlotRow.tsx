import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TimeSlotRow = ({ timeSlots, activeSlot, onSelectSlot }) => {
  return (
    <FlatList
      horizontal
      data={timeSlots}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.slot,
            activeSlot === item && styles.activeSlot,
          ]}
          onPress={() => onSelectSlot(item)}
        >
          <Text style={styles.slotText}>{item}</Text>
        </TouchableOpacity>
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  slot: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  activeSlot: {
    backgroundColor: '#007BFF',
    borderColor: '#0056b3',
  },
  slotText: {
    color: '#333',
  },
});

export default TimeSlotRow;
