import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  currentUser: "sheba_user",
  token: "sheba_token",
};

function getStoredCurrentUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.currentUser);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.token) || "";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredCurrentUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const saveAuth = (loggedInUser, userToken) => {
    setUser(loggedInUser);
    setToken(userToken);

    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(loggedInUser));
    localStorage.setItem(STORAGE_KEYS.token, userToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem(STORAGE_KEYS.currentUser);
    localStorage.removeItem(STORAGE_KEYS.token);
  };

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      saveAuth(data.user, data.token);

      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  };

  const register = async ({ name, email, phone, address, password }) => {
    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        phone,
        address,
        password,
      });

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      saveAuth(data.user, data.token);

      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(message);
    }
  };

  const getProfile = async () => {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.token)) {
        setLoading(false);
        return null;
      }

      const { data } = await api.get("/users/profile");

      if (data.success) {
        setUser(data.user);
        localStorage.setItem(
          STORAGE_KEYS.currentUser,
          JSON.stringify(data.user)
        );
        return data.user;
      }

      clearAuth();
      return null;
    } catch {
      clearAuth();
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({ name, phone, address }) => {
    try {
      const { data } = await api.put("/users/profile", {
        name,
        phone,
        address,
      });

      if (!data.success) {
        throw new Error(data.message || "Profile update failed");
      }

      setUser(data.user);
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Profile update failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    getProfile();
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    getProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}