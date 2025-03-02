 import { getSocket } from '../../hooks/getSocket';
import apiSlice from '../api/apiSlice';

const socket = getSocket();

const infoBarApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Update lead requirements
    updateRequirement: builder.mutation<
      Lead,
      {id: string; requirements: string[]}
    >({
      query: ({id, requirements}) => ({
        url: `/lead/${id}/requirements`,
        method: 'PUT',
        body: {requirements},
      }),
    }),

    // Add a phone number to a lead
    addPhone: builder.mutation<Lead, {id: string; phoneNumber: string}>({
      query: ({id, phoneNumber}) => {
        console.log(phoneNumber, typeof phoneNumber);
        return {
          url: `/lead/${id}/add-phone-number`,
          method: 'PUT',
          body: {phoneNumber},
        };
      },
    }),

    // Update reminders
    updateReminder: builder.mutation<ReminderResponse, UpdateReminderPayload>({
      query: ({id, time, commentId}) => ({
        url: `/lead/${id}/reminders`,
        method: 'POST',
        body: {time, commentId}, // Send both time and optional commentId
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Lead', id}],
    }),

    // Add a call log to a lead
    addCallLogs: builder.mutation<
      {msg: string; lead: Lead},
      {
        id: string;
        newCallLog: {
          recipientNumber: string;
          callType: 'Incoming' | 'Outgoing';
          status: 'Missed' | 'Received';
          callDuration?: number | string;
          timestamp: string;
        };
      } // Request type
    >({
      query: ({id, newCallLog}) => ({
        url: `/lead/${id}/call-logs`,
        method: 'POST',
        body: newCallLog,
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Lead', id}],
    }),

    // Add a comment to a lead
    addComment: builder.mutation<
      void,
      {id: string; comment: {comment: string; images: string[]}}
    >({
      query: ({id, comment}) => {
        console.log('its from rtk id and comment ', id, comment);
        return{
        url: `/lead/${id}/comments`,
        method: 'POST',
        body: comment,
      }}, 
      // async onQueryStarted({leadId, comment}, {dispatch, queryFulfilled}) {
      //   const handleCommentAdded = ({
      //     leadId,
      //     comment,
      //   }: {
      //     leadId: string;
      //     comment: Comment;
      //   }) => {
      //     dispatch(
      //       infoBarApi.util.updateQueryData('getSingleLead', leadId, lead => {
      //         console.log('onQueryStarted---id and lead->',leadId)
      //         console.log('infoBarApi.util infoBarApi.util:', infoBarApi.util);

      //         const existingComment = lead.comment.find(
      //           c => c._id === comment._id,
      //         );
      //         if (!existingComment) {
      //           lead.comment.push(comment);
      //         }
      //         console.log('infoBarApi.util-----existingComment:', existingComment);

      //       }),
      //     );
      //   };

      //   socket.on(`newComment_${leadId}`, handleCommentAdded);

      //   try {
      //     await queryFulfilled;
      //   } finally {
      //     socket.off(`newComment_${leadId}`, handleCommentAdded);
      //   }
      // },
    }),

  }),
  overrideExisting: false,
});

// Export hooks for use in components
export const {
  useUpdateRequirementMutation,
  useUpdateReminderMutation,
  useAddCommentMutation,
  useAddPhoneMutation,
  useAddCallLogsMutation,
} = infoBarApi;

export default infoBarApi;
