<script setup lang="ts">
const { isDark } = useTheme();

const treeImage = computed(() => {
  return isDark.value ? '/images/tree-dark.jpg' : '/images/tree.png'
})

// Function to download the family tree PDF
const downloadFamilyTree = () => {
  const link = document.createElement('a')
  link.href = '/books/family-tree.pdf'
  link.download = 'family-tree.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-10">
      <!-- Download Button - Centered with tree on md, fixed on lg -->
      <ClientOnly>
        <button
          @click="downloadFamilyTree"
          class="self-center md:self-end md:-mt-32 mb-12 md:mb-24 bg-[#4A2E1E] hover:scale-105 text-[#F1C687] px-6 py-2 rounded-full transition-smooth z-[130]"
        >
          <span>تحميل الشجرة الحائطية PDF</span>
        </button>
        <template #fallback>
          <div class="self-center md:self-end md:-mt-32 mb-12 md:mb-24 bg-[#4A2E1E] text-[#F1C687] px-6 py-2 rounded-full z-[130]">
            <span>تحميل الشجرة الحائطية PDF</span>
          </div>
        </template>
      </ClientOnly>
      
      <div class="relative w-full md:w-[70%] lg:w-[48%] flex justify-center lg:-mt-10">
        <!-- Theme-aware tree image -->
        <img 
          :src="treeImage" 
          alt="شجرة القواسم" 
          class="w-full h-auto object-contain"
        />
        
        <img 
          src="/logo.svg" 
          alt="جذر الشجرة" 
          class="absolute top-[78%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-auto max-w-[25%] z-10"
        />
      </div>
    </div>
  </div>
</template>
