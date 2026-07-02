import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCircle,
  Clock,
  FileText,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notifications");

      setNotifications(res.data.data || []);
    } catch (error) {
      toast.error("Bildirimler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      toast.error("Bildirim güncellenemedi.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading(true);

      await api.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success("Tüm bildirimler okundu olarak işaretlendi.");
    } catch (error) {
      toast.error("Bildirimler güncellenemedi.");
    } finally {
      setActionLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request_approved":
        return <CheckCircle size={20} className="text-green-600" />;

      case "request_rejected":
        return <FileText size={20} className="text-red-600" />;

      case "new_offer":
        return <MessageCircle size={20} className="text-blue-600" />;

      case "offer_accepted":
        return <CheckCircle size={20} className="text-green-600" />;

      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-light tracking-tighter text-gray-900 uppercase">
            Bildirimler
          </h1>

          <p className="text-gray-400 font-light mt-2">
            İlan, teklif ve sistem hareketlerini buradan takip edebilirsin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifications}
            className="bg-gray-50 text-gray-600 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Yenile
          </button>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition disabled:opacity-60"
            >
              {actionLoading ? "İşleniyor..." : "Tümünü Okundu Yap"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-400 font-bold">
            Bildirimler yükleniyor...
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 flex gap-4 transition ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-blue-50/50 hover:bg-blue-50"
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-black text-gray-900">
                        {notification.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Yeni
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={13} />
                      {new Date(notification.createdAt).toLocaleString("tr-TR")}
                    </span>

                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Okundu olarak işaretle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-300" />
            </div>

            <h3 className="font-black text-gray-800">
              Henüz bildirimin yok.
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              İlanların, tekliflerin ve mesajlarınla ilgili gelişmeler burada
              görünecek.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;