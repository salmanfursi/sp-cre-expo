// import React, { useState, useRef } from 'react';
// import { View, Text, ScrollView, TextInput, StyleSheet, Dimensions } from 'react-native';

// const SpreadsheetGrid = () => {
//   // Extended sample data with more rows
//   const [gridData, setGridData] = useState([
//     { id: 1, rollNo: '101', name: 'Alice Johnson', marks: '88', total: '77' },
//     { id: 2, rollNo: '103', name: 'Bob Smith', marks: '92', total: '85' },
//     { id: 3, rollNo: '105', name: 'Carol White', marks: '95', total: '90' },
//     { id: 4, rollNo: '107', name: 'David Brown', marks: '91', total: '82' },
//     { id: 5, rollNo: '109', name: 'Eve Wilson', marks: '87', total: '79' },
//     { id: 6, rollNo: '111', name: 'Frank Davis', marks: '94', total: '88' },
//     { id: 7, rollNo: '113', name: 'Grace Taylor', marks: '89', total: '84' },
//     { id: 8, rollNo: '115', name: 'Henry Miller', marks: '93', total: '87' },
//     { id: 9, rollNo: '117', name: 'Ivy Clark', marks: '90', total: '85' },
//     { id: 10, rollNo: '119', name: 'Jack Lewis', marks: '86', total: '81' },
//     { id: 11, rollNo: '121', name: 'Kelly Moore', marks: '88', total: '83' },
//     { id: 12, rollNo: '123', name: 'Liam Hall', marks: '91', total: '86' },
//     { id: 13, rollNo: '125', name: 'Mary Adams', marks: '94', total: '89' },
//     { id: 14, rollNo: '127', name: 'Noah King', marks: '87', total: '82' },
//     { id: 15, rollNo: '129', name: 'Olivia Scott', marks: '92', total: '87' },
//     { id: 16, rollNo: '131', name: 'Peter Young', marks: '89', total: '84' },
//     { id: 17, rollNo: '133', name: 'Quinn Baker', marks: '93', total: '88' },
//     { id: 18, rollNo: '135', name: 'Rachel Green', marks: '90', total: '85' },
//     { id: 19, rollNo: '137', name: 'Sam Turner', marks: '88', total: '83' },
//     { id: 20, rollNo: '139', name: 'Tom Harris', marks: '91', total: '86' }
//   ]);

//   // Added more columns to demonstrate horizontal scrolling
//   const columns = [
//     'S.No.',
//     'Roll no',
//     'Name',
//     'Eng marks',
//     'Science m',
//     'Math marks',
//     'History m',
//     'Geography',
//     'Total',
//     'Percentage',
//     'Grade'
//   ];
  
//   const mainScrollViewRef = useRef(null);
//   const horizontalScrollViewRef = useRef(null);
//   const verticalScrollViewRef = useRef(null);

//   const renderHeaderCell = (text, index) => (
//     <View key={index} style={[
//       styles.headerCell,
//       index === 0 && styles.stickyColumn
//     ]}>
//       <Text style={styles.headerText}>{text}</Text>
//     </View>
//   );

//   const renderCell = (text, rowIndex, cellIndex) => (
//     <View 
//       key={`${rowIndex}-${cellIndex}`} 
//       style={[
//         styles.cell,
//         cellIndex === 0 && styles.stickyColumn
//       ]}
//     >
//       <TextInput
//         style={styles.cellInput}
//         value={String(text)}
//         onChangeText={(newText) => {
//           // Implement cell update logic here
//         }}
//       />
//     </View>
//   );

//   const handleMainScroll = (event) => {
//     const { x, y } = event.nativeEvent.contentOffset;
//     if (horizontalScrollViewRef.current) {
//       horizontalScrollViewRef.current.scrollTo({ x, animated: false });
//     }
//     if (verticalScrollViewRef.current) {
//       verticalScrollViewRef.current.scrollTo({ y, animated: false });
//     }
//   };

//   const renderRow = (row, rowIndex) => (
//     <View key={rowIndex} style={styles.row}>
//       {renderCell(row.id, rowIndex, 0)}
//       {renderCell(row.rollNo, rowIndex, 1)}
//       {renderCell(row.name, rowIndex, 2)}
//       {renderCell(row.marks, rowIndex, 3)}
//       {renderCell(row.total, rowIndex, 4)}
//       {renderCell('85', rowIndex, 5)}
//       {renderCell('88', rowIndex, 6)}
//       {renderCell('92', rowIndex, 7)}
//       {renderCell(row.total, rowIndex, 8)}
//       {renderCell('87%', rowIndex, 9)}
//       {renderCell('A', rowIndex, 10)}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Fixed Header */}
//       <View style={styles.headerContainer}>
//         <ScrollView 
//           horizontal 
//           ref={horizontalScrollViewRef}
//           scrollEventThrottle={16}
//           showsHorizontalScrollIndicator={false}
//         >
//           <View style={styles.headerRow}>
//             {columns.map((column, index) => renderHeaderCell(column, index))}
//           </View>
//         </ScrollView>
//       </View>

//       {/* Main Grid */}
//       <ScrollView>
//         <ScrollView 
//           horizontal 
//           ref={mainScrollViewRef}
//           onScroll={handleMainScroll}
//           scrollEventThrottle={16}
//         >
//           <View>
//             {gridData.map((row, index) => renderRow(row, index))}
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </View>
//   );
// };

// export default ExcelLikeApp;



import { Text, View } from 'react-native'
import React from 'react'

const Meeting =()=> {
     return (
      <View>
        <Text>Meeting</Text>
      </View>
    )
  }

export default Meeting