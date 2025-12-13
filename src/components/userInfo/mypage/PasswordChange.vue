<template>
  <div class="p-4 border border-gray-100 rounded-lg bg-white">
    <h3 class="text-xl font-semibold text-gray-700 mb-4">비밀번호 변경</h3>
    <p class="text-sm text-gray-500 mb-6">
      보안을 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.
    </p>

    <form class="space-y-4">
      <div>
        <label for="current-pw" class="block text-sm font-medium text-gray-700"
          >현재 비밀번호</label
        >
        <input
          type="password"
          id="current-pw"
          v-model="currentPassword"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label for="new-pw" class="block text-sm font-medium text-gray-700"
          >새 비밀번호</label
        >
        <input
          type="password"
          id="new-pw"
          v-model="newPassword"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label for="confirm-pw" class="block text-sm font-medium text-gray-700"
          >새 비밀번호 확인</label
        >
        <input
          type="password"
          id="confirm-pw"
          v-model="confirmPassword"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition"
      >
        비밀번호 변경
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
</script>
