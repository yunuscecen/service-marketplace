// backend/seeder.js
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require("slugify");

// Env dosyasını yükle
dotenv.config();

// Modeli yükle
const Service = require("./models/Service");

// Veritabanına Bağlan
mongoose.connect(process.env.MONGO_URI);

// --- SEÇİLMİŞ & FİLTRELENMİŞ TEKNOLOJİ HİZMET LİSTESİ ---
const services = [
  // --- 1. YAZILIM VE GELİŞTİRME ---
  {
    name: "Android Uygulama Geliştirme",
    description:
      "Telefon ve tabletler için native veya hybrid Android uygulamaları.",
    questions: [
      {
        questionText: "Uygulamanın amacı nedir?",
        inputType: "select",
        options: [
          "E-Ticaret",
          "Oyun",
          "Sosyal Medya",
          "Kurumsal",
          "Araç/Utility",
        ],
      },
      {
        questionText: "Tasarımınız hazır mı?",
        inputType: "radio",
        options: ["Evet, hazır", "Hayır, tasarım da istiyorum"],
      },
      {
        questionText: "Uygulama markete yüklenecek mi?",
        inputType: "radio",
        options: [
          "Evet, Google Play kurulumu dahil olsun",
          "Hayır, sadece APK istiyorum",
        ],
      },
    ],
  },
  {
    name: "Mobil Uygulama Geliştirme",
    description: "iOS ve Android için kapsamlı mobil çözümler.",
    questions: [
      {
        questionText: "Hangi platformlar?",
        inputType: "checkbox",
        options: ["iOS", "Android", "Huawei"],
      },
      {
        questionText: "Proje aşaması nedir?",
        inputType: "select",
        options: ["Sadece fikir aşaması", "Detaylar belli", "Tasarım hazır"],
      },
    ],
  },
  {
    name: "Freelance Yazılımcı",
    description:
      "Özel projeleriniz için saatlik veya proje bazlı yazılım desteği.",
    questions: [
      {
        questionText: "Hangi dilde destek lazım?",
        inputType: "checkbox",
        options: [
          "Python",
          "JavaScript/Node.js",
          "PHP",
          "C#/.NET",
          "Java",
          "Diğer",
        ],
      },
      {
        questionText: "Proje süresi tahmini?",
        inputType: "radio",
        options: ["1 haftadan az", "1-4 hafta", "1 aydan uzun"],
      },
    ],
  },
  {
    name: "İnternet Sitesi Oluşturma",
    description: "Sıfırdan modern ve hızlı web sitesi kurulumu.",
    questions: [
      {
        questionText: "Site türü nedir?",
        inputType: "select",
        options: ["Kurumsal", "Blog", "E-Ticaret", "Portfolyo"],
      },
      {
        questionText: "Domain ve Hosting var mı?",
        inputType: "radio",
        options: ["Var", "Yok, danışmanlık istiyorum"],
      },
    ],
  },
  {
    name: "Mevcut Web Sitesi Düzenleme",
    description:
      "Var olan sitenizdeki hataların giderilmesi veya geliştirilmesi.",
    questions: [
      {
        questionText: "Kullanılan altyapı nedir?",
        inputType: "select",
        options: ["WordPress", "Özel Yazılım", "Wix/Shopify", "Bilmiyorum"],
      },
      {
        questionText: "Yapılacak işlem nedir?",
        inputType: "radio",
        options: [
          "Hata düzeltme (Bug fix)",
          "Yeni özellik ekleme",
          "Tasarım değişikliği",
        ],
      },
    ],
  },
  {
    name: "Elektronik Devre Tasarımı",
    description: "PCB çizimi, gömülü sistemler ve devre kartı projeleri.",
    questions: [
      {
        questionText: "Proje türü nedir?",
        inputType: "radio",
        options: [
          "PCB Çizimi",
          "Gömülü Yazılım (Arduino/STM32)",
          "Prototip Üretimi",
        ],
      },
      {
        questionText: "Şematik hazır mı?",
        inputType: "radio",
        options: ["Evet", "Hayır, sıfırdan tasarlanacak"],
      },
    ],
  },

  // --- 2. TASARIM VE KREATİF (DİJİTAL) ---
  {
    name: "Logo Tasarım",
    description: "Markanızın yüzü olacak özgün ve akılda kalıcı logolar.",
    questions: [
      { questionText: "Marka adınız nedir?", inputType: "text", options: [] },
      {
        questionText: "Hangi tarzı seviyorsunuz?",
        inputType: "select",
        options: ["Minimalist", "Modern", "Klasik/Retro", "Soyut", "Maskotlu"],
      },
      {
        questionText: "Teslimat formatları?",
        inputType: "checkbox",
        options: ["Vektörel (AI/EPS)", "Yüksek Çözünürlük (PNG/JPG)", "Tümü"],
      },
    ],
  },
  {
    name: "Kurumsal Logo Tasarımı",
    description: "Şirketler için profesyonel marka kimliği oluşturma.",
    questions: [
      { questionText: "Sektörünüz nedir?", inputType: "text", options: [] },
      {
        questionText: "Kurumsal kimlik (kartvizit vb.) dahil mi?",
        inputType: "radio",
        options: ["Evet", "Hayır, sadece logo"],
      },
    ],
  },
  {
    name: "Grafik Tasarım",
    description: "Genel grafik ihtiyaçları, banner, görsel düzenleme işleri.",
    questions: [
      {
        questionText: "İhtiyacınız nedir?",
        inputType: "select",
        options: [
          "Sosyal Medya Görseli",
          "Web Banner",
          "Basılı Materyal",
          "Fotoğraf Düzenleme",
        ],
      },
      {
        questionText: "Kaç adet tasarım yapılacak?",
        inputType: "radio",
        options: ["1-3 adet", "4-10 adet", "Sürekli çalışma"],
      },
    ],
  },
  {
    name: "3D Modelleme",
    description: "Mimari, ürün veya oyun için 3 boyutlu modelleme.",
    questions: [
      {
        questionText: "Modellenecek obje nedir?",
        inputType: "select",
        options: [
          "Mimari Yapı",
          "Endüstriyel Ürün",
          "Oyun Karakteri",
          "Mobilya",
        ],
      },
      {
        questionText: "Render (Görselleştirme) isteniyor mu?",
        inputType: "radio",
        options: ["Evet, fotorealistik render", "Hayır, sadece model dosyası"],
      },
    ],
  },
  {
    name: "3D Ürün Modelleme",
    description: "E-ticaret veya katalog için ürünlerin 3D görselleştirilmesi.",
    questions: [
      {
        questionText: "Ürünün teknik çizimi/fotoğrafı var mı?",
        inputType: "radio",
        options: ["Evet var", "Hayır, anlatıma göre yapılacak"],
      },
      {
        questionText: "Arka plan nasıl olsun?",
        inputType: "select",
        options: ["Beyaz/Transparan", "Konsept/Sahne içinde"],
      },
    ],
  },
  {
    name: "3D Animasyon",
    description: "Reklam, tanıtım veya oyun için 3D hareketli videolar.",
    questions: [
      {
        questionText: "Video süresi ne kadar?",
        inputType: "radio",
        options: ["15 saniyeye kadar", "15-60 saniye", "1 dakikadan uzun"],
      },
      {
        questionText: "Senaryo hazır mı?",
        inputType: "radio",
        options: ["Evet", "Hayır"],
      },
    ],
  },
  {
    name: "AutoCAD Çizim",
    description: "Teknik çizim, mimari plan ve proje çizimleri.",
    questions: [
      {
        questionText: "Proje türü?",
        inputType: "select",
        options: [
          "Mimari Plan",
          "Elektrik Projesi",
          "Mekanik Parça",
          "Ödev/Tez",
        ],
      },
      {
        questionText: "Elinizde taslak var mı?",
        inputType: "radio",
        options: ["Evet", "Hayır"],
      },
    ],
  },
  {
    name: "Photoshop Uzmanı",
    description: "Profesyonel fotoğraf manipülasyonu, dekupe ve düzenleme.",
    questions: [
      {
        questionText: "Yapılacak işlem?",
        inputType: "select",
        options: [
          "Arka plan temizleme",
          "Rötuş/Güzelleştirme",
          "Manipülasyon/Efekt",
          "Eski fotoğraf onarımı",
        ],
      },
      {
        questionText: "Kaç fotoğraf var?",
        inputType: "radio",
        options: ["1-5", "5-20", "20+"],
      },
    ],
  },
  {
    name: "İllüstrasyon Çizim",
    description: "Kitap, web sitesi veya tişört için dijital çizimler.",
    questions: [
      {
        questionText: "Çizim tarzı?",
        inputType: "select",
        options: [
          "Vektörel",
          "Karakalem Görünümlü",
          "Anime/Cartoon",
          "Gerçekçi",
        ],
      },
      {
        questionText: "Nerede kullanılacak?",
        inputType: "radio",
        options: ["Dijital (Web/Sosyal Medya)", "Baskı"],
      },
    ],
  },
  {
    name: "Afiş Tasarım",
    description: "Etkinlik, kampanya ve duyurular için afiş çalışmaları.",
    questions: [
      {
        questionText: "Boyut nedir?",
        inputType: "select",
        options: ["A4/A3 Baskı", "Sosyal Medya Boyutu", "Billboard"],
      },
    ],
  },
  {
    name: "Ambalaj Tasarım",
    description: "Ürünleriniz için kutu, etiket ve ambalaj tasarımları.",
    questions: [
      {
        questionText: "Ambalaj türü?",
        inputType: "radio",
        options: ["Kutu", "Etiket/Sticker", "Şişe/Kavanoz", "Poşet"],
      },
    ],
  },

  // --- 3. DİJİTAL PAZARLAMA & E-TİCARET ---
  {
    name: "Dijital Pazarlama",
    description: "Markanızı internette büyütmek için stratejik planlama.",
    questions: [
      {
        questionText: "Hangi kanallara odaklanalım?",
        inputType: "checkbox",
        options: ["Google", "Sosyal Medya", "Email Pazarlama", "Influencer"],
      },
      {
        questionText: "Aylık reklam bütçeniz (tahmini)?",
        inputType: "select",
        options: ["1.000-5.000 TL", "5.000-20.000 TL", "20.000 TL+"],
      },
    ],
  },
  {
    name: "Google Ads Uzmanı",
    description: "Google aramalarında en üstte çıkmak için reklam yönetimi.",
    questions: [
      {
        questionText: "Reklam türü?",
        inputType: "checkbox",
        options: [
          "Arama Ağı (Search)",
          "Görüntülü Reklam (Display)",
          "Youtube",
          "Alışveriş (Shopping)",
        ],
      },
      {
        questionText: "Web sitenizde dönüşüm takibi kurulu mu?",
        inputType: "radio",
        options: ["Evet", "Hayır", "Bilmiyorum"],
      },
    ],
  },
  {
    name: "SEO Hizmeti",
    description: "Arama motorlarında organik olarak üst sıralara yükselin.",
    questions: [
      {
        questionText: "Sitenizin yaşı?",
        inputType: "radio",
        options: ["Yeni site", "1-3 yıllık", "3 yıldan eski"],
      },
      {
        questionText: "Hizmet kapsamı?",
        inputType: "checkbox",
        options: ["Site İçi SEO", "Backlink Çalışması", "İçerik Stratejisi"],
      },
    ],
  },
  {
    name: "Sosyal Medya Yönetimi",
    description: "Instagram, Linkedin vb. hesaplarınızın profesyonel yönetimi.",
    questions: [
      {
        questionText: "Hangi platformlar?",
        inputType: "checkbox",
        options: ["Instagram", "Facebook", "Twitter/X", "Linkedin", "TikTok"],
      },
      {
        questionText: "Hizmet içeriği?",
        inputType: "checkbox",
        options: [
          "Görsel Tasarım",
          "Metin Yazarlığı",
          "Mesaj Cevaplama",
          "Reklam Yönetimi",
        ],
      },
    ],
  },
  {
    name: "E Ticaret Danışmanı",
    description: "Online satışlarınızı artırmak için stratejik destek.",
    questions: [
      {
        questionText: "Hangi altyapıyı kullanıyorsunuz?",
        inputType: "select",
        options: [
          "Woocommerce",
          "Shopify",
          "Ticimax/İdeasoft",
          "Pazaryerleri (Trendyol vb.)",
        ],
      },
      {
        questionText: "Satış durumunuz?",
        inputType: "radio",
        options: ["Yeni başlayacağım", "Satış var ama artırmak istiyorum"],
      },
    ],
  },
  {
    name: "Etsy Danışmanı",
    description: "Yurtdışına el emeği ve dijital ürün satışı desteği.",
    questions: [
      {
        questionText: "Mağaza durumunuz?",
        inputType: "radio",
        options: [
          "Mağaza açık değil",
          "Mağaza var, satış yok",
          "Satışları artırmak istiyorum",
        ],
      },
      {
        questionText: "Ürün türü?",
        inputType: "select",
        options: ["Fiziksel Ürün", "Dijital Ürün"],
      },
    ],
  },
  {
    name: "SEO Uyumlu Makale Yazımı",
    description: "Blogunuz veya siteniz için anahtar kelime odaklı içerikler.",
    questions: [
      {
        questionText: "Kaç kelimelik makale?",
        inputType: "select",
        options: ["300-500", "500-1000", "1000+"],
      },
      { questionText: "Kaç adet makale?", inputType: "text", options: [] },
    ],
  },
  {
    name: "Instagram Hesap Kurtarma",
    description: "Çalınan veya kapanan hesaplar için teknik destek.",
    questions: [
      {
        questionText: "Hesabın durumu nedir?",
        inputType: "radio",
        options: [
          "Çalındı (Hacklendi)",
          "Topluluk kuralları nedeniyle kapandı",
          "Şifremi unuttum",
        ],
      },
      {
        questionText: "Hesap türü?",
        inputType: "radio",
        options: ["Kişisel", "İşletme"],
      },
    ],
  },

  // --- 4. DİĞER TEKNOLOJİ HİZMETLERİ ---
  {
    name: "Müzik Prodüksiyon",
    description: "Beat yapımı, mix-mastering ve ses düzenleme.",
    questions: [
      {
        questionText: "İhtiyaç nedir?",
        inputType: "select",
        options: [
          "Beat/Altyapı Yapımı",
          "Mix & Mastering",
          "Vokal Düzenleme (Autotune vb.)",
        ],
      },
      { questionText: "Tarz nedir?", inputType: "text", options: [] },
    ],
  },
  {
    name: "3D Baskı",
    description: "Hazır modellerinizin 3D yazıcı ile üretimi.",
    questions: [
      {
        questionText: "Model dosyası (.stl) hazır mı?",
        inputType: "radio",
        options: ["Evet hazır", "Hayır, modelleme de lazım"],
      },
      {
        questionText: "İstenen materyal?",
        inputType: "select",
        options: [
          "PLA (Standart)",
          "ABS (Dayanıklı)",
          "Reçine (Detaylı)",
          "Farketmez",
        ],
      },
    ],
  },
];

// Slugları Otomatik Oluştur
const servicesWithSlugs = services.map((service) => {
  return {
    ...service,
    slug: slugify(service.name, { lower: true }),
  };
});

// Verileri İçe Aktar
const importData = async () => {
  try {
    await Service.deleteMany();
    console.log("Eski veriler temizlendi...");
    await Service.insertMany(servicesWithSlugs);
    console.log("Filtrelenmiş Teknoloji Kategorileri yüklendi!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Service.deleteMany();
    console.log("Veriler silindi...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
