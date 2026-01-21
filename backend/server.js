// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Routes
const auth = require("./routes/auth");
const services = require("./routes/service");
const serviceRequests = require("./routes/serviceRequest");
const offers = require("./routes/offer");

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

// --- Routes ---
app.use("/api/v1/auth", auth);
app.use("/api/v1/services", services);
app.use("/api/v1/requests", serviceRequests);
app.use("/api/v1/offers", offers);
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
