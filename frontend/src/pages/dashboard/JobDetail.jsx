import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Link eklendi
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Send,
  AlertCircle,
  CheckCircle,
  Lock, // Lock ikonu eklendi
} from "lucide-react";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myOffer, setMyOffer] = useState(null);

  // Kullanıcının teklif hakkı var mı kontrolü
  const hasCredits = user?.credits > 0;

  const [offerData, setOfferData] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await api.get(`/requests/${id}`);
        setJob(jobRes.data.data);

        if (user) {
          const offersRes = await api.get(`/offers/request/${id}`);
          const offers = offersRes.data.data;
          const currentUserId = user._id || user.id;

          const found = offers.find((o) => {
            const offerProviderId = o.provider?._id || o.provider;
            return offerProviderId.toString() === currentUserId.toString();
          });

          if (found) {
            setMyOffer(found);
          }
        }
      } catch (error) {
        // Hata yönetimi
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Güvenlik: Eğer hakkı yoksa submit işlemini engelle
    if (!hasCredits) {
      toast.error("Teklif verebilmek için paket satın almalısınız.");
      return;
    }

    try {
      await api.post("/offers", {
        requestId: id,
        price: offerData.price,
        deliveryTime: offerData.deliveryTime,
        message: offerData.message,
      });
      toast.success("Teklifiniz başarıyla gönderildi!");

      setMyOffer({
        price: offerData.price,
        deliveryTime: offerData.deliveryTime,
        message: offerData.message,
        status: "pending",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Teklif gönderilemedi.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-10 text-center">Yükleniyor...</div>
      </DashboardLayout>
    );
  if (!job) return null;

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft size={18} className="mr-2" /> Geri Dön
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SOL: İLAN DETAYLARI */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                {job.service?.name}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${job.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {job.status === "active" ? "Teklife Açık" : "Bekliyor"}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {job.service?.name}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {job.city}/{job.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(job.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                Açıklama
              </h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div className="space-y-2">
              {job.answers &&
                job.answers.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm border-b pb-1 last:border-0 border-gray-100"
                  >
                    <span className="text-gray-500">{a.question}</span>
                    <span className="font-medium text-gray-900">
                      {a.answer}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* SAĞ: TEKLİF FORMU veya DURUM BİLGİSİ */}
        <div>
          {myOffer ? (
            <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-2">
                Teklif Verildi!
              </h2>

              <p className="text-green-700 mb-4">
                Bu iş için teklifini zaten ilettin.
              </p>
              {myOffer && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1 tracking-wider">
                    İlan Sahibi İle İletişime Geç
                  </p>
                  <a
                    href={`tel:${job.user?.phone}`}
                    className="text-lg font-bold text-blue-800 flex items-center gap-2 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {job.user?.phone || "Telefon belirtilmedi"}
                  </a>
                </div>
              )}
              <div className="bg-white p-4 rounded-xl text-left shadow-sm inline-block w-full">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Fiyat:</span>
                  <span className="font-bold">{myOffer.price} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Süre:</span>
                  <span className="font-bold">{myOffer.deliveryTime}</span>
                </div>
                <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                  Durum:{" "}
                  <span
                    className={`font-bold uppercase ${myOffer.status === "accepted" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {myOffer.status === "pending"
                      ? "Cevap Bekleniyor"
                      : myOffer.status === "accepted"
                        ? "KABUL EDİLDİ"
                        : myOffer.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // FORM BÖLGESİ
            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-blue-100 sticky top-4 overflow-hidden">
              {/* EĞER PAKET YOKSA GÖZÜKECEK OLAN BLUR KATMANI */}
              {!hasCredits && (
                <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-white/60 flex flex-col items-center justify-center p-6 text-center transition-all">
                  <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 mb-4 border border-blue-50">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Teklif Verme Kısıtlı
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 px-4 font-medium">
                    İlanlara teklif verebilmek için aktif bir paketiniz
                    olmalıdır.
                  </p>
                  <Link
                    to="/dashboard/packages"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm"
                  >
                    Paket Satın Al
                  </Link>
                </div>
              )}

              {/* FORM İÇERİĞİ */}
              <div className={!hasCredits ? "opacity-40" : ""}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Send size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Teklif Ver
                    </h2>
                    <p className="text-xs text-gray-500">
                      Müşteriye en uygun fiyatı sun.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiyat (TL)
                    </label>
                    <input
                      type="number"
                      required
                      disabled={!hasCredits}
                      placeholder="5000"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      value={offerData.price}
                      onChange={(e) =>
                        setOfferData({ ...offerData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Süre
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!hasCredits}
                      placeholder="3 Gün"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50"
                      value={offerData.deliveryTime}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          deliveryTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesaj
                    </label>
                    <textarea
                      rows="4"
                      required
                      disabled={!hasCredits}
                      placeholder="Müşteriye kendinizi tanıtın..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-50"
                      value={offerData.message}
                      onChange={(e) =>
                        setOfferData({ ...offerData, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={!hasCredits}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
                  >
                    Teklifi Gönder
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
