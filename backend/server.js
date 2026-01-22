const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Socket.io Bağlantı Mantığı
io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  // Kullanıcı bağlandığında kendi ID'siyle odaya katılır (Global bildirimler için)
  socket.on("setup", (userId) => {
    socket.join(userId);
    console.log(`Kullanıcı kendi bildirim odasına katıldı: ${userId}`);
  });

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`Kullanıcı sohbet odasına katıldı: ${chatId}`);
  });

  socket.on("send_message", (data) => {
    // 1. Sohbet odasındakilere mesajı yolla (Chat ekranı güncellensin)
    socket.to(data.chatId).emit("receive_message", data);

    // 2. Alıcıya (receiverId) anlık bildirim fırlat (Liste sayfaları güncellensin)
    if (data.receiverId) {
      io.to(data.receiverId).emit("new_message_notification", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı.");
  });
});

app.use("/api/v1/auth", auth);
app.use("/api/v1/services", services);
app.use("/api/v1/requests", serviceRequests);
app.use("/api/v1/offers", offers);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/chats", chats);

app.get("/", (req, res) => {
  res.send("API Çalışıyor... Hizmet Uygulaması Backend");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `Server ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`,
  );
});
