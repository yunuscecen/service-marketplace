import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Search,
  ArrowUpRight,
  Code,
  Smartphone,
  PenTool,
  Globe,
  Database,
  Cpu,
  ArrowRight,
  Plus,
} from "lucide-react";

const Home = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data.slice(0, 8));
      } catch (error) {
        console.error("Hizmetler yüklenemedi");
      }
    };
    fetchServices();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/services?search=${searchTerm}`);
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    const props = { size: 28, strokeWidth: 1 };
    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo"))
      return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;
    return <Cpu {...props} />;
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans antialiased selection:bg-black selection:text-white">
      {/* --- HERO: SOFT & AIRY --- */}
      <section className="relative pt-32 pb-20 md:pt-56 md:pb-40 max-w-[1200px] mx-auto px-8">
        <div className="absolute top-20 right-8 w-64 h-64 bg-gray-50 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase">
              Yetenek ve Teknoloji Ağı
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[0.95] mb-12">
            Doğru uzmanla <br />
            <span className="text-gray-300 font-normal underline decoration-1 underline-offset-8">
              hız kazanın.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-md font-light leading-relaxed mb-16 italic-none">
            Projeleriniz için en yetkin isimlerden saniyeler içinde teklif
            almanın en modern yolu.
          </p>

          {/* Minimal Search */}
          <div className="relative group max-w-md border-b border-gray-100 py-4 focus-within:border-black transition-all">
            <input
              type="text"
              placeholder="Bir hizmet arayın..."
              className="w-full bg-transparent text-xl outline-none placeholder-gray-200 font-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors"
            >
              <ArrowRight size={24} strokeWidth={1.2} />
            </button>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES: REFINED GRID --- */}
      <section className="px-8 py-32 border-t border-gray-50 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-24">
          <h2 className="text-[10px] font-bold tracking-[0.5em] text-gray-300 uppercase">
            Hizmetler / 01
          </h2>
          <Link
            to="/services"
            className="text-[10px] font-bold tracking-widest uppercase border-b border-gray-200 pb-1 hover:border-black transition-all"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
          {services.map((service, index) => (
            <Link
              key={service._id}
              to={`/create-request/${service._id}`}
              className="group flex flex-col items-start transition-all duration-500"
            >
              <div className="mb-10 text-gray-300 group-hover:text-black transition-colors duration-500">
                {getIcon(service.name)}
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">
                  #{index + 1}
                </span>
                <h3 className="text-xl font-normal tracking-tight text-gray-900 leading-none">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed line-clamp-2">
                  {service.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  <ArrowUpRight
                    size={16}
                    className="text-black"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- ALT HERO: CREATIVE MINIMALISM --- */}
      <section className="px-8 py-12 max-w-[1200px] mx-auto">
        <div className="bg-[#111] text-white rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          {/* Subtle Creative Element */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] border border-white rounded-full"></div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-10 leading-none">
                Yeteneklerini <br />
                <span className="text-gray-600 font-normal underline decoration-1 underline-offset-[12px]">
                  serbest bırak.
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-16 font-light max-w-sm">
                Komisyon ödemeden, kendi kurallarınla çalışmaya bugün başla.
              </p>
              <div className="flex flex-wrap items-center gap-10">
                <Link
                  to="/register"
                  className="bg-white text-black px-12 py-5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Şimdi Katıl
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-[10px] font-bold tracking-widest uppercase border-b border-gray-800 pb-2 hover:border-white transition-all text-gray-500"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end pr-12">
              <div className="relative">
                <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase -rotate-90">
                  Join.Network
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER: SILENT --- */}
      <footer className="px-8 py-20 max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-end gap-12 border-t border-gray-50 mt-20">
        <div>
          <div className="text-2xl font-normal tracking-tighter mb-4 uppercase">
            Service<span className="text-gray-200">.</span>
          </div>
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.5em] font-bold">
            Istanbul / Digital Architecture © 2026
          </p>
        </div>

        <div className="flex gap-12 text-[9px] font-bold uppercase tracking-widest text-gray-400">
          <Link to="/services" className="hover:text-black transition-colors">
            Dizin
          </Link>
          <Link to="/login" className="hover:text-black transition-colors">
            Giriş
          </Link>
          <Link to="/register" className="hover:text-black transition-colors">
            Katılım
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
