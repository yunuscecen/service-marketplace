import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code,
  Cpu,
  Crown,
  Database,
  Globe,
  Layers,
  PenTool,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Smartphone,
  Zap,
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
      icon: <Zap size={28} className="text-orange-500" aria-hidden="true" />,
      bg: "from-orange-50 via-white to-blue-50",
      ring: "ring-orange-100",
      accent: "text-orange-600",
      description:
        "Sistemi denemek ve ilk projelerinize teklif vermek için ideal.",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 8,
      price: 935,
      icon: <Rocket size={28} className="text-blue-500" aria-hidden="true" />,
      bg: "from-blue-50 via-white to-emerald-50",
      ring: "ring-blue-100",
      accent: "text-blue-600",
      popular: true,
      description:
        "Düzenli iş alan teknoloji uzmanları için en çok tercih edilen paket.",
    },
    {
      id: "premium",
      name: "Kurumsal",
      offers: 12,
      price: 1375,
      icon: <Crown size={28} className="text-purple-500" aria-hidden="true" />,
      bg: "from-purple-50 via-white to-orange-50",
      ring: "ring-purple-100",
      accent: "text-purple-600",
      description:
        "Büyük ölçekli projeler ve ajanslar için yüksek kapasiteli çözüm.",
    },
  ];

  const footerLinks = [
    { label: "Hizmetler", to: "/services" },
    { label: "Paketler", to: "/dashboard/packages" },
    { label: "Giriş", to: "/login" },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices((res.data.data || []).slice(0, 8));
      } catch (error) {
        console.error("Hizmetler yüklenemedi:", error);
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

  const getServiceId = (service) => service?._id || service?.id;

  const getWizardPath = (service) => {
    const serviceId = getServiceId(service);
    if (serviceId) return `/create-request/${serviceId}`;

    const params = new URLSearchParams({ search: service?.name || "" });
    return `/services?${params.toString()}`;
  };

  const getIcon = (service) => {
    const text = `${service?.slug || ""} ${service?.name || ""}`.toLocaleLowerCase("tr");
    const props = { size: 26, strokeWidth: 1.6, "aria-hidden": "true" };

    if (text.includes("mobil") || text.includes("app")) return <Smartphone {...props} />;
    if (text.includes("web") || text.includes("yazılım") || text.includes("kod")) return <Code {...props} />;
    if (text.includes("tasarım") || text.includes("logo") || text.includes("grafik")) return <PenTool {...props} />;
    if (text.includes("veri") || text.includes("data")) return <Database {...props} />;
    if (text.includes("seo") || text.includes("pazarlama")) return <Globe {...props} />;
    if (text.includes("güvenlik") || text.includes("siber")) return <Shield {...props} />;
    return <Cpu {...props} />;
  };

  const featuredServices = useMemo(() => services.slice(0, 6), [services]);
  const quickServices = useMemo(() => services.slice(0, 8), [services]);

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
    <main className="min-h-screen overflow-hidden bg-[#f7f7f2] text-slate-950 font-sans selection:bg-[#c9ff2a] selection:text-black">
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

      {/* HERO */}
      <section className="relative px-5 pt-10 pb-20 md:px-8 md:pt-20 lg:pb-28" aria-label="Giriş Bölümü">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-[#dfff3f]/40 blur-3xl" />
          <div className="absolute -right-32 top-32 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.10)_1px,transparent_0)] [background-size:28px_28px] opacity-40" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-600 shadow-sm backdrop-blur-xl">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
                  <Sparkles size={14} aria-hidden="true" />
                </span>
                Freelancer pazaryeri
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-slate-950 md:text-7xl xl:text-8xl">
                Projeni anlat,
                <span className="relative mx-2 inline-block">
                  <span className="absolute inset-x-0 bottom-2 -z-10 h-5 rounded-full bg-[#c9ff2a] md:bottom-3 md:h-8" />
                  uzmanı
                </span>
                sistem eşleştirsin.
              </h1>

              <p className="mt-8 max-w-2xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
                Yazılım, tasarım, SEO ve veri projeleri için doğru kategoriyi seçin;
                talep sihirbazı ihtiyacınızı adım adım netleştirsin.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-10 max-w-2xl rounded-[2rem] border border-white/70 bg-white/85 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
                role="search"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label htmlFor="search-input" className="sr-only">
                    Uzman veya hizmet arayın
                  </label>
                  <div className="flex flex-1 items-center gap-3 px-4">
                    <Search size={22} className="text-slate-400" aria-hidden="true" />
                    <input
                      id="search-input"
                      name="q"
                      type="search"
                      placeholder="Web sitesi, logo, mobil uygulama..."
                      className="h-16 w-full bg-transparent text-base font-bold text-slate-950 outline-none placeholder:text-slate-300 md:text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Arama yap"
                    className="group inline-flex h-16 items-center justify-center gap-2 rounded-[1.4rem] bg-slate-950 px-8 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600 active:scale-95"
                  >
                    Ara
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap gap-3">
                {loadingServices
                  ? [1, 2, 3, 4].map((item) => (
                      <span key={item} className="h-11 w-28 animate-pulse rounded-full bg-white/60" />
                    ))
                  : quickServices.slice(0, 5).map((service) => (
                      <Link
                        key={getServiceId(service)}
                        to={getWizardPath(service)}
                        className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white"
                        title={`${service.name} talep sihirbazını aç`}
                        aria-label={`${service.name} hizmeti için talep oluştur`}
                      >
                        {service.name}
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </Link>
                    ))}
              </div>
            </div>

            <div className="relative min-h-[560px] lg:min-h-[680px]">
              <div className="absolute left-4 top-2 w-[78%] rotate-[-7deg] rounded-[2.5rem] border border-white/60 bg-white/55 p-3 shadow-2xl backdrop-blur-xl md:left-10">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop"
                  className="h-[420px] w-full rounded-[2rem] object-cover md:h-[520px]"
                  alt="Bilgisayar başında çalışan profesyonel yazılım ve tasarım uzmanı"
                  width="620"
                  height="620"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="absolute right-0 top-16 w-[68%] rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] md:right-2">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Canlı akış</p>
                    <h2 className="mt-1 text-xl font-black tracking-tight">Yeni talepler</h2>
                  </div>
                  <span className="rounded-full bg-[#c9ff2a] px-3 py-1 text-[11px] font-black text-black">Aktif</span>
                </div>

                <div className="space-y-3">
                  {[
                    ["Web arayüz", "3 teklif geldi"],
                    ["Logo tasarım", "Sihirbaz tamamlandı"],
                    ["SEO analizi", "Uzman eşleşti"],
                  ].map(([title, status]) => (
                    <div key={title} className="flex items-center justify-between rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950">
                          <Layers size={18} aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-sm font-black">{title}</p>
                          <p className="text-xs font-semibold text-slate-400">{status}</p>
                        </div>
                      </div>
                      <ArrowUpRight size={18} className="text-[#c9ff2a]" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-8 left-0 w-[58%] rounded-[2rem] border border-black/10 bg-[#c9ff2a] p-6 shadow-2xl md:left-6">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/50">Ortalama süreç</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-6xl font-black tracking-tighter">3</span>
                  <span className="pb-3 text-lg font-black">adımda talep</span>
                </div>
                <p className="mt-3 text-sm font-bold leading-6 text-black/65">
                  Hizmet seç, detayları doldur, uzmanlardan teklif al.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE WIZARD */}
      <section className="px-5 py-12 md:px-8 md:py-20" aria-labelledby="wizard-heading">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-[0_40px_120px_rgba(15,23,42,0.30)] md:rounded-[4rem]">
          <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#c9ff2a]/20 blur-3xl" />
              <div className="relative z-10">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-slate-300 ring-1 ring-white/10">
                  <span className="h-2 w-2 rounded-full bg-[#c9ff2a]" />
                  Talep sihirbazı
                </div>
                <h2 id="wizard-heading" className="text-4xl font-black leading-[0.95] tracking-[-0.06em] md:text-6xl">
                  Hizmet seç, talebi başlat.
                </h2>
                <p className="mt-6 max-w-md text-base font-medium leading-7 text-slate-400 md:text-lg">
                  Aşağıdaki her hizmet direkt ilgili talep oluşturma sihirbazına gider.
                  Kullanıcı önce katalogda kaybolmaz, doğrudan doğru adıma geçer.
                </p>

                <Link
                  to="/services"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-[#c9ff2a]"
                >
                  Tüm hizmetleri gör
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {loadingServices
                ? Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="min-h-[220px] animate-pulse bg-white/5 p-6" />
                    ))
                : featuredServices.map((service, index) => (
                    <Link
                      key={getServiceId(service)}
                      to={getWizardPath(service)}
                      className="group relative min-h-[240px] overflow-hidden bg-slate-950 p-6 transition-all hover:bg-white hover:text-slate-950"
                      aria-label={`${service.name} hizmeti için talep sihirbazını başlat`}
                      title={`${service.name} talep sihirbazını başlat`}
                    >
                      <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-[#c9ff2a]/0 blur-2xl transition-all group-hover:bg-[#c9ff2a]/80" />
                      <div className="relative z-10 flex h-full flex-col justify-between">
                        <div>
                          <div className="mb-6 flex items-center justify-between">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 transition-all group-hover:bg-slate-950 group-hover:text-white">
                              {getIcon(service)}
                            </span>
                            <span className="text-xs font-black text-slate-500 transition-colors group-hover:text-slate-400">
                              0{index + 1}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black tracking-tight">{service.name}</h3>
                          <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-400 transition-colors group-hover:text-slate-600">
                            {service.description || "Bu hizmet için talep detaylarınızı sihirbaz üzerinden oluşturun."}
                          </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 transition-colors group-hover:border-slate-200">
                          <span className="text-sm font-black">Sihirbaza git</span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 transition-all group-hover:rotate-45 group-hover:bg-slate-950 group-hover:text-white">
                            <ArrowUpRight size={18} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-5 py-12 md:px-8 md:py-20" aria-labelledby="categories-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">Popüler kategoriler</p>
              <h2 id="categories-heading" className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
                İşini anlatacağın doğru kapı.
              </h2>
            </div>
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-sm font-black text-slate-950"
              title="Tüm hizmet kategorilerini görüntüle"
            >
              Tüm kategoriler
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {loadingServices
              ? Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-[2.5rem] bg-white/70" />
                  ))
              : quickServices.map((service, index) => (
                  <Link
                    key={getServiceId(service)}
                    to={getWizardPath(service)}
                    className={`group relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(15,23,42,0.14)] ${
                      index === 0 || index === 5 ? "md:col-span-2" : ""
                    }`}
                    aria-label={`${service.name} kategorisinde talep oluştur`}
                    title={`${service.name} talep sihirbazını aç`}
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#c9ff2a]/0 blur-2xl transition-all duration-500 group-hover:bg-[#c9ff2a]/70" />
                    <div className="relative z-10 flex min-h-[230px] flex-col justify-between">
                      <div>
                        <div className="mb-8 flex items-center justify-between">
                          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-950 transition-all group-hover:rotate-[-6deg] group-hover:bg-slate-950 group-hover:text-white">
                            {getIcon(service)}
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-400 transition-all group-hover:bg-[#c9ff2a] group-hover:text-black">
                            Talep aç
                          </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-950">{service.name}</h3>
                        <p className="mt-3 line-clamp-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                          {service.description || "Uzmanlardan teklif almak için bu kategoride talep oluşturun."}
                        </p>
                      </div>

                      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                        <span className="text-sm font-black text-slate-500 transition-colors group-hover:text-slate-950">
                          Sihirbazı başlat
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white transition-all group-hover:rotate-45 group-hover:bg-blue-600">
                          <ArrowUpRight size={18} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-5 py-12 md:px-8 md:py-20" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600">Teklif hakları</p>
            <h2 id="pricing-heading" className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
              Uzmanlar için büyüme paketleri.
            </h2>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-600">
              Projeler için rekabete hazır olun. Size uygun paketi seçin ve hemen teklif vermeye başlayın.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={`group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${plan.bg} p-7 ring-1 ${plan.ring} transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)]`}
              >
                {plan.popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-slate-950 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white">
                    En Popüler
                  </span>
                )}

                <div className="flex min-h-[460px] flex-col justify-between">
                  <div>
                    <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                      {plan.icon}
                    </div>
                    <p className={`text-sm font-black uppercase tracking-[0.22em] ${plan.accent}`}>{plan.name}</p>
                    <h3 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950">
                      {plan.offers} adet teklif hakkı
                    </h3>
                    <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">{plan.description}</p>

                    <ul className="mt-8 space-y-4">
                      {[
                        `${plan.offers} adet teklif hakkı`,
                        "Öncelikli destek hattı",
                        "Komisyon ödemesi yok",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
                            <Check size={15} strokeWidth={3} aria-hidden="true" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <div className="mb-6 flex items-end gap-2">
                      <span className="text-5xl font-black tracking-tighter text-slate-950">₺{plan.price}</span>
                      <span className="pb-2 text-sm font-bold text-slate-400">/ paket</span>
                    </div>
                    <button
                      onClick={() => handlePurchase(plan)}
                      aria-label={`${plan.name} paketini satın al - Fiyat: ₺${plan.price}`}
                      className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-7 py-5 text-sm font-black text-white transition-all hover:bg-blue-600 active:scale-95"
                    >
                      Hemen Satın Al
                      <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-12 md:px-8" role="contentinfo">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 rounded-[2rem] border border-black/5 bg-white/70 p-6 backdrop-blur md:flex-row md:items-center md:p-8">
          <div>
            <div className="text-3xl font-black tracking-[-0.08em] text-slate-950">firsatis.com</div>
            <p className="mt-2 text-sm font-semibold text-slate-500">Projeyi doğru uzmanla buluşturan modern talep platformu.</p>
          </div>

          <nav className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500" aria-label="Alt menü">
            {footerLinks.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-full bg-slate-100 px-4 py-3 transition-all hover:bg-slate-950 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
};

export default Home;
