<template>
  <div>
    <button
      v-show="showTopButton"
      @click="scrollToTop"
      class="hidden fixed bottom-10 right-10 z-50 p-4 bg-[#8A8F6E] text-white rounded-full shadow-2xl border border-gray-100 hover:bg-[#8A8F6E] hover:text-white transition-all duration-300 group lg:block"
    >
      <ChevronUpIcon
        class="w-6 h-6 group-hover:-translate-y-1 transition-transform"
      />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ChevronUpIcon } from '@heroicons/vue/24/outline';
const showTopButton = ref(false);

const handleScroll = () => {
  const currentScroll = window.scrollY;
  showTopButton.value = currentScroll > 100;
};
// 최상단으로 부드럽게 이동
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped></style>
