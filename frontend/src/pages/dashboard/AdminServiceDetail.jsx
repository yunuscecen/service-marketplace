// src/pages/dashboard/AdminServiceDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { ArrowLeft, Plus, Trash2, Save, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

const AdminServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [service, setService] = useState({
    name: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${id}`);
        setService(res.data.data);
      } catch (error) {
        toast.error("Hizmet bulunamadı.");
        navigate("/dashboard/admin/services");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

  const addQuestion = () => {
    setService({
      ...service,
      questions: [
        ...service.questions,
        { questionText: "", inputType: "text", options: [] },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...service.questions];
    newQuestions.splice(index, 1);
    setService({ ...service, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...service.questions];
    if (field === "options") {
      newQuestions[index][field] = value.split(",").map((opt) => opt.trim());
    } else {
      newQuestions[index][field] = value;
    }
    setService({ ...service, questions: newQuestions });
  };

  // --- KAYDETME İŞLEMİ (DÜZELTİLDİ) ---
  const handleSave = async () => {
    // 1. Validasyon: Boş soru var mı?
    const emptyQuestion = service.questions.some(
      (q) => q.questionText.trim() === "",
    );
    if (emptyQuestion) {
      toast.error("Lütfen tüm sorulara bir metin giriniz.");
      return;
    }

    try {
      // 2. Veriyi Temizle: Root _id ve sistem alanlarını çıkar
      // Böylece backend update ederken "Ben bu ID'yi değiştiremem" hatası vermez.
      const payload = {
        name: service.name,
        description: service.description,
        questions: service.questions, // Soruların içindeki _id'ler kalabilir, Mongoose onları günceller
      };

      await api.put(`/services/${id}`, payload);
      toast.success("Hizmet ve sorular başarıyla güncellendi!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Güncelleme başarısız.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div>Yükleniyor...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/dashboard/admin/services")}
          className="flex items-center text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} className="mr-2" /> Listeye Dön
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2"
        >
          <Save size={20} /> Değişiklikleri Kaydet
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Temel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hizmet Adı
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={service.description}
              onChange={(e) =>
                setService({ ...service, description: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Müşteri Soruları
            </h2>
            <p className="text-sm text-gray-500">
              Müşteri talep oluştururken bu soruları cevaplayacak.
            </p>
          </div>
          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={18} /> Soru Ekle
          </button>
        </div>

        <div className="space-y-4">
          {service.questions.map((q, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative group"
            >
              <button
                onClick={() => removeQuestion(index)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <HelpCircle size={18} />
                </div>
                <span className="font-bold text-gray-400">
                  Soru {index + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Soru Metni
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Ev kaç metrekare?"
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                    value={q.questionText}
                    onChange={(e) =>
                      updateQuestion(index, "questionText", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Cevap Tipi
                  </label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                    value={q.inputType}
                    onChange={(e) =>
                      updateQuestion(index, "inputType", e.target.value)
                    }
                  >
                    <option value="text">Kısa Yazı (Text)</option>
                    <option value="number">Sayı (Number)</option>
                    <option value="textarea">Uzun Yazı (Textarea)</option>
                    <option value="select">Seçmeli (Dropdown)</option>
                  </select>
                </div>
              </div>

              {q.inputType === "select" && (
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Seçenekler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 1+1, 2+1, 3+1, Dubleks"
                    className="w-full p-2 border border-yellow-200 bg-yellow-50 rounded-lg outline-none focus:border-yellow-500 text-yellow-800"
                    value={q.options ? q.options.join(", ") : ""}
                    onChange={(e) =>
                      updateQuestion(index, "options", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          ))}

          {service.questions.length === 0 && (
            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              Bu hizmet için henüz soru eklenmemiş.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminServiceDetail;
