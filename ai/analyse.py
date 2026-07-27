import os
from rich import print as rprint
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_agent


# =====================================================================
# Pydantic Modelleri 
# =====================================================================

class DetailItem(BaseModel):
    label: str = Field(description="Kontrol edilen alan başlığı")
    value: str = Field(description="Durum açıklaması")
    status: str = Field(description="'good' veya 'warning'")


class RiskAnalysis(BaseModel):
    score: int = Field(description="Deprem güvenlik skoru (0-100)")
    riskLevel: str = Field(description="Risk seviyesi: 'Yüksek Risk', 'Orta Risk' veya 'Hazırlık İyi'")
    color: str = Field(description="Renk kodu: 'red', 'amber' veya 'green'")
    details: List[DetailItem] = Field(description="Her kontrol alanı için detay listesi")
    riskAreas: List[str] = Field(description="Riskli alanların listesi")
    safeSpots: List[str] = Field(description="Güvenli noktaların listesi")
    missingPreparations: List[str] = Field(description="Eksik hazırlıkların listesi")
    recommendations: List[str] = Field(description="Öneriler listesi")
    photoInsights: List[str] = Field(description="Fotoğraf destekli içgörüler")
    priorityActions: List[str] = Field(description="Öncelikli aksiyon listesi")
    summary: str = Field(description="Genel özet cümlesi")


# =====================================================================
# Kural tabanlı analiz 
# =====================================================================

