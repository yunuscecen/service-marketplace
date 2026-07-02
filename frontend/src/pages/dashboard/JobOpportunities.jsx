import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
import toast from "react-hot-toast";
import { MapPin, Calendar, ArrowRight, User, HelpCircle } from "lucide-react";

const JobOpportunities = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/requests/feed");
        setJobs(res.data.data);
      } catch (error) {
  setError("İş fırsatları yüklenemedi.");
  toast.error("İş fırsatları yüklenemedi.");
} finally {
  setLoading(false);
}
    };
    fetchJobs();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">İş Fırsatları</h1>
        <p className="text-gray-500">
          Becerilerinize uygun işlere teklif verin ve kazanın.
        </p>
      </div>

      {loading ? (
  <div className="text-center py-20 text-gray-400 font-bold">
    İş fırsatları yükleniyor...
  </div>
) : error ? (
  <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-3xl text-center font-bold">
    {error}
  </div>
) : jobs.length > 0 ? ((
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {job.service?.name}
                    </span>

                    <span className="text-xs text-gray-400 font-medium tracking-tight uppercase">
                      #{job._id.slice(-6).toUpperCase()}
                    </span>
                    {/* Sadece Teklif Sayısı */}
                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                      <span className="text-[11px] font-black text-gray-700">
                        {job.offerCount || 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        Teklif
                      </span>
                    </div>
                    {/* Daha Belirgin Soru-Cevap Alanı */}
                    {job.answers && job.answers.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.answers.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                          >
                            <HelpCircle
                              size={15}
                              className="text-blue-500"
                              strokeWidth={2.5}
                            />
                            <span className="text-[11px] font-bold text-blue-500 lowercase leading-none">
                              {item.question}:
                            </span>
                            <span className="text-[12px] font-bold text-black leading-none">
                              {item.answer}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-gray-800 leading-snug">
                    {job.description || "Açıklama belirtilmemiş."}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <User size={16} className="text-gray-400" />{" "}
                      {job.user?.name || "Müşteri"}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} className="text-gray-400" /> {job.city}{" "}
                      / {job.district}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-gray-400" />{" "}
                      {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link
                    to={`/dashboard/job/${job._id}`}
                    className="w-full md:w-auto bg-blue-600 text-white px-4 py-3.5 rounded-xl  hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    İncele & Teklif Ver <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 text-center rounded-2xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Şu an açık iş yok.
          </h3>
          <p className="text-gray-500">Birazdan tekrar kontrol edebilirsin.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default JobOpportunities;
