# نور — أذكار وأدعية

تطبيق عربي للأذكار والأدعية مبني بـ React وCapacitor. يعمل دون اتصال، ويدعم تنبيهات Android المجدولة وتحديثات الويب عبر OTA.

## التطوير والبناء

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npx cap sync android
```

افتح مشروع Android بعد ذلك باستخدام Android Studio أو ابنِه من مجلد `android`:

```bash
cd android
./gradlew assembleDebug
```

يتطلب بناء Android إصدار Java 21 وAndroid SDK 36.

## إعداد تحديثات OTA على Android

تستخدم تحديثات الويب الحية إضافة [Capgo Capacitor Updater](https://capgo.app/docs/plugins/updater/). لوحة الإعدادات تتيح التحقق يدويًا من الإصدار، تنزيله، ثم تثبيته وإعادة تشغيل التطبيق. تحديثات JavaScript/CSS/HTML فقط يمكن تسليمها عبر OTA؛ تغييرات Kotlin أو إضافات Android أو الأذونات تتطلب إصدارًا أصليًا جديدًا عبر المتجر.

لإعداد النشر:

1. أنشئ تطبيقًا في [Capgo](https://capgo.app/) باستخدام معرّف التطبيق `com.nour.adhkar`، وأنشئ قناة `production`.
2. أضف مفتاح Capgo إلى GitHub: **Settings → Secrets and variables → Actions → New repository secret**، باسم `CAPGO_TOKEN`.
3. ادفع التغييرات إلى الفرع `main`. بعد نجاح بناء Android، يرفع سير GitHub Actions الحزمة إلى قناة `production`. من دون السر، يتخطى السير العمل رفع OTA ويكمل بناء APK/AAB.
4. ابنِ وثبّت APK/AAB جديدًا مرة واحدة لإدراج إضافة Capgo الأصلية في نسخة التطبيق. بعد ذلك يمكن تسليم تحديثات الويب من داخل التطبيق دون تنزيل APK جديد.

لرفع حزمة يدويًا بعد إعداد التطبيق في Capgo:

```bash
npm run build
npx @capgo/cli@latest bundle upload --channel production
```

لا ترفع تحديثًا يغيّر الشيفرة الأصلية أو يطلب صلاحيات جديدة عبر OTA؛ استخدم إصدارًا جديدًا من التطبيق في المتجر لهذه التغييرات.
