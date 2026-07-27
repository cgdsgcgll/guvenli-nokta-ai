const express = require("express");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 5001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://98.88.72.7:9005";

// Fotoğraf belleğe alınır (diske yazılmaz)
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// JSON body parse — multer ile birlikte çalışır
app.use(express.json());

// ─────────────────────────────────────────
// Sağlık kontrolü
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Güvenli Nokta AI Backend çalışıyor.", endpoints: ["/api/health", "/api/analyze"] });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Güvenli Nokta AI API" });
});

// ─────────────────────────────────────────
// Kural tabanlı tam analiz
// Çıktı: frontend'in beklediği tüm alanları üretir
// ─────────────────────────────────────────
function analyzeHomeSafety(data) {
  const roomCount = Number(data.roomCount);
  const homeType = data.homeType;
  const floorLevel = data.floorLevel;
  const largeFurniture = data.largeFurniture;
  const furnitureFixed = data.furnitureFixed;
  const glassRisk = data.glassRisk;
  const exitBlocked = data.exitBlocked;
  const earthquakeBag = data.earthquakeBag;
  const bagComplete = data.bagComplete;
  const familyRisk = data.familyRisk;
  const meetingPoint = data.meetingPoint;
  const gasElectricKnowledge = data.gasElectricKnowledge;

  let score = 100;
  const details = [];
  const riskAreas = [];
  const safeSpots = [
    "Camlardan uzak iç duvar kenarları",
    "Sabitlenmiş ağır eşyalardan uzak alanlar",
    "Sağlam masa veya yaşam üçgeni oluşturabilecek güvenli bölgeler"
  ];
  const missingPreparations = [];
  const recommendations = [];
  const priorityActions = [];

  // --- Oda Bilgisi ---
  if (!roomCount || roomCount < 1) {
    score -= 5;
    details.push({ label: "Oda Bilgisi", value: "Eksik veya geçersiz bilgi (-5 puan)", status: "warning" });
  } else {
    details.push({ label: "Oda Bilgisi", value: `${roomCount} oda için analiz oluşturuldu`, status: "good" });
  }

  // --- Konut Tipi ---
  if (homeType === "dorm") {
    details.push({ label: "Konut Tipi", value: "Yurt / öğrenci evi için pratik hazırlık planı", status: "good" });
    recommendations.push("Ortak kullanım alanlarında çıkış rotası ve toplanma noktası oda arkadaşlarıyla paylaşılmalıdır.");
  } else if (homeType === "detached") {
    details.push({ label: "Konut Tipi", value: "Müstakil ev için dış alan planı önerilir", status: "good" });
    recommendations.push("Bahçe veya açık alan için güvenli toplanma noktası belirlenmelidir.");
  } else {
    details.push({ label: "Konut Tipi", value: "Apartman dairesi için tahliye planı gerekli", status: "good" });
  }

  // --- Kat Durumu ---
  if (floorLevel === "high") {
    score -= 5;
    details.push({ label: "Kat Durumu", value: "Yüksek kat için tahliye planı önemli (-5 puan)", status: "warning" });
    priorityActions.push("Merdiven tahliye rotasını önceden belirle");
  } else {
    details.push({ label: "Kat Durumu", value: "Kat bilgisi değerlendirildi", status: "good" });
  }

  // --- Büyük Eşyalar ---
  if (largeFurniture === "yes" && furnitureFixed === "no") {
    score -= 20;
    details.push({ label: "Büyük Eşyalar", value: "Sabitlenmemiş büyük eşya riski (-20 puan)", status: "warning" });
    riskAreas.push("Sabitlenmemiş dolap, kitaplık veya beyaz eşya bulunan alanlar");
    missingPreparations.push("Büyük eşyalar duvara sabitlenmeli");
    recommendations.push("Dolap, kitaplık, televizyon ünitesi ve beyaz eşyalar duvara sabitlenmelidir.");
    priorityActions.push("Dolap ve kitaplıkları duvara sabitle");
  } else if (largeFurniture === "yes" && furnitureFixed === "yes") {
    details.push({ label: "Büyük Eşyalar", value: "Büyük eşyalar sabitlenmiş", status: "good" });
  } else {
    details.push({ label: "Büyük Eşyalar", value: "Belirgin büyük eşya riski yok", status: "good" });
  }

  // --- Cam Kenarı Riski ---
  if (glassRisk === "yes") {
    score -= 15;
    details.push({ label: "Cam Kenarı Riski", value: "Cam kenarında yatak/koltuk var (-15 puan)", status: "warning" });
    riskAreas.push("Cam kenarına yakın yatak, koltuk veya çalışma alanları");
    missingPreparations.push("Cam kenarındaki oturma/yatma alanları yeniden düzenlenmeli");
    recommendations.push("Yatak, koltuk ve çalışma masası camlardan uzak bir noktaya taşınmalıdır.");
    priorityActions.push("Yatak ve oturma alanını cam kenarından uzaklaştır");
  } else {
    details.push({ label: "Cam Kenarı Riski", value: "Cam kenarında kritik kullanım alanı yok", status: "good" });
  }

  // --- Çıkış Yolu ---
  if (exitBlocked === "yes") {
    score -= 20;
    details.push({ label: "Çıkış Yolu", value: "Çıkış yolunda engel var (-20 puan)", status: "warning" });
    riskAreas.push("Kapı önü, koridor veya çıkış güzergahındaki engelli alanlar");
    missingPreparations.push("Çıkış kapısı ve koridorlar açık tutulmalı");
    recommendations.push("Deprem sonrası tahliye için kapı önü, koridor ve merdiven yolu sürekli açık bırakılmalıdır.");
    priorityActions.push("Kapı önü ve koridoru boşalt");
  } else {
    details.push({ label: "Çıkış Yolu", value: "Çıkış yolu açık görünüyor", status: "good" });
  }

  // --- Deprem Çantası ---
  if (earthquakeBag === "no") {
    score -= 20;
    details.push({ label: "Deprem Çantası", value: "Deprem çantası yok (-20 puan)", status: "warning" });
    missingPreparations.push("Deprem çantası hazırlanmalı");
    recommendations.push("Su, gıda, fener, powerbank, ilk yardım malzemesi ve kimlik fotokopisi içeren bir deprem çantası hazırlanmalıdır.");
    priorityActions.push("Deprem çantası hazırla");
  } else if (bagComplete === "partial") {
    score -= 8;
    details.push({ label: "Deprem Çantası", value: "Deprem çantası kısmen tamamlanmış (-8 puan)", status: "warning" });
    missingPreparations.push("Deprem çantasındaki eksikler tamamlanmalı");
    recommendations.push("Deprem çantasında su, gıda, fener, düdük, powerbank, ilaç ve ilk yardım malzemeleri kontrol edilmelidir.");
    priorityActions.push("Deprem çantası eksiklerini tamamla");
  } else if (bagComplete === "no") {
    score -= 12;
    details.push({ label: "Deprem Çantası", value: "Çanta var ama içerik yetersiz (-12 puan)", status: "warning" });
    missingPreparations.push("Deprem çantası içeriği yenilenmeli");
    recommendations.push("Deprem çantası yalnızca var olmakla kalmamalı; temel ihtiyaçları karşılayacak şekilde tamamlanmalıdır.");
    priorityActions.push("Çanta içeriğini yenile");
  } else {
    details.push({ label: "Deprem Çantası", value: "Deprem çantası mevcut ve yeterli", status: "good" });
  }

  // --- Aile Durumu ---
  if (familyRisk === "yes") {
    score -= 10;
    details.push({ label: "Aile Durumu", value: "Hassas grup için ek plan gerekli (-10 puan)", status: "warning" });
    missingPreparations.push("Çocuk, yaşlı, engelli birey veya evcil hayvan için özel acil durum planı yapılmalı");
    recommendations.push("Evde hassas grup varsa deprem anında kimin nereyi kontrol edeceği önceden belirlenmelidir.");
    priorityActions.push("Aile içi görev paylaşımı yap");
  } else {
    details.push({ label: "Aile Durumu", value: "Ek hassas grup belirtilmedi", status: "good" });
  }

  // --- Aile Buluşma Noktası ---
  if (meetingPoint === "no") {
    score -= 10;
    details.push({ label: "Aile Buluşma Noktası", value: "Buluşma noktası belirlenmemiş (-10 puan)", status: "warning" });
    missingPreparations.push("Aile buluşma noktası belirlenmeli");
    recommendations.push("Deprem sonrası iletişim kopukluğu ihtimaline karşı bina dışı güvenli bir aile buluşma noktası belirlenmelidir.");
    priorityActions.push("Aile buluşma noktası belirle");
  } else {
    details.push({ label: "Aile Buluşma Noktası", value: "Buluşma noktası belirlenmiş", status: "good" });
  }

  // --- Gaz / Elektrik Bilgisi ---
  if (gasElectricKnowledge === "no") {
    score -= 8;
    details.push({ label: "Gaz / Elektrik Bilgisi", value: "Kapatma bilgisi yok (-8 puan)", status: "warning" });
    missingPreparations.push("Gaz, su ve elektrik vanalarının konumu öğrenilmeli");
    recommendations.push("Deprem sonrası ikincil riskleri azaltmak için gaz, su ve elektrik kapatma noktaları öğrenilmelidir.");
    priorityActions.push("Gaz ve elektrik kapatma noktalarını öğren");
  } else {
    details.push({ label: "Gaz / Elektrik Bilgisi", value: "Kapatma bilgisi mevcut", status: "good" });
  }

  // --- Skor sınırlama ve risk seviyesi ---
  score = Math.max(0, Math.min(100, score));

  let riskLevel = "Hazırlık İyi";
  let color = "green";
  if (score < 50) { riskLevel = "Yüksek Risk"; color = "red"; }
  else if (score < 75) { riskLevel = "Orta Risk"; color = "amber"; }

  // --- Boş liste fallback'leri ---
  if (riskAreas.length === 0) riskAreas.push("Belirgin yüksek riskli alan tespit edilmedi");
  if (missingPreparations.length === 0) missingPreparations.push("Temel hazırlıklar büyük ölçüde tamamlanmış görünüyor");
  if (recommendations.length === 0) recommendations.push("Mevcut bilgilere göre ev içi deprem hazırlık seviyesi iyi görünüyor. Düzenli kontrol yapılması önerilir.");
  if (priorityActions.length === 0) {
    priorityActions.push("Mevcut hazırlıkları düzenli olarak kontrol et");
    priorityActions.push("Deprem çantasını belirli aralıklarla yenile");
  }

  return { score, riskLevel, color, details, riskAreas, safeSpots, missingPreparations, recommendations, priorityActions };
}

