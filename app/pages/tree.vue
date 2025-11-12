<template>
  <div>
    <div class="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-10">
      <!-- Download Button - Centered with tree on md, fixed on lg -->
      <button
        class="self-center mb-6 md:mb-8 lg:fixed lg:top-40 lg:left-24 lg:mb-0 bg-[#4A2E1E] hover:scale-105 text-[#F1C687] px-6 py-2 rounded-full transition-all duration-300 lg:z-[130]"
      >
        <span>تحميل الشجرة الحائطية PDF</span>
      </button>
      
      <div class="relative w-full md:w-[70%] lg:w-[48%] flex justify-center lg:-mt-10">
        <!-- Light mode tree -->
        <img 
          src="/images/tree.png" 
          alt="شجرة القواسم" 
          class="w-full h-auto object-contain"
        />
        
        <!-- Tree root overlay at 2/3 from top 
        <img 
          src="/images/tree-root.svg" 
          alt="جذر الشجرة" 
          class="absolute top-[66.67%] left-1/2 transform -translate-x-1/3 -translate-y-1/2 w-auto h-auto max-w-[20%] z-10"
        />
        -->
      </div>
    </div>
  </div>
</template>
