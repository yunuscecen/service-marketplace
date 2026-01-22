import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
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
    const props = { size: 24, strokeWidth: 1.5 };
    if (n.includes("mobil")) return <Smartphone {...props} />;
    if (n.includes("web") || n.includes("yazılım")) return <Code {...props} />;
    if (n.includes("tasarım") || n.includes("logo"))
      return <PenTool {...props} />;
    if (n.includes("veri")) return <Database {...props} />;
    if (n.includes("seo")) return <Globe {...props} />;
    return <Cpu {...props} />;
  };

  const plans = [
    {
      name: "Starter",
      price: "495",
      icon: <Zap size={24} />,
      bg: "bg-[#F2F6FF]",
      accent: "text-blue-600",
      features: [
        "4 Adet Teklif Hakkı",
        "Temel Profil Listeleme",
        "E-posta Desteği",
      ],
    },
    {
      name: "Professional",
      price: "935",
      icon: <Rocket size={24} />,
      bg: "bg-[#F5FFF2]",
      accent: "text-green-600",
      popular: true,
      features: [
        "10 Adet Teklif Hakkı",
        "Öne Çıkan Uzman Rozeti",
        "Öncelikli Müşteri Desteği",
      ],
    },
    {
      name: "Enterprise",
      price: "1375",
      icon: <Crown size={24} />,
      bg: "bg-[#FFF9F2]",
      accent: "text-orange-600",
      features: [
        "Sınırsız Teklif Hakkı",
        "Üst Sırada Listelenme",
        "7/24 Teknik Destek",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      {/* --- HERO SECTION: CLEAN & CENTERED --- */}
      <section className="pt-24 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-[5.5rem] font-bold tracking-tight leading-[1.1]">
            Teknoloji projeleriniz için <br /> doğru uzmanı bulun
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
            Yazılımdan dijital tasarıma kadar tüm teknik ihtiyaçlarınız için en
            yetkin profesyonellerle çalışın.
          </p>

          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="relative w-full max-w-xl">
              <div className="bg-[#f3f3f2] p-2 rounded-2xl flex items-center border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all shadow-sm">
                <input
                  type="text"
                  placeholder="Hangi hizmete ihtiyacınız var?"
                  className="bg-transparent w-full px-6 py-4 outline-none text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#00a82d] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#008f26] transition-all"
                >
                  Ara
                </button>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-400">
              Henüz üye değil misiniz?{" "}
              <Link
                to="/register"
                className="text-black underline decoration-2 underline-offset-4"
              >
                Hemen Katılın
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image Mockup */}
        <div className="mt-20 max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
            alt="Uzman çalışma alanı"
            className="w-full aspect-video object-cover"
          />
        </div>
      </section>

      {/* --- SERVICES: ICONIC GRID --- */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex justify-between items-end mb-16 px-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Popüler kategoriler
          </h2>
          <Link
            to="/services"
            className="text-sm font-bold border-b-2 border-black pb-1"
          >
            Tümünü gör
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service._id}
              to={`/create-request/${service._id}`}
              className="group bg-[#f8f9fa] p-10 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-slate-100"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-[#00a82d] group-hover:text-white transition-all mb-8">
                {getIcon(service.name)}
              </div>
              <h3 className="text-lg font-bold mb-2 tracking-tight">
                {service.name}
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                {service.description.substring(0, 60)}...
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* --- PLANS: EVERNOTE STYLE ASYMMETRIC BLOCKS --- */}
      <section className="py-24 px-6 space-y-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-4xl font-bold tracking-tight">
            Size uygun teklif paketini seçin
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Hizmet verenler için tasarlanmış profesyonel üyelik planları.
          </p>
        </div>

        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`${plan.bg} rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-16 transition-transform hover:scale-[1.01] duration-500 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm">
                <span className={plan.accent}>{plan.icon}</span>
                <span
                  className={`text-xs font-black uppercase tracking-widest ${plan.accent}`}
                >
                  {plan.name}
                </span>
              </div>
              <h3 className="text-5xl font-bold leading-tight tracking-tight">
                {index === 0 && "Hızlıca ilk teklifinizi gönderin"}
                {index === 1 && "Profesyonel ağınızı genişletin"}
                {index === 2 && "Sektörün zirvesinde yer alın"}
              </h3>
              <p className="text-xl text-slate-600 font-medium max-w-md">
                Uzmanlığınızı kazanca dönüştürmek için en etkili yol.
              </p>
              <div className="text-5xl font-black">
                ₺{plan.price}{" "}
                <span className="text-lg font-bold text-slate-400">/ay</span>
              </div>
              <button className="bg-black text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all">
                Planı Seç
              </button>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div
                className={`bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 ${index % 2 === 0 ? "rotate-2" : "-rotate-2"}`}
              >
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8">
                  Neler Dahil?
                </h4>
                <ul className="space-y-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-4 text-sm font-bold text-slate-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[#00a82d]">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* --- FOOTER: MINIMAL & BOLD --- */}
      <footer className="max-w-7xl mx-auto py-24 px-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="text-2xl font-black tracking-tighter uppercase">
            Service<span className="text-[#00a82d]">.</span>hub
          </div>
          <p className="text-slate-400 font-medium max-w-xs leading-relaxed">
            İstanbul'un en iyi teknoloji uzmanlarını müşterilerle buluşturan
            profesyonel pazaryeri.
          </p>
        </div>
        <div className="space-y-6">
          <h5 className="font-black text-xs uppercase tracking-widest">
            Platform
          </h5>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li>
              <Link to="/services">Hizmetler</Link>
            </li>
            <li>
              <Link to="/register">Hizmet Ver</Link>
            </li>
            <li>
              <Link to="/">Planlar</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <h5 className="font-black text-xs uppercase tracking-widest">
            Legal
          </h5>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li>
              <Link to="/">Gizlilik Politikası</Link>
            </li>
            <li>
              <Link to="/">Kullanım Şartları</Link>
            </li>
            <li>
              <Link to="/">KVKK</Link>
            </li>
          </ul>
        </div>
        <div className="col-span-full pt-12 border-t border-slate-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
          <span>© 2026 Technohub İstanbul</span>
          <div className="flex gap-6">
            <span>Linkedin</span>
            <span>Twitter</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
