<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
);
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"));
</script>

<template>
  <section class="px-14 lg:px-24 flex flex-col gap-10">
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl mb-12" :style="{ color: textColor }">
        عن التطبيق
      </h1>
      <ul class="space-y-3 text-base md:text-lg leading-relaxed text-justify mx-auto list-disc list-inside" :style="{ color: mutedColor }">
        <li>
          تطبيق القواسم: منصة رقمية رسمية مخصصة لعرض شجرة عائلة القواسم، وتقديم بيانات نسب معتمدة من الجهات الرسمية المعنية بالمحتوى.
        </li>
        <li>
          المستخدم: أي فرد يقوم باستخدام التطبيق أو تصفح محتواه.
        </li>
        <li>
          الجهات الرسمية المعنية بالمحتوى: الجهات المخوّلة رسميًا باعتماد وتحديث المعلومات الخاصة بنسب القواسم وفروع العائلة.
        </li>
      </ul>
    </div>
  </section>
</template>
