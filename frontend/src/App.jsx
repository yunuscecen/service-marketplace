import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import CreateRequest from "./pages/CreateRequest";
import SuspendedPage from "./pages/SuspendedPage";
import { Toaster } from "react-hot-toast";
import AdminUsers from "./pages/dashboard/AdminUsers";
import DashboardHome from "./pages/dashboard/DashboardHome";
import MyRequests from "./pages/dashboard/MyRequests";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import var, şimdi aşağıda kullanıyoruz
import RequestDetail from "./pages/dashboard/RequestDetail"; // Import et
import JobOpportunities from "./pages/dashboard/JobOpportunities"; // Import et
import JobDetail from "./pages/dashboard/JobDetail";
import MyOffers from "./pages/dashboard/MyOffers"; // Import
import Profile from "./pages/dashboard/Profile"; // Import et
import Packages from "./pages/dashboard/Packages";
import AdminServices from "./pages/dashboard/AdminServices"; // Import
import AdminServiceDetail from "./pages/dashboard/AdminServiceDetail"; // Import
import Notifications from "./pages/dashboard/Notifications";
import AdminRequests from "./pages/dashboard/AdminRequests";
function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <Routes>
        {/* HERKESE AÇIK SAYFALAR */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />

        {/* --- KORUMALI SAYFALAR (Giriş Yapmak Zorunlu) --- */}

        {/* 1. Talep Oluşturma Sayfası (Sadece Müşteriler) */}
        <Route
          path="/create-request/:serviceId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CreateRequest />
            </ProtectedRoute>
          }
        />
<Route
  path="/dashboard/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
        {/* 2. Dashboard Ana Sayfa (Herkes Girebilir ama Giriş Şart) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />

        {/* 3. Taleplerim Sayfası (Sadece Müşteriler) */}
        <Route
          path="/dashboard/my-requests"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/request/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RequestDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <JobOpportunities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/job/:id"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <JobDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/my-offers"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <MyOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/services"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminServices />
            </ProtectedRoute>
          }
        />
        {/* ADMIN: Hizmet Detay ve Soru Ekleme */}
        <Route
          path="/dashboard/admin/services/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminServiceDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/suspended" element={<SuspendedPage />} />
        <Route
          path="/dashboard/admin/requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/packages"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <Packages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
