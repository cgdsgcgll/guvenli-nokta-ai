import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Home, Camera, UploadCloud } from 'lucide-react';

export default function FormPage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const [formData, setFormData] = useState({
    roomCount: '',
    homeType: '',
    floorLevel: '',
    largeFurniture: '',
    furnitureFixed: '',
    glassRisk: '',
    exitBlocked: '',
    earthquakeBag: '',
    bagComplete: '',
    familyRisk: '',
    meetingPoint: '',
    gasElectricKnowledge: '',
    roomPhotoName: ''
  });

  const loadingSteps = [
    'Ev bilgileri işleniyor...',
    'Fotoğraf analizi beta kontrolü yapılıyor...',
    'Ev içi riskli alanlar analiz ediliyor...',
    'Güvenli nokta önerileri hazırlanıyor...',
    'Deprem hazırlık skoru hesaplanıyor...',
    'Kişisel öneriler oluşturuluyor...'
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      roomPhotoName: file.name
    }));

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let step = 0;
    setLoadingText(loadingSteps[0]);

    const interval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setLoadingText(loadingSteps[step]);
      }
    }, 600);

    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCount: Number(formData.roomCount),
          homeType: formData.homeType,
          floorLevel: formData.floorLevel,
          largeFurniture: formData.largeFurniture,
          furnitureFixed: formData.furnitureFixed,
          glassRisk: formData.glassRisk,
          exitBlocked: formData.exitBlocked,
          earthquakeBag: formData.earthquakeBag,
          bagComplete: formData.bagComplete,
          familyRisk: formData.familyRisk,
          meetingPoint: formData.meetingPoint,
          gasElectricKnowledge: formData.gasElectricKnowledge,
          hasRoomImage: Boolean(formData.roomPhotoName),
          roomPhotoName: formData.roomPhotoName
        })
      });

      if (!response.ok) {
        throw new Error('Backend analiz isteği başarısız oldu.');
      }

      const analysisResult = await response.json();

      setTimeout(() => {
        clearInterval(interval);
        navigate('/result', {
          state: {
            analysisResult,
            preview
          }
        });
      }, 900);
    } catch (err) {
      clearInterval(interval);
      setIsSubmitting(false);
      setError('Backend bağlantısı kurulamadı. Backend server çalışıyor mu kontrol edin.');
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-24 pb-12 px-6 sm:px-12 relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

      <div className="max-w-4xl w-full mx-auto">
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
          <div className="bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Home className="w-6 h-6 text-blue-400" />
              Ev ve Deprem Hazırlık Bilgilerini Girin
            </h2>
            <p className="text-slate-400 text-sm">
              Bilgileri doldurun, isterseniz oda fotoğrafı yükleyin. Sistem size riskli alanlar,
              güvenli noktalar ve eksik hazırlıklar için kişisel rapor oluştursun.
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
                    <Home className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Güvenli Nokta AI Analiz Ediyor
                  </h3>

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
                  className="space-y-8"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      1. Ev Bilgileri
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Evde kaç oda var?
                        </label>
                        <input
                          name="roomCount"
                          value={formData.roomCount}
                          onChange={handleChange}
                          type="number"
                          required
                          min="1"
                          max="20"
                          placeholder="Örn: 3"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Konut tipi
                        </label>
                        <select
                          name="homeType"
                          value={formData.homeType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="apartment">Apartman dairesi</option>
                          <option value="detached">Müstakil ev</option>
                          <option value="dorm">Yurt / öğrenci evi</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Bulunduğunuz kat
                        </label>
                        <select
                          name="floorLevel"
                          value={formData.floorLevel}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="ground">Zemin / giriş kat</option>
                          <option value="middle">Ara kat</option>
                          <option value="high">Yüksek kat</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      2. Ev İçi Riskler
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Büyük eşya var mı?
                        </label>
                        <select
                          name="largeFurniture"
                          value={formData.largeFurniture}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Büyük eşyalar sabit mi?
                        </label>
                        <select
                          name="furnitureFixed"
                          value={formData.furnitureFixed}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Cam kenarında yatak/koltuk var mı?
                        </label>
                        <select
                          name="glassRisk"
                          value={formData.glassRisk}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Kapı önü veya çıkış yolunda engel var mı?
                        </label>
                        <select
                          name="exitBlocked"
                          value={formData.exitBlocked}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      3. Deprem Hazırlığı
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Deprem çantası var mı?
                        </label>
                        <select
                          name="earthquakeBag"
                          value={formData.earthquakeBag}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Çanta içeriği yeterli mi?
                        </label>
                        <select
                          name="bagComplete"
                          value={formData.bagComplete}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="partial">Kısmen</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Aile buluşma noktası belirlendi mi?
                        </label>
                        <select
                          name="meetingPoint"
                          value={formData.meetingPoint}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 block">
                          Gaz/elektrik kapatma bilgisi var mı?
                        </label>
                        <select
                          name="gasElectricKnowledge"
                          value={formData.gasElectricKnowledge}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Seçiniz...</option>
                          <option value="yes">Evet</option>
                          <option value="no">Hayır</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 mt-6">
                      <label className="text-sm font-semibold text-slate-700 block">
                        Evde çocuk, yaşlı, engelli birey veya evcil hayvan var mı?
                      </label>
                      <select
                        name="familyRisk"
                        value={formData.familyRisk}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all outline-none bg-slate-50 focus:bg-white appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seçiniz...</option>
                        <option value="yes">Evet</option>
                        <option value="no">Hayır</option>
                      </select>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      4. Oda Fotoğrafı ile Risk Kontrolü
                    </h3>

                    <label className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <UploadCloud className="w-10 h-10 text-blue-600 mb-3" />
                      <span className="font-bold text-slate-800">
                        Oda fotoğrafı yükle
                      </span>
                      <span className="text-sm text-slate-500 mt-1">
                        Dolap, cam kenarı, çıkış yolu gibi görünür riskleri rapora dahil etmek için.
                      </span>
                    </label>

                    {preview && (
                      <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img
                          src={preview}
                          alt="Yüklenen oda fotoğrafı"
                          className="w-full max-h-80 object-cover"
                        />
                        <div className="p-3 text-sm text-slate-600 flex items-center gap-2">
                          <Camera className="w-4 h-4 text-blue-600" />
                          {formData.roomPhotoName} yüklendi. Fotoğraf destekli risk kontrolü rapora eklenecek.
                        </div>
                      </div>
                    )}
                  </section>

                

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors shadow-lg shadow-blue-600/30 active:scale-[0.98]"
                    >
                      Güvenli Noktayı ve Hazırlık Skorunu Analiz Et
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