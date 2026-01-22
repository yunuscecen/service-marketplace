import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Başlangıç",
      offers: 4,
      price: 495,
      icon: <Zap size={32} className="text-orange-500" />,
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
      icon: <Rocket size={32} className="text-blue-500" />,
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
      icon: <Crown size={32} className="text-purple-500" />,
      bg: "bg-[#FFF9F2]",
      accent: "text-orange-600",
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
      }
    };
    fetchServices();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/services?search=${searchTerm}`);
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
    const props = { size: 24, strokeWidth: 1.5 };
    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo"))
      return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;
    return <Cpu {...props} />;
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans selection:bg-[#c9ff2a]">
      {/* --- KREATİF MİNİMAL HERO --- */}
      <section className="relative pt-12 md:pt-24 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Sol: Metin ve Arama */}
          <div className="z-10 space-y-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[11px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9ff2a]"></span>
              Teknoloji Ekosistemi
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Projeleriniz için <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-400">
                doğru uzmanı
              </span>{" "}
              <br />
              burada bulun.
            </h1>

            <p className="text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
              Yazılım, tasarım ve veri biliminde onaylı uzmanlarla çalışarak
              işinizi bir sonraki seviyeye taşıyın.
            </p>

            <div className="max-w-lg">
              <div className="bg-white p-2 rounded-2xl flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                <input
                  type="text"
                  placeholder="Yazılım, Tasarım veya SEO..."
                  className="bg-transparent w-full px-6 py-4 outline-none text-lg font-medium placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all active:scale-95"
                >
                  Ara
                </button>
              </div>
            </div>
          </div>

          {/* Sağ: Sanatsal Görsel Kompozisyonu */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Uzman çalışırken"
              />
            </div>
            {/* Dekoratif Modern Degrade Elemanı */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse delay-700"></div>

            {/* Floating Badge (Evernote stili kreatif kart) */}
            <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-50 hidden sm:flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-[#c9ff2a] rounded-2xl flex items-center justify-center">
                <ArrowUpRight size={24} className="text-black" />
              </div>
              <div>
                <div className="text-sm font-black tracking-tight">
                  Onaylı Uzmanlar
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Bugün 12 yeni ilan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- KATEGORİLER --- */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-16 border-b border-slate-100 pb-10">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            Kategoriler
          </h2>
          <Link
            to="/services"
            className="text-sm font-black border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service._id}
              to={`/create-request/${service._id}`}
              className="group bg-[#f8f9fa] p-10 rounded-[3rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-slate-100 relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-[#c9ff2a] group-hover:text-black transition-all mb-10">
                {getIcon(service.name)}
              </div>
              <h3 className="text-xl  tracking-tight mb-2 group-hover:text-black transition-colors">
                {service.name}
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                İşin ehli profesyoneller.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- PAKETLER (Ferahlatılmış Tasarım) --- */}
      <section className="py-24 px-6 space-y-16 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-5xl font-bold tracking-tight">
            Teklif paketleri.
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed">
            Projeler için rekabete hazır olun. Size en uygun paketi seçin ve
            hemen teklif vermeye başlayın.
          </p>
        </div>

        <div className="space-y-10">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`${plan.bg} rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 transition-all duration-700 hover:scale-[1.01] ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-1 space-y-10 text-center md:text-left">
                <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm font-bold text-[11px] uppercase tracking-widest text-slate-400">
                  {plan.icon} {plan.name}
                </div>

                <h3 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
                  {plan.offers} Adet <br /> Teklif Hakkı
                </h3>

                <div className="text-6xl font-black tracking-tighter text-slate-950">
                  ₺{plan.price}
                </div>

                <button
                  onClick={() => handlePurchase(plan)}
                  className="bg-black text-white px-12 py-6 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95"
                >
                  Hemen Satın Al
                </button>
              </div>

              <div className="flex-1 w-full max-w-md">
                <div
                  className={`bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-50 transition-transform duration-700 hover:rotate-0 ${index % 2 === 0 ? "rotate-3 translate-x-6" : "-rotate-3 -translate-x-6"}`}
                >
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-10">
                    Paket Detayları
                  </h4>
                  <ul className="space-y-6">
                    <li className="flex items-center gap-4 text-sm font-bold text-slate-700">
                      <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      {plan.offers} Adet Teklif Hakkı
                    </li>
                    <li className="flex items-center gap-4 text-sm font-bold text-slate-700">
                      <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      Öncelikli Destek Hattı
                    </li>
                    <li className="flex items-center gap-4 text-sm font-bold text-slate-300">
                      <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <span className="line-through">Komisyon Ödemesi</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="max-w-7xl mx-auto py-24 px-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-3xl font-black tracking-tighter uppercase text-slate-900 italic-none">
          Service<span className="text-[#c9ff2a]">.</span>hub
        </div>
        <div className="flex gap-12 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link to="/" className="hover:text-black">
            Dizin
          </Link>
          <Link to="/" className="hover:text-black">
            Güvenlik
          </Link>
          <Link to="/" className="hover:text-black">
            Kvkk
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
