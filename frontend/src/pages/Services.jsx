import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const name = service.name?.toLocaleLowerCase("tr") || "";
      const desc = service.description?.toLocaleLowerCase("tr") || "";
      const search = searchTerm.toLocaleLowerCase("tr");
      return name.includes(search) || desc.includes(search);
    });
  }, [services, searchTerm]);

  // İkon Seçici (Minimalize edildi, rengi CSS'ten devralır)
  const getIcon = (service) => {
    const text = (service.slug || service.name || "").toLowerCase();
    const props = {
      size: 24,
      strokeWidth: 1.5,
      "aria-hidden": "true",
    };

    if (text.includes("mobil") || text.includes("app")) return <Smartphone {...props} />;
    if (text.includes("yazılım") || text.includes("web") || text.includes("kod")) return <Code {...props} />;
    if (text.includes("tasarım") || text.includes("logo") || text.includes("grafik")) return <PenTool {...props} />;
    if (text.includes("veri") || text.includes("data")) return <Database {...props} />;
    if (text.includes("seo") || text.includes("pazarlama")) return <Globe {...props} />;
    if (text.includes("güvenlik") || text.includes("siber")) return <Shield {...props} />;
    if (text.includes("sunucu") || text.includes("devops")) return <Server {...props} />;

    return <Sparkles {...props} />;
  };

  // --- SCHEMA.ORG (ITEM LIST) ---
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
    <main
      className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Helmet>
        <title>Hizmetler | Fırsatİş - Tüm Kategoriler</title>
        <meta
          name="description"
          content={`Web yazılım, grafik tasarım, SEO ve ${services.length} farklı kategoride uzman freelancer hizmetleri.`}
        />
        {/* Inter Fontu Entegrasyonu (Eğer Home.jsx'ten global gelmiyorsa garantiye almak için) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://firsatis.com/services" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* --- KOMPAKT HERO ALANI --- */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          {/* Sol: Başlık ve Arama */}
          <div className="flex-1 space-y-6 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-semibold tracking-wide">
              Katalog
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-zinc-900">
              Tüm Hizmetler.
            </h1>
            
            <p className="text-lg text-zinc-500 font-normal max-w-lg leading-relaxed">
              İhtiyacınız olan yeteneği bulun.{" "}
              {services.length > 0 && (
                <span className="text-zinc-900 font-semibold">{services.length}</span>
              )}{" "}
              farklı kategori ve yüzlerce uzman sizi bekliyor.
            </p>

            {/* Modern Arama Barı */}
            <form
              role="search"
              onSubmit={(e) => e.preventDefault()}
              className="relative max-w-lg mt-8 group"
            >
              <label htmlFor="service-search" className="sr-only">
                Hizmet Ara
              </label>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={20} className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              </div>
              <input
                id="service-search"
                type="search"
                placeholder="Hizmet ara... (Örn: Logo, Web)"
                className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-base outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all font-medium text-zinc-900 placeholder:text-zinc-400 shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
            </form>
          </div>

          {/* Sağ: Estetik Görsel (Hero Image) */}
          <div className="w-full md:w-5/12 aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden relative shadow-2xl shadow-zinc-200 hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop" 
              alt="Dijital Hizmetler ve Tasarım" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/20 to-transparent"></div>
          </div>

        </div>
      </section>

      {/* --- LİSTE ALANI --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32 pt-8" aria-label="Hizmet Listesi">
        
        {loading ? (
          // SKELETON LOADER
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-zinc-50 border border-zinc-100 rounded-[2rem] h-[300px] animate-pulse flex flex-col p-8 space-y-4"
              >
                <div className="w-14 h-14 bg-zinc-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-zinc-200 rounded w-2/3"></div>
                <div className="h-4 bg-zinc-200 rounded w-full"></div>
                <div className="h-4 bg-zinc-200 rounded w-4/5 mt-auto"></div>
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
                  className="group flex flex-col bg-white border border-zinc-200 rounded-[2rem] p-8 h-[300px] hover:border-zinc-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative overflow-hidden"
                  aria-label={`${service.name} hizmeti için talep oluştur`}
                >
                  <div className="w-14 h-14 bg-zinc-50 rounded-xl flex items-center justify-center mb-6 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                    {getIcon(service)}
                  </div>

                  <h2 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
                    {service.name}
                  </h2>

                  <p className="text-zinc-500 text-sm font-normal leading-relaxed line-clamp-3">
                    {service.description ||
                      "Bu kategoride uzmanlardan teklif alarak projenizi hayata geçirin."}
                  </p>

                  {/* Alt Kısım: Aksiyon Ok İşareti */}
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100">
                    <span className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                      Talep Oluştur
                    </span>
                    <ArrowUpRight 
                      size={20} 
                      className="text-zinc-300 group-hover:text-zinc-900 transition-colors" 
                    />
                  </div>
                </Link>
              ))
            ) : (
              // SONUÇ BULUNAMADI ALANI
              <div className="col-span-full py-24 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                  <Search size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-zinc-500 text-base max-w-md mx-auto mb-8">
                  "<span className="text-zinc-900 font-medium">{searchTerm}</span>" aramasıyla eşleşen bir kategori bulamadık. Lütfen farklı bir terimle tekrar deneyin.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-colors active:scale-95"
                >
                  Tüm Kategorileri Göster
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