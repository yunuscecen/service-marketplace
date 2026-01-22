const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http"); // Eklendi
const { Server } = require("socket.io"); // Eklendi
const connectDB = require("./config/db");

// Routes
const auth = require("./routes/auth");
const services = require("./routes/service");
const serviceRequests = require("./routes/serviceRequest");
const adminRoutes = require("./routes/admin");
const offers = require("./routes/offer");
const reviews = require("./routes/review");
const chats = require("./routes/chat");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // HTTP Server oluşturuldu
const io = new Server(server, {
  cors: {
    origin: "*", // Geliştirme aşamasında her yerden erişime izin ver
    methods: ["GET", "POST"],
  },
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Socket.io Bağlantı Mantığı
io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`Kullanıcı odaya katıldı: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    // Mesajı odadaki diğer kişilere gönder
    io.to(data.chatId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı.");
  });
});

// Routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/services", services);
app.use("/api/v1/requests", serviceRequests);
app.use("/api/v1/offers", offers);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/chats", chats); // Rotayı aktif et
app.get("/", (req, res) => {
  res.send("API Çalışıyor... Hizmet Uygulaması Backend");
});

const PORT = process.env.PORT || 5000;

// ÖNEMLİ: app.listen yerine server.listen kullanıyoruz
server.listen(PORT, () => {
  console.log(
    `Server ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`,
  );
});
