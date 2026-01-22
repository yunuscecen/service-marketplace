// src/pages/dashboard/DashboardHome.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  TrendingUp,
  List,
  Clock,
  CheckCircle,
  Plus,
  Briefcase,
  Star,
  Zap, // Yeni eklendi
} from "lucide-react";

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    list: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === "user") {
          const res = await api.get("/requests/my-requests");
          const data = res.data.data;
          setStats({
            total: data.length,
            active: data.filter(
              (r) => r.status === "active" || r.status === "pending",
            ).length,
            completed: data.filter((r) => r.status === "completed").length,
            list: data.slice(0, 5),
          });
        } else {
          const res = await api.get("/offers/my-offers");
          const data = res.data.data;
          setStats({
            total: data.length,
            active: data.filter((o) => o.status === "accepted").length,
            completed: user?.ratingCount || 0,
            list: data.slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Dashboard verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- MÜŞTERİ ARAYÜZÜ ---
  const UserDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Toplam Talep</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <List size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Aktif / Bekleyen</p>
            <h3 className="text-3xl font-bold text-yellow-600">
              {stats.active}
            </h3>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Tamamlanan</p>
            <h3 className="text-3xl font-bold text-green-600">
              {stats.completed}
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            Son Taleplerim
          </h3>
          <div className="space-y-3">
            {stats.list.length > 0 ? (
              stats.list.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition border-b last:border-0 border-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-900 block">
                      {item.service?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Henüz talep yok.</p>
            )}
          </div>
          <Link
            to="/dashboard/my-requests"
            className="block text-center text-blue-600 text-sm font-medium mt-4 hover:underline"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-center text-center shadow-lg shadow-blue-200">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Yeni Hizmet Al</h3>
          <p className="text-blue-100 text-sm mb-6">
            İhtiyacın olan hizmeti hemen bul ve teklifleri topla.
          </p>
          <Link
            to="/services"
            className="bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
          >
            Talep Oluştur
          </Link>
        </div>
      </div>
    </>
  );

  // --- HİZMET VEREN ARAYÜZÜ ---
  const ProviderDashboard = () => (
    <>
      {/* YENİ: Teklif Hakkı Bakiyesi Kartı */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-8 text-white mb-8 shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
              Paket Durumu
            </span>
          </div>
          <h2 className="text-1xl">
            {user?.offerLimit > 0
              ? "Profesyonel Üyelik"
              : "Teklif verebilmeniz için lütfen paket satın alın."}
          </h2>
        </div>

        <div className="text-center md:text-right mt-6 md:mt-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1">
            Kalan Teklif Hakkı
          </p>
          <div className="text-6xl font-black tracking-tighter leading-none">
            {user?.offerLimit || 0}
          </div>
        </div>

        <Link
          to="/dashboard/packages"
          className="mt-6 md:mt-0 bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all hover:scale-105"
        >
          Paket Satın Al
        </Link>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Verilen Teklif</p>
            <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
            <Briefcase size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Kazanılan İş</p>
            <h3 className="text-3xl font-bold text-green-600">
              {stats.active}
            </h3>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Ortalama Puan</p>
            <h3 className="text-3xl font-bold text-yellow-500">
              {user?.averageRating || 0}
            </h3>
          </div>
          <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600">
            <Star size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-4">
            Son Tekliflerin
          </h3>
          <div className="space-y-3">
            {stats.list.length > 0 ? (
              stats.list.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition border-b last:border-0 border-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-900 block">
                      {item.request?.service?.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {item.price} ₺
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === "accepted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Henüz teklif vermedin.</p>
            )}
          </div>
          <Link
            to="/dashboard/my-offers"
            className="block text-center text-blue-600 text-sm font-medium mt-4 hover:underline"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
          <Briefcase size={48} className="text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Yeni İş Fırsatları</h3>
          <p className="text-gray-400 text-sm mb-6">
            Becerilerine uygun yeni ilanları incele ve hemen kazanmaya başla.
          </p>
          <Link
            to="/dashboard/jobs"
            className="bg-white text-gray-900 py-3 px-8 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            İlanlara Git
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Hoş geldin, {user?.name} 👋
        </h1>
        <p className="text-gray-500">Bugün neler yapmak istersin?</p>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-400 italic">
          Veriler hazırlanıyor...
        </div>
      ) : user?.role === "user" ? (
        <UserDashboard />
      ) : (
        <ProviderDashboard />
      )}
    </DashboardLayout>
  );
};

export default DashboardHome;
