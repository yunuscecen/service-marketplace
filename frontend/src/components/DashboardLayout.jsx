// src/components/DashboardLayout.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  List,
  Briefcase,
  User,
  Send,
  Users,
  LogOut,
  ShieldAlert,
  ClipboardList, // İlan yönetimi için bu ikonu ekledik
  Rocket,
} from "lucide-react";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    {
      name: "Genel Bakış",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    // --- MÜŞTERİ (User) ---
    ...(user?.role === "user"
      ? [
          {
            name: "Taleplerim",
            path: "/dashboard/my-requests",
            icon: <List size={20} />,
          },
        ]
      : []),

    // --- HİZMET VEREN (Provider) ---
    ...(user?.role === "provider"
      ? [
          {
            name: "İş Fırsatları",
            path: "/dashboard/jobs",
            icon: <Briefcase size={20} />,
          },
          {
            name: "Verdiğim Teklifler",
            path: "/dashboard/my-offers",
            icon: <Send size={20} />,
          },
          // YENİ EKLENEN
          {
            name: "Teklif Paketleri",
            path: "/dashboard/packages",
            icon: <Rocket size={20} />, // import { Rocket } from "lucide-react"
          },
        ]
      : []),

    // --- ADMIN ---
    ...(user?.role === "admin"
      ? [
          {
            header: "YÖNETİM",
          },
          {
            name: "Hizmet Yönetimi",
            path: "/dashboard/admin/services",
            icon: <ShieldAlert size={20} />,
          },
          {
            name: "Üye Yönetimi",
            path: "/dashboard/admin/users",
            icon: <Users size={20} />,
          },
          // --- BURAYI EKLEDİK: İlan Yönetimi Linki ---
          {
            name: "İlan Yönetimi",
            path: "/dashboard/admin/requests",
            icon: <ClipboardList size={20} />,
          },
        ]
      : []),

    // --- PROFİL ---
    {
      name: "Profilim",
      path: "/dashboard/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-gray-800 truncate">{user?.name}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                {user?.role === "provider"
                  ? "Hizmet Veren"
                  : user?.role === "admin"
                    ? "Yönetici"
                    : "Müşteri"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item, index) =>
            item.header ? (
              <p
                key={index}
                className="text-[10px] font-black text-gray-400 mt-6 mb-2 ml-4 tracking-[0.2em]"
              >
                {item.header}
              </p>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm shadow-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </Link>
            ),
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen relative bg-gray-50/50">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
