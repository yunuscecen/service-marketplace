import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom"; // URL parametreleri için eklendi
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import {
  ArrowUpRight,
  Code,
  PenTool,
  Search,
  Server,
  Shield,
  Sparkles,
  Smartphone,
  Database,
  Globe,
} from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL'deki ?search=parametre değerini yakala
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchTerm = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  // Hizmetleri Çek
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data || []);
      } catch (error) {
        console.error("Hizmetler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Arama Terimini URL ile Senkronize Et
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // URL'yi güncelle (kullanıcı sayfayı yenilese bile arama kalır)
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // Performanslı Filtreleme (useMemo)
  // Her render'da tekrar hesaplamak yerine, sadece services veya searchTerm değişince çalışır.
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const name = service.name?.toLocaleLowerCase("tr") || "";
      const desc = service.description?.toLocaleLowerCase("tr") || ""; // Açıklamada da ara
      const search = searchTerm.toLocaleLowerCase("tr");
      return name.includes(search) || desc.includes(search);
    });
  }, [services, searchTerm]);

  // İkon Seçici (Genişletilmiş ve Güvenli)
  const getIcon = (service) => {
    // Hem slug hem name kontrolü yaparak daha isabetli ikon
    const text = (service.slug || service.name || "").toLowerCase();
    const props = {
      className: "w-7 h-7 text-[#1d1d1f]",
      strokeWidth: 1.5,
      "aria-hidden": "true",
    };

    if (text.includes("mobil") || text.includes("app"))
      return <Smartphone {...props} />;
    if (
      text.includes("yazılım") ||
      text.includes("web") ||
      text.includes("kod")
    )
      return <Code {...props} />;
    if (
      text.includes("tasarım") ||
      text.includes("logo") ||
      text.includes("grafik")
    )
      return <PenTool {...props} />;
    if (text.includes("veri") || text.includes("data"))
      return <Database {...props} />;
    if (text.includes("seo") || text.includes("pazarlama"))
      return <Globe {...props} />;
    if (text.includes("güvenlik") || text.includes("siber"))
      return <Shield {...props} />;
    if (text.includes("sunucu") || text.includes("devops"))
      return <Server {...props} />;

    return <Sparkles {...props} />;
  };

  // --- SCHEMA.ORG (ITEM LIST) ---
  // Google'a "Bu sayfa bir hizmet listesidir" diyoruz.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tüm Hizmetler | Fırsatİş",
    description: "Yazılım, tasarım ve dijital hizmetler kataloğu.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: filteredServices.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://firsatis.com/create-request/${service._id}`,
        name: service.name,
        description: service.description,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-white text-[#1d1d1f] font-sans selection:bg-gray-100">
      <Helmet>
        <title>Hizmetler | Fırsatİş - Tüm Kategoriler</title>
        <meta
          name="description"
          content={`Web yazılım, grafik tasarım, SEO ve ${services.length} farklı kategoride uzman freelancer hizmetleri.`}
        />
        <link rel="canonical" href="https://firsatis.com/services" />
        <meta name="robots" content="index, follow" />

        {/* Yapısal Veri */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* --- HEADER ALANI --- */}
      <section className="max-w-[1400px] mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            Katalog
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.1] text-[#1d1d1f]">
            Tüm Hizmetler.
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            İhtiyacınız olan yeteneği bulun.{" "}
            {services.length > 0 && (
              <span className="text-black font-semibold">
                {services.length}
              </span>
            )}{" "}
            farklı kategori ve yüzlerce uzman sizi bekliyor.
          </p>
        </div>

        {/* ARAMA BAR (Form Yapısı) */}
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="mt-16 relative max-w-xl group"
        >
          <label htmlFor="service-search" className="sr-only">
            Hizmet Ara
          </label>
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-1">
            <Search className="h-6 w-6 text-gray-300 group-focus-within:text-black transition-colors" />
          </div>
          <input
            id="service-search"
            type="search"
            placeholder="Hizmet ara... (Örn: Logo, Web)"
            className="w-full pl-10 pr-4 py-4 bg-transparent border-b border-gray-200 text-2xl outline-none placeholder-gray-300 focus:border-black transition-colors font-medium text-[#1d1d1f]"
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
          />
        </form>
      </section>

      {/* --- LİSTE ALANI --- */}
      <section
        className="max-w-[1400px] mx-auto px-6 pb-24"
        aria-label="Hizmet Listesi"
      >
        {loading ? (
          // SKELETON LOADER
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#F5F5F7] rounded-[2rem] h-80 animate-pulse flex flex-col p-8 space-y-4"
              >
                <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Link
                  key={service._id}
                  to={`/create-request/${service._id}`}
                  className="group relative bg-[#F5F5F7] rounded-[2rem] p-8 h-80 flex flex-col justify-between transition-all duration-500 hover:bg-white hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:scale-[1.01] cursor-pointer overflow-hidden border border-transparent hover:border-gray-100"
                  aria-label={`${service.name} hizmeti için talep oluştur`}
                >
                  {/* Hover Efekti için Arkaplan Işıltısı */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200/50 to-transparent rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Üst Kısım */}
                  <div className="relative z-10">
                    <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-500">
                      {getIcon(service)}
                    </div>

                    <h2 className="text-2xl font-bold text-[#1d1d1f] mb-3 tracking-tight group-hover:text-black">
                      {service.name}
                    </h2>

                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2 pr-2">
                      {service.description ||
                        "Bu kategoride uzmanlardan teklif alarak projenizi hayata geçirin."}
                    </p>
                  </div>

                  {/* Alt Kısım: Aksiyon */}
                  <div className="relative z-10 flex items-center justify-between border-t border-gray-200/50 pt-6 mt-2">
                    <span className="text-sm font-bold text-gray-400 group-hover:text-black transition-colors">
                      Talep Oluştur
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-sm border border-gray-50 text-black">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // SONUÇ BULUNAMADI
              <div className="col-span-full py-24 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-gray-500 text-lg font-medium">
                  "{searchTerm}" aramasıyla eşleşen bir hizmet yok.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="mt-6 text-black border-b-2 border-black pb-0.5 hover:opacity-70 transition-opacity font-bold"
                >
                  Tüm hizmetleri göster
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
};

export default Services;
