import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  MapPin,
  PackageCheck,
  Camera,
  ListChecks
} from 'lucide-react';

type DetailItem = {
  label: string;
  value: string;
  status: 'good' | 'warning';
};

type AnalysisResult = {
  score: number;
  riskLevel: string;
  color: 'green' | 'amber' | 'red';
  details: DetailItem[];
  riskAreas: string[];
  safeSpots: string[];
  missingPreparations: string[];
  recommendations: string[];
  photoInsights: string[];
  priorityActions: string[];
  summary: string;
};

const defaultResult: AnalysisResult = {
  score: 70,
  riskLevel: 'Orta Risk',
  color: 'amber',
  summary: 'Örnek analiz sonucu gösteriliyor. Gerçek sonuç için formu doldurun.',
  details: [
    { label: 'Büyük Eşyalar', value: 'Sabitlenmemiş eşya riski', status: 'warning' },
    { label: 'Çıkış Yolu', value: 'Çıkış yolu açık', status: 'good' }
  ],
  riskAreas: [
    'Sabitlenmemiş dolap ve kitaplık bulunan alanlar',
    'Cam kenarına yakın oturma alanları'
  ],
  safeSpots: [
    'Camlardan uzak iç duvar kenarları',
    'Sabitlenmiş eşyalardan uzak alanlar'
  ],
  missingPreparations: [
    'Deprem çantası tamamlanmalı',
    'Aile buluşma noktası belirlenmeli'
  ],
  recommendations: [
    'Büyük eşyalar duvara sabitlenmelidir.',
    'Çıkış yolları açık tutulmalıdır.'
  ],
  photoInsights: [
    'Fotoğraf yüklenirse görünür riskler için beta kontrol önerileri burada listelenir.'
  ],
  priorityActions: [
    'Büyük eşyaları sabitle',
    'Çıkış yolunu boşalt',
    'Deprem çantasını tamamla'
  ]
};

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const analysisResult: AnalysisResult =
    location.state?.analysisResult || defaultResult;

  const preview = location.state?.preview || '';

  const score = analysisResult.score;
  const riskLevel = analysisResult.riskLevel;

  const colorScheme =
    analysisResult.color === 'red'
      ? 'text-red-500'
      : analysisResult.color === 'green'
        ? 'text-emerald-500'
        : 'text-amber-500';

  const bgScheme =
    analysisResult.color === 'red'
      ? 'bg-red-50'
      : analysisResult.color === 'green'
        ? 'bg-emerald-50'
        : 'bg-amber-50';

  const topBarScheme =
    analysisResult.color === 'red'
      ? 'bg-red-500'
      : analysisResult.color === 'green'
        ? 'bg-emerald-500'
        : 'bg-amber-500';

  const borderScheme =
    analysisResult.color === 'red'
      ? 'border-red-200'
      : analysisResult.color === 'green'
        ? 'border-emerald-200'
        : 'border-amber-200';

  return (
    <div className="flex-1 flex flex-col pt-24 pb-12 px-6 sm:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl w-full mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Ana Sayfaya Dön</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className={`absolute top-0 w-full h-2 ${topBarScheme}`}></div>

            <h3 className="text-slate-500 font-semibold mb-6">
              Deprem Hazırlık Skoru
            </h3>

            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={colorScheme}
                  initial={{ strokeDasharray: '0, 300' }}
                  animate={{ strokeDasharray: `${score * 2.82}, 300` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
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
              {analysisResult.summary}
            </p>

            <div className="mt-6 w-full text-left bg-slate-50 rounded-2xl p-4">
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-blue-600" />
                Öncelikli Aksiyonlar
              </h4>

              <ul className="space-y-2">
                {analysisResult.priorityActions.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-700">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Ev İçi Analiz Detayları
              </h3>

              <div className="space-y-4">
                {analysisResult.details.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>

                    <div className="flex items-center gap-2 text-right">
                      {item.status === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}

                      <span
                        className={`text-sm font-bold ${
                          item.status === 'warning'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {preview && (
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-blue-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-500" />
                  Fotoğraf Destekli Risk Kontrolü
                </h3>

                <img
                  src={preview}
                  alt="Yüklenen oda fotoğrafı"
                  className="w-full max-h-80 object-cover rounded-2xl border border-slate-100 mb-4"
                />

                <ul className="space-y-3">
                  {analysisResult.photoInsights.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-red-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  Riskli Alanlar
                </h3>

                <ul className="space-y-3">
                  {analysisResult.riskAreas.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-blue-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Güvenli Noktalar
                </h3>

                <ul className="space-y-3">
                  {analysisResult.safeSpots.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-amber-100">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-amber-500" />
                  Eksik Hazırlıklar
                </h3>

                <ul className="space-y-3">
                  {analysisResult.missingPreparations.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-700 leading-relaxed">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border ${borderScheme}`}>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-slate-700" />
                AI Destekli Kişisel Öneriler
              </h3>

              <ul className="space-y-3">
                {analysisResult.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 flex-shrink-0"></div>
                    <p>{item}</p>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => navigate('/form')}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
                >
                  Yeni Analiz Yap
                </button>

                <button
                  onClick={() => navigate('/checklist')}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                >
                  Kontrol Listesine Git
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}