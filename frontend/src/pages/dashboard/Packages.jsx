import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import toast from "react-hot-toast";

const Packages = () => {
  const plans = [
    {
      id: "basic",
      name: "Başlangıç",
      offers: 4,
      price: 495,
      icon: <Zap className="text-orange-500" />,
      color: "border-orange-100",
    },
    {
      id: "pro",
      name: "Profesyonel",
      offers: 8,
      price: 935,
      icon: <Rocket className="text-blue-500" />,
      color: "border-blue-100",
      popular: true,
    },
    {
      id: "premium",
      name: "Kurumsal",
      offers: 12,
      price: 1375,
      icon: <Crown className="text-purple-500" />,
      color: "border-purple-100",
    },
  ];
const handlePurchase = () => {
  toast.error("Ödeme sistemi henüz entegre edilmedi. Paket satın alma şu anda aktif değil.", {
    duration: 5000,
  });
};

  return (
    <DashboardLayout>
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Teklif Paketleri
        </h1>
        <p className="text-gray-500 font-light ">
          Projeler için rekabete hazır olun. Size en uygun paketi seçin ve hemen
          teklif vermeye başlayın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-[3rem] p-10 border-2 ${plan.color} transition-all hover:shadow-2xl hover:-translate-y-2 group`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">
                En Çok Seçilen
              </div>
            )}

            <div className="mb-8">{plan.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black tracking-tighter">
                {plan.price}
              </span>
              <span className="text-gray-400 font-bold">TL</span>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <Check size={16} className="text-green-500" /> {plan.offers}{" "}
                Adet Teklif Hakkı
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <Check size={16} className="text-green-500" /> Öncelikli Destek
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-gray-400 line-through">
                Komisyon Ödemesi
              </li>
            </ul>

<button
  onClick={handlePurchase}
  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
    plan.popular
      ? "bg-black text-white hover:bg-gray-800"
      : "bg-gray-50 text-black hover:bg-gray-100"
  }`}
>
  Yakında Aktif Olacak
</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Packages;
