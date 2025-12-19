<template>
  <div class="min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <AlertFillBodyInfo v-if="userStore.isHealthInfoMissing" class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:items-start">
        <div class="lg:col-span-7 grid grid-cols-1 gap-6">
          <TodayNutritions class="h-62" />

          <TotalScores class="h-112" />

          <DietCalender />
        </div>

        <div class="lg:col-span-3 grid grid-cols-1 gap-6">
          <AiAnalysisCard class="h-62" />

          <MyStreak class="h-112" />
        </div>
      </div>

      <!-- <WriteDietBoardBtn /> -->
      <button
        @click="isOptionModalVisible = true"
        class="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-[#8A8F6E] text-white shadow-xl hover:bg-[#6e7256] transition z-40 cursor-pointer"
      >
        <PlusIcon class="w-8 h-8 mx-auto" />
      </button>
      <CreateDietFormOptionModal
        :is-visible="isOptionModalVisible"
        @update:isVisible="isOptionModalVisible = $event"
        @selectOption="handleSelectOption"
      />
    </div>
  </div>
</template>

<script setup>
import AiAnalysisCard from '@/components/dashboard/AiAnalysisCard.vue';
import AlertFillBodyInfo from '@/components/dashboard/AlertFillBodyInfo.vue';
import DietCalender from '@/components/dashboard/calender/DietCalender.vue';
import MyStreak from '@/components/dashboard/MyStreak.vue';
import TodayNutritions from '@/components/dashboard/nutrition/TodayNutritions.vue';
import TotalScores from '@/components/dashboard/score/TotalScores.vue';
import CreateDietFormOptionModal from '@/components/diet/CreateDietFormOptionModal.vue';
import { useModalStore } from '@/stores/modal';
import { PlusIcon } from '@heroicons/vue/24/outline';
import { useUserStore } from '@/stores/User';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router'; // useRouter 임포트 필요

const router = useRouter(); // router 인스턴스 생성

const modalStore = useModalStore();
const userStore = useUserStore();
const isOptionModalVisible = ref(false);

// 모달에서 'saved' 이벤트 발생 시 처리 로직
const handleModalSaved = () => {
  // 식단 등록/수정 성공 시 달력 또는 목록을 새로고침하는 로직을 여기에 추가
  console.log('식단이 저장되었습니다. 데이터를 새로고침합니다.');
  // 예: dietStore.fetchDietForDay(selectedDate);
};

const handleSelectOption = option => {
  let methodParam;

  if (option === 'manual') {
    // URL: /diet/create-diet/manual
    methodParam = 'manual';
  } else if (option === 'public-api') {
    // URL: /diet/create-diet/public-api
    methodParam = 'public-api';
  } else {
    // 옵션이 유효하지 않으면 종료
    return;
  }

  // 💡 라우팅 실행: name과 params를 사용하여 이동
  router.push({
    name: 'dietForm', // 라우터에 정의한 이름
    params: {
      method: methodParam, // URL에 들어갈 값 (manual 또는 public-api)
    },
  });
};
</script>

<!-- // Dashboard.vue (예시)

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
</script> -->
