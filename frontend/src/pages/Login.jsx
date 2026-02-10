import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Login fonksiyonunun bir Promise döndürdüğünü varsayıyoruz
      const success = await login(email, password);

      if (success) {
        toast.success("Tekrar hoş geldiniz!");
        navigate("/"); // veya kullanıcının geldiği sayfaya (redirectUrl)
      } else {
        // useAuth içinde hata toast'ı yoksa burada gösterelim
        toast.error("E-posta veya şifre hatalı.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      toast.error("Bir sorun oluştu. Lütfen tekrar deneyin.");
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
        name: "Giriş Yap",
        item: "https://firsatis.com/login",
      },
    ],
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4 py-12 relative overflow-hidden">
      <Helmet>
        <title>Giriş Yap | Fırsatİş - Hesabınıza Erişin</title>
        <meta
          name="description"
          content="Fırsatİş hesabınıza giriş yapın. Projelerinizi yönetin, teklifleri inceleyin ve uzmanlarla iletişime geçin."
        />
        <link rel="canonical" href="https://firsatis.com/login" />

        {/* Login sayfaları indexlenebilir ama snippet'ı kontrol edelim */}
        <meta name="robots" content="index, follow" />

        {/* Yapısal Veri */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Arka Plan Dekorasyonları */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-[#c9ff2a] rounded-full blur-[100px] opacity-20"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-block mb-8 text-2xl font-black tracking-tighter uppercase text-slate-900"
          >
            firsatis.com
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Tekrar Hoş Geldiniz
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            Devam etmek için lütfen giriş yapın.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-bold text-gray-700 block ml-1"
            >
              E-posta Adresi
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Mail size={20} strokeWidth={2} />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="username" // Tarayıcılar için ipucu
                placeholder="ornek@sirket.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label
                htmlFor="password"
                className="text-sm font-bold text-gray-700"
              >
                Şifre
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Şifremi Unuttum?
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Lock size={20} strokeWidth={2} />
              </div>
              <input
                id="password"
                type="password"
                name="password"
                required
                autoComplete="current-password" // Tarayıcılar için ipucu
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                <span>Giriş Yapılıyor...</span>
              </>
            ) : (
              <>
                <span>Giriş Yap</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Henüz bir hesabınız yok mu?{" "}
            <Link
              to="/register"
              className="text-black font-black hover:text-blue-600 hover:underline transition-all ml-1"
            >
              Hemen Kayıt Olun
            </Link>
          </p>
        </div>
      </div>

      {/* Güvenlik Rozeti / Alt Bilgi */}
      <div className="absolute bottom-6 text-center w-full px-6">
        <p className="text-xs text-gray-400 font-medium flex items-center justify-center gap-2">
          <Lock size={12} />
          <span>Güvenli ve şifreli bağlantı ile korunmaktadır.</span>
        </p>
      </div>
    </main>
  );
};

export default Login;
