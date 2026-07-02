import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";

import {
  Trash2,
  Eye,
  User,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/requests");
      setRequests(res.data.data);
    } catch (err) {
      toast.error("İlanlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Onay Bekliyor",
          className: "bg-yellow-50 text-yellow-700 border-yellow-100",
        };
      case "active":
  return {
    text: "Teklife Açık",
    className: "bg-green-50 text-green-700 border-green-100",
  };
      case "in_progress":
        return {
          text: "İş Devam Ediyor",
          className: "bg-blue-50 text-blue-700 border-blue-100",
        };
      case "completed":
        return {
          text: "Tamamlandı",
          className: "bg-gray-100 text-gray-700 border-gray-200",
        };
      case "canceled":
        return {
          text: "İptal Edildi",
          className: "bg-red-50 text-red-700 border-red-100",
        };
      case "rejected":
        return {
          text: "Reddedildi",
          className: "bg-red-50 text-red-700 border-red-100",
        };
      default:
        return {
          text: "Bilinmiyor",
          className: "bg-gray-50 text-gray-600 border-gray-100",
        };
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Bu ilanı onaylayıp yayına almak istiyor musun?")) {
      return;
    }

    try {
      setActionLoadingId(id);

      const res = await api.put(`/admin/requests/${id}/approve`);

      toast.success(res.data.message || "İlan onaylandı.");

      setRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,
                ...res.data.data,
              }
            : request
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "İlan onaylanamadı.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      "İlan neden reddediliyor? Boş bırakırsan varsayılan açıklama yazılır."
    );

    if (reason === null) {
      return;
    }

    try {
      setActionLoadingId(id);

      const res = await api.put(`/admin/requests/${id}/reject`, {
        reason,
      });

      toast.success(res.data.message || "İlan reddedildi.");

      setRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,
                ...res.data.data,
              }
            : request
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "İlan reddedilemedi.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bu ilanı ve tüm teklifleri silmek istediğine emin misin?"
      )
    ) {
      return;
    }

    try {
      setActionLoadingId(id);

      await api.delete(`/admin/requests/${id}`);

      toast.success("İlan silindi.");

      setRequests((prev) => prev.filter((request) => request._id !== id));
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            İlanlar yükleniyor...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tighter text-gray-900 uppercase">
            İlan Denetimi
          </h1>

          <p className="text-gray-400 font-light mt-2">
            Platformdaki müşteri taleplerini onaylayın, reddedin veya silin.
          </p>
        </div>

        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-xs tracking-widest border border-blue-100 uppercase">
          {requests.length} TOPLAM İLAN
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                İlan / Müşteri
              </th>

              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Kategori
              </th>

              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Durum
              </th>

              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Teklifler
              </th>

              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                İşlem
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {requests.length > 0 ? (
              requests.map((req) => {
                const statusInfo = getStatusInfo(req.status);
                const isLoading = actionLoadingId === req._id;

                return (
                  <tr
                    key={req._id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-6">
                      <div className="font-semibold text-gray-900 truncate max-w-xs">
                        {req.description || "Açıklama girilmemiş"}
                      </div>

                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-mono uppercase">
                        <User size={10} /> {req.user?.name || "Kullanıcı yok"}
                      </div>
                    </td>

                    <td className="p-6">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {req.service?.name || "Kategori yok"}
                      </span>
                    </td>

                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusInfo.className}`}
                      >
                        {statusInfo.text}
                      </span>

                      {req.status === "rejected" && req.rejectionReason && (
                        <p className="text-[10px] text-red-400 mt-2 max-w-xs">
                          {req.rejectionReason}
                        </p>
                      )}
                    </td>

                    <td className="p-6">
                      <button
                        onClick={() => setSelectedJob(req)}
                        className="flex items-center gap-2 text-blue-600 hover:underline font-bold text-xs"
                      >
                        <Eye size={14} /> {req.offerCount || 0} Teklif
                      </button>
                    </td>

                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(req._id)}
                              disabled={isLoading}
                              className="bg-green-50 text-green-600 p-3 rounded-2xl hover:bg-green-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              title="İlanı onayla"
                            >
                              {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                            </button>

                            <button
                              onClick={() => handleReject(req._id)}
                              disabled={isLoading}
                              className="bg-orange-50 text-orange-600 p-3 rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              title="İlanı reddet"
                            >
                              {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <XCircle size={18} />
                              )}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(req._id)}
                          disabled={isLoading}
                          className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          title="İlanı sil"
                        >
                          {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Henüz sistemde ilan bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tighter">
                  İlana Verilen Teklifler
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedJob.description || "Açıklama girilmemiş"}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-black font-black uppercase tracking-widest text-[10px]"
              >
                Kapat [X]
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {selectedJob.offers && selectedJob.offers.length > 0 ? (
                selectedJob.offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="p-5 border border-gray-100 rounded-3xl flex justify-between items-center bg-gray-50/30"
                  >
                    <div>
                      <div className="font-bold text-gray-900">
                        {offer.provider?.name || "Provider yok"}
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        {offer.provider?.email || "E-posta yok"}
                      </div>

                      {offer.message && (
                        <p className="text-xs text-gray-500 mt-2 max-w-sm">
                          {offer.message}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-blue-600 tracking-tighter">
                        {offer.price} TL
                      </div>

                      <div className="text-xs text-gray-400">
                        {offer.deliveryTime}
                      </div>

                      <div className="text-[10px] font-black uppercase text-gray-400 mt-2">
                        {offer.status || "pending"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  Bu ilana henüz teklif verilmemiş.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminRequests;