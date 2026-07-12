import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Loader2, Building, AlertTriangle } from 'lucide-react';

export default function FormPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const loadingSteps = [
    'Veriler işleniyor...',
    'Yapısal bütünlük hesaplanıyor...',
    'Fay hattı mesafesi analiz ediliyor...',
    'Zemin etüdü değerlendiriliyor...',
    'Sonuçlar hazırlanıyor...'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock loading sequence
    let step = 0;
    setLoadingText(loadingSteps[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setLoadingText(loadingSteps[step]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/result');
        }, 500);
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col pt-24 pb-12 px-6 sm:px-12 relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
      
      <div className="max-w-2xl w-full mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Geri Dön</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-400" />
              Bina Bilgilerini Girin
            </h2>
            <p className="text-slate-400 text-sm">
              En doğru analiz sonucu için lütfen aşağıdaki bilgileri eksiksiz doldurun.
            </p>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <Building className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Yapay Zeka Analiz Ediyor</h3>
                  <p className="text-slate-500 text-sm font-medium animate-pulse">
                    {loadingText}
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">Yapım Yılı</label>
                      <input 
                        type="number" 
                        required 
                        min="1900" 
                        max={new Date().getFullYear()}
                        placeholder="Örn: 1999"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">Kat Sayısı</label>
                      <input 
                        type="number" 
                        required 
                        min="1" 
                        max="50"
                        placeholder="Örn: 5"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Yapı Sistemi</label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer">
                      <option value="" disabled selected>Seçiniz...</option>
                      <option value="betonarme">Betonarme Karkas</option>
                      <option value="yigma">Yığma</option>
                      <option value="celik">Çelik</option>
                      <option value="ahsap">Ahşap</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Hasar Durumu (Geçmiş Depremler)</label>
                    <select required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer">
                      <option value="hasarsiz">Hasarsız</option>
                      <option value="az-hasarli">Az Hasarlı</option>
                      <option value="orta-hasarli">Orta Hasarlı</option>
                      <option value="agir-hasarli">Ağır Hasarlı (Güçlendirilmiş)</option>
                    </select>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Lütfen verileri gerçeğe uygun doldurun. Bu uygulama bir bilgilendirme aracıdır, kesin mühendislik sonuçları yerine geçmez.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                    >
                      Analizi Başlat
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
