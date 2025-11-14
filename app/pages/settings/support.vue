<script setup lang="ts">
const { isDark } = useTheme()
const appConfig = useAppConfig()
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
)
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"))

</script>

<template>
  <section class="px-14 lg:px-24 flex flex-col gap-10">
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl mb-12" :style="{ color: textColor }">
        الدعم الفني
      </h1>
      <p class="text-base md:text-lg leading-relaxed text-center mx-auto" :style="{ color: mutedColor }">
        يسعدنا خدمتكم علي مدار الساعه وتلقي اسئلتكم واستفساراتكم علي البريد الالكتروني التالي :
        <span class="block my-4 font-family-['Inter']" :style="{ color: textColor }">Info@mahmoudasr.com</span>
      </p>
    </div>
  </section>
</template>