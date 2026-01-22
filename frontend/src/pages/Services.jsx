import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  ArrowUpRight, // Yeni tasarım oku
  Code,
  PenTool,
  Search,
  Server,
  Shield,
  Sparkles,
} from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Sayfa açılınca hizmetleri çek (Senin kodunun aynısı)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        console.log("Gelen Veriler:", res.data.data);
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Hizmetler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // İkon Seçici (Mantık aynı, sadece renkler yeni tasarıma uyumlu siyah yapıldı)
  const getIcon = (slug) => {
    if (!slug) return <Search className="w-6 h-6 text-gray-400" />;

    if (
      slug.includes("yazilim") ||
      slug.includes("web") ||
      slug.includes("android")
    )
      return <Code className="w-6 h-6 text-black" />;
    if (slug.includes("tasarim") || slug.includes("logo"))
      return <PenTool className="w-6 h-6 text-black" />;
    if (slug.includes("guvenlik"))
      return <Shield className="w-6 h-6 text-black" />;
    if (slug.includes("sunucu") || slug.includes("devops"))
      return <Server className="w-6 h-6 text-black" />;

    return <Sparkles className="w-6 h-6 text-black" />;
  };

  // --- TÜRKÇE UYUMLU FİLTRELEME (Senin kodunun aynısı) ---
  const filteredServices = services.filter((service) => {
    const serviceName = service.name.toLocaleLowerCase("tr");
    const search = searchTerm.toLocaleLowerCase("tr");
    return serviceName.includes(search);
  });

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-gray-100">
      {/* --- HEADER ALANI (Yeni Tasarım) --- */}
      <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-tight">
            Tüm Hizmetler.
          </h2>
          <p className="text-xl text-gray-500 font-medium">
            {services.length} farklı kategori arasından seçim yapın.
          </p>
        </div>

        {/* ARAMA BAR (Fonksiyonellik aynı, Görünüm Apple Style) */}
        <div className="mt-16 relative max-w-xl group">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-300 group-focus-within:text-black transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Hizmet ara... (Örn: Logo, Web)"
            className="w-full pl-10 pr-4 py-4 bg-transparent border-b border-gray-200 text-2xl outline-none placeholder-gray-300 focus:border-black transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- LİSTE ALANI --- */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24">
        {loading ? (
          // YÜKLENİYOR SKELETON (Senin kodunun aynısı, sadece stil güncel)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#F5F5F7] rounded-[2rem] h-64 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Link
                  key={service._id}
                  // --- DÜZELTME BURADA: Senin orijinal rotanı kullandım ---
                  to={`/create-request/${service._id}`}
                  className="group relative bg-[#F5F5F7] rounded-[2rem] p-8 h-80 flex flex-col justify-between transition-all duration-500 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:scale-[1.01] cursor-pointer"
                >
                  {/* Üst Kısım: İkon ve Başlık */}
                  <div>
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                      {getIcon(service.slug)}
                    </div>

                    <h3 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                      {service.name}
                    </h3>

                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 pr-4">
                      {service.description}
                    </p>
                  </div>

                  {/* Alt Kısım: Aksiyon */}
                  <div className="flex items-center justify-between border-t border-gray-200/50 pt-6 mt-2">
                    <span className="text-sm font-semibold text-gray-400 group-hover:text-black transition-colors">
                      Hizmet Al
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                      <ArrowUpRight className="w-5 h-5 text-black" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // SONUÇ BULUNAMADI (Senin kodunun mantığı)
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 text-xl font-medium">
                  "{searchTerm}" ile ilgili bir hizmet bulunamadı.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                >
                  Tüm hizmetleri göster
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
