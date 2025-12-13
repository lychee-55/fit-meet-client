<template>
  <div class="p-4 border border-gray-100 rounded-lg bg-white">
    <h3 class="text-xl font-semibold text-gray-700 mb-4">신체 정보 수정</h3>
    <p class="text-sm text-gray-500 mb-6">
      정확한 식단 및 운동 목표 설정을 위해 현재 체중과 키를 입력해주세요.
    </p>

    <form class="space-y-4">
      <div>
        <label for="height" class="block text-sm font-medium text-gray-700"
          >키 (cm)</label
        >
        <input
          type="number"
          id="height"
          v-model="height"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label for="weight" class="block text-sm font-medium text-gray-700"
          >체중 (kg)</label
        >
        <input
          type="number"
          id="weight"
          v-model="weight"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
      >
        신체 정보 저장
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const height = ref(175); // 현재 키
const weight = ref(70); // 현재 체중
</script>
