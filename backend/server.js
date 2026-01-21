// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const auth = require("./routes/auth"); // Rotaları import ettik
const services = require("./routes/service");

// Ortam değişkenlerini yükle
dotenv.config();

// Veritabanına bağlan
connectDB();

// App Başlatma
const app = express();

// --- ÖNEMLİ: Middlewares (ÖNCE BUNLAR ÇALIŞMALI) ---

// 1. Güvenlik (Helmet)
app.use(helmet());

// 2. Cross-Origin Resource Sharing (Frontend'in erişimi için)
app.use(cors());

// 3. JSON veri okuma (BU SATIR ROTALARDAN ÖNCE OLMALI)
app.use(express.json());

// 4. Loglama (Sadece development modunda)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Rotalar (Middleware'lerden SONRA) ---
app.use("/api/v1/auth", auth);
app.use("/api/v1/services", services);
// Test Rotası
app.get("/", (req, res) => {
  res.send("API Çalışıyor... Hizmet Uygulaması Backend");
});

// --- Sunucuyu Ayağa Kaldırma ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`,
  );
});
