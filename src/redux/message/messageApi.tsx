import apiSlice from '../api/apiSlice';

const messageApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Existing text message mutation
    sendMessage: builder.mutation({
      query: ({leadId, messageType, content}) => {
        console.log('rtk data log', {leadId, messageType, content});
        return {
          url: `/lead/conversation/${leadId}/messages`,
          method: 'POST',
          body: {
            messageType,
            content,
          },
        };
      },
      invalidatesTags: (result, error, {leadId}) => [
        {type: 'Conversation', id: leadId},
      ],
    }),

    // New mutation for file upload
    sendFileMessage: builder.mutation({
      query: ({ leadId, file }) => {
          const formData = new FormData();
          formData.append('file', {
              uri: file.uri,
              name: file.name,
              type: file.type,
          });
          formData.append('messageType', file.type); // e.g., 'image'
  
          return {
              url: `/lead/conversation/${leadId}/messages`,
              method: 'POST',
              body: formData,
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          };
      },
      invalidatesTags: (result, error, { leadId }) => [
          { type: 'Conversation', id: leadId },
      ],
  }),
  
  

  }),
  overrideExisting: true
});

export const {useSendMessageMutation, useSendFileMessageMutation} = messageApi;
export default messageApi;
