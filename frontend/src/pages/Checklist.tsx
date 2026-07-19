import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, PackageCheck, Home, Users } from 'lucide-react';

export default function Checklist() {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Ev İçi Güvenlik',
      icon: Home,
      items: [
        'Dolap, kitaplık ve televizyon ünitesi duvara sabitlendi.',
        'Yatak ve koltuklar cam kenarından uzaklaştırıldı.',
        'Kapı önü, koridor ve çıkış güzergahı açık tutuluyor.',
        'Ağır eşyalar üst raflardan alt raflara alındı.'
      ]
    },
    {
      title: 'Deprem Çantası',
      icon: PackageCheck,
      items: [
        'Su, dayanıklı gıda ve ilk yardım malzemesi eklendi.',
        'Fener, pil, powerbank ve düdük hazırlandı.',
        'Kimlik fotokopileri ve önemli belgeler eklendi.',
        'İlaçlar ve kişisel ihtiyaçlar düzenli kontrol ediliyor.'
      ]
    },
    {
      title: 'Aile Planı',
      icon: Users,
      items: [
        'Aile buluşma noktası belirlendi.',
        'Çocuk, yaşlı veya evcil hayvan için sorumlu kişi belirlendi.',
        'Gaz, su ve elektrik vanalarının konumu biliniyor.',
        'Acil durumda aranacak kişiler listesi hazırlandı.'
      ]
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
            Akıllı Deprem Hazırlık Kontrol Listesi
          </h1>
          <p className="text-slate-600">
            Analizden bağımsız olarak ev, deprem çantası ve aile planı için uygulanabilir hazırlık adımlarını takip edebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {section.title}
                </h2>

                <ul className="space-y-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/form')}
            className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
          >
            Kendi Evimi Analiz Et
          </button>

          <button
            onClick={() => navigate('/emergency-plan')}
            className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Aile Acil Planına Git
          </button>
        </div>
      </div>
    </div>
  );
}