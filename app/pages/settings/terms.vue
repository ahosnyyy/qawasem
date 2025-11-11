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
        الشروط والأحكام
      </h1>
      <p class="text-base md:text-lg leading-relaxed text-justify mx-auto" :style="{ color: mutedColor }">
        يوافق المستخدم على شروط وأحكام الاتفاقية عند استخدام التطبيق ( "القواسم")، وفي حالة عدم الرضا عنه أو عن المحتويات يمكنه التوقف عن استخدامه. وتشمل هذه الشروط و الأحكام ما يلي:
      </p>

      <ol class="list-decimal list-inside text-base md:text-lg leading-relaxed text-justify mx-auto space-y-2" :style="{ color: mutedColor }">
        <li>
          إن محتويات وخصائص عمل ومميزات التطبيق كاملة (تتضمن على سبيل الذكر وليس الحصر كل المعلومات والخدمات والنصوص والصور والتصميم وغيرها) هي ملك للمنصة وفريق عملها ومزودي خدماتها، ومحمية دولياً من قبل قوانين الملكية الفكرية والنشر. تسمح هذه الاتفاقية للمستخدم استخدام التطبيق لأمور غير تجارية فقط، ولن تمنح التطبيق أي حقوق تتعلق بالتطبيق أو محتواه للمستخدم، وتحتفظ ادارة التطبيق بكامل حقوق ملكيتها للموقع.
        </li>
        <li>
          يتوجب على المستخدم عدم إعادة إنتاج أو توزيع أو تعديل أو إنشاء أعمال من محتويات التطبيق، وعدم عرضه علانية أو تحميل أو نقل أو تخزين أي مواد من محتوياته.
        </li>
        <li>
          يتوجب على المستخدم عدم العبث أو حذف العلامات التجارية أو علامات الملكية أو أي دلائل عن الملكية الفكرية من نسخ المواد المأخوذة من التطبيق.
        </li>
        <li>
          يتوجب على المستخدم عدم الدخول إلى التطبيق واستخدامه أو استخدام أي جزء منه أو من محتوياته وخدماته في أغراض تجارية.
        </li>
        <li>
          يتوجب على المستخدم عدم استخدام اسم التطبيق وشعارها وكل ما يتعلق بها من أسماء وشعارات ومنتجات وخدمات وتصميم، فهي ملك للمنصة أو للشركات التابعة لها أو الجهات المرخصة لها.
        </li>
      </ol>
    </div>
  </section>
</template>