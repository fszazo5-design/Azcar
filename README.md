# Azcar

تطبيق عربي للأذكار والأدعية والقرآن الكريم.

## الواجهات المضافة

- **القرآن والتلاوات:** يستخدم [Al Quran Cloud API](https://alquran.cloud/api) لجلب السور، ويتيح التشغيل بأصوات عدة قراء. الصوت يُبث من شبكة CDN ولا يتم تنزيل المصحف كاملًا.
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

## إعداد التحديث الهوائي OTA على Android

يستخدم التطبيق إضافة [Capgo Capacitor Updater](https://capgo.app/docs/plugins/updater/) لتحديث ملفات الويب فقط دون تنزيل APK جديد. يجب تثبيت نسخة Android أصلية تحتوي على الإضافة مرة واحدة، ثم إعداد تطبيق Capgo بمعرّف `com.nour.adhkar` وقناة `production`.

لرفع تحديث: أضف السر `CAPGO_TOKEN` إلى GitHub Actions ثم ادفع إلى `main`. تغييرات JavaScript وCSS وHTML تدعم OTA، أما تغييرات Android أو الصلاحيات فتحتاج إصدار APK/AAB جديدًا.
