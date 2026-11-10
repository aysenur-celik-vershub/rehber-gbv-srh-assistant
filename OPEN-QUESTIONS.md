# Açık sorular (Brif Bölüm 2.2)

Ayşenur'a iletilecek belirsizlikler. Karar verilince işaretlenip koda yansıtılacak.

- [x] **Ürün adı** (A1): 10 Kasım kararı: her iki dilde de "Wellspring". Sekme başlığı, açılış ekranı ve favicon güncellendi. Repo adı GitHub'da `wellspring-assistant` olarak değiştirilecek (eski adres otomatik yönlenir); yayın adresi nötr kalacak (ör. wellspring.vercel.app), adreste "gbv", "violence" gibi kelimeler geçmeyecek.
- [ ] **LLM sağlayıcısı ve model** (A7): Hesaplar VersHub adına açılacak (9 Kasım). İki aday model (Anthropic Claude Sonnet ve OpenAI'ın güncel orta seviye modeli) `scripts/compare-models.mjs` ile Test 4, 5, 6, 11, 7, 8 üzerinde karşılaştırılıp seçim birlikte yapılacak; Arapça kalitesi ve Test 7–8 belirleyici. Harcama limiti: aylık 50 USD. Sağlayıcının veri saklama politikası netleşince README "Privacy" bölümüne yazılacak.
- [ ] **Onaylı içerik metinleri** (A2, A3): 10 Kasım: `05-regl-ve-hijyen` Türkçe taslağı yerleştirildi (`reviewed: false`, Ayşenur hemşire olarak onaylayınca `true`), Arapçası makine çevirisi (`reviewed: false`). Kalan 6 metin bugün gelecek; GBV temel ve haklar metinlerine Eda (hukuk) da bakacak.
- [ ] **Arapça arayüz metinleri** (A4): Bölüm 12'deki 52 anahtar birebir kullanıldı. Brifte olmayan, eklenen 24 anahtar da Arapça kontrolüne girmeli: `language_tr`, `language_ar`, `referral_step_of`, `referral_step2_title`, `referral_step3_title`, `service_city_online`, `service_hours`, `service_languages`, `service_phone`, `service_types`, `assistant_label`, `you_label`, `chat_region_label`, `message_input_label` (son dördü yalnızca ekran okuyucular için) ve 10 il adı `city_*` (Ayşenur'un önerdiği Arapça karşılıklar kullanıldı: أنقرة, إسطنبول, إزمير, غازي عنتاب, هاتاي, شانلي أورفا, أضنة, مرسين, قونية, قيصري).
- [x] **Anahtar kelime listesi** (A5): 9 Kasım'da onaylandı ve uygulandı: "beni evlendir", "evlendirecek", "سيزوجونني" yüksek listeye eklendi; "يريدون تزويجي" ortadan yükseğe taşındı. Arapça kısmı gözden geçirici onayına tabi (kontrol tablosunda).
- [x] **Acil numaralar** (A6): 9 Kasım düzeltmeleri uygulandı: ALO 183 adı "Şiddetle Mücadele Hattı", 7/24, WhatsApp 0501 183 0 183 (kartta wa.me bağlantısı), TR/AR/KU; YİMER 157 açıklaması (acil 7/24, bilgi hattı hafta içi 08–18, Arapça ve Farsça); KADES 11 dil. Arapça açıklamalar taslak, kontrol tablosunda.
- [ ] **Node sürümü**: `package.json` brife göre `>=24` diyor; geliştirme ve testler Node 22.23 ile yapıldı, 24'te ayrıca doğrulanmalı (Vercel'de 24.x seçilecek).
- [ ] **Demo alan adı**: Vercel adresi yeterli mi?
- [x] **Deploy sahibi** (Bölüm 16): Karar: deploy'u Enes yapacak; Vercel hesabı VersHub adına, Ayşenur ekleyecek. İlk deploy içerik beklenmeden yer tutucu metinle yapılacak.
- [ ] **main'e birleştirme**: Başvurudan önce `feat/demo-prototype` → `main` merge edilecek (repo public).
- [ ] **Pitch videosu**: Ayşenur 11 Kasım'da çekecek (senaryo ve çekim listesi `docs/VIDEO-SHOTLIST.md`); Enes'ten beklenen: yayın adresinin o saatte çalışması, yüksek risk ve yönlendirme sahneleri için örnek veriler (hazır).
- [ ] **ROADMAP.md**: Öncelik değil; kısa sürüm eklendi.
- [ ] **npm audit**: üretim bağımlılıklarında açık yok; ESLint'in geliştirme araçlarında (`minimatch`) bir orta seviye uyarı var, pakete girmiyor. `eslint-config-next` yeni sürümü çıkınca güncellenecek.
- [x] **Dil değiştirme sohbet sırasında**: Ayşenur'un kararı uygulandı: geçmiş korunur, sonraki yanıtlar yeni dilde gelir, karşılama mesajı yeniden gösterilmez.
- [ ] **Sohbet başlığındaki "Dili değiştir"** tek tıkla TR↔AR geçiş yapıyor (yalnızca iki dil olduğu için). Farsça eklenirse menüye dönüştürülecek.
- [ ] **GitHub hesabı** (A9): Kod şimdilik geliştiricinin hesabında; VersHub organizasyonuna transfer edilecek mi?