// ─────────────────────────────────────────
// Fotoğrafı FastAPI AI servisine ilet
// Döndürür: { riskAreas, safeSpots, suggestions } veya null
// ─────────────────────────────────────────
async function getPhotoInsightsFromAI(imageBuffer, mimetype) {
  try {
    const form = new FormData();
    form.append("image", imageBuffer, {
      filename: "room.jpg",
      contentType: mimetype || "image/jpeg"
    });

    const response = await fetch(`${AI_SERVICE_URL}/analyze-image`, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
      timeout: 30000
    });

    if (!response.ok) {
      console.error("FastAPI hatası:", response.status, await response.text());
      return null;
    }

    return await response.json(); // { riskAreas, safeSpots, suggestions }
  } catch (err) {
    console.error("FastAPI'ye ulaşılamadı:", err.message);
    return null;
  }
}

// ─────────────────────────────────────────
// photoInsights dizisini oluştur
// AI varsa ondan, yoksa kural tabanlı fallback
// ─────────────────────────────────────────
function buildPhotoInsights(hasImage, aiResult, formData) {
  if (!hasImage) {
    return [
      "Fotoğraf yüklenmediği için oda düzeni görsel olarak rapora dahil edilemedi.",
      "Daha doğru bir ev içi risk değerlendirmesi için oda, kapı önü, cam kenarı ve büyük eşyaları gösteren bir fotoğraf yüklenmesi önerilir."
    ];
  }

  // AI servisi başarılıysa onun tespitlerini kullan
  if (aiResult) {
    const insights = [];

    if (aiResult.riskAreas?.length) {
      insights.push("📍 Görsel riskli alanlar:");
      aiResult.riskAreas.forEach(item => insights.push(item));
    }

    if (aiResult.safeSpots?.length) {
      insights.push("✅ Güvenli görünen noktalar:");
      aiResult.safeSpots.forEach(item => insights.push(item));
    }

    if (aiResult.suggestions?.length) {
      insights.push("💡 Öneriler:");
      aiResult.suggestions.forEach(item => insights.push(item));
    }

    return insights.length > 0 ? insights : ["Fotoğraf analiz edildi ancak belirgin bir risk tespit edilmedi."];
  }

  // AI servisi çevrimdışıysa form verisine göre kural tabanlı fallback
  const insights = ["Yüklenen oda fotoğrafı rapora dahil edildi."];
  if (formData.largeFurniture === "yes" && formData.furnitureFixed === "no") {
    insights.push("Fotoğrafta masa, dolap, raf veya duvar önündeki ağır eşyalar özellikle kontrol edilmelidir. Sabitlenmemiş eşyalar deprem anında devrilme riski oluşturabilir.");
  }
  if (formData.glassRisk === "yes") {
    insights.push("Cam kenarına yakın oturma, yatak veya çalışma alanları riskli kabul edilmiştir. Bu alanların camdan uzaklaştırılması önerilir.");
  } else {
    insights.push("Cam kenarı riski düşük işaretlenmiştir. Yine de fotoğraftaki pencere çevresinde kırılabilir eşya veya oturma alanı olup olmadığı kontrol edilmelidir.");
  }
  if (formData.exitBlocked === "yes") {
    insights.push("Çıkış yolu engelli olarak belirtilmiştir. Fotoğrafta kapı önü, masa çevresi ve geçiş alanlarının boş bırakılması öncelikli aksiyon olmalıdır.");
  } else {
    insights.push("Çıkış yolu açık olarak belirtilmiştir. Fotoğraftaki geçiş alanlarının düzenli kalması deprem sonrası tahliye için önemlidir.");
  }
  if (formData.earthquakeBag === "no") {
    insights.push("Deprem çantası olmadığı için fotoğrafta kolay ulaşılabilir bir alan belirlenip çanta bu noktaya yerleştirilmelidir.");
  }
  return insights;
}

