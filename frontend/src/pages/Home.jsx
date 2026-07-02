import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  Search,
  Code,
  Smartphone,
  PenTool,
  Globe,
  Database,
  Cpu,
  Check,
  Zap,
  Rocket,
  Crown,
  ArrowUpRight,
  Github,
} from "lucide-react";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // GitHub Linkini dinamik bir değişkene atadık
  const githubRepoUrl = "https://github.com/yunuscecen/service-marketplace";

  // Tasarımı minimalize etmek için renkleri nötr/monokrom tonlara çektik
  const plans = [
    {
      id: "basic",
      name: "Başlangıç",
      offers: 3,
      price: 495,
      icon: <Zap size={24} className="text-zinc-500" aria-hidden="true" />,
      bg: "bg-zinc-50",
      accent: "text-zinc-600",
      description:
        "Sistemi denemek ve ilk projelerinize teklif vermek için ideal.",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 6,
      price: 935,
      icon: <Rocket size={24} className="text-zinc-900" aria-hidden="true" />,
      bg: "bg-zinc-900",
      accent: "text-zinc-100",
      popular: true,
      description:
        "Düzenli iş alan teknoloji uzmanları için en çok tercih edilen paket.",
    },
    {
      id: "premium",
      name: "Kurumsal",
      offers: 9,
      price: 1375,
      icon: <Crown size={24} className="text-zinc-500" aria-hidden="true" />,
      bg: "bg-white",
      accent: "text-zinc-600",
      description:
        "Büyük ölçekli projeler ve ajanslar için yüksek kapasiteli çözüm.",
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data.slice(0, 8));
      } catch (error) {
        console.error("Hizmetler yüklenemedi");
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/services?search=${searchTerm}`);
  };

  // İstediğiniz doğrultusunda güncellenen fonksiyon
  const handlePurchase = (plan) => {
    // API isteği ve otomatik yükleme kaldırıldı. Sadece uyarı mesajı veriliyor.
    toast.error("Ödeme sistemi henüz tanımlanmadı.", {
      icon: "💳",
      duration: 4000
    });
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    const props = { size: 24, strokeWidth: 1.5, "aria-hidden": "true" };
    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo")) return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;
    return <Cpu {...props} />;
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fırsatİş",
    url: "https://firsatis.com/",
    description:
      "Yazılım, tasarım and SEO projeleriniz için uzman freelancer platformu.",
    potentialAction: {
      "@type": "SearchAction",
      target: "/frontend/public/cover-firsat-is.jpg",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Fırsatİş",
      logo: {
        "@type": "ImageObject",
        url: "https://firsatis.com/logo.png",
      },
    },
    offers: plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      description: plan.description,
      price: plan.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    })),
  };

  return (
    <main
      className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Helmet>
        <title>Fırsatİş | Projeleriniz İçin Uzman Freelancer Platformu</title>
        <meta
          name="description"
          content="Yazılım, tasarım, SEO ve veri bilimi projeleriniz için onaylı uzmanlardan teklif alın. Güvenilir freelancer platformu ile işinizi büyütün."
        />
        <meta
          name="keywords"
          content="freelancer, yazılım uzmanı, web tasarım, seo hizmeti, iş ilanı ver, uzman bul, react geliştirici, logo tasarım"
        />
        {/* Inter Fontu Entegrasyonu */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://firsatis.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Fırsatİş" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://firsatis.com/" />
        <meta property="og:title" content="Fırsatİş - Teknoloji Uzmanlarını Bulun" />
        <meta
          property="og:description"
          content="Projeleriniz için doğru uzmanı burada bulun. Yazılım ve tasarımda profesyonel çözümler."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200"
        />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden" aria-label="Giriş Bölümü">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse"></span>
              Teknoloji Ekosistemi
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-zinc-900">
              Projeleriniz için <br />
              <span className="text-zinc-500">doğru uzmanı</span> <br />
              burada bulun.
            </h1>

            <p className="text-lg text-zinc-500 max-w-lg font-normal leading-relaxed">
              Yazılım, tasarım ve veri biliminde onaylı uzmanlarla çalışarak
              işinizi bir sonraki seviyeye taşıyın.
            </p>

            <div className="max-w-lg pt-4">
              <form
                onSubmit={handleSearch}
                className="bg-white flex items-center shadow-sm border border-zinc-200 p-1.5 rounded-2xl focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-100 transition-all"
                role="search"
              >
                <div className="pl-4 text-zinc-400">
                  <Search size={20} />
                </div>
                <label htmlFor="search-input" className="sr-only">
                  Uzman veya hizmet arayın
                </label>
                <input
                  id="search-input"
                  name="q"
                  type="text"
                  placeholder="Yazılım, Tasarım veya SEO..."
                  className="bg-transparent w-full px-4 py-3 outline-none text-base font-medium placeholder:text-zinc-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  aria-label="Arama yap"
                  className="bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors active:scale-[0.98]"
                >
                  Ara
                </button>
              </form>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 w-full aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000 ease-out"
                alt="Bilgisayar başında çalışan profesyonel yazılım ve tasarım uzmanı"
                loading="eager"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl z-20 border border-zinc-100 hidden sm:flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                <ArrowUpRight size={20} strokeWidth={2.5} aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-tight text-zinc-900">
                  Onaylı Uzmanlar
                </div>
                <div className="text-xs text-zinc-500 font-medium mt-0.5">
                  Bugün 12 yeni ilan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- KATEGORİLER --- */}
      <section className="max-w-7xl mx-auto py-24 px-6 bg-zinc-50 rounded-[3rem] my-12" aria-labelledby="categories-heading">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
            Kategoriler
          </h2>
          <Link
            to="/services"
            className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors group flex items-center gap-1"
            title="Tüm hizmet kategorilerini görüntüle"
          >
            Tümünü Gör
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[250px]">
          {loadingServices
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-zinc-100 animate-pulse h-56"></div>
              ))
            : services.map((service) => (
                <Link
                  key={service._id}
                  to={`/create-request/${service._id}`}
                  className="group bg-white p-8 rounded-3xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 border border-zinc-100 hover:border-zinc-300 relative flex flex-col"
                >
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors mb-8">
                    {getIcon(service.name)}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-900 mb-2 mt-auto">
                    {service.name}
                  </h3>
                  <p className="text-sm text-zinc-500 font-normal">
                    İşin ehli profesyoneller.
                  </p>
                </Link>
              ))}
        </div>
      </section>

      {/* --- PAKETLER (Grid Yapısı) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto" aria-labelledby="pricing-heading">
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Teklif Paketleri
          </h2>
          <p className="text-zinc-500 text-lg font-normal">
            Projeler için rekabete hazır olun. Size en uygun paketi seçin ve hemen teklif vermeye başlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${plan.bg} ${
                plan.popular 
                  ? "border-2 border-zinc-900 shadow-2xl shadow-zinc-900/10 scale-100 md:scale-105 z-10" 
                  : "border border-zinc-200 hover:border-zinc-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
                    En Popüler
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                  {plan.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-zinc-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm min-h-[40px] leading-relaxed ${plan.popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-extrabold tracking-tight ${plan.popular ? 'text-white' : 'text-zinc-900'}`}>
                  ₺{plan.price}
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3">
                  <Check size={18} className={plan.popular ? 'text-white' : 'text-zinc-900'} />
                  <span className={`text-sm font-medium ${plan.popular ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    {plan.offers} Adet Teklif Hakkı
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check size={18} className={plan.popular ? 'text-white' : 'text-zinc-900'} />
                  <span className={`text-sm font-medium ${plan.popular ? 'text-zinc-300' : 'text-zinc-700'}`}>
                    Öncelikli Destek Hattı
                  </span>
                </li>
                <li className="flex items-center gap-3 opacity-50">
                  <Check size={18} className={plan.popular ? 'text-zinc-600' : 'text-zinc-400'} />
                  <span className={`text-sm font-medium line-through ${plan.popular ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Komisyon Ödemesi
                  </span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                aria-label={`${plan.name} paketini satın al - Fiyat: ₺${plan.price}`}
                className={`w-full py-4 rounded-xl font-semibold transition-all active:scale-[0.98] ${
                  plan.popular 
                    ? "bg-white text-zinc-900 hover:bg-zinc-100" 
                    : "bg-zinc-900 text-white hover:bg-zinc-800"
                }`}
              >
                Hemen Satın Al
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-100 bg-white" role="contentinfo">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-2xl font-extrabold tracking-tighter text-zinc-900">
            fırsatiş<span className="text-zinc-400">.</span>
          </div>
          
          <nav className="flex gap-8 text-sm font-medium text-zinc-500">
            <Link to="/sitemap" className="hover:text-zinc-900 transition-colors" title="Site Haritası">
              Dizin
            </Link>
            <Link to="/privacy-policy" className="hover:text-zinc-900 transition-colors" title="Güvenlik Politikası">
              Güvenlik
            </Link>
            <Link to="/kvkk" className="hover:text-zinc-900 transition-colors" title="Kişisel Verilerin Korunması">
              KVKK
            </Link>
          </nav>

          {/* Dinamik GitHub Linki */}
          <a
            href={githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors text-sm font-medium"
            title="Projeyi GitHub'da İncele"
          >
            <Github size={20} />
            <span className="hidden sm:inline">Açık Kaynak</span>
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Home;