def analyze_home_safety(data: Dict[str, Any]) -> Dict[str, Any]:
    room_count = int(data.get("roomCount", 0))
    home_type = data.get("homeType", "")
    floor_level = data.get("floorLevel", "")
    large_furniture = data.get("largeFurniture", "")
    furniture_fixed = data.get("furnitureFixed", "")
    glass_risk = data.get("glassRisk", "")
    exit_blocked = data.get("exitBlocked", "")
    earthquake_bag = data.get("earthquakeBag", "")
    bag_complete = data.get("bagComplete", "")
    family_risk = data.get("familyRisk", "")
    meeting_point = data.get("meetingPoint", "")
    gas_electric_knowledge = data.get("gasElectricKnowledge", "")
    has_room_image = bool(data.get("hasRoomImage", False))

    score = 100

    details: List[Dict[str, str]] = []
    risk_areas: List[str] = []
    safe_spots: List[str] = [
        "Camlardan uzak iç duvar kenarları",
        "Sabitlenmiş ağır eşyalardan uzak alanlar",
        "Sağlam masa veya yaşam üçgeni oluşturabilecek güvenli bölgeler"
    ]
    missing_preparations: List[str] = []
    recommendations: List[str] = []
    photo_insights: List[str] = []
    priority_actions: List[str] = []

    # --- Oda Bilgisi ---
    if not room_count or room_count < 1:
        score -= 5
        details.append({
            "label": "Oda Bilgisi",
            "value": "Eksik veya geçersiz bilgi (-5 puan)",
            "status": "warning"
        })
    else:
        details.append({
            "label": "Oda Bilgisi",
            "value": f"{room_count} oda için analiz oluşturuldu",
            "status": "good"
        })

    # --- Konut Tipi ---
    if home_type == "dorm":
        details.append({
            "label": "Konut Tipi",
            "value": "Yurt / öğrenci evi için pratik hazırlık planı",
            "status": "good"
        })
        recommendations.append(
            "Ortak kullanım alanlarında çıkış rotası ve toplanma noktası oda arkadaşlarıyla paylaşılmalıdır."
        )
    elif home_type == "detached":
        details.append({
            "label": "Konut Tipi",
            "value": "Müstakil ev için dış alan planı önerilir",
            "status": "good"
        })
        recommendations.append(
            "Bahçe veya açık alan için güvenli toplanma noktası belirlenmelidir."
        )
    else:
        details.append({
            "label": "Konut Tipi",
            "value": "Apartman dairesi için tahliye planı gerekli",
            "status": "good"
        })

    # --- Kat Durumu ---
    if floor_level == "high":
        score -= 5
        details.append({
            "label": "Kat Durumu",
            "value": "Yüksek kat için tahliye planı önemli (-5 puan)",
            "status": "warning"
        })
        priority_actions.append("Merdiven tahliye rotasını önceden belirle")
    else:
        details.append({
            "label": "Kat Durumu",
            "value": "Kat bilgisi değerlendirildi",
            "status": "good"
        })

    # --- Büyük Eşyalar ---
    if large_furniture == "yes" and furniture_fixed == "no":
        score -= 20
        details.append({
            "label": "Büyük Eşyalar",
            "value": "Sabitlenmemiş büyük eşya riski (-20 puan)",
            "status": "warning"
        })
        risk_areas.append("Sabitlenmemiş dolap, kitaplık veya beyaz eşya bulunan alanlar")
        missing_preparations.append("Büyük eşyalar duvara sabitlenmeli")
        recommendations.append(
            "Dolap, kitaplık, televizyon ünitesi ve beyaz eşyalar duvara sabitlenmelidir."
        )
        priority_actions.append("Dolap ve kitaplıkları duvara sabitle")
    elif large_furniture == "yes" and furniture_fixed == "yes":
        details.append({
            "label": "Büyük Eşyalar",
            "value": "Büyük eşyalar sabitlenmiş",
            "status": "good"
        })
    else:
        details.append({
            "label": "Büyük Eşyalar",
            "value": "Belirgin büyük eşya riski yok",
            "status": "good"
        })

    # --- Cam Kenarı Riski ---
    if glass_risk == "yes":
        score -= 15
        details.append({
            "label": "Cam Kenarı Riski",
            "value": "Cam kenarında yatak/koltuk var (-15 puan)",
            "status": "warning"
        })
        risk_areas.append("Cam kenarına yakın yatak, koltuk veya çalışma alanları")
        missing_preparations.append("Cam kenarındaki oturma/yatma alanları yeniden düzenlenmeli")
        recommendations.append(
            "Yatak, koltuk ve çalışma masası camlardan uzak bir noktaya taşınmalıdır."
        )
        priority_actions.append("Yatak ve oturma alanını cam kenarından uzaklaştır")
    else:
        details.append({
            "label": "Cam Kenarı Riski",
            "value": "Cam kenarında kritik kullanım alanı yok",
            "status": "good"
        })

    # --- Çıkış Yolu ---
    if exit_blocked == "yes":
        score -= 20
        details.append({
            "label": "Çıkış Yolu",
            "value": "Çıkış yolunda engel var (-20 puan)",
            "status": "warning"
        })
        risk_areas.append("Kapı önü, koridor veya çıkış güzergahındaki engelli alanlar")
        missing_preparations.append("Çıkış kapısı ve koridorlar açık tutulmalı")
        recommendations.append(
            "Deprem sonrası tahliye için kapı önü, koridor ve merdiven yolu sürekli açık bırakılmalıdır."
        )
        priority_actions.append("Kapı önü ve koridoru boşalt")
    else:
        details.append({
            "label": "Çıkış Yolu",
            "value": "Çıkış yolu açık görünüyor",
            "status": "good"
        })

    # --- Deprem Çantası ---
    if earthquake_bag == "no":
        score -= 20
        details.append({
            "label": "Deprem Çantası",
            "value": "Deprem çantası yok (-20 puan)",
            "status": "warning"
        })
        missing_preparations.append("Deprem çantası hazırlanmalı")
        recommendations.append(
            "Su, gıda, fener, powerbank, ilk yardım malzemesi ve kimlik fotokopisi içeren bir deprem çantası hazırlanmalıdır."
        )
        priority_actions.append("Deprem çantası hazırla")
    elif bag_complete == "partial":
        score -= 8
        details.append({
            "label": "Deprem Çantası",
            "value": "Deprem çantası kısmen tamamlanmış (-8 puan)",
            "status": "warning"
        })
        missing_preparations.append("Deprem çantasındaki eksikler tamamlanmalı")
        recommendations.append(
            "Deprem çantasında su, gıda, fener, düdük, powerbank, ilaç ve ilk yardım malzemeleri kontrol edilmelidir."
        )
        priority_actions.append("Deprem çantası eksiklerini tamamla")
    elif bag_complete == "no":
        score -= 12
        details.append({
            "label": "Deprem Çantası",
            "value": "Çanta var ama içerik yetersiz (-12 puan)",
            "status": "warning"
        })
        missing_preparations.append("Deprem çantası içeriği yenilenmeli")
        recommendations.append(
            "Deprem çantası yalnızca var olmakla kalmamalı; temel ihtiyaçları karşılayacak şekilde tamamlanmalıdır."
        )
        priority_actions.append("Çanta içeriğini yenile")
    else:
        details.append({
            "label": "Deprem Çantası",
            "value": "Deprem çantası mevcut ve yeterli",
            "status": "good"
        })

    # --- Aile Durumu ---
    if family_risk == "yes":
        score -= 10
        details.append({
            "label": "Aile Durumu",
            "value": "Hassas grup için ek plan gerekli (-10 puan)",
            "status": "warning"
        })
        missing_preparations.append(
            "Çocuk, yaşlı, engelli birey veya evcil hayvan için özel acil durum planı yapılmalı"
        )
        recommendations.append(
            "Evde hassas grup varsa deprem anında kimin nereyi kontrol edeceği önceden belirlenmelidir."
        )
        priority_actions.append("Aile içi görev paylaşımı yap")
    else:
        details.append({
            "label": "Aile Durumu",
            "value": "Ek hassas grup belirtilmedi",
            "status": "good"
        })

    # --- Aile Buluşma Noktası ---
    if meeting_point == "no":
        score -= 10
        details.append({
            "label": "Aile Buluşma Noktası",
            "value": "Buluşma noktası belirlenmemiş (-10 puan)",
            "status": "warning"
        })
        missing_preparations.append("Aile buluşma noktası belirlenmeli")
        recommendations.append(
            "Deprem sonrası iletişim kopukluğu ihtimaline karşı bina dışı güvenli bir aile buluşma noktası belirlenmelidir."
        )
        priority_actions.append("Aile buluşma noktası belirle")
    else:
        details.append({
            "label": "Aile Buluşma Noktası",
            "value": "Buluşma noktası belirlenmiş",
            "status": "good"
        })

    # --- Gaz / Elektrik Bilgisi ---
    if gas_electric_knowledge == "no":
        score -= 8
        details.append({
            "label": "Gaz / Elektrik Bilgisi",
            "value": "Kapatma bilgisi yok (-8 puan)",
            "status": "warning"
        })
        missing_preparations.append("Gaz, su ve elektrik vanalarının konumu öğrenilmeli")
        recommendations.append(
            "Deprem sonrası ikincil riskleri azaltmak için gaz, su ve elektrik kapatma noktaları öğrenilmelidir."
        )
        priority_actions.append("Gaz ve elektrik kapatma noktalarını öğren")
    else:
        details.append({
            "label": "Gaz / Elektrik Bilgisi",
            "value": "Kapatma bilgisi mevcut",
            "status": "good"
        })

    # --- Fotoğraf Destekli Kontrol ---
    if has_room_image:
        details.append({
            "label": "Fotoğraf Destekli Kontrol",
            "value": "Oda fotoğrafı rapora dahil edildi",
            "status": "good"
        })
        photo_insights.append(
            "Yüklenen oda fotoğrafı, ev içi deprem güvenliği açısından ön kontrol listesine dahil edildi."
        )

        if large_furniture == "yes" and furniture_fixed == "no":
            photo_insights.append(
                "Fotoğrafta masa, dolap, raf, monitör veya duvar önündeki ağır eşyalar özellikle kontrol edilmelidir. "
                "Sabitlenmemiş eşyalar deprem anında devrilme riski oluşturabilir."
            )

        if glass_risk == "yes":
            photo_insights.append(
                "Cam kenarına yakın oturma, yatak veya çalışma alanları riskli kabul edilmiştir. "
                "Bu alanların camdan uzaklaştırılması önerilir."
            )
        else:
            photo_insights.append(
                "Cam kenarı riski düşük işaretlenmiştir. Yine de fotoğraftaki pencere çevresinde "
                "kırılabilir eşya veya oturma alanı olup olmadığı kontrol edilmelidir."
            )

        if exit_blocked == "yes":
            photo_insights.append(
                "Çıkış yolu engelli olarak belirtilmiştir. Fotoğrafta kapı önü, masa çevresi ve "
                "geçiş alanlarının boş bırakılması öncelikli aksiyon olmalıdır."
            )
        else:
            photo_insights.append(
                "Çıkış yolu açık olarak belirtilmiştir. Fotoğraftaki geçiş alanlarının düzenli kalması "
                "deprem sonrası tahliye için önemlidir."
            )

        if earthquake_bag == "no":
            photo_insights.append(
                "Deprem çantası olmadığı için fotoğrafta kolay ulaşılabilir bir alan belirlenip "
                "çanta bu noktaya yerleştirilmelidir."
            )
    else:
        score -= 3
        details.append({
            "label": "Fotoğraf Destekli Kontrol",
            "value": "Fotoğraf yüklenmedi (-3 puan)",
            "status": "warning"
        })
        photo_insights.append(
            "Fotoğraf yüklenmediği için oda düzeni görsel olarak rapora dahil edilemedi."
        )
        photo_insights.append(
            "Daha doğru bir ev içi risk değerlendirmesi için oda, kapı önü, cam kenarı ve "
            "büyük eşyaları gösteren bir fotoğraf yüklenmesi önerilir."
        )
        missing_preparations.append("Oda fotoğrafı ile ev içi risk kontrolü yapılabilir")

    # --- Skor sınırlama ---
    score = max(0, min(100, score))

    # --- Risk seviyesi belirleme ---
    if score < 50:
        risk_level = "Yüksek Risk"
        color = "red"
    elif score < 75:
        risk_level = "Orta Risk"
        color = "amber"
    else:
        risk_level = "Hazırlık İyi"
        color = "green"

    # --- Boş liste kontrolü ---
    if not risk_areas:
        risk_areas.append("Belirgin yüksek riskli alan tespit edilmedi")

    if not missing_preparations:
        missing_preparations.append("Temel hazırlıklar büyük ölçüde tamamlanmış görünüyor")

    if not recommendations:
        recommendations.append(
            "Mevcut bilgilere göre ev içi deprem hazırlık seviyesi iyi görünüyor. Düzenli kontrol yapılması önerilir."
        )

    if not priority_actions:
        priority_actions.append("Mevcut hazırlıkları düzenli olarak kontrol et")
        priority_actions.append("Deprem çantasını belirli aralıklarla yenile")

    return {
        "score": score,
        "riskLevel": risk_level,
        "color": color,
        "details": details,
        "riskAreas": risk_areas,
        "safeSpots": safe_spots,
        "missingPreparations": missing_preparations,
        "recommendations": recommendations,
        "photoInsights": photo_insights,
        "priorityActions": priority_actions,
        "summary": f"Ev içi deprem hazırlık skorunuz {score}/100 olarak hesaplandı. Genel durum: {risk_level}."
    }


