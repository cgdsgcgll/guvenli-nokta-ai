import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Users, Route } from 'lucide-react';

export default function EmergencyPlan() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Buluşma Noktası',
      icon: MapPin,
      text: 'Binadan uzak, açık ve kolay tarif edilebilir bir alan belirleyin. Örneğin okul bahçesi, park veya geniş meydan.'
    },
    {
      title: 'Acil Kişiler',
      icon: Phone,
      text: 'Aile dışından en az iki kişiyi acil iletişim kişisi olarak belirleyin ve herkesin telefonuna kaydedin.'
    },
    {
      title: 'Görev Paylaşımı',
      icon: Users,
      text: 'Çocuk, yaşlı, engelli birey veya evcil hayvan için deprem sonrası kimin sorumlu olacağı önceden belirlenmelidir.'
    },
    {
      title: 'Tahliye Rotası',
      icon: Route,
      text: 'Kapı önü, koridor ve merdiven güzergahı boş tutulmalı; alternatif çıkış rotası aileyle paylaşılmalıdır.'
    }
  ];

  return (
    <div className="flex-1 pt-24 pb-12 px-6 sm:px-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Ana Sayfaya Dön</span>
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-3">
            Aile Acil Durum Planı
          </h1>
          <p className="text-slate-600">
            Güvenli Nokta AI yalnızca risk skoru üretmez; deprem sonrası aile koordinasyonu için uygulanabilir plan önerileri de sunar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {card.title}
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  {card.text}
                </p>
              </div>
            );
          })}
        </div>

       

        <button
          onClick={() => navigate('/form')}
          className="mt-8 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
        >
          Ev Analizine Başla
        </button>
      </div>
    </div>
  );
}