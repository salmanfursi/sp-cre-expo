
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {useAddCommentMutation} from '../../../../../redux/inboxInfoBar/infobarApi';
import {useGetSingleLeadQuery} from '../../../../../redux/conversation/conversationApi';

const Comment = ({conversationId}) => {
  const [comment, setComment] = useState('');
  const [commentsData, setCommentsData] = useState([]);
  const token = useSelector(state => state.auth.token);
// console.log('commentsData is hare----->',commentsData)
  const {
    data: singleLead,
    isLoading: isFetchingLead,
    isError: isLeadError,
    refetch,
  } = useGetSingleLeadQuery(conversationId, {skip: !conversationId});

  const [addComment, {isLoading: isAddingComment, isError: commentError}] =
    useAddCommentMutation();
  console.log(commentError);
  // Fetch comments when singleLead changes
  useEffect(() => {
    if (singleLead?.comment) {
      setCommentsData(singleLead.comment.map(item => item.comment));
    }
  }, [singleLead]);

  const handleAddComment = async () => {
    try {
      if (!comment.trim()) return; // Prevent empty comments

      const commentData = {comment: comment.trim(), images: []};

      const result = await addComment({
        id: conversationId,
        comment: commentData,
        headers: {Authorization: `Bearer ${token}`},
      }).unwrap();

      console.log('result is hare ', result?.savedComment);
      if (result?.msg == 'Comment added successfully') {
        setCommentsData(prev => [comment, ...prev]);
        setComment('');
        refetch();
      } else {
        console.error(
          'Failed to add comment:',
          result.message || 'Unknown error',
        );
      }
    } catch (err) {
      console.error('Failed to add comment:', err.message || err);
    }
  };

  const renderComment = ({item}) => (
    <View className="pb-2 mb-2 border-b border-gray-100">
      <Text className="text-gray-700 text-sm">{item}</Text>
    </View>
  );

  return (
    <View className="rounded-lg shadow-md w-full">
      <Text>Comments</Text>
      {/* Comment Input Section */}
      <View className="flex-row items-center mb-2">
        <TextInput
          className="flex-1 text-black bg-white border border-gray-200 rounded-xl px-4 py-2 mr-3"
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          className={`bg-blue-500 rounded-full w-10 h-10 items-center justify-center ${
            isAddingComment ? 'opacity-50' : ''
          }`}
          onPress={handleAddComment}
          disabled={isAddingComment}>
          <Text className="text-white">{isAddingComment ? '...' : '➤'}</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Comments Section */}
      <View className="rounded-lg">
        {isFetchingLead ? (
          <Text className="text-gray-500 text-center">Loading comments...</Text>
        ) : commentsData.length > 0 ? (
          <>
            {/* Show only the first comment */}
            <FlatList
              data={[commentsData.at(-1)]}
              keyExtractor={(item, index) => `comment-${index}`}
              renderItem={renderComment}
            />
            {/* "See all comments" button */}
            {commentsData.length > 1 && (
              <TouchableOpacity
                className="w-full items-center mt-2"
                onPress={() => console.log('Navigate to all comments view')}>
                <Text className="text-blue-600 font-semibold">
                  See all comments ({commentsData.length - 1} more)
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text className="text-gray-500 text-center">No comments yet.</Text>
        )}
      </View>
    </View>
  );
};

export default Comment;
