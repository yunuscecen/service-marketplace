import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  User,
  Star,
  X,
  MessageCircle,
  Send,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scrollRef = useRef();

  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    text: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRes = await api.get(`/requests/${id}`);
        setRequest(reqRes.data.data);
        const offerRes = await api.get(`/offers/request/${id}`);
        setOffers(offerRes.data.data);
      } catch (error) {
        toast.error("Veriler alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- ANLIK BİLDİRİM VE MESAJ DİNLEYİCİSİ ---
useEffect(() => {
  if (!user) return;

  const currentUserId = user._id || user.id;

  socket.emit("setup", currentUserId);

  const isSameId = (a, b) => a?.toString() === b?.toString();

  const addMessageIfNotExists = (message) => {
    setMessages((prev) => {
      const alreadyExists = prev.some(
        (msg) =>
          msg._id &&
          message._id &&
          msg._id.toString() === message._id.toString()
      );

      if (alreadyExists) return prev;

      return [...prev, message];
    });
  };

  const handleReceiveMessage = (data) => {
    const senderId = data.sender?._id || data.sender;

    if (isSameId(senderId, currentUserId)) return;

    if (activeChat && isSameId(data.chatId, activeChat._id)) {
      addMessageIfNotExists(data);
    }
  };

  const handleNewMessageNotification = (data) => {
    const senderId = data.sender?._id || data.sender;

    if (isSameId(senderId, currentUserId)) return;

    // Aktif sohbet açıksa mesajı burada tekrar ekleme.
    // Çünkü receive_message zaten ekliyor.
    if (activeChat && isSameId(data.chatId, activeChat._id)) {
      return;
    }

    setOffers((prevOffers) =>
      prevOffers.map((o) => {
        const providerId = o.provider?._id || o.provider;
        const isThisProvider = isSameId(providerId, senderId);

        if (isThisProvider) {
          return {
            ...o,
            unreadCount: (o.unreadCount || 0) + 1,
          };
        }

        return o;
      })
    );

    setRequest((prev) => ({
      ...prev,
      unreadCount: (prev?.unreadCount || 0) + 1,
    }));
  };

  socket.on("receive_message", handleReceiveMessage);
  socket.on("new_message_notification", handleNewMessageNotification);

  return () => {
    socket.off("receive_message", handleReceiveMessage);
    socket.off("new_message_notification", handleNewMessageNotification);
  };
}, [activeChat, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenChat = async (provider) => {
    try {
      setSelectedProvider(provider);
      const res = await api.post("/chats", {
        receiverId: provider._id,
        requestId: id,
      });
      setActiveChat(res.data.data);

      const msgRes = await api.get(`/chats/${res.data.data._id}/messages`);
      setMessages(msgRes.data.data);

      // Sohbet açıldığında unreadCount'u hem tekliften hem de ana başlıktan düşür
      const currentUnread =
        offers.find((o) => (o.provider?._id || o.provider) === provider._id)
          ?.unreadCount || 0;

      setOffers((prev) =>
        prev.map((o) =>
          (o.provider?._id || o.provider) === provider._id
            ? { ...o, unreadCount: 0 }
            : o,
        ),
      );

      setRequest((prev) => ({
        ...prev,
        unreadCount: Math.max(0, (prev.unreadCount || 0) - currentUnread),
      }));

      socket.emit("join_chat", res.data.data._id);
    } catch (error) {
      toast.error("Sohbet başlatılamadı.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatId: activeChat._id,
      text: newMessage,
      sender: user._id || user.id,
      receiverId: selectedProvider?._id, // ALICI ID'Sİ EKLENDİ
      requestId: id, // İLAN ID'Sİ EKLENDİ
    };

    try {
      const res = await api.post("/chats/message", messageData);
      socket.emit("send_message", { ...res.data.data, ...messageData });
      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (error) {
      toast.error("Mesaj gönderilemedi.");
    }
  };

const handleAcceptOffer = async (offerId) => {
  if (acceptingOfferId) return;

  if (!window.confirm("Bu teklifi kabul etmek istediğine emin misin?")) {
    return;
  }

  try {
    setAcceptingOfferId(offerId);

    await api.put(`/offers/${offerId}/accept`);

    const [reqRes, offerRes] = await Promise.all([
      api.get(`/requests/${id}`),
      api.get(`/offers/request/${id}`),
    ]);

    setRequest(reqRes.data.data);
    setOffers(offerRes.data.data);

    toast.success("Teklif kabul edildi. İş süreci başladı.");
  } catch (error) {
    toast.error(error.response?.data?.error || "İşlem başarısız.");
  } finally {
    setAcceptingOfferId(null);
  }
};

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", {
        requestId: id,
        rating: reviewData.rating,
        title: reviewData.title,
        text: reviewData.text,
      });
      toast.success("Yorumunuz kaydedildi ve iş tamamlandı! 🎉");
      setIsReviewModalOpen(false);
      setRequest((prev) => ({ ...prev, status: "completed" }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Yorum gönderilemedi.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div>Yükleniyor...</div>
      </DashboardLayout>
    );
  if (!request) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <Clock size={16} /> Onay Bekliyor
          </span>
        );
      case "active":
        return (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <CheckCircle size={16} /> Teklife Açık
          </span>
        );
      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <Clock size={16} /> İşlemde
          </span>
        );
      case "completed":
        return (
          <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-bold flex items-center w-max gap-2">
            <CheckCircle size={16} /> Tamamlandı
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-blue-600 transition mb-4"
        >
          <ArrowLeft size={18} className="mr-2" /> Taleplerime Dön
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {request.service?.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Talep No: #{request._id.slice(-6).toUpperCase()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}
            {/* BAŞLIKTAKİ TOPLAM BİLDİRİM */}
            {request.unreadCount > 0 && (
              <div className="flex items-center justify-center relative -ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white">
                  {request.unreadCount} Yeni Mesaj
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeChat ? (
            <div className="bg-white flex flex-col h-[600px] rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-left duration-300">
              <div className="p-4 border-b bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                    {selectedProvider?.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">
                      {selectedProvider?.name}
                    </h3>
                    <p className="text-[10px] opacity-70 uppercase font-bold tracking-wider">
                      Hizmet Veren
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${selectedProvider?.phone}`}
                  className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition text-white shadow-lg shadow-green-200"
                >
                  <Phone size={18} />
                </a>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg, idx) => {
                  const isMe =
                    (msg.sender?._id || msg.sender) === (user._id || user.id);
                  return (
                    <div
                      key={idx}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-medium shadow-sm ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}
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
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
                Hizmet Detayları
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Konum</span>
                    <span className="font-semibold text-gray-900">
                      {request.city} / {request.district}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Tarih</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Açıklama
                </h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {request.description}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
            <h3 className="text-xl font-bold mb-2">Gelen Teklifler</h3>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{offers.length}</span>
              <span className="opacity-80 font-medium text-sm">
                kişi teklif verdi
              </span>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className={`bg-white p-5 rounded-xl border-2 transition-all ${offer.status === "accepted" ? "border-green-500 ring-2 ring-green-100" : "border-gray-100 hover:border-blue-200"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleOpenChat(offer.provider)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100 font-bold">
                        {offer.provider?.name[0]}
                      </div>
                      {offer.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                            {offer.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition underline underline-offset-4 decoration-blue-200">
                        {offer.provider?.name}
                      </h4>
                      <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <MessageCircle size={10} /> Sohbet Et
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-blue-600">
                    {offer.price} ₺
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mb-3 italic">
                  "{offer.message}"
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    ⏱ {offer.deliveryTime}
                  </span>
                  {request.status === "active" && offer.status === "pending" && (
  <button
    onClick={() => handleAcceptOffer(offer._id)}
    disabled={acceptingOfferId === offer._id}
    className={`bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition ${
      acceptingOfferId === offer._id
        ? "opacity-60 cursor-not-allowed"
        : "hover:bg-green-700"
    }`}
  >
    {acceptingOfferId === offer._id ? "Kabul ediliyor..." : "Kabul Et"}
  </button>
)}
                  {offer.status === "accepted" && (
                    <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                      <CheckCircle size={16} /> KABUL EDİLDİ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestDetail;
