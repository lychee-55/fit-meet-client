<template>
  <div class="h-auto p-6 sm:p-6 flex justify-center">
    <div class="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 sm:p-8">
      <div class="mb-3">
        <button
          @click="goBackToDashboard"
          class="flex items-center text-gray-600 hover:text-[#8A8F6E] transition font-medium"
        >
          <ArrowLeftIcon class="w-5 h-5 mr-1" />
          <span>이전</span>
        </button>
      </div>

      <HandleSubmitDietForm :mode="creationMethod" />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HandleSubmitDietForm from '@/components/diet/formElements/HandleSubmitDietForm.vue';

const router = useRouter();
const route = useRoute();

/**
 * URL 매개변수에서 현재 식단 작성 모드를 가져옵니다.
 * 'manual' 또는 'public-api' 값을 가집니다.
 */
const creationMethod = computed(() => route.params.method);

/**
 * 대시보드 화면으로 돌아갑니다.
 */
const goBackToDashboard = () => {
  router.push({ name: 'dashBoard' });
};
</script>

<style scoped>
/* 페이지 스타일 */
</style>
