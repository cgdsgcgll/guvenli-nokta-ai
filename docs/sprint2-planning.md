# Sprint 2 - Product Owner Planlama ve Gereksinimler

Bu doküman, Güvenli Nokta AI projesinin Sprint 2 hedefleri doğrultusunda Product Owner tarafından belirlenen backlog güncellemelerini, kullanıcı hikayelerini, kabul kriterlerini ve ürün gereksinimlerini içerir.

## 1. Sprint 2 Ürün Akışı (Kullanıcı İhtiyaçlarına Göre)
Kullanıcının sistemi en basit ve anlaşılır haliyle deneyimleyebilmesi için Sprint 2 MVP akışı aşağıdaki gibi netleştirilmiştir:
1. **Ana Sayfa:** Kullanıcı uygulamayı açar ve uygulamanın amacını anlatan karşılama ekranını (Ana Sayfa) görür.
2. **Ev Bilgileri Formu:** Kullanıcı risk analizine başlamak için form sayfasına yönlendirilir ve gerekli soruları yanıtlar.
3. **Veri İşleme (Arka Plan):** Form verileri backend'e iletilir ve basit risk algoritmasından geçirilerek sonuç (skor ve öneriler) üretilir.
4. **Sonuç Ekranı:** Kullanıcıya hesaplanan hazırlık puanı, riskli alanlar, güvenli nokta önerileri ve eksik hazırlıklar sunulur.

## 2. Sprint 2 Öncelikli Backlog ve Özellikler
Sprint 2'nin MVP hedefini tutturmak adına önceliklendirilen özellikler (High Priority):
*   **Ana Sayfa Görüntüleme:** Kullanıcının sisteme giriş yapabileceği landing page.
*   **Ev Bilgileri Formu:** Risk analizi için girdi toplayan arayüz.
*   **Risk Analizi Sonuç Ekranı:** Analiz sonuçlarının gösterildiği pano.

## 3. User Story ve Kabul Kriterleri (Sprint 2)

### User Story 1: Ana Sayfa
**"Bir kullanıcı olarak uygulamanın ana sayfasını görmek istiyorum, böylece uygulamanın ne işe yaradığını anlayabilir ve risk analizine başlayabilirim."**
*   **Kabul Kriterleri:**
    *   Ana sayfa başlığı ve kısa açıklama metni bulunmalıdır.
    *   "Risk Analizine Başla" (veya benzeri) bir çağrı butonu (CTA) yer almalıdır.
    *   Butona tıklandığında kullanıcı Ev Bilgileri Formu sayfasına yönlendirilmelidir.

### User Story 2: Ev Bilgileri Formu
**"Bir kullanıcı olarak evimle ilgili bilgileri bir form aracılığıyla girmek istiyorum, böylece sistemin bana özel risk analizi yapmasını sağlayabilirim."**
*   **Kabul Kriterleri:**
    *   Formda belirlenen 5 temel soru yer almalıdır (Bkz: Bölüm 4).
    *   Sorular "Evet / Hayır" veya çoktan seçmeli (dropdown/radio) gibi basit ve hızlı doldurulabilir yapıda olmalıdır.
    *   Formun sonunda "Analiz Et" butonu yer almalıdır.
    *   Form gönderildiğinde bilgiler backend `POST /api/analyze` endpoint'ine JSON formatında iletilmelidir.

### User Story 3: Risk Analizi Sonuç Ekranı
**"Bir kullanıcı olarak form sonucunda hazırlık puanımı, evimdeki riskli alanları ve önerileri görmek istiyorum, böylece deprem hazırlığımı iyileştirebilirim."**
*   **Kabul Kriterleri:**
    *   Sayfada kullanıcının toplam "Hazırlık Puanı" (0-100 arası) büyük ve belirgin şekilde gösterilmelidir.
    *   "Riskli Alanlar" maddeler halinde listelenmelidir.
    *   "Güvenli Nokta Önerileri" maddeler halinde listelenmelidir.
    *   "Eksik Hazırlıklar" maddeler halinde listelenmelidir.
    *   Ana sayfaya geri dönmek veya yeni analiz yapmak için bir buton bulunmalıdır.

## 4. Formda Yer Alacak Soruların Netleştirilmesi
Risk puanı algoritmasına (başlangıç: 100) girdi sağlamak amacıyla formda şu sorular yer alacaktır:
1.  **Büyük dolaplarınız duvara sabitlenmiş durumda mı?** (Hayır ise: -15 Puan)
2.  **Cam kenarına yakın sürekli kullandığınız bir oturma veya yatma alanı var mı?** (Evet ise: -10 Puan)
3.  **Çıkış kapısına giden koridorda geçişi engelleyebilecek eşyalar var mı?** (Evet ise: -20 Puan)
4.  **İçinde temel ihtiyaçların (su, fener, düdük vb.) bulunduğu bir deprem çantanız var mı?** (Hayır ise: -20 Puan)
5.  **Evde çocuk, yaşlı veya evcil hayvan yaşıyor mu?** (Evet ise tahliye zorluğu riskinden dolayı: -10 Puan)

## 5. Sonuç Ekranında Gösterilecek Bilgilerin Belirlenmesi
Form verilerine göre backend tarafından hesaplanacak ve sonuç ekranında kullanıcıya gösterilecek veriler:
*   **Hazırlık Puanı (Score):** Örneğin; 72
*   **Riskli Alanlar (Risk Areas):**
    *   *Örn:* Sabitlenmemiş dolaplar, Cam kenarına yakın oturma alanı
*   **Güvenli Nokta Önerileri (Safe Spots):**
    *   *Örn:* Camlardan uzak iç duvar kenarı, Sağlam masa yanı (Hayat üçgeni)
*   **Eksik Hazırlıklar (Missing Preparations):**
    *   *Örn:* Deprem çantası tamamlanmalı, Çıkış yolu üzerindeki engeller kaldırılmalı
