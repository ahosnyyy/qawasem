<script setup lang="ts">
const { isDark } = useTheme()
const appConfig = useAppConfig()
const textColor = computed(() =>
  isDark.value
    ? (appConfig.theme?.colors?.text?.dark || "#D9B27A")
    : (appConfig.theme?.colors?.text?.light || "#4A2E1E"),
)
const mutedColor = computed(() => (isDark.value ? "#b09775" : "#7A5B3F"))

const activeTab = ref<'ar' | 'en'>('ar')

const privacyCategoriesAr = [
  {
    "title": "مقدمة",
    "sections": [
      {
        "label": "",
        "items": [
          "توضح هذه السياسة كيفية قيام تطبيق القواسم بجمع واستخدام وحماية المعلومات التي يقدّمها مستخدمو الموقع والتطبيق الإلكتروني (ويُشار إلى كلٍّ منهم بـ \"المستخدم\").",
          "تسري هذه السياسة على التطبيق وجميع الخدمات المرتبطة به، ويتم استخدام المعلومات المقدَّمة من المستخدم فقط وفقًا للأحكام الواردة فيها.",
          "قد يتم تحديث هذه السياسة عند الحاجة، وتُعد النسخة المنشورة آخر نسخة معتمدة.",
          "تشير مفردة \"نحن\" في هذا السياق إلى إدارة تطبيق القواسم."
        ]
      }
    ]
  },
  {
    "title": "جمع البيانات",
    "sections": [
      {
        "label": "",
        "items": [
          "يجمع تطبيق القواسم بيانات معينة عن الأفراد عند استخدام الموقع أو التطبيق أو عند التسجيل أو الاشتراك في النشرات البريدية أو تعبئة النماذج.",
          "تشمل هذه البيانات – دون حصر – ما يلي:",
          "اسم المستخدم.",
          "معلومات الاتصال مثل البريد الإلكتروني ورقم الهاتف.",
          "عنوان السكن.",
          "بيانات استخدام الموقع والتطبيق، بما في ذلك الصفحات التي تتم زيارتها وطريقة التفاعل معها.",
          "ويجري جمع هذه البيانات بالقدر اللازم لتقديم الخدمة وتحسين تجربة المستخدم."
        ]
      }
    ]
  },
  {
    "title": "استخدام البيانات",
    "sections": [
      {
        "label": "",
        "items": [
          "يساعد جمع البيانات على فهم احتياجات المستخدمين وتحسين جودة الخدمات المقدّمة من خلال الموقع والتطبيق.",
          "قد تُستخدم البيانات الشخصية للأغراض التالية:",
          "تحديث السجلات الداخلية.",
          "التواصل مع المستخدم للرد على الاستفسارات أو الملاحظات أو الشكاوى.",
          "إرسال رسائل بريد إلكتروني ترويجية حول المناسبات أو العروض أو أي محتوى يُعتقد أنه مناسب للمستخدم.",
          "تنفيذ الحملات التسويقية والمسابقات والاستطلاعات أو أي ميزات أخرى يوفّرها الموقع أو التطبيق.",
          "لا يتم استخدام البيانات لأي غرض غير مذكور إلا بموافقة المستخدم أو بحسب ما يقتضيه القانون."
        ]
      }
    ]
  },
  {
    "title": "ملفات تعريف الارتباط (Cookies)",
    "sections": [
      {
        "label": "",
        "items": [
          "يستخدم الموقع والتطبيق ملفات تعريف الارتباط لتخزين تفضيلات المستخدم، وتقديم محتوى وخيارات مخصّصة، وقياس عدد مستخدمي الموقع والصفحات الأكثر زيارة.",
          "يتم تخزين هذه الملفات في جهاز المستخدم للأغراض التالية:",
          "تحسين الأداء وسهولة التصفح.",
          "تتبع التفاعل مع الصفحات والميزات المختلفة.",
          "تخصيص محتوى يظهر للمستخدم بناءً على اهتماماته.",
          "ويمكن للمستخدم رفض ملفات تعريف الارتباط أو ضبط تنبيه عند إرسالها من خلال إعدادات المتصفح. غير أن تعطيلها قد يؤدي إلى قصور في أداء بعض وظائف الموقع أو التطبيق."
        ]
      }
    ]
  },
  {
    "title": "الروابط الخارجية",
    "sections": [
      {
        "label": "",
        "items": [
          "قد يتضمن الموقع أو التطبيق روابط لمواقع إلكترونية أخرى لا تخضع لإدارة تطبيق القواسم.",
          "ولا تتحمّل الإدارة أي مسؤولية تجاه محتوى تلك المواقع أو ممارساتها الخاصة بالخصوصية.",
          "وينبغي على المستخدم قراءة سياسات الخصوصية العائدة لتلك المواقع قبل تقديم أي بيانات شخصية."
        ]
      }
    ]
  },
  {
    "title": "قبول السياسة",
    "sections": [
      {
        "label": "",
        "items": [
          "يُعدّ استخدام الموقع أو التطبيق موافقة كاملة وصريحة من المستخدم على هذه السياسة.",
          "وفي حال عدم قبول أي من بنودها، يرجى التوقف عن استخدام الموقع أو التطبيق."
        ]
      }
    ]
  }
]

