<template>
  <div
    class="p-6 max-w-3xl mx-auto border border-red-100 rounded-lg bg-red-50 mb-6 my-4"
  >
    <h3 class="text-xl font-semibold text-red-700 mb-4">회원 탈퇴</h3>
    <p class="text-sm text-red-600 mb-6">
      경고: 회원 탈퇴 시 모든 계정 정보와 데이터가 영구적으로 삭제되며 복구할 수
      없습니다.
    </p>

    <div class="space-y-4">
      <div>
        <label
          for="deletion-reason"
          class="block text-sm font-medium text-red-700"
          >탈퇴 사유</label
        >
        <textarea
          id="deletion-reason"
          rows="3"
          v-model="reason"
          class="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-500 focus:ring-red-500"
        ></textarea>
      </div>

      <div class="flex items-center">
        <input
          id="confirm-check"
          type="checkbox"
          v-model="isConfirmed"
          class="h-4 w-4 text-red-600 border-red-300 rounded focus:ring-red-500"
        />
        <label for="confirm-check" class="ml-2 block text-sm text-red-700">
          위 내용을 확인했으며, 계정 탈퇴에 동의합니다.
        </label>
      </div>

      <button
        @click="handleDeletion"
        :disabled="!isConfirmed"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        회원 탈퇴 처리
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/Auth';
import { ref } from 'vue';

const reason = ref('');
const isConfirmed = ref(false);
const store = useAuthStore();

const handleDeletion = () => {
  if (isConfirmed.value) {
    store.signout();
  }
};
</script>
