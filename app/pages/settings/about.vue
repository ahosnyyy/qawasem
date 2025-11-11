<script setup lang="ts">
const colorMode = useColorMode()
const appConfig = useAppConfig()

const isDark = computed(() => colorMode.value === "dark")
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
        عن التطبيق
      </h1>
      <p class="text-base md:text-lg leading-relaxed text-justify mx-auto" :style="{ color: mutedColor }">
        التطبيق قائم علي تاريخ ونسب عائلة القواسم ، والسير الذاتية لكل من شيوخها وافرادها وعلاقات النسب القائمة داخل وبين افراد العائلة حتي الوصول الي  نسب سيدنا علي بن ابي طالب رضي الله عنه وارضاه..... التطبيق مناسب لكل من انظمة الاندرويد وال IOS بمنتهي الدقه والكفاءه. بتحميلك التطبيق ستحصل علي تجربة فريدة من نوعها ومميزه للوصول الي تفاصيل ومعلومات صحيحه عن افراد وتاريخ ونسب القواسم
      </p>
    </div>
  </section>
</template>


