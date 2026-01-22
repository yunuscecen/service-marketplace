import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import {
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={14} /> Cevap Bekleniyor
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tekliflerim</h1>
        <p className="text-gray-500">
          Verdiğiniz tekliflerin durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : offers.length > 0 ? (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className={`bg-white p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all ${offer.status === "accepted" ? "border-l-green-500" : offer.status === "rejected" ? "border-l-red-400" : "border-l-yellow-400"}`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                {/* Sol: İlan Bilgisi */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {offer.request?.service?.name || "Hizmet"}
                    </h3>
                    {getStatusBadge(offer.status)}
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

                {/* Sağ: Aksiyon */}
                <div>
                  <Link
                    to={`/dashboard/job/${offer.request?._id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    İlanı Görüntüle <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Eğer KABUL edildiyse Müşteri Mesajı veya Bilgilendirme */}
              {offer.status === "accepted" && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg text-sm text-green-800 border border-green-200 flex items-start gap-2">
                  <CheckCircle className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Tebrikler! Teklifiniz kabul edildi.</strong>
                    <p>
                      Müşteri ile iletişime geçip işe başlayabilirsiniz. İş
                      tamamlandığında müşteri onayı ile ücretinizi alacaksınız.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Henüz bir teklif vermedin.
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
