 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

interface User {
  _id: string;
  nameAsPerNID: string;
  nickname: string;
  email: string;
  personalPhone: string;
  officePhone: string;
  gender: string;
  address: string;
  profilePicture?: string;
  coverPhoto?: string;
  status: string;
  roleId?: string;
  departmentId?: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.token = action.payload.token;

      // Store token and user in AsyncStorage asynchronously
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;

      // Remove token and user from AsyncStorage asynchronously
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
    },
    setInitialAuthState: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
  },
});

export const { setUser, logoutUser, setInitialAuthState } = authSlice.actions;
export default authSlice.reducer;
