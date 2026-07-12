import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  
  // Mock data for the result
  const score = 72;
  const riskLevel = 'Orta Risk';
  const colorScheme = 'text-amber-500';
  const bgScheme = 'bg-amber-50';
  const borderScheme = 'border-amber-200';

  return (
    <div className="flex-1 flex flex-col pt-24 pb-12 px-6 sm:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl w-full mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Ana Sayfaya Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className={`absolute top-0 w-full h-2 ${bgScheme.replace('50', '500')}`}></div>
            
            <h3 className="text-slate-500 font-semibold mb-6">Güvenlik Skoru</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className={colorScheme}
                  initial={{ strokeDasharray: "0, 300" }}
                  animate={{ strokeDasharray: `${score * 2.82}, 300` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900">{score}</span>
                <span className="text-sm font-medium text-slate-400">/100</span>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full font-bold text-sm mb-4 ${bgScheme} ${colorScheme}`}>
              {riskLevel}
            </div>
            <p className="text-sm text-slate-600">
              Binanızın yapısal analizine göre güçlendirme çalışmaları tavsiye edilmektedir.
            </p>
          </motion.div>

          {/* Details & Recommendations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Breakdown */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Analiz Detayları
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: "Yapı Yaşı Etkisi", value: "Negatif Etki (-15 Puan)", status: "warning" },
                  { label: "Zemin Sınıfı", value: "Z3 (Orta Derece)", status: "warning" },
                  { label: "Fay Hattına Uzaklık", value: "12 km (Güvenli Bölge)", status: "good" },
                  { label: "Kat/Yükseklik Oranı", value: "Standartlara Uygun", status: "good" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className={`text-sm font-bold ${item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className={`bg-gradient-to-br from-white to-${bgScheme.split('-')[1]}-50 rounded-3xl p-8 shadow-xl shadow-slate-200/50 border ${borderScheme}`}>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-700" />
                Uzman Önerileri
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <p>Binanızın 1999 öncesi yapımı olması sebebiyle detaylı karot testi alınması önerilir.</p>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <p>Zemin kattaki kolon ve kirişlerde çatlak kontrolü için uzman bir mühendise başvurun.</p>
                </li>
                <li className="flex items-start gap-3 text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                  <p>Bina sakinleri ile ortak bir deprem acil durum planı oluşturun.</p>
                </li>
              </ul>
              
              <button className="mt-6 w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors">
                Detaylı PDF Raporu İndir
              </button>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
}
