# Açık sorular (Brif Bölüm 2.2)

Ayşenur'a iletilecek belirsizlikler. Karar verilince işaretlenip koda yansıtılacak.

- [ ] **Ürün adı** kesin mi? Şimdilik "Rehber" / "دليل" (A1). Repo adı `rehber-gbv-srh-assistant`.
- [ ] **LLM sağlayıcısı ve model** (A7): Hesaplar VersHub adına açılacak (9 Kasım). İki aday model `scripts/compare-models.mjs` ile Test 4, 5, 6, 11, 7, 8 üzerinde karşılaştırılıp seçim birlikte yapılacak. Harcama limiti: aylık 50 USD. Sağlayıcının veri saklama politikası netleşince README "Privacy" bölümüne yazılacak.
- [ ] **Onaylı içerik metinleri** (A2, A3): `content/tr/` ve `content/ar/` altındaki 14 dosya yer tutucu. Gelince frontmatter'da `reviewed: true` ve `reviewer` doldurulacak.
- [ ] **Arapça arayüz metinleri** (A4): Bölüm 12'deki 52 anahtar birebir kullanıldı. Brifte olmayan, eklenen 24 anahtar da Arapça kontrolüne girmeli: `language_tr`, `language_ar`, `referral_step_of`, `referral_step2_title`, `referral_step3_title`, `service_city_online`, `service_hours`, `service_languages`, `service_phone`, `service_types`, `assistant_label`, `you_label`, `chat_region_label`, `message_input_label` (son dördü yalnızca ekran okuyucular için) ve 10 il adı `city_*` (Ayşenur'un önerdiği Arapça karşılıklar kullanıldı: أنقرة, إسطنبول, إزمير, غازي عنتاب, هاتاي, شانلي أورفا, أضنة, مرسين, قونية, قيصري).
- [x] **Anahtar kelime listesi** (A5): 9 Kasım'da onaylandı ve uygulandı: "beni evlendir", "evlendirecek", "سيزوجونني" yüksek listeye eklendi; "يريدون تزويجي" ortadan yükseğe taşındı. Arapça kısmı gözden geçirici onayına tabi (kontrol tablosunda).
- [x] **Acil numaralar** (A6): 9 Kasım düzeltmeleri uygulandı: ALO 183 adı "Şiddetle Mücadele Hattı", 7/24, WhatsApp 0501 183 0 183 (kartta wa.me bağlantısı), TR/AR/KU; YİMER 157 açıklaması (acil 7/24, bilgi hattı hafta içi 08–18, Arapça ve Farsça); KADES 11 dil. Arapça açıklamalar taslak, kontrol tablosunda.
- [ ] **Node sürümü**: `package.json` brife göre `>=24` diyor; geliştirme ve testler Node 22.23 ile yapıldı, 24'te ayrıca doğrulanmalı (Vercel'de 24.x seçilecek).
- [ ] **Demo alan adı**: Vercel adresi yeterli mi?
- [x] **Deploy sahibi** (Bölüm 16): Karar: deploy'u Enes yapacak; Vercel hesabı VersHub adına, Ayşenur ekleyecek. İlk deploy içerik beklenmeden yer tutucu metinle yapılacak.
- [ ] **Onaylı metin takvimi**: Türkçe 7 metin 9 Kasım gecesi, Arapça 10 Kasım akşamı. Arapça gelene kadar Türkçe onaylı metnin makine çevirisi `reviewed: false` olarak konacak ve README listesinde kalacak.
- [ ] **main'e birleştirme**: Başvurudan önce `feat/demo-prototype` → `main` merge edilecek (repo public).
- [ ] **Pitch videosu**: 2 dakika, ekibin kendi sesi ve kamera görüntüsü şart, yapay zekâ üretimi ses/görüntü yok; çekim zamanı belirlenecek.
- [ ] **npm audit**: üretim bağımlılıklarında açık yok; ESLint'in geliştirme araçlarında (`minimatch`) bir orta seviye uyarı var, pakete girmiyor. `eslint-config-next` yeni sürümü çıkınca güncellenecek.
- [x] **Dil değiştirme sohbet sırasında**: Ayşenur'un kararı uygulandı: geçmiş korunur, sonraki yanıtlar yeni dilde gelir, karşılama mesajı yeniden gösterilmez.
- [ ] **Sohbet başlığındaki "Dili değiştir"** tek tıkla TR↔AR geçiş yapıyor (yalnızca iki dil olduğu için). Farsça eklenirse menüye dönüştürülecek.
- [ ] **GitHub hesabı** (A9): Kod şimdilik geliştiricinin hesabında; VersHub organizasyonuna transfer edilecek mi?