// ─────────────────────────────────────────
// Ana analiz endpoint'i
// Hem JSON hem multipart/form-data destekler
// ─────────────────────────────────────────
app.post("/api/analyze", upload.single("roomImage"), async (req, res) => {
  try {
    const data = req.body;
    const hasImage = Boolean(req.file);

    // 1. Kural tabanlı tam analiz
    const analysis = analyzeHomeSafety(data);

    // 2. Fotoğraf varsa AI servisine gönder
    let aiResult = null;
    if (hasImage) {
      aiResult = await getPhotoInsightsFromAI(req.file.buffer, req.file.mimetype);
    }

    // 3. photoInsights oluştur (AI veya fallback)
    const photoInsights = buildPhotoInsights(hasImage, aiResult, data);

    // 4. Fotoğraf detayını details listesine ekle
    if (hasImage) {
      analysis.details.push({
        label: "Fotoğraf Destekli Kontrol",
        value: "Oda fotoğrafı analiz edildi",
        status: "good"
      });
    } else {
      analysis.score = Math.max(0, analysis.score - 3);
      analysis.details.push({
        label: "Fotoğraf Destekli Kontrol",
        value: "Fotoğraf yüklenmedi (-3 puan)",
        status: "warning"
      });
    }

    // 5. Nihai yanıt — frontend'in beklediği tüm alanlar
    res.json({
      score: analysis.score,
      riskLevel: analysis.riskLevel,
      color: analysis.color,
      summary: `Ev içi deprem hazırlık skorunuz ${analysis.score}/100 olarak hesaplandı. Genel durum: ${analysis.riskLevel}.`,
      details: analysis.details,
      riskAreas: analysis.riskAreas,
      safeSpots: analysis.safeSpots,
      missingPreparations: analysis.missingPreparations,
      recommendations: analysis.recommendations,
      photoInsights,
      priorityActions: analysis.priorityActions
    });

  } catch (err) {
    console.error("Analiz hatası:", err);
    res.status(500).json({ error: "Analiz sırasında bir hata oluştu.", detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Güvenli Nokta AI Backend ${PORT} portunda çalışıyor.`);
});