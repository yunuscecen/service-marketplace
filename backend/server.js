// backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Ortam değişkenlerini yükle
dotenv.config();

// App Başlatma
const app = express();

// --- Middlewares (Ara Yazılımlar) ---
// 1. Güvenlik (Helmet)
app.use(helmet());

// 2. Cross-Origin Resource Sharing (Frontend'in erişimi için)
app.use(cors());

// 3. JSON veri okuma
app.use(express.json());

// 4. Loglama (Sadece development modunda)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Rotalar (Test) ---
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
