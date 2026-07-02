export const getRequestStatusInfo = (status) => {
  switch (status) {
    case "pending":
      return {
        text: "Onay Bekliyor",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "active":
      return {
        text: "Teklife Açık",
        className: "bg-green-100 text-green-700",
      };

    case "in_progress":
      return {
        text: "İş Devam Ediyor",
        className: "bg-blue-100 text-blue-700",
      };

    case "completed":
      return {
        text: "Tamamlandı",
        className: "bg-gray-100 text-gray-700",
      };

    case "canceled":
      return {
        text: "İptal Edildi",
        className: "bg-red-100 text-red-700",
      };

    case "rejected":
      return {
        text: "Reddedildi",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        text: "Bilinmiyor",
        className: "bg-gray-100 text-gray-600",
      };
  }
};

export const getOfferStatusInfo = (status) => {
  switch (status) {
    case "pending":
      return {
        text: "Cevap Bekliyor",
        className: "bg-yellow-100 text-yellow-700",
      };

    case "accepted":
      return {
        text: "Kabul Edildi",
        className: "bg-green-100 text-green-700",
      };

    case "rejected":
      return {
        text: "Reddedildi",
        className: "bg-red-100 text-red-700",
      };

    case "withdrawn":
      return {
        text: "Geri Çekildi",
        className: "bg-gray-100 text-gray-700",
      };

    default:
      return {
        text: "Bilinmiyor",
        className: "bg-gray-100 text-gray-600",
      };
  }
};

export const getRequestStatusDescription = (status) => {
  switch (status) {
    case "pending":
      return "İlanın admin onayı bekliyor. Onaylandıktan sonra hizmet verenlere gösterilecek.";

    case "active":
      return "İlanın yayında. Hizmet verenler teklif verebilir.";

    case "in_progress":
      return "Bir teklif kabul edildi. İş süreci başladı.";

    case "completed":
      return "Bu iş tamamlandı.";

    case "canceled":
      return "Bu ilan iptal edildi.";

    case "rejected":
      return "İlanın reddedildi. Bilgileri kontrol edip yeniden ilan oluşturabilirsin.";

    default:
      return "";
  }
};