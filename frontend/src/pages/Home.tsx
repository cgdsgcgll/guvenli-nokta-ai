import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home as HomeIcon,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Camera,
  ListChecks,
  Users,
  Route
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Ev İçi Risk Analizi',
      desc: 'Sabitlenmemiş eşyalar, cam kenarları ve çıkış yollarındaki riskleri analiz eder.',
      icon: HomeIcon
    },
    {
      title: 'Fotoğraf Destekli Risk Kontrolü',
      desc: 'Oda fotoğrafını rapora dahil ederek cam kenarı, büyük eşya ve çıkış yolu risklerini daha anlaşılır hale getirir.',
      icon: Camera
    },
    {
      title: 'Güvenli Nokta Önerisi',
      desc: 'Deprem anında ev içinde daha güvenli olabilecek alanları kullanıcıya önerir.',
      icon: MapPin
    },
    {
      title: 'Deprem Hazırlık Skoru',
      desc: 'Deprem çantası, aile planı ve ev düzenine göre hazırlık puanı oluşturur.',
      icon: ShieldCheck
    },
    {
      title: 'Akıllı Kontrol Listesi',
      desc: 'Eksik hazırlıklarını oda, aile ve çanta bazlı yapılacaklara dönüştürür.',
      icon: ListChecks
    },
    {
      title: 'Aile Acil Planı',
      desc: 'Çocuk, yaşlı ve evcil hayvan gibi hassas gruplara göre plan önerir.',
      icon: Users
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 px-6 pt-24 pb-12">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-medium text-sm mb-8 shadow-sm border border-blue-200/50 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          AI Destekli Deprem Hazırlık ve Güvenli Nokta Asistanı
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6"
        >
          Evinizdeki Riskleri Görün, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Güvenli Noktanızı Belirleyin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 max-w-3xl mb-10 leading-relaxed"
        >
          Güvenli Nokta AI; ev bilgilerinizi, aile durumunuzu, deprem çantanızı ve
          isteğe bağlı oda fotoğrafınızı değerlendirerek kişisel risk raporu, güvenli
          nokta önerileri ve hazırlık aksiyonları oluşturur.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/form')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-900/20"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">Analize Başla</span>
            <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/checklist')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-semibold text-lg border border-slate-200 shadow-sm hover:shadow-lg transition-all"
          >
            <ListChecks className="w-5 h-5 text-blue-600" />
            Kontrol Listesini Gör
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08 }}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/emergency-plan')}
            className="inline-flex items-center justify-center gap-2 text-blue-700 font-semibold hover:text-blue-900 transition-colors"
          >
            <Route className="w-5 h-5" />
            Aile Acil Durum Planı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}