# =====================================================================
# Gemini AI destekli analiz 
# =====================================================================

def run_risk_agent(form_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Önce kural tabanlı analizi çalıştırır, ardından Gemini AI ile
    zenginleştirilmiş analiz üretir.
    """
    # Kural tabanlı analiz sonucu
    rule_result = analyze_home_safety(form_data)

    raw_content = f"""
    Kural tabanlı analiz sonucu:
    - Skor: {rule_result['score']}/100
    - Risk Seviyesi: {rule_result['riskLevel']}
    - Riskli Alanlar: {', '.join(rule_result['riskAreas'])}
    - Güvenli Noktalar: {', '.join(rule_result['safeSpots'])}
    - Eksik Hazırlıklar: {', '.join(rule_result['missingPreparations'])}
    - Öneriler: {', '.join(rule_result['recommendations'])}
    - Fotoğraf İçgörüleri: {', '.join(rule_result['photoInsights'])}
    - Öncelikli Aksiyonlar: {', '.join(rule_result['priorityActions'])}
    - Detaylar: {rule_result['details']}
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
    agent = create_agent(
        model=model,
        system_prompt=(
            f"Sen kullanıcının ev bilgilerine göre deprem risk analizi yapan bir danışmansın. "
            f"Çıktındaki 'score' değerini kesinlikle sana verilen baz puana ({rule_result['score']}) eşitlemelisin. "
            f"Kural tabanlı analiz sonuçları sana rehber olacak, bunları zenginleştirerek kullanıcıya sun. "
            f"Bilgiler: {raw_content}"
        ),
        response_format=RiskAnalysis
    )

    response = agent.invoke({
        "messages": [("user", "Yukarıdaki bilgilere göre riskli alanları, güvenli noktaları ve eksiklikleri listele.")]
    })
    return response["structured_response"].model_dump()


# =====================================================================
# GERÇEK ZAMANLI TEST ALANI 
# =====================================================================
if __name__ == "__main__":
    # os.environ["GOOGLE_API_KEY"] = "BURAYA_TEST_ICIN_YAZABILIRSIN"
    if "GOOGLE_API_KEY" not in os.environ:
        raise ValueError("Lütfen sistemde 'GOOGLE_API_KEY' ortam değişkenini tanımlayın.")

    mock_form_data = {
        "roomCount": 3,
        "homeType": "apartment",
        "floorLevel": "high",
        "largeFurniture": "yes",
        "furnitureFixed": "no",
        "glassRisk": "yes",
        "exitBlocked": "no",
        "earthquakeBag": "yes",
        "bagComplete": "partial",
        "familyRisk": "yes",
        "meetingPoint": "no",
        "gasElectricKnowledge": "yes",
        "hasRoomImage": False
    }

    try:
        # Sadece kural tabanlı testi de çalıştırabilirsin:
        rprint("\n=== KURAL TABANLI ANALİZ ===")
        rule_result = analyze_home_safety(mock_form_data)
        rprint(rule_result)

        # AI destekli tam analiz:
        rprint("\n=== AI DESTEKLİ ANALİZ ===")
        ai_result = run_risk_agent(mock_form_data)
        rprint(ai_result)
    except Exception as e:
        print(f"Hata: {e}")