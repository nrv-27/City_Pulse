import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // We will create this file next

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On initial app load, check if a token exists and try to log the user in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.get("/users/current-user")
        .then((response) => {
          setUser(response.data.data);
        })
        .catch(() => {
          // If the token is invalid, remove it
          localStorage.removeItem("accessToken");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { accessToken, user } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };
  
  const register = async (fullName, username, email, password) => {
    try {
      await api.post("/users/register", { fullName, username, email, password });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoggedIn, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};