const privacyCategoriesEn = [
  {
    "title": "Introduction",
    "sections": [
      {
        "label": "",
        "items": [
          "This Privacy Policy explains how the Al Qawasim Application collects, uses, and protects the information provided by users of the website and mobile application (each referred to as a \"User\").",
          "This policy applies to the application and all services offered through its website and mobile platform.",
          "By providing information while using the website or application, you agree that such information will be handled in accordance with this Policy.",
          "The Policy may be updated from time to time, and the most recent version shall be deemed the official one.",
          "The terms \"we,\" \"us,\" and \"our\" refer to the Al Qawasim Application Administration."
        ]
      }
    ]
  },
  {
    "title": "Data Collection",
    "sections": [
      {
        "label": "",
        "items": [
          "The Al Qawasim Application may collect specific information about Users through various interactions, including when visiting the website or application, registering an account, subscribing to newsletters, completing forms, or engaging with provided services.",
          "The data collected may include, without limitation:",
          "Username",
          "Contact information such as email address and phone number",
          "Residential address",
          "Usage data related to website and application interaction, including visited pages and engagement patterns",
          "Such data is collected only to the extent necessary for service delivery and to enhance the User experience."
        ]
      }
    ]
  },
  {
    "title": "How We Use the Collected Data",
    "sections": [
      {
        "label": "",
        "items": [
          "The data we collect helps us better understand how Users interact with our platform and enables us to improve the quality, responsiveness, and relevance of our services.",
          "Personal data may be used for the following purposes:",
          "Updating internal records",
          "Communicating with the User to respond to inquiries, feedback, or complaints",
          "Sending promotional emails regarding new events, offers, or content deemed relevant to the User",
          "Conducting marketing campaigns, competitions, surveys, or enabling any other features offered by the platform",
          "Data will not be used for any additional purposes without the User's consent unless required by law."
        ]
      }
    ]
  },
  {
    "title": "Cookies and Tracking Technologies",
    "sections": [
      {
        "label": "",
        "items": [
          "The website and application use cookies and similar technologies to:",
          "Store User preferences and deliver customized content or functionality",
          "Improve navigation speed and overall performance",
          "Identify visitor numbers and determine frequently visited pages",
          "Cookies may be stored on the User's device for record-keeping and analytical purposes.",
          "Users may choose to disable cookies or receive notifications when cookies are sent by adjusting browser settings; however, doing so may limit the proper functioning of certain website or application features."
        ]
      }
    ]
  },
  {
    "title": "Third-Party Websites",
    "sections": [
      {
        "label": "",
        "items": [
          "The website and application may contain links to external websites.",
          "We do not control these external sites and are not responsible for their content, privacy practices, or data handling methods.",
          "Users are advised to review the privacy policies of any external websites before providing personal information."
        ]
      }
    ]
  },
  {
    "title": "Acceptance of this Policy",
    "sections": [
      {
        "label": "",
        "items": [
          "By accessing or using the website or application, the User expressly agrees to this Privacy Policy in full.",
          "If the User does not accept the terms outlined herein, they are advised to discontinue the use of the website or application."
        ]
      }
    ]
  }
]

const privacyCategories = computed(() => activeTab.value === 'ar' ? privacyCategoriesAr : privacyCategoriesEn)
const pageTitle = computed(() => activeTab.value === 'ar' ? 'سياسة الخصوصية – تطبيق القواسم' : 'Privacy Policy – Al Qawasim Application')

</script>

<template>
  <section class="px-14 lg:px-24 flex flex-col gap-10 pb-16">
    <div class="text-center">
      <h1 class="text-2xl md:text-3xl mb-8" :style="{ color: textColor }">
        {{ pageTitle }}
      </h1>
      
      <!-- Language Tabs -->
      <div class="flex justify-center gap-4 mb-12">
        <button
          @click="activeTab = 'ar'"
          :class="[
            'px-6 py-2 rounded-2xl transition-all duration-300 text-base md:text-lg',
            activeTab === 'ar' 
              ? 'bg-[#BE9E77] text-[#5E402D] font-medium' 
              : 'bg-transparent border border-[rgba(241,198,135,0.17)] hover:bg-[rgba(241,198,135,0.1)]'
          ]"
          :style="activeTab !== 'ar' ? { color: textColor } : {}"
        >
          العربية
        </button>
        <button
          @click="activeTab = 'en'"
          :class="[
            'px-6 py-2 rounded-2xl transition-all duration-300 text-base md:text-lg',
            activeTab === 'en' 
              ? 'bg-[#BE9E77] text-[#5E402D] font-medium' 
              : 'bg-transparent border border-[rgba(241,198,135,0.17)] hover:bg-[rgba(241,198,135,0.1)]'
          ]"
          :style="activeTab !== 'en' ? { color: textColor } : {}"
        >
          English
        </button>
      </div>
      
      <div class="space-y-12 mt-12" :dir="activeTab === 'ar' ? 'rtl' : 'ltr'">
        <article v-for="category in privacyCategories" :key="category.title" class="space-y-6">
          <header class="text-center">
            <h2 class="text-lg md:text-xl tracking-tight" :style="{ color: textColor }">
              {{ category.title }}
            </h2>
            <span class="inline-block w-16 h-[1px]" :style="{ backgroundColor: mutedColor }" />
          </header>
          <div class="space-y-6">
            <section v-for="section in category.sections" :key="section.label || section.items[0]" class="space-y-2">
              <p
                v-if="section.label"
                class="text-base md:text-lg text-center md:text-start"
                :style="{ color: textColor }"
              >
                {{ section.label }}
              </p>
              <ol
                :class="[
                  'list-disc list-inside text-base md:text-lg leading-relaxed text-justify mx-auto space-y-2',
                  activeTab === 'ar' ? 'pr-8' : 'pl-8'
                ]"
                :style="{ color: mutedColor }"
              >
                <li v-for="item in section.items" :key="item">
                  {{ item }}
                </li>
              </ol>
            </section>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

