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
  ArrowRight,
  Check,
  Zap,
  Rocket,
  Crown,
  ArrowUpRight,
} from "lucide-react";

const Home = () => {
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Başlangıç",
      offers: 4,
      price: 495,
      icon: <Zap size={30} className="text-orange-500" aria-hidden="true" />,
      bg: "bg-[#F2F6FF]",
      accent: "text-blue-600",
      border: "border-blue-100",
      glow: "shadow-blue-100/70",
      description:
        "Sistemi denemek ve ilk projelerinize teklif vermek için ideal.",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 8,
      price: 935,
      icon: <Rocket size={30} className="text-blue-500" aria-hidden="true" />,
      bg: "bg-[#F5FFF2]",
      accent: "text-green-600",
      border: "border-green-100",
      glow: "shadow-green-100/70",
      popular: true,
      description:
        "Düzenli iş alan teknoloji uzmanları için en çok tercih edilen paket.",
    },
    {
      id: "premium",
      name: "Kurumsal",
      offers: 12,
      price: 1375,
      icon: <Crown size={30} className="text-purple-500" aria-hidden="true" />,
      bg: "bg-[#FFF9F2]",
      accent: "text-orange-600",
      border: "border-orange-100",
      glow: "shadow-orange-100/70",
      description:
        "Büyük ölçekli projeler ve ajanslar için yüksek kapasiteli çözüm.",
    },
  ];

  const quickLinks = [
    { label: "Hizmet keşfet", to: "/services" },
    { label: "Uzman girişi", to: "/login" },
    { label: "Hesap oluştur", to: "/register" },
  ];

  const footerLinks = [
    { label: "Hizmetler", to: "/services" },
    { label: "Giriş", to: "/login" },
    { label: "Kayıt", to: "/register" },
    { label: "Paketler", to: "/dashboard/packages" },
  ];

  const processSteps = [
    {
      title: "İhtiyacını seç",
      text: "Web, mobil, tasarım, SEO veya veri alanındaki doğru kategoriyi belirle.",
    },
    {
      title: "Talebini oluştur",
      text: "Kısa proje detaylarını gönder; uzmanlar talebini görmeye başlasın.",
    },
    {
      title: "Teklifleri değerlendir",
      text: "Sana uygun uzmanla konuş, detayları netleştir ve projeyi başlat.",
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
    const query = searchTerm.trim();
    if (!query) return;

    const params = new URLSearchParams({ search: query });
    navigate(`/services?${params.toString()}`);
  };

  const handlePurchase = async (plan) => {
    try {
      await api.post("/auth/add-credits", { credits: plan.offers });
      toast.success(`${plan.name} paketi tanımlandı!`, { icon: "💰" });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error("Ödeme işlemi şu an gerçekleştirilemiyor.");
    }
  };

  const getIcon = (name = "") => {
    const n = name.toLowerCase();
    const props = { size: 24, strokeWidth: 1.7, "aria-hidden": "true" };
    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo")) return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;
    return <Cpu {...props} />;
  };

  const getServiceHref = (service) => {
    const serviceId = service?._id || service?.id;
    return serviceId ? `/create-request/${serviceId}` : "/services";
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fırsatİş",
    url: "https://firsatis.com/",
    description:
      "Yazılım, tasarım ve SEO projeleriniz için uzman freelancer platformu.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://firsatis.com/services?search={search_term_string}",
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
    <main className="min-h-screen overflow-hidden bg-[#f8fbff] text-slate-950 font-sans selection:bg-[#c9ff2a] selection:text-black">
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
        <meta property="og:site_name" content="Fırsatİş" />
        <meta property="og:locale" content="tr_TR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fırsatİş - Teknoloji Uzmanlarını Bulun" />
        <meta name="twitter:description" content="Projeleriniz için doğru uzmanı burada bulun." />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200"
        />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28" aria-label="Giriş Bölümü">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="absolute top-20 -left-28 h-80 w-80 rounded-full bg-[#c9ff2a]/30 blur-3xl" />
          <div className="absolute right-0 bottom-10 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 order-2 space-y-9 lg:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9ff2a] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9ff2a]" />
              </span>
              Teknoloji ekosistemi
            </div>

            <div className="space-y-6">
              <h1 className="max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-slate-950 md:text-7xl xl:text-8xl">
                Projen için doğru uzmanı
                <span className="relative mx-2 inline-block">
                  <span className="absolute inset-x-0 bottom-2 -z-10 h-5 rounded-full bg-[#c9ff2a] md:bottom-4 md:h-7" />
                  bugün bul.
                </span>
              </h1>

              <p className="max-w-2xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
                Yazılım, tasarım, SEO ve veri alanında ihtiyacını anlat; onaylı uzmanlardan hızlıca teklif al ve işini güvenle başlat.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="group max-w-2xl rounded-[2rem] border border-white/70 bg-white/85 p-2 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-all focus-within:border-blue-200 focus-within:shadow-[0_30px_100px_rgba(37,99,235,0.16)]"
              role="search"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label htmlFor="search-input" className="sr-only">
                  Uzman veya hizmet arayın
                </label>
                <div className="flex flex-1 items-center gap-3 px-4">
                  <Search size={22} className="text-slate-300 transition-colors group-focus-within:text-blue-500" aria-hidden="true" />
                  <input
                    id="search-input"
                    name="q"
                    type="text"
                    placeholder="Web sitesi, mobil uygulama, logo, SEO..."
                    className="w-full bg-transparent py-4 text-base font-semibold text-slate-900 outline-none placeholder:text-slate-300 md:text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Arama yap"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600 active:scale-95 sm:text-base"
                >
                  Ara
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-full border border-slate-200 bg-white/70 px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-950 hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="grid max-w-2xl grid-cols-3 gap-3 pt-2">
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
                <div className="text-2xl font-black tracking-tighter text-slate-950">{services.length || 8}+</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Kategori</div>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
                <div className="text-2xl font-black tracking-tighter text-slate-950">Dakikalar</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">İçinde talep</div>
              </div>
              <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-sm">
                <div className="text-2xl font-black tracking-tighter text-slate-950">0%</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Komisyon</div>
              </div>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2">
            <div className="absolute -inset-4 rounded-[3.5rem] bg-gradient-to-br from-blue-200/60 via-white to-[#c9ff2a]/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[3rem] border border-white/70 bg-white p-3 shadow-[0_40px_120px_rgba(15,23,42,0.18)] rotate-1 transition-transform duration-700 hover:rotate-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
                  className="h-full w-full object-cover"
                  alt="Bilgisayar başında çalışan profesyonel yazılım ve tasarım uzmanı"
                  width="600"
                  height="750"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 rounded-[2rem] border border-white/20 bg-white/15 p-5 text-white shadow-2xl backdrop-blur-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Canlı talep akışı</p>
                      <h2 className="mt-2 text-2xl font-black tracking-tight">Yeni proje yayında</h2>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9ff2a] text-black">
                      <ArrowUpRight size={23} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-2xl bg-white/15 px-3 py-3">
                      <div className="text-lg font-black">Web</div>
                      <div className="text-[10px] font-bold text-white/55">Kategori</div>
                    </div>
                    <div className="rounded-2xl bg-white/15 px-3 py-3">
                      <div className="text-lg font-black">4</div>
                      <div className="text-[10px] font-bold text-white/55">Teklif</div>
                    </div>
                    <div className="rounded-2xl bg-white/15 px-3 py-3">
                      <div className="text-lg font-black">Yeni</div>
                      <div className="text-[10px] font-bold text-white/55">Durum</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 top-10 hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-2xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Check size={20} strokeWidth={3} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-black">Onaylı uzmanlar</div>
                  <div className="text-xs font-semibold text-slate-400">Güvenli iletişim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8" aria-label="Platform bağlantıları">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-100 bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 text-center text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 sm:grid-cols-3">
            <span>Yazılım projeleri</span>
            <span>Marka ve tasarım işleri</span>
            <span>SEO ve büyüme destekleri</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24" aria-labelledby="categories-heading">
        <div className="mb-12 flex flex-col gap-6 border-b border-slate-200/70 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-blue-600">Kategoriler</p>
            <h2 id="categories-heading" className="text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl">
              Hizmet seç, talebi başlat.
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600"
            title="Tüm hizmet kategorilerini görüntüle"
          >
            Tümünü Gör
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid min-h-[300px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingServices
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-[2.5rem] border border-white bg-white/70 shadow-sm"
                  />
                ))
            : services.map((service, index) => (
                <Link
                  key={service._id || service.id || service.name}
                  to={getServiceHref(service)}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_30px_90px_rgba(37,99,235,0.12)]"
                  aria-label={`${service.name} kategorisinde ilan oluştur`}
                  title={`${service.name} hizmetleri`}
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative flex h-full min-h-[210px] flex-col justify-between">
                    <div>
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-500 shadow-inner transition-all group-hover:bg-[#c9ff2a] group-hover:text-black">
                        {getIcon(service.name)}
                      </div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                        {service.name}
                      </h3>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                        {service.description || "İşin ehli profesyonellerden hızlı teklif alın."}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-xs font-black uppercase tracking-[0.24em] text-slate-300">
                        0{index + 1}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-all group-hover:rotate-[-20deg] group-hover:bg-blue-600">
                        <ArrowUpRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <section className="px-6 py-10" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-slate-950 p-8 text-white shadow-[0_40px_120px_rgba(15,23,42,0.22)] md:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-[#c9ff2a]">Nasıl çalışır?</p>
              <h2 id="process-heading" className="text-4xl font-black tracking-[-0.04em] md:text-6xl">
                Üç adımda doğru uzman.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {processSteps.map((step, index) => (
                <div key={step.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 text-sm font-black">
                    0{index + 1}
                  </div>
                  <h3 className="text-lg font-black">{step.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-6 text-white/55">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24" aria-labelledby="pricing-heading">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-blue-600">Teklif paketleri</p>
            <h2 id="pricing-heading" className="text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl">
              Uzmanlar için net paketler.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-500">
              Projeler için rekabete hazır olun. Size en uygun paketi seçin ve hemen teklif vermeye başlayın.
            </p>
          </div>
          <Link
            to="/dashboard/packages"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-950 hover:text-slate-950"
          >
            Paketleri karşılaştır
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative overflow-hidden rounded-[3rem] border ${plan.border} ${plan.bg} p-7 shadow-2xl ${plan.glow} transition-all duration-500 hover:-translate-y-2`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                  En Popüler
                </div>
              )}

              <div className="mb-9 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                {plan.icon}
              </div>

              <div className="space-y-4">
                <p className={`text-xs font-black uppercase tracking-[0.3em] ${plan.accent}`}>{plan.name}</p>
                <h3 className="text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">
                  {plan.offers} Adet Teklif Hakkı
                </h3>
                <p className="min-h-[72px] text-sm font-medium leading-6 text-slate-500">{plan.description}</p>
              </div>

              <div className="my-9 flex items-end gap-2">
                <span className="text-6xl font-black tracking-[-0.08em] text-slate-950">₺{plan.price}</span>
                <span className="pb-2 text-sm font-black uppercase tracking-widest text-slate-400">tek sefer</span>
              </div>

              <ul className="mb-9 space-y-4">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600">
                    <Check size={16} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {plan.offers} adet teklif hakkı
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600">
                    <Check size={16} strokeWidth={3} aria-hidden="true" />
                  </span>
                  Öncelikli destek hattı
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-400">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-300">
                    <Check size={16} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="line-through">Komisyon ödemesi</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                aria-label={`${plan.name} paketini satın al - Fiyat: ₺${plan.price}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-5 text-base font-black text-white transition-all hover:bg-blue-600 active:scale-95"
              >
                Hemen Satın Al
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24" aria-label="Başlangıç çağrısı">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-white p-8 shadow-[0_35px_100px_rgba(15,23,42,0.10)] md:p-14">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.32em] text-blue-600">Başlamaya hazır mısınız?</p>
              <h2 className="text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-5xl">
                Projeni birkaç dakika içinde yayına al.
              </h2>
              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-500">
                Kategorini seç, proje ihtiyacını paylaş ve doğru uzmanlardan gelen teklifleri tek yerden yönet.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c9ff2a] px-8 py-5 text-base font-black text-black transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Hizmetleri keşfet
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 border-t border-slate-200/70 px-6 py-14 md:flex-row" role="contentinfo">
        <Link to="/" className="text-3xl font-black tracking-[-0.06em] text-slate-950">
          firsatis.com
        </Link>
        <nav className="flex flex-wrap justify-center gap-4 text-[11px] font-black uppercase tracking-[0.24em] text-slate-400" aria-label="Alt menü">
          {footerLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-full px-3 py-2 transition-colors hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
};

export default Home;
