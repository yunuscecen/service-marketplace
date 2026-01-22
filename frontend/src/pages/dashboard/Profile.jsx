import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Star, LogOut, Shield } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profilim</h1>

        {/* Profil Kartı */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Üst Renkli Alan */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg inline-block">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 uppercase">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
            </div>

            {/* Bilgiler */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  {user?.role === "provider" ? (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <Shield size={14} /> Hizmet Veren
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      <User size={14} /> Müşteri
                    </span>
                  )}
                </div>
              </div>

              {/* İletişim */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="bg-white p-2 rounded-lg text-gray-500">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="block text-xs text-gray-400">
                    E-Posta Adresi
                  </span>
                  <span className="font-medium text-gray-900">
                    {user?.email}
                  </span>
                </div>
              </div>

              {/* SADECE HİZMET VERENLER İÇİN PUAN KARTI */}
              {user?.role === "provider" && (
                <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="block text-yellow-800 font-bold text-lg">
                      Ortalama Puan
                    </span>
                    <span className="text-yellow-600 text-sm">
                      {user?.ratingCount || 0} değerlendirme
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star
                      size={32}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="text-4xl font-bold text-gray-900">
                      {user?.averageRating || 0}
                    </span>
                  </div>
                </div>
              )}

              {/* Çıkış Butonu */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-xl font-bold hover:bg-red-100 transition mt-4"
              >
                <LogOut size={20} /> Güvenli Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
