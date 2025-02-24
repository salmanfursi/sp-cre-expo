// import React from 'react';
// import { View, Text } from 'react-native';

// const SalesTeamList = ({ salesTeams }) => {
//   return (
//     <View className="bg-gray-100">
//       <View className=''>
//       <Text className="h-20 pt-4 border-b border-gray-300 text-sm font-semibold text-black">Team&slot</Text>
//       </View>
//       {salesTeams.map((team) => (
//         <View key={team} className="h-20 justify-center border-b border-gray-300">
//           <Text className="ml-4 text-sm font-semibold text-black">{team}</Text>
//         </View>
//       ))}
//     </View>
//   );
// };

// export default SalesTeamList;





import React from 'react';
import { View, Text } from 'react-native';

const SalesTeamList = ({ salesTeams }) => {
  return (
    <View>
      {salesTeams.map((team) => (
        <View key={team} className="h-20 justify-center border-b border-r border-gray-300 bg-gray-100">
          <Text className="px-2 text-sm font-semibold text-black">{team}</Text>
        </View>
      ))}
    </View>
  );
};

export default SalesTeamList;

