# Açık sorular (Brif Bölüm 2.2)

Ayşenur'a iletilecek belirsizlikler. Karar verilince işaretlenip koda yansıtılacak.

- [ ] **Ürün adı** kesin mi? Şimdilik "Rehber" / "دليل" (A1). Repo adı `rehber-gbv-srh-assistant`.
- [ ] **LLM sağlayıcısı ve model** (A7): Anthropic hedeflendi, OpenAI-uyumlu API de destekleniyor. Model adı, API anahtarı ve harcama limiti bekleniyor. Sağlayıcının veri saklama politikası netleşince README "Privacy" bölümüne yazılacak.
- [ ] **Onaylı içerik metinleri** (A2, A3): `content/tr/` ve `content/ar/` altındaki 14 dosya yer tutucu. Gelince frontmatter'da `reviewed: true` ve `reviewer` doldurulacak.
- [ ] **Arapça arayüz metinleri** (A4): Bölüm 12'deki taslak kullanıldı. Brifte olmayan, benim eklediğim 12 anahtar da kontrol edilmeli: `language_tr`, `language_ar`, `referral_step_of`, `service_city_online`, `service_hours`, `service_languages`, `service_phone`, `service_types`, `assistant_label`, `you_label`, `chat_region_label`, `message_input_label` (son dördü yalnızca ekran okuyucular için).
- [ ] **Anahtar kelime listesi** (A5): Test 12 cümlesi ("ailem beni gelecek ay evlendirecek") anahtar kelime katmanında yakalanmıyor; "beni evlendir", "evlendirecek" eklensin mi?
- [ ] **Acil numaralar** (A6): Bölüm 9.5 listesi kullanıldı, teyit bekleniyor.
- [ ] **Node sürümü**: `package.json` brife göre `>=24` diyor; geliştirme ve testler Node 22.23 ile yapıldı, 24'te ayrıca doğrulanmalı (Vercel'de 24.x seçilecek).
- [ ] **Demo alan adı**: Vercel adresi yeterli mi?
- [ ] **Dil değiştirme sohbet sırasında**: Sohbet geçmişi korunuyor, karşılama mesajı yeni dilde gösteriliyor. Geçmişin silinmesi mi istenir?
- [ ] **Sohbet başlığındaki "Dili değiştir"** tek tıkla TR↔AR geçiş yapıyor (yalnızca iki dil olduğu için). Farsça eklenirse menüye dönüştürülecek.
- [ ] **GitHub hesabı** (A9): Kod şimdilik geliştiricinin hesabında; VersHub organizasyonuna transfer edilecek mi?
