import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Search,
  ArrowRight,
  Code,
  Cpu,
  Globe,
  Terminal,
  ChevronRight,
} from "lucide-react";
const Home = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data.slice(0, 3));
      } catch (error) {
        console.error("Hizmetler yüklenemedi");
      }
    };
    fetchServices();
  }, []);
  const handleSearch = () => {
    navigate(`/services?search=${searchTerm}`);
  };
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {" "}
      {/* --- HERO SECTION: TEKNİK MİNİMALİZM --- */}{" "}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto text-center">
        {" "}
        {/* Badge */}{" "}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-mono text-gray-600 mb-8 animate-fade-in-up">
          {" "}
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> v2.0
          HİZMET PLATFORMU{" "}
        </div>{" "}
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-8 text-black">
          {" "}
          Yazılım ve Tasarım <br />{" "}
          <span className="text-gray-400">Eşleşme Ağı.</span>{" "}
        </h1>{" "}
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 font-light">
          {" "}
          Modern ekipler için yetenek havuzu. Kodlamadan tasarıma, <br />{" "}
          projeniz için en iyi uzmanlarla anında çalışın.{" "}
        </p>{" "}
        {/* ARAMA: "CLI / TERMINAL" Tarzı Input */}{" "}
        <div className="relative max-w-xl mx-auto group">
          {" "}
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            {" "}
            <Terminal className="h-5 w-5 text-gray-400" />{" "}
          </div>{" "}
          <input
            type="text"
            placeholder="Örn: React Native Developer..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all shadow-sm group-hover:shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />{" "}
          <div className="absolute inset-y-0 right-2 flex items-center">
            {" "}
            <button
              onClick={handleSearch}
              className="bg-black text-white p-2 rounded-lg opacity-0 group-focus-within:opacity-100 transition-all transform scale-90 group-focus-within:scale-100"
            >
              {" "}
              <ArrowRight size={18} />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Tech Stack Icons (Gri Tonlarda) */}{" "}
        <div className="mt-12 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          {" "}
          {/* Temsili İkonlar */} <Globe size={24} /> <Cpu size={24} />{" "}
          <Code size={24} /> <Terminal size={24} />{" "}
        </div>{" "}
      </section>{" "}
      {/* --- GRID: "BENTO" TARZI TEMİZ KARTLAR --- */}{" "}
      <section className="py-20 px-6 max-w-[1200px] mx-auto border-t border-gray-100">
        {" "}
        <div className="flex justify-between items-end mb-12">
          {" "}
          <div>
            {" "}
            <h2 className="text-2xl font-bold tracking-tight">
              Öne Çıkan Kategoriler
            </h2>{" "}
            <p className="text-gray-500 mt-1">
              Teknoloji odaklı hizmetler.
            </p>{" "}
          </div>{" "}
          <Link
            to="/services"
            className="text-sm font-bold border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            {" "}
            TÜMÜNÜ GÖR{" "}
          </Link>{" "}
        </div>{" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {" "}
          {services.map((service, idx) => (
            <Link
              key={service._id}
              to={`/create-request/${service._id}`}
              className={`group relative p-8 rounded-2xl border border-gray-200 bg-white hover:border-black/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${idx === 0 ? "md:col-span-2 md:flex md:items-center md:justify-between" : ""}`}
            >
              {" "}
              <div className="relative z-10">
                {" "}
                <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center mb-6 text-black group-hover:bg-black group-hover:text-white transition-colors">
                  {" "}
                  {idx === 0 ? (
                    <Code size={20} />
                  ) : idx === 1 ? (
                    <Cpu size={20} />
                  ) : (
                    <Globe size={20} />
                  )}{" "}
                </div>{" "}
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>{" "}
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                  {" "}
                  {service.description}{" "}
                </p>{" "}
              </div>{" "}
              {/* Büyük kart için özel görsel alanı */}{" "}
              {idx === 0 && (
                <div className="hidden md:block w-48 h-32 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden ml-8">
                  {" "}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-mono text-xs">
                    {" "}
                    {`<Code />`}{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {/* Küçük Aksiyon Oku */}{" "}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {" "}
                <ArrowRight size={20} />{" "}
              </div>{" "}
            </Link>
          ))}{" "}
        </div>{" "}
      </section>{" "}
      {/* --- CTA: DEVELOPER FOCUS --- */}{" "}
      <section className="py-20 px-6">
        {" "}
        <div className="max-w-[1200px] mx-auto bg-black text-white rounded-3xl p-12 md:p-20 relative overflow-hidden">
          {" "}
          {/* Arka Plan Deseni */}{" "}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>{" "}
          <div className="relative z-10 max-w-2xl">
            {" "}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              {" "}
              Yeteneklerini <br /> Global Pazara Aç.{" "}
            </h2>{" "}
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              {" "}
              Freelancerlar ve ajanslar için tasarlandı. <br /> Komisyon
              oranlarını düşürdük, hızı artırdık.{" "}
            </p>{" "}
            <div className="flex gap-4">
              {" "}
              <Link
                to="/register"
                className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                {" "}
                Uzman Hesabı Aç{" "}
              </Link>{" "}
              <Link
                to="/how-it-works"
                className="px-6 py-3 rounded-lg font-bold border border-white/20 hover:bg-white/10 transition flex items-center gap-2"
              >
                {" "}
                Dokümantasyon <ChevronRight size={16} />{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          {/* Sağ Taraf Dekoru */}{" "}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 hidden md:block">
            {" "}
            <div className="w-96 h-96 bg-gradient-to-br from-gray-800 to-black rounded-full border border-white/10 flex items-center justify-center">
              {" "}
              <div className="w-64 h-64 bg-black rounded-full border border-white/5 flex items-center justify-center animate-pulse-slow">
                {" "}
                <Terminal size={48} className="text-gray-600" />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* --- FOOTER: SIMPLE & CLEAN --- */}{" "}
      <footer className="border-t border-gray-100 bg-white py-12">
        {" "}
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          {" "}
          <div className="font-mono text-black mb-4 md:mb-0">
            {" "}
            service.git_commit(){" "}
          </div>{" "}
          <div className="flex gap-8">
            {" "}
            <Link to="/services" className="hover:text-black">
              Hizmetler
            </Link>{" "}
            <Link to="/login" className="hover:text-black">
              Giriş
            </Link>{" "}
            <Link to="/register" className="hover:text-black">
              Kayıt
            </Link>{" "}
          </div>{" "}
          <div> © 2026 Service App Inc. </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
};
export default Home;
