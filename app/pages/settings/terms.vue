<script setup lang="ts">
const { isDark } = useTheme();
const appConfig = useAppConfig();
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
);
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"));

type ListItem = string | { text: string; children?: string[] };

type TermsContent
  = | { type: "paragraph"; text: string }
    | { type: "heading"; text: string }
    | { type: "list"; items: ListItem[] };

const termsContent: TermsContent[] = [
  { type: "heading", text: "1. باستخدامك للتطبيق، فإنك توافق بشكل كامل على جميع الشروط الواردة أدناه." },
  { type: "heading", text: "2. طبيعة الخدمة" },
  { type: "paragraph", text: "يوفّر تطبيق القواسم:" },
  {
    type: "list",
    items: [
      "عرضًا تفاعليًا لشجرة العائلة.",
      "معلومات نسب معتمدة رسميًا.",
      "بيانات عامة ضمن قسم البيانات المفتوحة.",
    ],
  },
  { type: "paragraph", text: "ولا يقدّم التطبيق خدمات تعديل المحتوى أو إضافة بيانات من المستخدمين." },
  { type: "heading", text: "3. نطاق الاستخدام" },
  { type: "paragraph", text: "يُسمح باستخدام التطبيق للأغراض التالية:" },
  {
    type: "list",
    items: [
      "الاطلاع على شجرة العائلة وفروعها.",
      "الاستخدام الشخصي أو المعرفي.",
      "الاستفادة من البيانات المفتوحة ضمن الضوابط المحددة.",
    ],
  },
  { type: "paragraph", text: "ويُمنع استخدام التطبيق في:" },
  {
    type: "list",
    items: [
      "تقديم بيانات غير رسمية أو رفع معلومات مخالفة.",
      "أي نشاط يتسبب في الإضرار بالتطبيق أو محتواه.",
      "إعادة نشر البيانات بصورة تتعارض مع هذه الشروط.",
    ],
  },
  { type: "heading", text: "4. دقة المعلومات واعتماد المحتوى" },
  {
    type: "list",
    items: [
      {
        text: "يعتمد التطبيق على مؤلفات صاحب السمو الشيخ الدكتور سلطان بن محمد القاسمي:",
        children: [
          "القول الحاسم في نسب القواسم",
          "التذكرة بالأرحام",
        ],
      },
      "تتم مراجعة وتحديث المعلومات فقط من قبل الجهات الرسمية المعنية بالمحتوى.",
      "لا تتحمل المنصة مسؤولية أي معلومات متداولة خارج التطبيق تخالف المحتوى الرسمي.",
    ],
  },
  { type: "heading", text: "5. تحديث البيانات" },
  {
    type: "list",
    items: [
      "لا يتيح التطبيق حاليًا للمستخدمين طلب تعديل بيانات أو إضافة أفراد.",
      "تتم جميع التحديثات عبر منظومة رسمية داخلية، بعد مراجعة علمية دقيقة.",
      "يحتفظ التطبيق بحق تحديث المحتوى في أي وقت دون إشعار مسبق.",
    ],
  },
  { type: "heading", text: "6. البيانات المفتوحة" },
  {
    type: "list",
    items: [
      "يتيح التطبيق بيانات عامة وغير شخصية فقط.",
      "تخضع البيانات المفتوحة لسياسة استخدام محددة تمنع إساءة الاستخدام أو إعادة النشر بصيغة مضللة.",
      "لا تشمل البيانات المفتوحة أي صور أو مواد فيلمية.",
    ],
  },
  { type: "heading", text: "7. الخصوصية وحماية البيانات" },
  {
    type: "list",
    items: [
      "لا يجمع التطبيق أي معلومات شخصية حساسة عن المستخدمين.",
      "يتم عرض البيانات العامة فقط المتعلقة بالنسب.",
      "تلتزم المنصة بحماية أي بيانات يتم تداولها وفقًا للمعايير الرسمية.",
      "لا تُشارك البيانات مع أي جهة خارجية إلا وفق المتطلبات النظامية.",
    ],
  },
  { type: "heading", text: "8. الملكية الفكرية" },
  {
    type: "list",
    items: [
      "جميع المحتويات الواردة في التطبيق متضمنة (  النصوص، البيانات، التصميم، والأسماء ) مملوكة رسميًا للجهات المعنية ، وكذلك البيانات المفتوحة من الكتب والمنشورات العلمية ، وملكية وحقوق المؤلف للكتب الصادرة من منشورات القاسمي.",
      "يمنع نسخ أو إعادة استخدام أي جزء من محتوى التطبيق دون إذن رسمي.",
      "تعتمد المعلومات على المصادر العلمية الرسمية ولا يجوز تعديلها أو إعادة تفسيرها دون سند معتمد.",
    ],
  },
  { type: "heading", text: "9. مسؤولية الاستخدام" },
  {
    type: "list",
    items: [
      "يوفر التطبيق معلومات رسمية موثوقة، لكنه غير مسؤول عن أي استخدام للمحتوى خارج سياقه.",
      "لا يتحمل أي تفسير غير معتمد للمعلومات المنشورة.",
      "لا يعتمد بيانات غير رسمية أو غير صادرة عن الجهات الرسمية.",
      "يتحمل المستخدم كامل المسؤولية عن أي استخدام يخالف هذه الشروط.",
    ],
  },
  { type: "heading", text: "10. المسؤولية التقنية" },
  {
    type: "list",
    items: [
      "يبذل التطبيق كل الجهود لضمان عمله بكفاءة.",
      "لا يضمن عدم حدوث توقفات أو أعطال.",
      "لا يضمن عمل التطبيق بشكل مثالي في جميع الأجهزة أو الشبكات.",
      "لا تتحمل المنصة أي مسؤولية عن أي ضرر ينتج عن أعطال تقنية خارجة عن الإرادة.",
    ],
  },
  { type: "heading", text: "11. التعديلات على الشروط والأحكام" },
  {
    type: "list",
    items: [
      "تحتفظ الجهة المشغّلة للتطبيق بحق تعديل هذه الشروط في أي وقت.",
      "يُعد استمرار المستخدم في استخدام التطبيق بعد التعديل قبولًا ضمنيًا بالشروط الجديدة.",
      "يتم الإعلان عن التعديلات داخل التطبيق.",
    ],
  },
  { type: "heading", text: "12. الإشعارات الرسمية" },
  {
    type: "list",
    items: [
      "تُرسل الإشعارات المتعلقة بالتحديثات أو السياسات عبر إشعارات التطبيق.",
      "تُنشر التحديثات عبر صفحة وروابط التحديثات.",
    ],
  },
  { type: "heading", text: "13. جهة الاعتماد والمصدر الرسمي" },
  {
    type: "list",
    items: [
      "جميع المعلومات الواردة في التطبيق تعتمد رسميًا من الجهات الرسمية المعنية بالمحتوى.",
      "يعتمد التطبيق على المصادر العلمية الرسمية المذكورة أعلاه.",
      "ولا يتم اعتماد أي معلومات إلا عبر القنوات الرسمية.",
    ],
  },
  { type: "heading", text: "14. قبول الشروط" },
  {
    type: "list",
    items: [
      "باستخدام التطبيق، فإن المستخدم يقرّ بأنه قد قرأ وفهم جميع البنود، ويوافق على الالتزام بها.",
    ],
  },
];
</script>

