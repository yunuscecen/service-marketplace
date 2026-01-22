import React from "react";
import { ShieldAlert, LogOut, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SuspendedPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md">
        {/* İkon: Kırmızı ve Hareketli */}
        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse">
          <ShieldAlert size={48} strokeWidth={1.5} />
        </div>

        {/* Başlık: Editorial Minimalizm */}
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter mb-6 text-gray-900 uppercase">
          Erişim <br />
          <span className="text-red-600 font-serif italic">Kısıtlandı.</span>
        </h1>

        {/* Mesaj */}
        <p className="text-gray-500 font-light mb-12 leading-relaxed">
          Hesabınız topluluk kurallarını ihlal ettiği veya güvenlik gerekçesiyle
          **geçici olarak askıya alınmıştır**. Bu bir hata olduğunu
          düşünüyorsanız lütfen destek ekibiyle iletişime geçin.
        </p>

        {/* Aksiyonlar */}
        <div className="flex flex-col gap-4">
          <a
            href="mailto:destek@serviceapp.com"
            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
          >
            <Mail size={18} /> Destekle İletişime Geç
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-colors py-2 text-sm font-bold uppercase tracking-widest"
          >
            <LogOut size={16} /> Güvenli Çıkış
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedPage;
