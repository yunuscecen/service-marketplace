import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { Users, Ban, CheckCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error("Kullanıcılar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/suspend`);
      toast.success("Durum güncellendi.");
      fetchUsers(); // Listeyi yenile
    } catch (err) {
      toast.error("İşlem başarısız.");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Üye Denetimi</h1>
          <p className="text-gray-500">Tüm kullanıcıları görüntüle ve yönet.</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Users size={18} /> Toplam: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Kullanıcı
              </th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Rol
              </th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Durum
              </th>
              <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                Aksiyon
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <div className="font-semibold text-gray-900">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="p-6">
                  <span
                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                      u.role === "admin"
                        ? "bg-indigo-50 text-indigo-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-6">
                  {u.isSuspended ? (
                    <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                      <Ban size={14} /> ASKIDA
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-500 font-bold text-xs">
                      <CheckCircle size={14} /> AKTİF
                    </div>
                  )}
                </td>
                <td className="p-6 text-right">
                  <button
                    onClick={() => handleToggleStatus(u._id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      u.isSuspended
                        ? "bg-green-600 text-white shadow-lg shadow-green-100"
                        : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    {u.isSuspended ? "Erişimi Aç" : "Askıya Al"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
