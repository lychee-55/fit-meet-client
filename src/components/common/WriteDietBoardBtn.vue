<template>
  <button
    @click="modalStore.openWriteModal()"
    class="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 z-40 transform hover:scale-105 z-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4"
      />
    </svg>
    <span class="hidden md:inline ml-2 text-base font-medium"
      >식단 작성하기</span
    >
  </button>
</template>

<script setup>
import { useModalStore } from '@/stores/modal'; // 💡 스토어 임포트

const modalStore = useModalStore();
// 이제 이 버튼은 상위 컴포넌트에서 이벤트를 받을 필요 없이,
// 직접 모달 스토어를 조작하여 모달을 엽니다.
</script>
