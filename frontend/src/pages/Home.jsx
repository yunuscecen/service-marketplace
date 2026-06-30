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
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Layers,
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
      bg: "from-blue-50 via-white to-indigo-50",
      ring: "ring-blue-100",
      accent: "text-blue-600",
      description:
        "Sistemi denemek ve ilk projelerinize teklif vermek için ideal.",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 8,
      price: 935,
      icon: <Rocket size={28} className="text-blue-500" aria-hidden="true" />,
      bg: "from-lime-50 via-white to-emerald-50",
      ring: "ring-lime-200",
      accent: "text-green-600",
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices((res.data.data || []).slice(0, 8));
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
    navigate(`/services?search=${encodeURIComponent(searchTerm.trim())}`);
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
    const props = { size: 24, strokeWidth: 1.8, "aria-hidden": "true" };

    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo")) return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;

    return <Cpu {...props} />;
  };

  const getServiceDescription = (service) => {
    if (service?.description) return service.description;
    return `${service?.name || "Bu hizmet"} alanında uzmanlardan hızlıca teklif alın.`;
  };

  const goToServiceSearch = (name) => {
    if (!name) return;
    navigate(`/services?search=${encodeURIComponent(name)}`);
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
    <main
      className="min-h-screen overflow-hidden bg-[#f6f7fb] text-slate-950 selection:bg-[#c9ff2a] selection:text-black"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
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
        <link rel="canonical" href="https://firsatis.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Fırsatİş" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

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
      <section className="relative px-5 pb-20 pt-10 md:px-6 md:pb-28 md:pt-20" aria-label="Giriş Bölümü">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-120px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-200/50 blur-[120px]" />
          <div className="absolute right-[-120px] top-20 h-[420px] w-[420px] rounded-full bg-[#c9ff2a]/40 blur-[120px]" />
          <div className="absolute bottom-[-160px] left-[-160px] h-[520px] w-[520px] rounded-full bg-purple-200/50 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-9">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-slate-500 shadow-sm backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9ff2a] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9ff2a]" />
                </span>
                Canlı hizmet pazarı
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl text-[3.25rem] font-black leading-[0.92] tracking-[-0.07em] text-slate-950 md:text-7xl lg:text-[5.8rem]">
                  Projen için doğru uzmanı
                  <span className="relative ml-2 inline-block whitespace-nowrap">
                    <span className="relative z-10 bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      tek ekranda bul.
                    </span>
                    <span className="absolute bottom-2 left-0 h-5 w-full rounded-full bg-[#c9ff2a] md:h-7" />
                  </span>
                </h1>

                <p className="max-w-2xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
                  Veritabanındaki gerçek hizmet kategorilerinden seçim yap, ilanını oluştur,
                  uzmanlardan teklif al ve mesajlaşarak işi netleştir.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="group max-w-2xl rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_30px_90px_rgba(15,23,42,0.10)] transition-all focus-within:shadow-[0_35px_110px_rgba(37,99,235,0.20)]"
                role="search"
              >
                <label htmlFor="search-input" className="sr-only">
                  Uzman veya hizmet arayın
                </label>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3 px-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition group-focus-within:bg-blue-50 group-focus-within:text-blue-600">
                      <Search size={20} aria-hidden="true" />
                    </div>
                    <input
                      id="search-input"
                      name="q"
                      type="text"
                      placeholder={services[0]?.name ? `${services[0].name} ara...` : "Web tasarım, SEO, logo, yazılım..."}
                      className="min-h-[58px] w-full bg-transparent text-base font-bold text-slate-950 outline-none placeholder:text-slate-300 md:text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    aria-label="Arama yap"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.45rem] bg-slate-950 px-8 py-5 text-sm font-black uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600 active:scale-95"
                  >
                    Ara
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                </div>
              </form>

              <div className="flex max-w-2xl flex-wrap gap-2">
                {loadingServices
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className="h-9 w-24 animate-pulse rounded-full bg-white/80" />
                      ))
                  : services.slice(0, 6).map((service) => (
                      <button
                        key={service._id}
                        type="button"
                        onClick={() => goToServiceSearch(service.name)}
                        className="rounded-full border border-white bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-500 shadow-sm backdrop-blur transition hover:border-blue-200 hover:text-blue-600"
                      >
                        {service.name}
                      </button>
                    ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-10 z-20 hidden rotate-[-3deg] rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9ff2a] text-black">
                    <ShieldCheck size={22} strokeWidth={2.4} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">Gerçek kategoriler</p>
                    <p className="text-xs font-bold text-slate-400">Veritabanından gelir</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-12 z-20 hidden rotate-3 rounded-[2rem] bg-slate-950 p-5 text-white shadow-2xl md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                    <MessageCircle size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Canlı mesajlaşma</p>
                    <p className="text-xs font-bold text-white/50">Teklif sonrası iletişim</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto max-w-[560px] rounded-[3rem] border border-white/80 bg-white/70 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.18)] backdrop-blur">
                <div className="relative overflow-hidden rounded-[2.4rem] bg-slate-950 p-5 text-white">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,255,42,0.28),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.35),transparent_38%)]" />

                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-white/40">Akış</p>
                        <h2 className="mt-2 text-2xl font-black tracking-tight">Hizmet panosu</h2>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#c9ff2a]">
                        <Layers size={24} aria-hidden="true" />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {loadingServices
                        ? Array(4)
                            .fill(0)
                            .map((_, i) => (
                              <div key={i} className="h-20 animate-pulse rounded-3xl bg-white/10" />
                            ))
                        : services.slice(0, 4).map((service, index) => (
                            <Link
                              key={service._id}
                              to={`/create-request/${service._id}`}
                              className="group flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur transition hover:bg-white hover:text-slate-950"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#c9ff2a] transition group-hover:bg-[#c9ff2a] group-hover:text-black">
                                  {getIcon(service.name)}
                                </div>
                                <div>
                                  <p className="font-black tracking-tight">{service.name}</p>
                                  <p className="text-xs font-bold text-white/45 transition group-hover:text-slate-400">
                                    {index + 1}. aktif kategori
                                  </p>
                                </div>
                              </div>
                              <ArrowUpRight size={18} aria-hidden="true" />
                            </Link>
                          ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="rounded-3xl bg-white/10 p-4">
                        <p className="text-2xl font-black">{services.length || "—"}</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/35">Kategori</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 p-4">
                        <p className="text-2xl font-black">3</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/35">Adım</p>
                      </div>
                      <div className="rounded-3xl bg-[#c9ff2a] p-4 text-black">
                        <p className="text-2xl font-black">0₺</p>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-black/45">İlan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DİNAMİK KATEGORİLER */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-6" aria-labelledby="categories-heading">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-blue-600 shadow-sm">
              <Sparkles size={15} aria-hidden="true" />
              Veritabanından gelen kategoriler
            </div>
            <h2 id="categories-heading" className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
              Kullanıcının gerçekten seçebileceği hizmetler.
            </h2>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-blue-600"
            title="Tüm hizmet kategorilerini görüntüle"
          >
            Tümünü gör
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid min-h-[300px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingServices
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-72 animate-pulse rounded-[2.5rem] bg-white shadow-sm" />
                ))
            : services.map((service, index) => (
                <Link
                  key={service._id}
                  to={`/create-request/${service._id}`}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)] ${
                    index === 0 || index === 5 ? "lg:row-span-2" : ""
                  }`}
                  aria-label={`${service.name} kategorisinde ilan oluştur`}
                  title={`${service.name} hizmetleri`}
                >
                  <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-100 opacity-0 blur-3xl transition group-hover:opacity-100" />
                  <div className="absolute -bottom-24 -left-24 h-44 w-44 rounded-full bg-[#c9ff2a]/40 opacity-0 blur-3xl transition group-hover:opacity-100" />

                  <div className="relative z-10 flex h-full min-h-52 flex-col justify-between">
                    <div>
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all group-hover:rotate-6 group-hover:bg-[#c9ff2a] group-hover:text-black">
                        {getIcon(service.name)}
                      </div>

                      <h3 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                        {service.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-slate-500">
                        {getServiceDescription(service)}
                      </p>
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        İlan aç
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-blue-600">
                        <ArrowRight size={18} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="px-5 py-20 md:px-6" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3.5rem] bg-slate-950 p-8 text-white shadow-[0_35px_110px_rgba(15,23,42,0.28)] md:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#c9ff2a]">Nasıl çalışır?</p>
              <h2 id="process-heading" className="mt-5 text-4xl font-black tracking-[-0.05em] md:text-6xl">
                Karmaşayı azaltan 3 adımlı akış.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-medium leading-8 text-white/55">
              Ana sayfadaki tüm kategori çıkışları gerçek servis kayıtlarına bağlandı.
              Kullanıcı kategoriye tıkladığında direkt ilgili hizmet için talep oluşturma sayfasına gider.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Hizmet seç",
                desc: "Kategori kartları API'den gelen gerçek servis kayıtlarıyla oluşur.",
                icon: <Layers size={22} aria-hidden="true" />,
              },
              {
                title: "İlan oluştur",
                desc: "Kullanıcı seçtiği hizmetin gerçek ID'siyle talep formuna gider.",
                icon: <PenTool size={22} aria-hidden="true" />,
              },
              {
                title: "Teklifleri yönet",
                desc: "Uzmanlar teklif verir, taraflar mesajlaşarak işi netleştirir.",
                icon: <MessageCircle size={22} aria-hidden="true" />,
              },
            ].map((step, index) => (
              <div key={step.title} className="relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.06] p-7">
                <div className="absolute -right-5 -top-8 text-[118px] font-black leading-none text-white/[0.035]">0{index + 1}</div>
                <div className="relative z-10">
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9ff2a] text-black">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-white/55">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKETLER */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-6" aria-labelledby="pricing-heading">
        <div className="mb-12 max-w-3xl">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-purple-600">Teklif paketleri</p>
          <h2 id="pricing-heading" className="mt-5 text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
            Uzmanlar için net, sade ve hızlı paketler.
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-slate-500">
            Projeler için rekabete hazır olun. Size en uygun paketi seçin ve hemen teklif vermeye başlayın.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`group relative overflow-hidden rounded-[3rem] bg-gradient-to-br ${plan.bg} p-8 shadow-sm ring-1 ${plan.ring} transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_100px_rgba(15,23,42,0.16)]`}
            >
              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/80 blur-3xl transition group-hover:scale-125" />

              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                  En popüler
                </div>
              )}

              <div className="relative z-10">
                <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                  {plan.icon}
                </div>

                <h3 className="text-2xl font-black tracking-tight text-slate-950">{plan.name}</h3>
                <p className="mt-3 min-h-14 text-sm font-semibold leading-6 text-slate-500">{plan.description}</p>

                <div className="my-9">
                  <div className="text-6xl font-black tracking-[-0.08em] text-slate-950">₺{plan.price}</div>
                  <div className="mt-2 text-sm font-black uppercase tracking-widest text-slate-400">{plan.offers} adet teklif hakkı</div>
                </div>

                <ul className="mb-10 space-y-4">
                  {[
                    `${plan.offers} adet teklif hakkı`,
                    "Öncelikli destek hattı",
                    "Komisyon ödemesi yok",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-green-600">
                        <Check size={16} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan)}
                  aria-label={`${plan.name} paketini satın al - Fiyat: ₺${plan.price}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-5 text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-blue-600 active:scale-95"
                >
                  Hemen satın al
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-20 md:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3.5rem] bg-slate-950 p-8 text-white shadow-[0_35px_120px_rgba(15,23,42,0.35)] md:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#c9ff2a]">Başlamak için</p>
              <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] md:text-6xl">
                Kategorini seç, ilanını oluştur, teklifleri karşılaştır.
              </h2>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-[#c9ff2a] px-9 py-6 text-sm font-black uppercase tracking-wider text-black transition hover:bg-white active:scale-95"
            >
              Hizmetleri keşfet
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 border-t border-slate-200 px-5 py-14 md:flex-row md:px-6" role="contentinfo">
        <div>
          <div className="text-3xl font-black uppercase tracking-[-0.08em] text-slate-950">firsatis.com</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Uzman hizmet pazarı</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/services" className="transition hover:text-black">Hizmetler</Link>
          <Link to="/login" className="transition hover:text-black">Giriş</Link>
          <Link to="/register" className="transition hover:text-black">Kayıt</Link>
          <Link to="/dashboard/packages" className="transition hover:text-black">Paketler</Link>
        </nav>
      </footer>
    </main>
  );
};

export default Home;
