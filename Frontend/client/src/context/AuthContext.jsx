import { createContext, useContext, useState } from "react";

import { demoUsers } from "../data/demoUsers";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  users: "sheba_users",
  currentUser: "sheba_user",
  token: "sheba_token",
};

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createUserId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function removePassword(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function getStoredUsers() {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.users);

    if (!users) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(demoUsers));
      return demoUsers;
    }

    return JSON.parse(users);
  } catch {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(demoUsers));
    return demoUsers;
  }
}

function getStoredCurrentUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.currentUser);
    const parsedUser = user ? JSON.parse(user) : null;

    if (!parsedUser || !parsedUser.id) {
      return null;
    }

    return parsedUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => getStoredUsers());
  const [user, setUser] = useState(() => getStoredCurrentUser());
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_KEYS.token) || ""
  );

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers);
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(updatedUsers));
  };

  const saveCurrentUser = (safeUser, userToken) => {
    setUser(safeUser);
    setToken(userToken);

    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(safeUser));
    localStorage.setItem(STORAGE_KEYS.token, userToken);
  };

  const login = ({ email, password }) => {
    const cleanEmail = normalizeEmail(email);

    const foundUser = users.find(
      (item) => normalizeEmail(item.email) === cleanEmail
    );

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid email or password.");
    }

    if (foundUser.isBlocked) {
      throw new Error("Your account is blocked by admin.");
    }

    const now = new Date().toISOString();

    const updatedUsers = users.map((item) =>
      item.id === foundUser.id
        ? {
            ...item,
            isLoggedIn: true,
            lastLogin: now,
          }
        : item
    );

    saveUsers(updatedUsers);

    const loggedInUser = updatedUsers.find((item) => item.id === foundUser.id);
    const safeUser = removePassword(loggedInUser);
    const userToken = `demo-token-${loggedInUser.id}`;

    saveCurrentUser(safeUser, userToken);

    return safeUser;
  };

  const register = ({ name, email, phone, password }) => {
    const cleanEmail = normalizeEmail(email);

    const alreadyExists = users.some(
      (item) => normalizeEmail(item.email) === cleanEmail
    );

    if (alreadyExists) {
      throw new Error("This email is already registered.");
    }

    const now = new Date().toISOString();

    const newUser = {
      id: createUserId(),
      name,
      email: cleanEmail,
      phone,
      password,
      role: "customer",
      isBlocked: false,
      isLoggedIn: true,
      createdAt: now,
      lastLogin: now,
    };

    const updatedUsers = [...users, newUser];

    saveUsers(updatedUsers);

    const safeUser = removePassword(newUser);
    const userToken = `demo-token-${newUser.id}`;

    saveCurrentUser(safeUser, userToken);

    return safeUser;
  };

  const logout = () => {
    if (user) {
      const updatedUsers = users.map((item) =>
        item.id === user.id
          ? {
              ...item,
              isLoggedIn: false,
            }
          : item
      );

      saveUsers(updatedUsers);
    }

    setUser(null);
    setToken("");

    localStorage.removeItem(STORAGE_KEYS.currentUser);
    localStorage.removeItem(STORAGE_KEYS.token);
  };

  const toggleUserBlock = (userId) => {
    const targetUser = users.find((item) => item.id === userId);

    if (!targetUser) {
      return;
    }

    if (targetUser.role === "admin") {
      alert("Admin account cannot be blocked.");
      return;
    }

    const updatedUsers = users.map((item) =>
      item.id === userId
        ? {
            ...item,
            isBlocked: !item.isBlocked,
            isLoggedIn: item.isBlocked ? item.isLoggedIn : false,
          }
        : item
    );

    saveUsers(updatedUsers);
  };

  const deleteUser = (userId) => {
    const targetUser = users.find((item) => item.id === userId);

    if (!targetUser) {
      return;
    }

    if (targetUser.role === "admin") {
      alert("Admin account cannot be deleted.");
      return;
    }

    const updatedUsers = users.filter((item) => item.id !== userId);
    saveUsers(updatedUsers);
  };

  const markUserLoggedOut = (userId) => {
    const updatedUsers = users.map((item) =>
      item.id === userId
        ? {
            ...item,
            isLoggedIn: false,
          }
        : item
    );

    saveUsers(updatedUsers);
  };

  const value = {
    users,
    user,
    token,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    toggleUserBlock,
    deleteUser,
    markUserLoggedOut,
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