import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { getRequestStatusInfo } from "../../utils/statusHelpers";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Send,
  CheckCircle,
  Lock,
  MessageCircle,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

// Socket sunucu adresi (Backend URL'niz)
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myOffer, setMyOffer] = useState(null);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
const [isSending, setIsSending] = useState(false);
const [offerSubmitting, setOfferSubmitting] = useState(false);
const hasCredits = Number(user?.offerLimit || 0) > 0;

  const [offerData, setOfferData] = useState({
    price: "",
    deliveryTime: "",
    message: "",
  });
  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      socket.emit("setup", userId); // BACKEND'E KİMLİĞİNİ BİLDİR
    }
  }, [user]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await api.get(`/requests/${id}`);
        setJob(jobRes.data.data);

        if (user) {
          const offersRes = await api.get(`/offers/request/${id}`);
          const offers = offersRes.data.data;
          const currentUserId = user._id || user.id;

          const found = offers.find((o) => {
            const offerProviderId = o.provider?._id || o.provider;
            return offerProviderId.toString() === currentUserId.toString();
          });

          if (found) {
            setMyOffer(found);
            const chatRes = await api.post("/chats", {
              receiverId: jobRes.data.data.user._id,
              requestId: id,
            });
            setChat(chatRes.data.data);
            const msgRes = await api.get(
              `/chats/${chatRes.data.data._id}/messages`,
            );
            setMessages(msgRes.data.data);
            socket.emit("join_chat", chatRes.data.data._id);
          }
        }
      } catch (error) {
        console.error("Veri yükleme hatası");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  // --- KRİTİK DÜZELTME: ÇİFT MESAJI ENGELLEYEN SOCKET DİNLEYİCİSİ ---
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (chat && data.chatId === chat._id) {
        // Mesajı gönderen kişi BEN DEĞİLSEM listeye ekle
        const currentUserId = user?._id || user?.id;
        const senderId = data.sender?._id || data.sender;

        if (senderId !== currentUserId) {
          setMessages((prev) => [...prev, data]);
        }
      }
    });
    return () => socket.off("receive_message");
  }, [chat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (offerSubmitting) return;

  try {
    setOfferSubmitting(true);

    await api.post("/offers", {
      requestId: id,
      price: offerData.price,
      deliveryTime: offerData.deliveryTime,
      message: offerData.message,
    });

    toast.success("Teklifiniz başarıyla gönderildi!");
    window.location.reload();
  } catch (error) {
    toast.error(error.response?.data?.error || "Teklif gönderilemedi.");
  } finally {
    setOfferSubmitting(false);
  }
};
const handleSendMessage = async (e) => {
  e.preventDefault();

  if (!newMessage.trim() || isSending) return;

  setIsSending(true);

  const receiverId = job.user?._id || job.user;

  const messageData = {
    chatId: chat._id,
    text: newMessage,
    sender: user._id || user.id,
    receiverId,
    requestId: id,
  };

  try {
    const res = await api.post("/chats/message", messageData);

    socket.emit("send_message", {
      ...res.data.data,
      ...messageData,
    });

    setMessages((prev) => {
      const alreadyExists = prev.some(
        (msg) =>
          msg._id &&
          res.data.data._id &&
          msg._id.toString() === res.data.data._id.toString()
      );

      if (alreadyExists) return prev;

      return [...prev, res.data.data];
    });

    setNewMessage("");
  } catch (error) {
    toast.error("Mesaj gönderilemedi.");
  } finally {
    setIsSending(false);
  }
};

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-gray-400">Yükleniyor...</div>
      </DashboardLayout>
    );
  if (!job) return null;
const requestStatusInfo = getRequestStatusInfo(job.status);
  return (
    <DashboardLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft size={18} className="mr-2" /> Geri Dön
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* SOL KOLON (Değişmedi) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                {job.service?.name}
              </span>
             <span
  className={`px-3 py-1 rounded-full text-xs font-bold ${requestStatusInfo.className}`}
>
  {requestStatusInfo.text}
</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {job.service?.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1">
                <MapPin size={16} /> {job.city}/{job.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />{" "}
                {new Date(job.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">
                Açıklama
              </h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>
            <div className="space-y-2">
              {job.answers?.map((a, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm border-b pb-1 last:border-0 border-gray-100"
                >
                  <span className="text-gray-500">{a.question}</span>
                  <span className="font-medium text-gray-900">{a.answer}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ KOLON (Chat ve Form) */}
        <div className="h-[600px] sticky top-4">
          {myOffer ? (
            <div className="bg-white flex flex-col h-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                      {job.user?.name[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-blue-600 w-4 h-4 rounded-full flex items-center justify-center">
                      <CheckCircle size={10} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none mb-1">
                      {job.user?.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                        Teklif Verildi
                      </span>
                      <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold">
                        Müşteri
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${job.user?.phone}`}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition border border-white/10"
                  >
                    <Phone size={16} />
                    <span className="text-xs font-bold">
                  {job.user?.phone
  ? job.user.phone
  : job.allowPhoneAfterOffer === false
  ? "Müşteri önce mesajlaşmak istiyor. Telefon teklif kabul edilince açılır."
  : "Telefon numarası teklif verdikten sonra açılır."}
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, index) => {
                  const isMe =
                    (msg.sender?._id || msg.sender) === (user._id || user.id);
                  return (
                    <div
                      key={index}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              <button
  type="submit"
  disabled={isSending}
  className={`bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100 ${
    isSending ? "opacity-60 cursor-not-allowed" : ""
  }`}
>
  <Send size={20} />
</button>
              </form>
            </div>
          ) : (
            <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Teklif Formu Alanı (Değişmedi) */}
              {!hasCredits && (
                <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-white/60 flex flex-col items-center justify-center p-6 text-center transition-all">
                  <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 mb-4 border border-blue-50">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Teklif Verme Kısıtlı
                  </h3>
                  <Link
                    to="/dashboard/packages"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm"
                  >
                    Paket Satın Al
                  </Link>
                </div>
              )}
              <div className={!hasCredits ? "opacity-40" : ""}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Send size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Teklif Ver
                    </h2>
                    <p className="text-xs text-gray-500">
                      Müşteriye en uygun fiyatı sun.
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiyat (TL)
                    </label>
                    <input
                      type="number"
                      required
                      disabled={!hasCredits}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={offerData.price}
                      onChange={(e) =>
                        setOfferData({ ...offerData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Süre
                    </label>
                    <input
                      type="text"
                      required
                      disabled={!hasCredits}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={offerData.deliveryTime}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          deliveryTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesaj
                    </label>
                    <textarea
                      rows="4"
                      required
                      disabled={!hasCredits}
                      className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      value={offerData.message}
                      onChange={(e) =>
                        setOfferData({ ...offerData, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <button
  type="submit"
  disabled={offerSubmitting || !hasCredits}
  className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-black transition ${
    offerSubmitting || !hasCredits
      ? "opacity-60 cursor-not-allowed"
      : "hover:bg-blue-700"
  }`}
>
  {offerSubmitting ? "Teklif gönderiliyor..." : "Teklifi Gönder"}
</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
