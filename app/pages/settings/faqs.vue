<script setup lang="ts">
const { isDark } = useTheme()
const appConfig = useAppConfig()
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
)
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"))

const faqs = [
  {
    q: "ما هو المستفاد من تطبيق القواسم ؟",
    a: " يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم  يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم"
  },
  {
    q: "هل يمكن تنزيل كتب القواسم ؟",
    a: " يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم  يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم"
  },
  {
    q: "هل متاح التواصل مباشرة مع افرد العائلة ؟",
    a: " يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم  يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم"
  },
  {
    q: "هل يمكن ضم افراد من خارج العائلة ؟",
    a: " يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم  يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم"
  },
  {
    q: "هل التطبيق ربحي ؟",
    a: " يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم  يوفر التطبيق إمكانية الوصول السريع إلى الخدمات والمعلومات الخاصه بعائلة القواسم ويمكن للمستخدمين تنفيذ مهام متعددة بالبحث واستخراج المعلومات الهامة لعائلة القواسم"
  }
]
</script>

<template>
  <section class="px-14 lg:px-24 flex flex-col">
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl mb-8 space-y-4" :style="{ color: textColor }">
        الاسئلة الشائعة
      </h1>

    </div>

    <!-- Simple line-spaced collapsible list -->
    <div>
      <details
        v-for="item in faqs"
        :key="item.q"
        class="group py-3 faq-item"
        :style="{
          '--faq-border': `${mutedColor}30`,
          '--faq-border-active': `${mutedColor}90`
        }"
      >
        <summary
          class="list-none cursor-pointer flex items-center justify-between gap-4 pb-3 border-b px-8"
          :style="{ borderColor: 'var(--faq-border)' }"
        >
          <span class="text-base md:text-lg" :style="{ color: textColor }">
            {{ item.q }}
          </span>
          <span
            class="w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 rotate-90 group-open:rotate-0"
            :style="{
              backgroundColor: textColor,
              WebkitMask: 'url(/icons/down.svg) center / contain no-repeat',
              mask: 'url(/icons/down.svg) center / contain no-repeat'
            }"
            aria-hidden="true"
          />
        </summary>
        <p class="mt-2 text-sm md:text-base leading-relaxed text-justify px-4" :style="{ color: mutedColor }">
          {{ item.a }}
        </p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq-item[open] > summary {
  border-color: var(--faq-border-active) !important;
}
</style>