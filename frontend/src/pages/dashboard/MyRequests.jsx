// src/pages/dashboard/MyRequests.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { Calendar, MapPin, Eye, List } from "lucide-react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/requests/my-requests");
        setRequests(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Durum Rozetleri
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
            Onay Bekliyor
          </span>
        );
      case "active":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            Teklife Açık
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            İşlemde
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
            Tamamlandı
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
            Belirsiz
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Taleplerim</h1>
        <Link
          to="/services"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          + Yeni Talep Oluştur
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">Yükleniyor...</div>
      ) : requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              {/* Sol Taraf: Bilgiler */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {req.service?.name}
                  </h3>
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} /> {req.city} / {req.district}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />{" "}
                    {new Date(req.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </div>

                <p className="mt-3 text-gray-600 text-sm line-clamp-1 max-w-xl">
                  {req.description}
                </p>
              </div>

              {/* Sağ Taraf: Aksiyon ve Teklif Sayısı */}
              <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-4 md:mt-0">
                <div className="text-center px-4">
                  {/* DÜZELTİLEN KISIM: Teklif Sayısı Dinamik Geliyor */}
                  <span className="block text-xl font-bold text-blue-600">
                    {req.offerCount || 0}
                  </span>
                  <span className="text-xs text-gray-400">Teklif</span>
                </div>
                <Link
                  to={`/dashboard/request/${req._id}`}
                  className="flex-1 md:flex-none bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Eye size={18} /> Detaylar
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <List size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Henüz bir talebiniz yok.
          </h3>
          <p className="text-gray-500 mb-6">
            Hemen ihtiyacınız olan hizmeti seçin ve teklif almaya başlayın.
          </p>
          <Link
            to="/services"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Hizmet Bul
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyRequests;
