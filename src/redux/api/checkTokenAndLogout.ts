 import { jwtDecode } from 'jwt-decode';
import { logoutUser } from '../auth/authSlice';
import store from '../store';

// Helper function to check token validity and logout if invalid
export const checkTokenAndLogout = (token: string | null): boolean => {
  if (token) {
    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // If the token has expired, dispatch logout action
        store.dispatch(logoutUser());
        return false;
      }
      return true;
    } catch (error) {
      // If decoding the token fails, log the user out
      store.dispatch(logoutUser());
      return false;
    }
  }
  return false;
};
