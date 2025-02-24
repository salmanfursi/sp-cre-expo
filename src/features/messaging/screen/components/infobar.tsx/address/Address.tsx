//in the gray bg at tha right upper corner will be the icon once i lcick then modal open and when the address empty 
// then there will written like no address set

import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styled} from 'nativewind';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddressModal from './AddressModal';
import { useGetSingleLeadQuery } from '../../../../../../redux/conversation/conversationApi';

interface Address {
  division: string;
  district: string;
  area: string;
  address: string;
}

interface AddressCardProps {
   leadId: string | undefined;
}

// Styled components with NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const AddressCard: React.FC<AddressCardProps> = ({leadId}) => {
  const [isModalOpen, setModalOpen] = useState(false);


  const {
    data: singleLead,
    isLoading: isFetchingLead,
    isError: isLeadError,
    refetch,
  } = useGetSingleLeadQuery(leadId, {skip: !leadId});
console.log("singleLead-----addres",singleLead?.address)

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

 
  return (
    <StyledView className="my-2 p-2 bg-white rounded-md">
      <StyledView className="flex-row justify-between items-center mb-2">
        <StyledText className="text-base font-bold">📍 Address</StyledText>
        <StyledTouchableOpacity onPress={handleModalOpen}>
          <Icon name={singleLead ? 'edit' : 'plus'} size={20} color="#007bff" />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className="bg-gray-100 p-3 rounded-md">
        <StyledText className="text-sm text-gray-800">
          {singleLead
            ? `${singleLead?.address?.address}, ${singleLead?.address?.area}, ${singleLead?.address?.district}, ${singleLead?.address?.division}`
            : 'No address available. Please add one.'}
        </StyledText>
      </StyledView>

      {/* Address Modal */}
      <AddressModal
        leadId={leadId}
        visible={isModalOpen}
        onClose={handleModalClose}
      />
    </StyledView>
  );
};

export default AddressCard;
