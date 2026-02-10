import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user", // Varsayılan: Müşteri
  });

  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasyon: Basit bir şifre kontrolü
      if (formData.password.length < 6) {
        toast.error("Şifreniz en az 6 karakter olmalıdır.");
        setIsLoading(false);
        return;
      }

      const success = await register(formData);

      if (success) {
        toast.success(
          "Hesabınız başarıyla oluşturuldu! Yönlendiriliyorsunuz...",
        );
        // Kullanıcı deneyimi için kısa bir gecikme
        setTimeout(() => navigate("/"), 1000);
      } else {
        // useAuth içinde toast yoksa burası çalışır
        toast.error("Kayıt işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
      toast.error("Bir sorun oluştu. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- SCHEMA.ORG (BREADCRUMB) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Anasayfa",
        item: "https://firsatis.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kayıt Ol",
        item: "https://firsatis.com/register",
      },
    ],
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Kayıt Ol | Fırsatİş - Hemen Hesap Oluşturun</title>
        <meta
          name="description"
          content="Fırsatİş'e katılın. İster hizmet vererek kazanın, ister projeleriniz için en iyi uzmanları bulun. Ücretsiz kayıt olun."
        />
        <link rel="canonical" href="https://firsatis.com/register" />
        <meta name="robots" content="index, follow" />

        {/* Yapısal Veri */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Dekoratif Arka Plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block mb-6 text-2xl font-black tracking-tighter uppercase text-slate-900"
          >
            firsatis.com
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Hesap Oluştur
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Hemen aramıza katıl ve fırsatları yakala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* İsim */}
          <div className="space-y-1">
            <label htmlFor="name" className="sr-only">
              Adınız Soyadınız
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Adınız Soyadınız"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium placeholder:text-gray-400"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="sr-only">
              E-posta Adresiniz
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="E-posta Adresiniz"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Telefon Numarası */}
          <div className="space-y-1">
            <label htmlFor="phone" className="sr-only">
              Telefon Numaranız
            </label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Telefon Numaranız (05xx)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium placeholder:text-gray-400"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
          </div>

          {/* Şifre */}
          <div className="space-y-1">
            <label htmlFor="password" className="sr-only">
              Şifreniz
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="Şifreniz (En az 6 karakter)"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition font-medium placeholder:text-gray-400"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Rol Seçimi - UX İyileştirildi */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
              Hesap Türü Seçin
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                aria-pressed={formData.role === "user"}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${
                  formData.role === "user"
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm scale-[1.02]"
                    : "border-gray-100 bg-white text-gray-500 hover:border-blue-100 hover:bg-gray-50"
                }`}
              >
                {formData.role === "user" && (
                  <div className="absolute top-3 right-3 text-blue-600">
                    <CheckCircle2 size={16} />
                  </div>
                )}
                <User size={28} strokeWidth={1.5} />
                <span className="font-bold text-sm">Hizmet Alacağım</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "provider" })}
                aria-pressed={formData.role === "provider"}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${
                  formData.role === "provider"
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm scale-[1.02]"
                    : "border-gray-100 bg-white text-gray-500 hover:border-blue-100 hover:bg-gray-50"
                }`}
              >
                {formData.role === "provider" && (
                  <div className="absolute top-3 right-3 text-blue-600">
                    <CheckCircle2 size={16} />
                  </div>
                )}
                <Briefcase size={28} strokeWidth={1.5} />
                <span className="font-bold text-sm">Hizmet Vereceğim</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Hesap Oluşturuluyor...</span>
              </>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        <div className="text-center text-sm font-medium text-gray-500 mt-8">
          Zaten hesabınız var mı?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-all"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Register;
