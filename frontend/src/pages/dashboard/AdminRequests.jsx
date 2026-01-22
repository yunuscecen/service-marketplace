import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { Trash2, Eye, ClipboardList, User, Tag } from "lucide-react";
import toast from "react-hot-toast";

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // Teklifleri görmek için

  const fetchRequests = async () => {
    try {
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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bu ilanı ve tüm teklifleri silmek istediğine emin misin?",
      )
    )
      return;
    try {
      await api.delete(`/admin/requests/${id}`);
      toast.success("İlan silindi.");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tighter text-gray-900 uppercase">
            İlan Denetimi
          </h1>
          <p className="text-gray-400 font-light mt-2">
            Platformdaki tüm müşteri taleplerini yönetin.
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-black text-xs tracking-widest border border-blue-100 uppercase">
          {requests.length} AKTİF İLAN
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
                Teklifler
              </th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.map((req) => (
              <tr
                key={req._id}
                className="group hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-6">
                  <div className="font-semibold text-gray-900 truncate max-w-xs">
                    {req.description}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 font-mono uppercase">
                    <User size={10} /> {req.user?.name}
                  </div>
                </td>
                <td className="p-6">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {req.service?.name}
                  </span>
                </td>
                <td className="p-6">
                  <button
                    onClick={() => setSelectedJob(req)}
                    className="flex items-center gap-2 text-blue-600 hover:underline font-bold text-xs"
                  >
                    <Eye size={14} /> {req.offerCount} Teklif
                  </button>
                </td>
                <td className="p-6 text-right">
                  <button
                    onClick={() => handleDelete(req._id)}
                    className="bg-red-50 text-red-600 p-3 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- TEKLİF VERENLERİ GÖSTEREN MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-8">
              <h2 className="text-2xl font-bold tracking-tighter">
                İlana Verilen Teklifler
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-black font-black uppercase tracking-widest text-[10px]"
              >
                Kapat [X]
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {selectedJob.offers.length > 0 ? (
                selectedJob.offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="p-5 border border-gray-100 rounded-3xl flex justify-between items-center bg-gray-50/30"
                  >
                    <div>
                      <div className="font-bold text-gray-900">
                        {offer.provider?.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {offer.provider?.email}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-blue-600 tracking-tighter">
                        {offer.price} TL
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold">
                        {offer.deliveryTime}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-gray-400 italic">
                  Bu ilana henüz teklif verilmemiş.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminRequests;
