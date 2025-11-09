<template>
  <div>
    <div class="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-10 lg:-mt-16">
      <!-- Download Button - Above tree on mobile, fixed on desktop -->
      <button
        class="self-center mb-6 mt-6 lg:fixed lg:top-34 lg:left-20 bg-[#4A2E1E] hover:scale-105 text-[#F1C687] px-6 py-3 rounded-full transition-all duration-300 lg:z-[130] flex items-center gap-2"
      >
        <span>PDF تحميل الشجرة الحائطية</span>
      </button>
      
      <div class="relative w-full lg:w-[50%] flex justify-center">
        <!-- Light mode tree -->
        <img 
          src="/images/tree-light.svg" 
          alt="شجرة القواسم" 
          class="w-full h-auto object-contain block dark:hidden"
        />
        <!-- Dark mode tree -->
        <img 
          src="/images/tree-dark.svg" 
          alt="شجرة القواسم" 
          class="w-full h-auto object-contain hidden dark:block"
        />
        
        <!-- Tree root overlay at 2/3 from top -->
        <img 
          src="/images/tree-root.svg" 
          alt="جذر الشجرة" 
          class="absolute top-[66.67%] left-1/2 transform -translate-x-1/3 -translate-y-1/2 w-auto h-auto max-w-[20%] z-10"
        />
      </div>
    </div>
  </div>
</template>
