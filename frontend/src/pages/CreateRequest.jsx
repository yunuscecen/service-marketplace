import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Calendar,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const CreateRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hangi adımdayız?
  const [step, setStep] = useState(0);

  // Dinamik Cevaplar (Özel Sorular İçin)
  const [dynamicAnswers, setDynamicAnswers] = useState({});

  // Standart Form Verileri
  const [formData, setFormData] = useState({
    city: "",
    district: "",
    datePreference: "",
    description: "",
  });

  // Hizmet Bilgisini Çek
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data.data);
      } catch (error) {
        toast.error("Hizmet bilgileri alınamadı.");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchService();
    else {
      toast.error("Giriş yapmalısınız.");
      navigate("/login");
    }
  }, [serviceId, user, navigate]);

  // TOPLAM ADIM SAYISI
  const questionCount = service?.questions?.length || 0;
  const totalSteps = questionCount + 3;

  // Sonraki Adıma Geç
  const nextStep = () => {
    // 1. Dinamik Soruların Kontrolü
    if (step < questionCount) {
      const currentQuestion = service.questions[step];
      const answer = dynamicAnswers[currentQuestion.questionText];

      if (currentQuestion.inputType === "checkbox") {
        if (!answer || answer.length === 0)
          return toast.error("Lütfen en az bir seçenek işaretleyin.");
      } else {
        if (!answer)
          return toast.error("Lütfen bir seçim yapın veya cevap yazın.");
      }
    }

    // 2. Standart Alanların Kontrolü
    if (
      step === questionCount &&
      (!formData.city || !formData.district || !formData.datePreference)
    ) {
      return toast.error("Lütfen konum ve tarih bilgilerini doldurun.");
    }
    if (step === questionCount + 1 && !formData.description) {
      return toast.error("Lütfen detaylı açıklama yazın.");
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  // Dinamik Cevap Güncelleme
  const handleDynamicChange = (questionText, value, type) => {
    if (type === "checkbox") {
      const existing = dynamicAnswers[questionText] || [];
      if (existing.includes(value)) {
        setDynamicAnswers({
          ...dynamicAnswers,
          [questionText]: existing.filter((item) => item !== value),
        });
      } else {
        setDynamicAnswers({
          ...dynamicAnswers,
          [questionText]: [...existing, value],
        });
      }
    } else {
      // Radio, Select, Text, Number
      setDynamicAnswers({
        ...dynamicAnswers,
        [questionText]: value,
      });
    }
  };

  // Formu Gönder
  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(dynamicAnswers).map(([q, a]) => ({
      question: q,
      answer: Array.isArray(a) ? a.join(", ") : a,
    }));

    formattedAnswers.push({
      question: "Ne zaman lazım?",
      answer: formData.datePreference,
    });

    const requestPayload = {
      serviceId: serviceId,
      city: formData.city,
      district: formData.district,
      description: formData.description,
      answers: formattedAnswers,
    };

    try {
      await api.post("/requests", requestPayload);
      toast.success("Talebiniz başarıyla oluşturuldu!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Bir hata oluştu.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Yükleniyor...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2 font-medium">
          ADIM {step + 1} / {totalSteps + 1}
        </p>
      </div>

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden min-h-[450px] flex flex-col">
        {/* Başlık */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{service?.name}</h2>
            <p className="text-sm text-gray-500">
              {step < questionCount ? "Detayları Belirle" : "Son Adımlar"}
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            {step < questionCount ? (
              <HelpCircle size={20} />
            ) : step === questionCount ? (
              <MapPin size={20} />
            ) : step === questionCount + 1 ? (
              <FileText size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
          </div>
        </div>

        {/* --- İÇERİK ALANI --- */}
        <div className="p-8 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300">
          {/* 1. DİNAMİK SORULAR */}
          {step < questionCount &&
            (() => {
              const q = service.questions[step];
              const currentAns = dynamicAnswers[q.questionText];

              return (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {q.questionText}
                  </h3>

                  <div className="space-y-3">
                    {/* SELECT */}
                    {q.inputType === "select" && (
                      <select
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg bg-white"
                        onChange={(e) =>
                          handleDynamicChange(
                            q.questionText,
                            e.target.value,
                            "select",
                          )
                        }
                        value={currentAns || ""}
                      >
                        <option value="">Seçiniz...</option>
                        {q.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* RADIO */}
                    {q.inputType === "radio" &&
                      q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            handleDynamicChange(q.questionText, opt, "radio")
                          }
                          className={`w-full p-4 rounded-xl border-2 text-left text-lg font-medium transition-all flex items-center justify-between group ${
                            currentAns === opt
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-gray-100 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                        >
                          {opt}
                          {currentAns === opt && (
                            <CheckCircle className="text-blue-600" />
                          )}
                        </button>
                      ))}

                    {/* CHECKBOX */}
                    {q.inputType === "checkbox" &&
                      q.options.map((opt) => {
                        const isSelected = (currentAns || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() =>
                              handleDynamicChange(
                                q.questionText,
                                opt,
                                "checkbox",
                              )
                            }
                            className={`w-full p-4 rounded-xl border-2 text-left text-lg font-medium transition-all flex items-center justify-between group ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-gray-100 hover:border-blue-300 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                            {isSelected ? (
                              <CheckCircle className="text-blue-600" />
                            ) : (
                              <div className="w-5 h-5 border-2 rounded border-gray-300"></div>
                            )}
                          </button>
                        );
                      })}

                    {/* TEXT */}
                    {q.inputType === "text" && (
                      <input
                        type="text"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                        placeholder="Cevabınızı yazın..."
                        value={currentAns || ""}
                        onChange={(e) =>
                          handleDynamicChange(
                            q.questionText,
                            e.target.value,
                            "text",
                          )
                        }
                        autoFocus
                      />
                    )}

                    {/* --- EKLENEN KISIM: NUMBER (SAYI) --- */}
                    {q.inputType === "number" && (
                      <input
                        type="number"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg"
                        placeholder="Bir sayı girin..."
                        value={currentAns || ""}
                        onChange={(e) =>
                          handleDynamicChange(
                            q.questionText,
                            e.target.value,
                            "number",
                          )
                        }
                        autoFocus
                      />
                    )}

                    {/* --- EKLENEN KISIM: TEXTAREA (UZUN YAZI) --- */}
                    {q.inputType === "textarea" && (
                      <textarea
                        rows="4"
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg resize-none"
                        placeholder="Detaylı cevabınızı yazın..."
                        value={currentAns || ""}
                        onChange={(e) =>
                          handleDynamicChange(
                            q.questionText,
                            e.target.value,
                            "textarea",
                          )
                        }
                        autoFocus
                      ></textarea>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* 2. KONUM VE ZAMAN */}
          {step === questionCount && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Konum ve Zaman
              </h3>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Şehir (Örn: İstanbul)"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="İlçe (Örn: Kadıköy)"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
                <select
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.datePreference}
                  onChange={(e) =>
                    setFormData({ ...formData, datePreference: e.target.value })
                  }
                >
                  <option value="">Ne zaman lazım?</option>
                  <option value="Acil">Hemen (Acil)</option>
                  <option value="Bu hafta">Bu hafta</option>
                  <option value="Bu ay">Bu ay</option>
                </select>
              </div>
            </div>
          )}

          {/* 3. AÇIKLAMA */}
          {step === questionCount + 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Eklemek istediklerin var mı?
              </h3>
              <textarea
                rows="5"
                placeholder="Örn: Ev 3+1, eşyalı, genel temizlik yapılacak..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                autoFocus
              ></textarea>
            </div>
          )}

          {/* 4. ÖZET */}
          {step === questionCount + 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Her şey hazır!
                </h3>
                <p className="text-gray-500">
                  Bilgilerini kontrol et ve yayınla.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl space-y-3 text-sm max-h-60 overflow-y-auto">
                {Object.entries(dynamicAnswers).map(([q, a]) => (
                  <div
                    key={q}
                    className="flex justify-between border-b border-gray-200 pb-2 last:border-0"
                  >
                    <span className="text-gray-500 w-1/2">{q}:</span>
                    <span className="font-semibold text-gray-900 w-1/2 text-right">
                      {Array.isArray(a) ? a.join(", ") : a}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-gray-200 pb-2 pt-2">
                  <span className="text-gray-500">Konum:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.city} / {formData.district}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">Zaman:</span>
                  <span className="font-semibold text-gray-900">
                    {formData.datePreference}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ALT BUTONLAR */}
        <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
          {step > 0 ? (
            <button
              onClick={prevStep}
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft size={18} className="mr-2" /> Geri
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
            >
              Devam Et <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1"
            >
              Yayınla <CheckCircle size={20} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
