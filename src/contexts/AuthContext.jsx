import { createContext, useState, useEffect, useCallback } from "react";
import Cookies from 'js-cookie';
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post("/user/login", credentials);
      const { accessToken, refreshToken, userId } = response.data;
  
      Cookies.set('accessToken', accessToken, { expires: 1 });  
      Cookies.set('refreshToken', refreshToken, { expires: 7 });  
  
      setIsAuthenticated(true);
      setUser({ id: userId });
    
      return { accessToken };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.post("/change_password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      const { accessToken, refreshToken } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1 });
      Cookies.set('refreshToken', refreshToken, { expires: 7 });

      return { message: "Password changed successfully" };
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');
      if (accessToken && refreshToken) {
        try {
          const response = await api.get('/user/me');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation error:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
