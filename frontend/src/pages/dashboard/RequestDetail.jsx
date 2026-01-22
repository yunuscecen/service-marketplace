import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  User,
  Star,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- PUANLAMA MODALI İÇİN STATE ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    text: "",
  });
  // ----------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRes = await api.get(`/requests/${id}`);
        setRequest(reqRes.data.data);

        const offerRes = await api.get(`/offers/request/${id}`);
        setOffers(offerRes.data.data);
      } catch (error) {
        toast.error("Veriler alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm("Bu teklifi kabul etmek istediğine emin misin?"))
      return;
    try {
      await api.put(`/offers/${offerId}/accept`);
      toast.success("Teklif kabul edildi! İş başladı.");
      setRequest((prev) => ({ ...prev, status: "in_progress" }));
      setOffers((prev) =>
        prev.map((o) =>
          o._id === offerId
            ? { ...o, status: "accepted" }
            : { ...o, status: "rejected" },
        ),
      );
    } catch (error) {
      toast.error("İşlem başarısız.");
    }
  };

  // --- PUANLAMA GÖNDERME ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        requestId: id,
        rating: reviewData.rating,
        title: reviewData.title,
        text: reviewData.text,
      });
      toast.success("Yorumunuz kaydedildi ve iş tamamlandı! 🎉");
      setIsReviewModalOpen(false);
      setRequest((prev) => ({ ...prev, status: "completed" })); // Durumu güncelle
    } catch (error) {
      toast.error(error.response?.data?.error || "Yorum gönderilemedi.");
    }
  };
  // -------------------------

  if (loading)
    return (
      <DashboardLayout>
        <div>Yükleniyor...</div>
      </DashboardLayout>
    );
  if (!request) return null;

  // Yıldız Seçimi İçin Yardımcı
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setReviewData({ ...reviewData, rating: star })}
        className={`text-2xl transition ${star <= reviewData.rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        <Star fill={star <= reviewData.rating ? "currentColor" : "none"} />
      </button>
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <Clock size={16} /> Onay Bekliyor
          </span>
        );
      case "active":
        return (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <CheckCircle size={16} /> Teklife Açık
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <Clock size={16} /> İşlemde
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <CheckCircle size={16} /> Tamamlandı
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition mb-4"
        >
          <ArrowLeft size={18} className="mr-2" /> Taleplerime Dön
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {request.service?.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Talep No: #{request._id.slice(-6).toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}

            {/* --- İŞİ TAMAMLA BUTONU --- */}
            {request.status === "in_progress" && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition animate-pulse"
              >
                ✓ İşi Tamamla & Puanla
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL KOLON */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
              Hizmet Detayları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Konum</span>
                  <span className="font-semibold text-gray-900">
                    {request.city} / {request.district}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Tarih</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(request.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Açıklama
              </h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                {request.description}
              </p>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON: Teklif Listesi */}
        <div className="lg:col-span-1">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200 mb-6">
            <h3 className="text-xl font-bold mb-2">Gelen Teklifler</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-4xl font-bold">{offers.length}</span>
              <span className="opacity-80">Teklif var</span>
            </div>
          </div>

          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className={`bg-white p-5 rounded-xl border-2 transition-all ${offer.status === "accepted" ? "border-green-500 ring-2 ring-green-100" : "border-gray-100"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                      <User size={14} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {offer.provider?.name}
                      </h4>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-blue-600">
                    {offer.price} ₺
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3">
                  "{offer.message}"
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                    ⏱ {offer.deliveryTime}
                  </span>

                  {/* Kabul Et Butonu Sadece Bekleyen İşlerde Çıkar */}
                  {request.status === "active" && (
                    <button
                      onClick={() => handleAcceptOffer(offer._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                      Kabul Et
                    </button>
                  )}

                  {offer.status === "accepted" && (
                    <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                      <CheckCircle size={16} /> KABUL EDİLDİ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- PUANLAMA MODALI (Pop-up) --- */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Hizmeti Değerlendir</h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Hizmetten ne kadar memnun kaldın?
                </p>
                <div className="flex justify-center gap-2 mb-4">
                  {renderStars()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık
                </label>
                <input
                  type="text"
                  required
                  maxLength="50"
                  placeholder="Örn: Harika işçilik!"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={reviewData.title}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yorumunuz
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Deneyiminizden bahsedin..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={reviewData.text}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, text: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
              >
                Gönder ve Tamamla
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RequestDetail;
