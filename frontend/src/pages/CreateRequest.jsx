import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // SEO İçin Eklendi
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  FileText,
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const CreateRequest = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const topRef = useRef(null); // Sayfa geçişlerinde yukarı kaydırma için

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [dynamicAnswers, setDynamicAnswers] = useState({});
 const [formData, setFormData] = useState({
  city: "",
  district: "",
  datePreference: "",
  description: "",
  allowPhoneAfterOffer: true,
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
      toast.error("İlan oluşturmak için giriş yapmalısınız.");
      navigate("/login");
    }
  }, [serviceId, user, navigate]);

  const questionCount = service?.questions?.length || 0;
  const totalSteps = questionCount + 3;

  // Her adım değişiminde sayfayı yukarı kaydır (UX)
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  // Klavye ile "Enter" kontrolü
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      nextStep();
    }
  };

  const nextStep = () => {
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
      setDynamicAnswers({
        ...dynamicAnswers,
        [questionText]: value,
      });
    }
  };

  const handleSubmit = async () => {
  if (submitLoading) return;

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
  allowPhoneAfterOffer: formData.allowPhoneAfterOffer,
};

  try {
    setSubmitLoading(true);

    await api.post("/requests", requestPayload);

    toast.success(
      "Talebiniz oluşturuldu. Admin onayından sonra yayına alınacak."
    );

    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.error || "Bir hata oluştu.");
  } finally {
    setSubmitLoading(false);
  }
};

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Sihirbaz hazırlanıyor...
        </p>
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4 pb-20">
      <div ref={topRef} />

      {/* --- SEO & META TAGS --- */}
      <Helmet>
        <title>
          {service ? `${service.name} İlanı Oluştur` : "Hizmet İlanı Oluştur"} |
          Fırsatİş
        </title>
        <meta
          name="description"
          content={
            service
              ? `${service.name} projeniz için detayları belirleyin, uzmanlardan hızlıca teklif alın.`
              : "Projeniz için uzmanlardan teklif alın."
          }
        />
        <meta name="robots" content="noindex, follow" />{" "}
        {/* Form adımlarının indexlenmesini istemeyiz, ama linkleri takip etsin */}
      </Helmet>

      {/* Progress Bar (Erişilebilir) */}
      <div
        className="w-full max-w-2xl mb-8"
        role="progressbar"
        aria-valuenow={((step + 1) / (totalSteps + 1)) * 100}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
          <span>Başlangıç</span>
          <span>Tamamlanıyor</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-400 mt-2 font-medium">
          Adım {step + 1} / {totalSteps + 1}
        </p>
      </div>

      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden min-h-[500px] flex flex-col border border-gray-100">
        {/* Header */}
        <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {service?.name}
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1">
              {step < questionCount
                ? "Proje detaylarını belirleyelim"
                : "Son birkaç detay kaldı"}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
            {step < questionCount ? (
              <HelpCircle size={24} strokeWidth={1.5} />
            ) : step === questionCount ? (
              <MapPin size={24} strokeWidth={1.5} />
            ) : step === questionCount + 1 ? (
              <FileText size={24} strokeWidth={1.5} />
            ) : (
              <CheckCircle size={24} strokeWidth={1.5} />
            )}
          </div>
        </header>

        {/* --- İÇERİK ALANI --- */}
        <div className="p-8 md:p-10 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-500">
          {/* 1. DİNAMİK SORULAR */}
          {step < questionCount &&
            (() => {
              const q = service.questions[step];
              const currentAns = dynamicAnswers[q.questionText];

              return (
                <fieldset className="space-y-8">
                  <legend className="text-3xl font-bold text-gray-900 leading-tight block mb-4">
                    {q.questionText}
                  </legend>

                  <div className="space-y-4">
                    {/* SELECT */}
                    {q.inputType === "select" && (
                      <div className="relative">
                        <select
                          id={`question-${step}`}
                          className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg appearance-none cursor-pointer transition-all hover:bg-white"
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
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ChevronRight className="rotate-90" />
                        </div>
                      </div>
                    )}

                    {/* RADIO BUTTONS (SEMANTİK) */}
                    {q.inputType === "radio" &&
                      q.options.map((opt, idx) => (
                        <label
                          key={opt}
                          htmlFor={`opt-${idx}`}
                          className={`w-full p-5 rounded-2xl border-2 text-left text-lg font-medium transition-all flex items-center justify-between group cursor-pointer ${
                            currentAns === opt
                              ? "border-blue-600 bg-blue-50/50 text-blue-800 shadow-sm"
                              : "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name={q.questionText}
                              id={`opt-${idx}`}
                              value={opt}
                              checked={currentAns === opt}
                              onChange={() =>
                                handleDynamicChange(
                                  q.questionText,
                                  opt,
                                  "radio",
                                )
                              }
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            {opt}
                          </div>
                        </label>
                      ))}

                    {/* CHECKBOX (SEMANTİK) */}
                    {q.inputType === "checkbox" &&
                      q.options.map((opt, idx) => {
                        const isSelected = (currentAns || []).includes(opt);
                        return (
                          <label
                            key={opt}
                            className={`w-full p-5 rounded-2xl border-2 text-left text-lg font-medium transition-all flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/50 text-blue-800 shadow-sm"
                                : "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  handleDynamicChange(
                                    q.questionText,
                                    opt,
                                    "checkbox",
                                  )
                                }
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                              />
                              {opt}
                            </div>
                          </label>
                        );
                      })}

                    {/* INPUT TYPES */}
                    {(q.inputType === "text" || q.inputType === "number") && (
                      <input
                        type={q.inputType}
                        className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-xl placeholder:text-gray-300 transition-all shadow-sm"
                        placeholder={
                          q.inputType === "number"
                            ? "Örn: 100"
                            : "Cevabınızı buraya yazın..."
                        }
                        value={currentAns || ""}
                        onChange={(e) =>
                          handleDynamicChange(
                            q.questionText,
                            e.target.value,
                            q.inputType,
                          )
                        }
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                    )}

                    {/* TEXTAREA */}
                    {q.inputType === "textarea" && (
                      <textarea
                        rows="4"
                        className="w-full p-5 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg resize-none shadow-sm placeholder:text-gray-300"
                        placeholder="Detayları buraya girebilirsiniz..."
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
                </fieldset>
              );
            })()}

          {/* 2. KONUM VE ZAMAN */}
          {step === questionCount && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Konum ve Zaman
              </h2>
              <div className="grid gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Şehir
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: İstanbul"
                    className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg transition-all"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    İlçe
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Kadıköy"
                    className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg transition-all"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                    Zaman Tercihi
                  </label>
                  <select
                    className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none bg-white text-lg transition-all cursor-pointer"
                    value={formData.datePreference}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        datePreference: e.target.value,
                      })
                    }
                  >
                    <option value="">Ne zaman lazım?</option>
                    <option value="Acil">Hemen (Acil)</option>
                    <option value="Bu hafta">Bu hafta</option>
                    <option value="Bu ay">Bu ay</option>
                    <option value="Belirsiz">Tarih henüz belli değil</option>
                  </select>
                </div>
                <div className="mt-8">
  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
    İletişim Tercihi
  </label>

  <div className="space-y-3">
    <label
      className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition ${
        formData.allowPhoneAfterOffer
          ? "border-blue-500 bg-blue-50"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <input
        type="radio"
        name="allowPhoneAfterOffer"
        checked={formData.allowPhoneAfterOffer === true}
        onChange={() =>
          setFormData({
            ...formData,
            allowPhoneAfterOffer: true,
          })
        }
        className="mt-1"
      />

      <div>
        <div className="font-bold text-gray-900">
          Teklif veren hizmet verenler beni arayabilir.
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Hizmet veren teklif verdikten sonra telefon numaranı görebilir.
          Daha hızlı dönüş almak için önerilir.
        </p>
      </div>
    </label>

    <label
      className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer transition ${
        formData.allowPhoneAfterOffer === false
          ? "border-blue-500 bg-blue-50"
          : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      <input
        type="radio"
        name="allowPhoneAfterOffer"
        checked={formData.allowPhoneAfterOffer === false}
        onChange={() =>
          setFormData({
            ...formData,
            allowPhoneAfterOffer: false,
          })
        }
        className="mt-1"
      />

      <div>
        <div className="font-bold text-gray-900">
          Önce mesajlaşmak istiyorum.
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Telefon numaran sadece bir teklifi kabul ettikten sonra açılır.
        </p>
      </div>
    </label>
  </div>
</div>
              </div>
            </div>
            
          )}

          {/* 3. AÇIKLAMA */}
          {step === questionCount + 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Eklemek istediklerin var mı?
              </h2>
              <p className="text-gray-500">
                Uzmanların size daha doğru fiyat verebilmesi için detayları
                paylaşın.
              </p>
              <textarea
                rows="6"
                placeholder="Örn: Eski logomuzu modernize etmek istiyoruz, renk paletimiz mavi tonları..."
                className="w-full p-5 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none text-lg resize-none shadow-sm"
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
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={40} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Her şey harika görünüyor!
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Bilgilerini son kez kontrol et ve ilanını yayınla.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-4 text-sm max-h-80 overflow-y-auto custom-scrollbar">
                {Object.entries(dynamicAnswers).map(([q, a]) => (
                  <div
                    key={q}
                    className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-3 last:border-0 gap-2"
                  >
                    <span className="text-gray-500 font-medium sm:w-1/2">
                      {q}
                    </span>
                    <span className="font-bold text-gray-900 sm:w-1/2 sm:text-right">
                      {Array.isArray(a) ? a.join(", ") : a}
                    </span>
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-3 pt-2 gap-2">
                  <span className="text-gray-500 font-medium">Konum</span>
                  <span className="font-bold text-gray-900 sm:text-right">
                    {formData.city} / {formData.district}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between pt-2 gap-2">
                  <span className="text-gray-500 font-medium">Zaman</span>
                  <span className="font-bold text-gray-900 sm:text-right">
                    {formData.datePreference}
                  </span>
                </div>
                 <div className="flex flex-col sm:flex-row justify-between pt-2 gap-2">
                   <p>
  <span className="font-bold">İletişim Tercihi</span>{" "}
  {formData.allowPhoneAfterOffer
    ? "Teklif verenler beni arayabilir."
    : "Önce mesajlaşmak istiyorum."}
</p>
                </div>
               
                
              </div>
            </div>
          )}
        </div>

        {/* ALT BUTONLAR */}
        <div className="p-8 border-t border-gray-50 flex justify-between bg-white items-center">
          {step > 0 ? (
            <button
              onClick={prevStep}
              className="group flex items-center text-gray-500 hover:text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
            >
              <ArrowLeft
                size={20}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              />
              Geri
            </button>
          ) : (
            <div></div>
          )}

          {step < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95"
            >
              Devam Et <ChevronRight size={20} className="ml-2" />
            </button>
          ) : (
           <button
  onClick={handleSubmit}
  disabled={submitLoading}
  className={`flex items-center bg-[#c9ff2a] text-black px-10 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
    submitLoading
      ? "opacity-60 cursor-not-allowed"
      : "hover:shadow-xl hover:shadow-lime-100 hover:-translate-y-1"
  }`}
>
  {submitLoading ? "Gönderiliyor..." : "Yayınla"}
  {!submitLoading && <CheckCircle size={20} className="ml-2" />}
</button>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateRequest;
