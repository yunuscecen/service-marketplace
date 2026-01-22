/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yenilendiğinde kullanıcıyı hatırla (Persist Login)
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/auth/me"); // Backend'den "Ben kimim?" sorgusu
          setUser(res.data.data);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Giriş Fonksiyonu
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token); // Token'ı kaydet
      setUser(res.data.user);
      toast.success("Giriş başarılı! Hoş geldiniz.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Giriş başarısız.");
      return false;
    }
  };

  // Kayıt Fonksiyonu
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Hesap oluşturuldu!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Kayıt başarısız.");
      return false;
    }
  };

  // Çıkış Fonksiyonu
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Çıkış yapıldı.");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