<template>
  <section class="px-14 lg:px-24 flex flex-col gap-10 pb-16">
    <div class="space-y-6 text-center">
      <h1 class="text-2xl md:text-3xl" :style="{ color: textColor }">
        الشروط والأحكام
      </h1>
    </div>

    <div class="space-y-6">
      <template v-for="(block, index) in termsContent" :key="index">
        <h2
          v-if="block.type === 'heading'"
          class="text-lg md:text-xl tracking-tight text-right"
          :style="{ color: textColor }"
        >
          {{ block.text }}
        </h2>
        <p
          v-else-if="block.type === 'paragraph'"
          class="text-base md:text-lg leading-relaxed text-justify"
          :style="{ color: mutedColor }"
        >
          {{ block.text }}
        </p>
        <ul
          v-else
          class="list-disc list-inside pr-8 text-base md:text-lg leading-relaxed text-justify space-y-2"
          :style="{ color: mutedColor }"
        >
          <li v-for="item in block.items" :key="typeof item === 'string' ? item : item.text">
            <template v-if="typeof item === 'string'">
              {{ item }}
            </template>
            <template v-else>
              {{ item.text }}
              <ul
                v-if="item.children?.length"
                class="list-disc list-inside pr-8 text-base md:text-lg leading-relaxed text-justify space-y-1 mr-4"
                :style="{ color: mutedColor }"
              >
                <li v-for="child in item.children" :key="child">
                  {{ child }}
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </template>
    </div>
  </section>
</template>
