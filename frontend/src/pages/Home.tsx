import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Home as HomeIcon, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 px-6 pt-24 pb-12">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-medium text-sm mb-8 shadow-sm border border-blue-200/50 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          AI Destekli Yapı Analizi
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
        >
          Evinizin Güvenliğini <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Yapay Zeka ile Keşfedin
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed"
        >
          Deprem güvenliği ve yapısal bütünlük analizini saniyeler içinde gerçekleştirin. Gelişmiş algoritmalarımız sayesinde evinizin risk durumunu öğrenin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <button
            onClick={() => navigate('/form')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2">
              Analize Başla
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, mt: 40 }}
          animate={{ opacity: 1, mt: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24"
        >
          {[
            { icon: HomeIcon, title: "Yapısal Değerlendirme", desc: "Temel, kolon ve kiriş durumunu analiz eder." },
            { icon: Activity, title: "Risk Analizi", desc: "Zemin özellikleri ve deprem fay hatlarına göre risk hesaplar." },
            { icon: ShieldCheck, title: "Güvenlik Skorlaması", desc: "Detaylı rapor ve güçlendirme önerileri sunar." }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-3xl shadow-lg shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
