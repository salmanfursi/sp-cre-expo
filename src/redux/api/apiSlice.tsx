import { createApi, fetchBaseQuery, RootState } from '@reduxjs/toolkit/query/react';
import { checkTokenAndLogout } from './checkTokenAndLogout';

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    //  baseUrl: 'http://192.168.68.108:5000',

     // baseUrl: 'http://192.168.68.130/api',
     baseUrl: 'https://crm.solutionprovider.com.bd/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as RootState).auth.token;

      // Check token validity, and if invalid, handle logout
      const isValid = checkTokenAndLogout(token);
      if (token && isValid) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Lead','Conversation'],
  endpoints: () => ({})
});

export default apiSlice;
