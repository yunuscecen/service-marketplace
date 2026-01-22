// src/pages/dashboard/AdminServices.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { Plus, Trash2, Layers, Edit } from "lucide-react";
import toast from "react-hot-toast";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.data);
    } catch (error) {
      toast.error("Hizmetler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/services", formData);
      toast.success("Yeni hizmet eklendi!");
      setFormData({ name: "", description: "" });
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ekleme başarısız.");
    }
  };

  // --- SİLME FONKSİYONU ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bu hizmeti silmek istediğine emin misin?")) return;

    try {
      await api.delete(`/services/${id}`);
      toast.success("Hizmet silindi.");
      // Listeden silineni çıkar
      setServices(services.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Silme işlemi başarısız.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hizmet Yönetimi</h1>
          <p className="text-gray-500">
            Platformdaki hizmet kategorilerini yönet.
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Layers size={20} /> Toplam: {services.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOL: FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Plus size={20} className="text-blue-600" /> Hızlı Hizmet Ekle
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hizmet Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Nakliye"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Açıklama
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Kısa açıklama..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
              >
                Kaydet
              </button>
            </form>
          </div>
        </div>

        {/* SAĞ: LİSTE */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Hizmet Adı
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">
                    Açıklama
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500">
                      Yükleniyor...
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr
                      key={service._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="p-4 text-gray-500 text-sm max-w-xs truncate">
                        {service.description}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <Link
                          to={`/dashboard/admin/services/${service._id}`}
                          className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {services.length === 0 && !loading && (
              <div className="p-6 text-center text-gray-500">
                Hizmet bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminServices;
