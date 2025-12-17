<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-20 transition-opacity"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all"
    >
      <h3 class="text-xl font-bold text-gray-800 text-center mb-6">
        식단 등록 옵션 선택
      </h3>

      <div class="space-y-4">
        <button
          @click="selectOption('manual')"
          class="w-full flex items-center justify-center p-4 bg-[#8A8F6E] text-white font-semibold rounded-lg hover:bg-[#6e7256] transition-colors shadow-md"
        >
          <PencilSquareIcon class="w-6 h-6 mr-3" />
          <span>식단 직접 입력</span>
        </button>

        <button
          @click="selectOption('public-api')"
          class="w-full flex items-center justify-center p-4 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-md border border-gray-300"
        >
          <MagnifyingGlassIcon class="w-6 h-6 mr-3" />
          <span>음식 검색으로 추가</span>
        </button>
      </div>

      <div class="mt-6 text-center">
        <button
          @click="closeModal"
          class="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline';
import { defineProps, defineEmits } from 'vue';

// Props: 모달의 가시성 제어
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

// Emits: 부모 컴포넌트에 상태 변경 및 옵션 선택 전달
const emit = defineEmits(['update:isVisible', 'selectOption']);

/**
 * 모달을 닫고 부모 컴포넌트에 상태 변경을 알립니다.
 */
const closeModal = () => {
  emit('update:isVisible', false);
};

/**
 * 옵션을 선택하고 부모 컴포넌트에 옵션 타입과 함께 모달 닫힘을 알립니다.
 * @param {string} optionType - 'direct' 또는 'search'
 */
const selectOption = optionType => {
  emit('selectOption', optionType);
  closeModal();
};
</script>

<style scoped>
/* Tailwind CSS를 사용하고 있으므로 별도의 스타일은 필요하지 않습니다. */
</style>
