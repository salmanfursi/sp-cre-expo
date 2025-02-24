import {getSocket} from '../../hooks/getSocket';
import apiSlice from '../api/apiSlice';
import {
  Conversation,
  GetAllConversationsResponse,
  GetConversationByIdResponse,
  GetConversationMessagesResponse,
  Lead,
  UpdateLeadPayload,
} from './conversation';

// Define Types for Message, Conversation, Lead, and other entities

const socket = getSocket();

const conversationApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
     // Get all leads with filters
    getAllLead: builder.query<
      GetConversationByIdResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        source?: string;
        startDate?: string;
        endDate?: string;
        assignedCre?: string;
        salesExecutive?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 100,
        status,
        source,
        startDate,
        endDate,
        assignedCre,
        salesExecutive,
      }) => {
        // Build query string dynamically based on provided filters
        const queryParams = new URLSearchParams();

        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());

        if (status) queryParams.append('status', status);
        if (source) queryParams.append('source', source);
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        if (assignedCre) queryParams.append('assignedCre', assignedCre);
        if (salesExecutive)
          queryParams.append('salesExecutive', salesExecutive);

        return `/lead?${queryParams.toString()}`;
      },
    }),
    // Get a single lead by its ID
    getSingleLead: builder.query<Lead, string>({
      query: (id: string) => `/lead/${id}`,
      providesTags: (result, error, id) => [{type: 'Lead', id}],
    }),

    getAllConversations: builder.query<
      GetAllConversationsResponse,
      {page: number; limit: number}
    >({
      query: ({page, limit}) =>
        `/lead/conversation?page=${page}&limit=${limit}`,

      // Keep cached data for 5 minutes
      keepUnusedDataFor: 300,

      // Serialize query args to ensure proper caching
      serializeQueryArgs: ({endpointName}) => {
        return endpointName;
      },

      // Merge function to handle pagination and deduplication
      merge: (currentCache, newData, {arg}) => {
        if (!currentCache) return newData;

        // For first page, replace entire cache
        if (arg.page === 1) {
          return newData;
        }

        // Merge and deduplicate leads
        return {
          ...newData,
          leads: [...currentCache.leads, ...newData.leads].filter(
            (lead, index, self) =>
              index === self.findIndex(l => l._id === lead._id),
          ),
        };
      },

      // Transform response to maintain consistency
      transformResponse: (response: GetAllConversationsResponse) => {
        return {
          ...response,
          leads: response.leads.sort(
            (a, b) =>
              new Date(b.lastMessageTime).getTime() -
              new Date(a.lastMessageTime).getTime(),
          ),
        };
      },

      // Determine if we should refetch
      forceRefetch({currentArg, previousArg}) {
        return currentArg?.page !== previousArg?.page;
      },

      // Handle real-time updates via socket
      async onCacheEntryAdded(
        arg,
        {updateCachedData, cacheDataLoaded, cacheEntryRemoved},
      ) {
        try {
          // Wait for the initial cache entry to be added
          await cacheDataLoaded;

          // Socket handler for conversation updates
          const handleConversationUpdate = (conversation: Conversation) => {
            updateCachedData(draft => {
              const index = draft.leads.findIndex(
                ({_id}) => _id === conversation._id,
              );

              if (index !== -1) {
                // Update existing conversation
                draft.leads[index] = conversation;
              } else {
                // Add new conversation to the beginning
                draft.leads.unshift(conversation);
              }

              // Maintain sorting
              draft.leads.sort(
                (a, b) =>
                  new Date(b.lastMessageTime).getTime() -
                  new Date(a.lastMessageTime).getTime(),
              );
            });
          };

          // Subscribe to socket events
          socket.on('conversation', handleConversationUpdate);

          // Cleanup on cache entry removal
          await cacheEntryRemoved;
          socket.off('conversation', handleConversationUpdate);
        } catch (err) {
          console.error('Socket error:', err);
        }
      },
    }),

    // Get conversation messages for a specific lead
    getConversationMessages: builder.query<
      GetConversationMessagesResponse,
      string
    >({
      query: (id: string) => `/lead/conversation/${id}/messages/`,
      onCacheEntryAdded: async (
        id,
        {updateCachedData, cacheDataLoaded, cacheEntryRemoved},
      ) => {
        await cacheDataLoaded;

        const handleMessageUpdate = (message: Message) => {
          updateCachedData(draft => {
            if (
              !draft.messages.find(
                ({messageId}) => messageId === message.messageId,
              )
            ) {
              draft.messages.push(message);
            }
          });
        };

        socket.on(`fbMessage${id}`, handleMessageUpdate);
        await cacheEntryRemoved;
        socket.off(`fbMessage${id}`, handleMessageUpdate);
      },
    }),

    // Mark messages as seen with optimistic update
    markAsSeen: builder.mutation<void, {id: string}>({
      query: ({id}) => ({
        url: `/lead/conversation/${id}/mark-messages-seen`,
        method: 'PUT',
      }),
      // Optimistic update: we update the cached data before the mutation is fulfilled
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        // Optimistically update the leads cache to mark messages as seen
        const patchResult = dispatch(
          conversationApi.util.updateQueryData(
            'getAllConversations',
            {page: 1, limit: 500}, // Assuming you're fetching paginated data
            draft => {
              const lead = draft.leads.find(lead => lead._id === arg.id);
              if (lead) {
                lead.messagesSeen = true; // Mark the messages as seen optimistically
              }
            },
          ),
        );

        try {
          // Await the actual server response
          await queryFulfilled;
        } catch (err) {
          // Rollback the optimistic update if the mutation fails
          patchResult.undo();
        }
      },
      // Invalidates the cache for specific lead once the mutation is successful
      invalidatesTags: (result, error, {id}) => [{type: 'Lead', id}],
    }),

    // Send a message to a lead
    sentMessage: builder.mutation<
      void,
      {
        id: string;
        message: {messageType: string; content: {text: string}};
      }
    >({
      query: ({id, message}) => ({
        url: `/lead/conversation/${id}/messages`,
        method: 'POST',
        body: {message},
      }),
    }),

    // Update a lead
    updateLeads: builder.mutation<Lead, {id: string; data: UpdateLeadPayload}>({
      query: ({id, data}) => {
          // Log the incoming data and ID
    console.log('Updating lead with ID:', id);
    console.log('Data being sent:', data);
        return{
        url: `/lead/${id}`,
        method: 'PUT',
        body: data,
      }},
      invalidatesTags: (result, error, {id}) => [{type: 'Lead', id}],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for use in components
export const {
  useGetAllConversationsQuery,
  useGetConversationMessagesQuery,
  useGetSingleLeadQuery,
  useUpdateLeadsMutation,
  useSentMessageMutation,
  useMarkAsSeenMutation,
  useGetAllLeadQuery,
} = conversationApi;

export default conversationApi;
