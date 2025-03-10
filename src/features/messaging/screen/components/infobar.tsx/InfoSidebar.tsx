import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {Drawer} from 'react-native-drawer-layout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Comment from './Comment';
import Address from './address/Address';

const InfoSidebar = ({children, isOpen, onClose, onOpen, conversationId}) => {
 
  const [requirements, setRequirements] = useState([
    {id: 1, text: 'Complete project proposal', completed: false},
    {id: 2, text: 'Schedule team meeting', completed: true},
  ]);
  const [newRequirement, setNewRequirement] = useState('');

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState('');

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([
        ...requirements,
        {
          id: Date.now(),
          text: newRequirement,
          completed: false,
        },
      ]);
      setNewRequirement('');
    }
  };

  const toggleRequirementComplete = id => {
    setRequirements(
      requirements.map(req =>
        req.id === id ? {...req, completed: !req.completed} : req,
      ),
    );
  };

  const deleteRequirement = id => {
    setRequirements(requirements.filter(req => req.id !== id));
  };

  const addReminder = () => {
    if (newReminder.trim()) {
      setReminders([
        ...reminders,
        {
          id: Date.now(),
          text: newReminder,
        },
      ]);
      setNewReminder('');
    }
  };

  const deleteReminder = id => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  return (
    <Drawer
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      drawerType="front"
      drawerPosition="right"
      drawerStyle={{width: 300}}
      renderDrawerContent={() => (
        <View className="flex-1 p-4">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">Sidebar Menu</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>

          {/* address component  */}
          {/* address={} */}
          <Address leadId={conversationId} />
          {/* <View>
            <Text className="text-2xl p-2 border">address will be thare </Text>
          </View> */}

          {/* Requirements Section */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-black text-lg font-semibold">Requirements</Text>
              <TouchableOpacity>
                <Icon name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
            <View className="flex-row mb-2">
              <TextInput
                placeholder="New Requirement"
                value={newRequirement}
                onChangeText={setNewRequirement}
                className="flex-1 border border-gray-300 rounded-md p-2 mr-2"
              />
              <TouchableOpacity
                className="bg-blue-500 justify-center px-4 rounded-md"
                onPress={addRequirement}>
                <Text className="text-white">Add</Text>
              </TouchableOpacity>
            </View>
            {requirements.map(req => (
              <View
                key={req.id}
                className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => toggleRequirementComplete(req.id)}
                    className="mr-2">
                    <Icon
                      name={
                        req.completed ? 'check-box' : 'check-box-outline-blank'
                      }
                      size={24}
                      color={req.completed ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>
                  <Text
                    className={
                      req.completed ? 'line-through text-gray-500' : ''
                    }>
                    {req.text}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteRequirement(req.id)}>
                  <Icon name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Reminders Section */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Reminders</Text>
              <TouchableOpacity>
                <Icon name="add-circle" size={24} color="green" />
              </TouchableOpacity>
            </View>
            {reminders.length === 0 && (
              <Text className="text-gray-600 text-center">
                No reminders yet
              </Text>
            )}
          </View>

          {/* Settings and Comments */}
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-md mb-2"
            onPress={() => alert('Go to Settings')}>
            <Text>Settings</Text>
          </TouchableOpacity>

          <Comment conversationId={conversationId} />

          {/* Address Modal */}
        </View>
      )}>
      {/* Main Content */}
      <View className="flex-1">{children}</View>
    </Drawer>
  );
};

export default InfoSidebar;
