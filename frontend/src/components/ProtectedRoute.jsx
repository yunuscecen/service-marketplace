// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Durum: Sistem hala kullanıcının kim olduğunu anlamaya çalışıyorsa bekle
  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  // 2. Durum: Kullanıcı giriş yapmamışsa -> Login sayfasına fırlat
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // --- 3. YENİ DURUM: Hesap Askıya Alınmış mı? ---
  if (user.isSuspended) {
    return <Navigate to="/suspended" replace />;
  }
  // ----------------------------------------------

  // 4. Durum: Rol kontrolü.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Yetkisiz ise ana sayfaya at
  }

  // Her şey yolundaysa sayfayı göster
  return children;
};

export default ProtectedRoute;
