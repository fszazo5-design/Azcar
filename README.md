# Azcar

تطبيق عربي للأذكار والأدعية والقرآن الكريم.

## الواجهات المضافة

- **القرآن والتلاوات:** يستخدم [Al Quran Cloud API](https://alquran.cloud/api) لجلب السور، ويتيح تشغيل كل آية بزر مستقل بأصوات عدة قراء. عند غياب رابط الصوت من API يُستخدم رابط CDN احتياطي.
- **أذكار الصباح والمساء:** يجلب البيانات من ملفات JSON المفتوحة في [muslimKit](https://ahegazy.github.io/muslimKit/json/)، مع الرجوع تلقائيًا إلى البيانات المحلية عند عدم توفر الإنترنت.
- **المعلومات الصحية والدينية:** أضيفت مكتبة محلية مختارة للتوعية، مع تنبيه واضح أنها لا تستبدل الطبيب أو المفتي. ويمكن ربط endpoint خارجي اختياري عبر `VITE_INFO_API_URL` إذا كان لديك API خاص.

## التشغيل

```bash
npm install
npm run dev
```

لربط API خارجي للمعلومات، أنشئ ملف `.env`:

```bash
VITE_INFO_API_URL=https://example.com/api/info
```

يقبل endpoint مصفوفة `LibraryCard[]` مباشرة أو كائنًا بالشكل `{ "data": [...] }`.

## الفحص والبناء

```bash
npm run typecheck
npm run lint
npm run build
```

## إصدارات Android والتنزيل

ملف `.github/workflows/build-android.yml` يبني التطبيق تلقائياً عند كل push إلى `main`، ويقوم عند دفع وسم بصيغة `v*` بإنشاء إصدار جديد في صفحة [Releases](https://github.com/fszazo5-design/Azcar/releases) وإرفاق:

- **APK debug موقّع تلقائياً:** مناسب للتثبيت المباشر والاختبار على الهاتف.
- **AAB release:** مناسب للرفع إلى Google Play بعد توقيعه بمفتاح النشر.

مثال لإنشاء إصدار جديد:

```bash
git tag v1.0.2
git push origin v1.0.2
```

وللحصول على AAB موقّع للإنتاج، أضف أسرار المستودع التالية في GitHub قبل دفع الوسم: `ANDROID_KEYSTORE_BASE64` و`ANDROID_KEYSTORE_PASSWORD` و`ANDROID_KEY_ALIAS` و`ANDROID_KEY_PASSWORD`. في حال عدم إضافتها سيظل الإصدار يُنشر، لكن AAB سيكون غير موقّع ويحتاج توقيعاً قبل Google Play.

## إعداد التحديث الهوائي OTA على Android

يستخدم التطبيق إضافة [Capgo Capacitor Updater](https://capgo.app/docs/plugins/updater/) لتحديث ملفات الويب فقط دون تنزيل APK جديد. يجب تثبيت نسخة Android أصلية تحتوي على الإضافة مرة واحدة، ثم إعداد تطبيق Capgo بمعرّف `com.nour.adhkar` وقناة `production`.

لرفع تحديث: أضف السر `CAPGO_TOKEN` إلى GitHub Actions ثم ادفع إلى `main`. تغييرات JavaScript وCSS وHTML تدعم OTA، أما تغييرات Android أو الصلاحيات فتحتاج إصدار APK/AAB جديدًا.
