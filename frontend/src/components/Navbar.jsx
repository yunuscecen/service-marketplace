import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, LogOut, Briefcase, Sparkles } from "lucide-react"; // Briefcase ve Sparkles eklendi
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/services?search=${searchTerm}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* 1. LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="text-2xl font-semibold tracking-tighter text-black group-hover:opacity-70 transition-opacity">
            firsatis.com<span className="text-gray-400">.</span>
          </div>
        </Link>

        {/* 2. ORTA: ARAMA */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border-transparent rounded-full text-sm font-medium text-gray-900 placeholder-gray-500 focus:bg-white focus:border-gray-200 transition-all duration-300 outline-none"
              placeholder="Hizmet veya uzman ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        {/* 3. SAĞ: DİNAMİK MENÜ */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {/* ROL KONTROLÜ: Hizmet Veren ise İş Fırsatlarını Göster */}
            {user?.role === "provider" ? (
              <Link
                to="/dashboard/jobs"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Briefcase size={16} />
                İş Fırsatları
              </Link>
            ) : (
              <Link
                to="/services"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Keşfet
              </Link>
            )}

            {/* Giriş yapmamış kullanıcıya özel "Hizmet Veren Ol" */}
            {!user && (
              <Link
                to="/register?role=provider"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Hizmet Veren Ol
              </Link>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-all border border-transparent hover:border-gray-300 group"
              >
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold shadow-sm">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
                    {user.role === "provider" ? "Uzman" : "Müşteri"}
                  </span>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-gray-400 hover:text-red-600 transition-colors p-2"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden md:block text-sm font-semibold text-gray-900"
              >
                Giriş
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
              >
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
