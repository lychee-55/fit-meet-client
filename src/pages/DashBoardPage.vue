// Dashboard.vue (예시)

<template>
  <div>
    <div
      v-if="userStore.isHealthInfoMissing"
      class="bg-yellow-100 p-4 rounded-lg mb-6 border border-yellow-300"
    >
      <p class="text-lg text-yellow-800 font-semibold">
        ⚠️ 신체 정보 작성이 미완료되었습니다. 정보를 작성하신 후에 모든 대시보드
        기능을 이용하실 수 있습니다.
      </p>
      <router-link
        to="/profile-setting"
        class="text-sm text-yellow-700 underline mt-1 block hover:text-yellow-900"
      >
        정보 작성 페이지로 이동
      </router-link>
    </div>

    <div :class="{ relative: userStore.isHealthInfoMissing }">
      <div
        v-if="userStore.isHealthInfoMissing"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm rounded-lg"
      >
        <p class="text-xl font-bold text-gray-700 p-4">
          신체 정보 미작성으로 인해 블러 처리되었습니다.
        </p>
      </div>

      <section
        :class="{
          'blur-sm pointer-events-none': userStore.isHealthInfoMissing,
        }"
      >
        <h2>나의 오늘의 식단 목표</h2>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { useUserStore } from '@/stores/User';

const authStore = useAuthStore();
const userStore = useUserStore();

onMounted(async () => {
  // 1. 필요한 데이터 로드
  // 신체 정보가 없거나, 아직 로드되지 않은 상태라면 전체 정보를 로드합니다.
  if (!userStore.healthInfo.height_cm && !authStore.loadingUser) {
    await authStore.fetchAllUserInfo();
  }
});
</script>
