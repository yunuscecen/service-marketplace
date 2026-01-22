import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Briefcase, Phone } from "lucide-react"; // Phone eklendi

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Telefon alanı state'e eklendi
    password: "",
    role: "user", // Varsayılan: Müşteri
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // formData artık içinde phone bilgisini de barındırıyor
    const success = await register(formData);
    if (success) {
      navigate("/"); // Başarılıysa ana sayfaya git
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Hesap Oluştur
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hemen aramıza katıl ve fırsatları yakala.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* İsim */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Adınız Soyadınız"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              placeholder="E-posta Adresiniz"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Telefon Numarası - YENİ EKLENEN ALAN */}
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              required
              placeholder="Telefon Numaranız (05xx)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          {/* Şifre */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              placeholder="Şifreniz (En az 6 karakter)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {/* Rol Seçimi */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "user" })}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${formData.role === "user" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <User size={24} />
              <span className="font-medium text-sm">Hizmet Alacağım</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "provider" })}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition ${formData.role === "provider" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <Briefcase size={24} />
              <span className="font-medium text-sm">Hizmet Vereceğim</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Kayıt Ol
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Zaten hesabınız var mı?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
