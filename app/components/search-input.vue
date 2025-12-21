<script setup lang="ts">
const { isDark: isDarkMode } = useTheme();

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Open modal on input focus or click
const handleInputFocus = () => {
  openModal();
};

const handleInputClick = () => {
  openModal();
};
</script>

<template>
  <div class="relative">
    <!-- Trigger Input - just opens the modal -->
    <input
      type="text"
      placeholder="أبحث.."
      class="w-70 h-10 px-6 py-4 rounded-full border-2 font-normal text-lg transition-colors placeholder-gray-600 placeholder:font-normal bg-white text-black border-gray-200 focus:outline-none focus:border-gray-400 cursor-pointer"
      dir="rtl"
      readonly
      @focus="handleInputFocus"
      @click="handleInputClick"
    >
    <img
      src="/icons/search.svg"
      alt="Search"
      class="absolute left-6 top-1/2 transform -translate-y-1/2 w-[23px] h-[23px] opacity-60 pointer-events-none"
    >
    
    <!-- Search Modal -->
    <SearchModal
      v-model:is-open="isModalOpen"
      @close="closeModal"
    />
  </div>
</template>
