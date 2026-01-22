import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext"; // AuthContext eklendi
import { io } from "socket.io-client"; // Socket eklendi
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

// Socket sunucu adresi
const socket = io("http://localhost:5000");

const MyOffers = () => {
  const { user } = useAuth(); // Kullanıcı bilgisi için
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get("/offers/my-offers");
        setOffers(res.data.data);
      } catch (error) {
        console.error("Teklifler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  // --- ANLIK BİLDİRİM DİNLEYİCİSİ (TASARIMI BOZMAYAN GÜNCELLEME) ---
  useEffect(() => {
    if (user) {
      // Sunucuya bu kullanıcının bildirimleri alması gerektiğini bildiriyoruz
      socket.emit("setup", user._id || user.id);
    }

    const handleNewNotification = (data) => {
      const currentUserId = user?._id || user?.id;
      const senderId = data.sender?._id || data.sender;

      if (senderId !== currentUserId) {
        setOffers((prevOffers) =>
          prevOffers.map((offer) => {
            // EĞER gelen mesajın chatId'si veya requestId'si bu teklifle eşleşiyorsa sayıyı artır
            if (
              offer.chatId === data.chatId ||
              offer.request?._id === data.requestId
            ) {
              return { ...offer, unreadCount: (offer.unreadCount || 0) + 1 };
            }
            return offer;
          }),
        );
      }
    };

    socket.on("receive_message", handleNewNotification);
    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("receive_message", handleNewNotification);
      socket.off("new_notification", handleNewNotification);
    };
  }, [user]);

  const filteredOffers = offers.filter((offer) => {
    if (filter === "all") return true;
    if (filter === "accepted") return offer.status === "accepted";
    if (filter === "pending") return offer.status === "pending";
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle size={14} /> Kabul Edildi
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle size={14} /> Reddedildi
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <Clock size={16} /> Cevap Bekleniyor
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tekliflerim</h1>
          <p className="text-gray-500">
            Verdiğiniz tekliflerin durumunu buradan takip edebilirsiniz.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 self-start">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "all" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Tümü
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "accepted" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Kabul Edilenler
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "pending" ? "bg-white text-yellow-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Cevap Beklenenler
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center">Yükleniyor...</div>
      ) : filteredOffers.length > 0 ? (
        <div className="grid gap-4">
          {filteredOffers.map((offer) => (
            <div
              key={offer._id}
              className={`bg-white p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${offer.status === "accepted" ? "border-l-green-500" : offer.status === "rejected" ? "border-l-red-400" : "border-l-yellow-400"}`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {offer.request?.service?.name || "Hizmet"}
                    </h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(offer.status)}
                      {/* OKUNMAMIŞ MESAJ SAYISI */}
                      {offer.unreadCount > 0 && (
                        <div className="flex items-center justify-center relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-white">
                            {offer.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {offer.request?.city} /{" "}
                      {offer.request?.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(offer.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Verdiğin Fiyat: </span>
                    <span className="font-bold text-gray-900">
                      {offer.price} ₺
                    </span>
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-gray-500">Teslim: </span>
                    <span className="font-bold text-gray-900">
                      {offer.deliveryTime}
                    </span>
                  </div>
                </div>

                <div>
                  <Link
                    to={`/dashboard/job/${offer.request?._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    İlanı Görüntüle <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {offer.status === "accepted" && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg text-sm text-green-800 border border-green-200 flex items-start gap-2">
                  <CheckCircle className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Tebrikler! Teklifiniz kabul edildi.</strong>
                    <p>Müşteri ile iletişime geçip işe başlayabilirsiniz.</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {filter === "all"
              ? "Henüz bir teklif vermedin."
              : "Bu kategoride teklifiniz bulunmuyor."}
          </h3>
          <p className="text-gray-500 mb-4">
            İş fırsatlarını inceleyerek hemen kazanmaya başla.
          </p>
          <Link
            to="/dashboard/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
          >
            İş Fırsatlarına Git
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyOffers;
