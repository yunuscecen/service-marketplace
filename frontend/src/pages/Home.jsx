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
      icon: <Zap size={32} className="text-orange-500" aria-hidden="true" />,
      bg: "bg-[#F2F6FF]",
      accent: "text-blue-600",
      description:
        "Sistemi denemek ve ilk projelerinize teklif vermek için ideal.",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 8,
      price: 935,
      icon: <Rocket size={32} className="text-blue-500" aria-hidden="true" />,
      bg: "bg-[#F5FFF2]",
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
      icon: <Crown size={32} className="text-purple-500" aria-hidden="true" />,
      bg: "bg-[#FFF9F2]",
      accent: "text-orange-600",
      description:
        "Büyük ölçekli projeler ve ajanslar için yüksek kapasiteli çözüm.",
    },
  ];

  const stats = [
    { value: "8+", label: "Aktif kategori" },
    { value: "24s", label: "İçinde teklif akışı" },
    { value: "0₺", label: "İlan yayınlama ücreti" },
  ];

  const steps = [
    {
      title: "İhtiyacını anlat",
      desc: "Proje detaylarını birkaç adımda paylaş, doğru uzmanlar seni görsün.",
      icon: <Search size={22} aria-hidden="true" />,
    },
    {
      title: "Teklifleri karşılaştır",
      desc: "Fiyat, süre ve uzman profiline göre en doğru seçimi yap.",
      icon: <ArrowRight size={22} aria-hidden="true" />,
    },
    {
      title: "Uzmanla iletişime geç",
      desc: "Canlı mesajlaşma ile işi netleştir, güvenle ilerle.",
      icon: <Check size={22} aria-hidden="true" />,
    },
  ];

  const featuredCards = [
    {
      title: "Web geliştirme",
      desc: "Kurumsal site, panel, landing page ve özel yazılım işleri.",
      icon: <Code size={24} aria-hidden="true" />,
    },
    {
      title: "Mobil uygulama",
      desc: "iOS, Android ve hibrit uygulama ihtiyaçları.",
      icon: <Smartphone size={24} aria-hidden="true" />,
    },
    {
      title: "Marka & tasarım",
      desc: "Logo, sosyal medya, arayüz ve reklam kreatifleri.",
      icon: <PenTool size={24} aria-hidden="true" />,
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

  const getIcon = (name) => {
    const n = name.toLowerCase();
    const props = { size: 24, strokeWidth: 1.5, "aria-hidden": "true" };

    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo"))
      return <PenTool {...props} />;
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
    <main className="min-h-screen overflow-hidden bg-[#F7F8FC] text-slate-950 font-sans selection:bg-[#c9ff2a] selection:text-black">
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
        <meta
          property="og:title"
          content="Fırsatİş - Teknoloji Uzmanlarını Bulun"
        />
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
        <meta
          name="twitter:title"
          content="Fırsatİş - Teknoloji Uzmanlarını Bulun"
        />
        <meta
          name="twitter:description"
          content="Projeleriniz için doğru uzmanı burada bulun."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200"
        />

        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      {/* HERO */}
      <section
        className="relative px-6 pt-10 pb-24 md:pt-20 md:pb-28"
        aria-label="Giriş Bölümü"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-blue-200/40 blur-[120px]" />
          <div className="absolute right-0 top-32 h-[420px] w-[420px] rounded-full bg-[#c9ff2a]/30 blur-[100px]" />
          <div className="absolute left-0 bottom-0 h-[420px] w-[420px] rounded-full bg-purple-200/40 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10 space-y-9">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 shadow-sm backdrop-blur">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9ff2a] opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9ff2a]" />
                </span>
                Yeni nesil hizmet pazarı
              </div>

              <div className="space-y-6">
                <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950 md:text-7xl lg:text-8xl">
                  İşi bilen
                  <span className="relative mx-3 inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      uzmanı
                    </span>
                    <span className="absolute bottom-2 left-0 -z-0 h-5 w-full rounded-full bg-[#c9ff2a]" />
                  </span>
                  dakikalar içinde bul.
                </h1>

                <p className="max-w-2xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
                  Yazılım, tasarım, SEO, veri ve dijital projelerin için ilan
                  oluştur. Uzmanlar teklif versin, sen en doğru kişiyle hızlıca
                  işe başla.
                </p>
              </div>

              <div className="max-w-2xl">
                <form
                  onSubmit={handleSearch}
                  className="group rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.10)] transition-all focus-within:shadow-[0_30px_100px_rgba(37,99,235,0.18)]"
                  role="search"
                >
                  <label htmlFor="search-input" className="sr-only">
                    Uzman veya hizmet arayın
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3 px-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-focus-within:bg-blue-50 group-focus-within:text-blue-600">
                        <Search size={20} aria-hidden="true" />
                      </div>

                      <input
                        id="search-input"
                        name="q"
                        type="text"
                        placeholder="Web tasarım, logo, SEO, mobil uygulama..."
                        className="min-h-[58px] w-full bg-transparent text-base font-bold text-slate-900 outline-none placeholder:text-slate-300 md:text-lg"
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

                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {["Web Tasarım", "React", "Logo", "SEO", "Mobil Uygulama"].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSearchTerm(item);
                          navigate(
                            `/services?search=${encodeURIComponent(item)}`
                          );
                        }}
                        className="rounded-full border border-white bg-white/70 px-4 py-2 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid max-w-2xl grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur"
                  >
                    <div className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-12 z-20 hidden rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl backdrop-blur md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c9ff2a] text-black">
                    <Check size={22} strokeWidth={3} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      Onaylı uzman akışı
                    </p>
                    <p className="text-xs font-semibold text-slate-400">
                      Profil, teklif ve mesajlaşma
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 bottom-16 z-20 hidden rounded-[2rem] border border-white/80 bg-slate-950 p-5 text-white shadow-2xl md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500">
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Bugün 12 yeni ilan</p>
                    <p className="text-xs font-semibold text-white/50">
                      Kategoriler canlı
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto max-w-[560px] rounded-[3rem] border border-white/80 bg-white/60 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.18)] backdrop-blur">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-200">
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

                  <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/20 bg-white/15 p-5 text-white backdrop-blur-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        Canlı teklif
                      </span>
                      <span className="text-xs font-bold text-white/70">
                        3 dk önce
                      </span>
                    </div>

                    <p className="text-xl font-black leading-tight">
                      “React panel ve kurumsal web sitesi için teklif geldi.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-3">
            {featuredCards.map((card) => (
              <div
                key={card.title}
                className="group rounded-[2.5rem] border border-white/70 bg-white/75 p-7 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
              >
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all group-hover:bg-[#c9ff2a] group-hover:text-black">
                  {card.icon}
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section className="px-6 py-20" aria-labelledby="how-it-works-heading">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-slate-950 p-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.25)] md:p-14">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#c9ff2a]">
                Süreç
              </p>
              <h2
                id="how-it-works-heading"
                className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] md:text-6xl"
              >
                İlan aç, teklifleri gör, doğru uzmanla başla.
              </h2>
            </div>

            <Link
              to="/create-request"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-wider text-slate-950 transition hover:bg-[#c9ff2a]"
            >
              İlan oluştur
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-7"
              >
                <div className="absolute -right-6 -top-8 text-[120px] font-black leading-none text-white/[0.03]">
                  0{index + 1}
                </div>

                <div className="relative z-10">
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9ff2a] text-black">
                    {step.icon}
                  </div>

                  <h3 className="text-2xl font-black tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm font-medium leading-7 text-white/55">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section
        className="mx-auto max-w-7xl px-6 py-24"
        aria-labelledby="categories-heading"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 border-b border-slate-200 pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-blue-600">
              Kategoriler
            </p>
            <h2
              id="categories-heading"
              className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl"
            >
              Projen için en doğru alanı seç.
            </h2>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-950 transition hover:text-blue-600"
            title="Tüm hizmet kategorilerini görüntüle"
          >
            Tümünü Gör
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid min-h-[300px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loadingServices
            ? Array(8)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-[2.5rem] bg-white"
                  />
                ))
            : services.map((service, index) => (
                <Link
                  key={service._id}
                  to={`/create-request/${service._id}`}
                  className={`group relative overflow-hidden rounded-[2.5rem] border border-white bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
                    index === 0 || index === 5 ? "lg:row-span-2" : ""
                  }`}
                  aria-label={`${service.name} kategorisinde ilan oluştur`}
                  title={`${service.name} hizmetleri`}
                >
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-100 opacity-0 blur-2xl transition group-hover:opacity-100" />

                  <div className="relative z-10 flex h-full min-h-48 flex-col justify-between">
                    <div>
                      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition-all group-hover:rotate-6 group-hover:bg-[#c9ff2a] group-hover:text-black">
                        {getIcon(service.name)}
                      </div>

                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                        {service.name}
                      </h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-400">
                        İşin ehli profesyonellerden hızlı teklif alın.
                      </p>
                    </div>

                    <div className="mt-10 inline-flex items-center gap-2 text-sm font-black text-slate-950 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                      İlan oluştur
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      {/* GÜVEN / FARK */}
      <section className="px-6 py-20" aria-labelledby="why-heading">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[3rem] bg-[#c9ff2a] p-10 md:p-14">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-black/50">
              Neden Fırsatİş?
            </p>

            <h2
              id="why-heading"
              className="mt-5 text-4xl font-black tracking-[-0.05em] text-black md:text-6xl"
            >
              Daha az karmaşa, daha hızlı eşleşme.
            </h2>

            <p className="mt-6 text-base font-bold leading-8 text-black/60">
              İlan sahipleri ücretsiz talep açar. Uzmanlar teklif hakkı ile
              projelere başvurur. Böylece iki taraf da daha net ve hızlı bir
              süreç yaşar.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              "Talep odaklı teklif sistemi",
              "Kategori bazlı uzman akışı",
              "Canlı mesajlaşma deneyimi",
              "SEO uyumlu hizmet sayfaları",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[2.5rem] border border-white bg-white p-8 shadow-sm"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Check size={22} strokeWidth={3} aria-hidden="true" />
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  {item}
                </h3>

                <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                  Platform deneyimini basitleştirir, kullanıcıyı doğrudan
                  aksiyona yönlendirir.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAKETLER */}
      <section
        className="mx-auto max-w-7xl px-6 py-24"
        aria-labelledby="pricing-heading"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-purple-600">
              Teklif paketleri
            </p>

            <h2
              id="pricing-heading"
              className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl"
            >
              Uzmanlar için teklif hakkı paketleri.
            </h2>

            <p className="mt-5 text-lg font-medium leading-8 text-slate-500">
              Projeler için rekabete hazır olun. Size en uygun paketi seçin ve
              hemen teklif vermeye başlayın.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`group relative overflow-hidden rounded-[3rem] border border-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${plan.bg}`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                  En Popüler
                </div>
              )}

              <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/80 blur-3xl transition group-hover:scale-125" />

              <div className="relative z-10">
                <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                  {plan.icon}
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {plan.name}
                  </h3>
                  <p className="mt-3 min-h-14 text-sm font-semibold leading-6 text-slate-500">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="text-6xl font-black tracking-[-0.08em] text-slate-950">
                    ₺{plan.price}
                  </div>
                  <div className="mt-2 text-sm font-black uppercase tracking-widest text-slate-400">
                    {plan.offers} adet teklif hakkı
                  </div>
                </div>

                <ul className="mb-10 space-y-4">
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
                    Komisyon ödemesi yok
                  </li>
                </ul>

                <button
                  onClick={() => handlePurchase(plan)}
                  aria-label={`${plan.name} paketini satın al - Fiyat: ₺${plan.price}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-5 text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-blue-600 active:scale-95"
                >
                  Hemen Satın Al
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[3.5rem] bg-slate-950 p-10 text-white shadow-[0_35px_120px_rgba(15,23,42,0.35)] md:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#c9ff2a]">
                Hemen başla
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] md:text-6xl">
                Aklındaki projeyi ilana dönüştür, uzmanlar teklif versin.
              </h2>
            </div>

            <Link
              to="/create-request"
              className="inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-[#c9ff2a] px-9 py-6 text-sm font-black uppercase tracking-wider text-black transition hover:bg-white active:scale-95"
            >
              İlan oluştur
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 border-t border-slate-200 px-6 py-14 md:flex-row"
        role="contentinfo"
      >
        <div>
          <div className="text-3xl font-black uppercase tracking-[-0.08em] text-slate-950">
            firsatis.com
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            Uzman hizmet pazarı
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/sitemap" className="transition hover:text-black">
            Dizin
          </Link>

          <Link to="/privacy-policy" className="transition hover:text-black">
            Güvenlik
          </Link>

          <Link to="/kvkk" className="transition hover:text-black">
            Kvkk
          </Link>
        </nav>
      </footer>
    </main>
  );
};

export default Home;