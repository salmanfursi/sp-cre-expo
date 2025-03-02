import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [auth, setAuth] = useState({ user: null, token: null, loading: true });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        setAuth({
          token: token || null,
          user: userData ? JSON.parse(userData) : null,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching user/token:", error);
        setAuth({ user: null, token: null, loading: false });
      }
    };

    fetchAuthData();
  }, []);

  return auth; // Returns { user, token, loading }
};

export default useAuth;
