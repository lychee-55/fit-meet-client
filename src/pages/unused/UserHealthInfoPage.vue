<!-- <template>
  <div class="min-h-screen flex items-center justify-center bg-[#fffcf6]">
    <div class="w-full max-w-3xl grid grid-cols-1 md: gap-8 p-6">
      <div class="bg-white rounded-2xl shadow-md p-10 flex flex-col gap-6">
       
        <div class="mb-10">
          <ProgressBar :step="step" :total="5" />
        </div>

        <div class="min-h-[280px] flex items-center justify-center">
          <component :is="currentComponent" v-model="formData" />
        </div>

        <div class="flex justify-between mt-10">
          <button
            v-if="step > 1"
            @click="prevStep"
            class="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            이전
          </button>

          <button
            v-if="step < 5"
            @click="nextStep"
            class="ml-auto px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            다음
          </button>

          <button
            v-if="step === 5"
            @click="submit"
            class="ml-auto px-6 py-3 rounded-xl bg-green-700 text-white hover:bg-green-800 transition"
          >
            완료
          </button>
        </div>

        <div class="mt-6 text-center">
          <button @click="goHome" class="text-gray-500 underline">
            다음에 작성하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';

import ProgressBar from '@/components/userInfo/health/ProgressBar.vue';
import StepGenderBirth from '@/components/userInfo/health/StepGenderBirth.vue';
import StepHeight from '@/components/userInfo/health/StepHeight.vue';
import StepWeight from '@/components/userInfo/health/StepWeight.vue';
import StepTargetWeight from '@/components/userInfo/health/StepTargetWeight.vue';
import StepActivityLevel from '@/components/userInfo/health/StepActivityLevel.vue';

const router = useRouter();
const Store = useUserStore();

const step = ref(1);

const formData = reactive(Store.healthInfo);

const components = [
  StepGenderBirth,
  StepHeight,
  StepWeight,
  StepTargetWeight,
  StepActivityLevel,
];

const currentComponent = computed(() => components[step.value - 1]);

function nextStep() {
  if (step.value < 5) step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function submit() {
  await Store.submitBodyProfileInfo();
  router.push('/home/dashBoard');
}

function goHome() {
  router.push('/home/dashBoard');
}
</script> -->

<!-- 2버젼 -->
<!-- <template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8 sm:p-10 flex flex-col gap-8">
        <ProgressBar :step="step" :total="components.length" class="" />
        <header class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 border-b pb-3 mb-2">
            기본 정보 입력
          </h2>
        </header>

        <hr class="border-gray-200" />

        <div class="min-h-[250px] flex items-center justify-center py-4">
          <component :is="currentComponent" v-model="formData" />
        </div>

        <hr class="border-gray-200" />

        <div class="flex justify-between items-center mt-4">
          <button
            v-if="step > 1"
            @click="prevStep"
            class="px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
          >
            이전
          </button>

          <div :class="{ 'ml-auto': step === 1 }">
            <button
              v-if="step < components.length"
              @click="nextStep"
              class="px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg shadow-green-500/30"
            >
              다음
            </button>

            <button
              v-if="step === components.length"
              @click="submit"
              class="px-8 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow-lg shadow-green-600/40"
            >
              완료
            </button>
          </div>
        </div>

        <div class="mt-4 text-center">
          <button
            @click="goHome"
            class="text-sm text-gray-500 hover:text-gray-700 underline transition"
          >
            다음에 작성하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';

import ProgressBar from '@/components/userInfo/health/ProgressBar.vue';
import StepGenderBirth from '@/components/userInfo/health/StepGenderBirth.vue';
import StepHeight from '@/components/userInfo/health/StepHeight.vue';
import StepWeight from '@/components/userInfo/health/StepWeight.vue';
import StepTargetWeight from '@/components/userInfo/health/StepTargetWeight.vue';
import StepActivityLevel from '@/components/userInfo/health/StepActivityLevel.vue';

const router = useRouter();
const Store = useUserStore();

// total을 components.length로 자동 계산하도록 수정
const components = [
  StepGenderBirth,
  StepHeight,
  StepWeight,
  StepTargetWeight,
  StepActivityLevel,
];

const step = ref(1);

const formData = reactive(Store.healthInfo);

const currentComponent = computed(() => components[step.value - 1]);

function nextStep() {
  if (step.value < components.length) step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function submit() {
  await Store.submitBodyProfileInfo();
  router.push('/home/dashBoard');
}

function goHome() {
  router.push('/home/dashBoard');
}
</script> -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div
      class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div class="p-8 sm:p-12 flex flex-col gap-10">
        <header class="flex flex-col gap-4">
          <h2 class="text-3xl font-extrabold text-gray-800 text-center">
            나만의 건강 정보 입력
          </h2>
          <p class="text-center text-lg text-green-700 font-semibold">
            Step {{ step }} / {{ components.length }}:
            {{ stepTitles[step - 1] }}
          </p>
          <ProgressBar :step="step" :total="components.length" />
        </header>

        <div class="min-h-[300px] flex items-center justify-center py-4">
          <Transition name="fade-slide" mode="out-in">
            <component
              :is="currentComponent"
              :key="step"
              v-model="formData"
              class="w-full"
            />
          </Transition>
        </div>

        <div
          class="flex justify-between items-center pt-6 border-t border-gray-100"
        >
          <button
            v-if="step > 1"
            @click="prevStep"
            class="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            이전
          </button>
          <div v-else class="w-1/4"></div>
          <div :class="{ 'ml-auto': step === 1 }">
            <button
              v-if="step < components.length"
              @click="nextStep"
              class="flex items-center gap-2 px-8 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-lg shadow-green-500/30"
            >
              다음
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              v-if="step === components.length"
              @click="submit"
              class="px-8 py-3 rounded-full bg-green-700 text-white font-semibold hover:bg-green-800 transition shadow-lg shadow-green-600/40"
            >
              완료하고 시작하기
            </button>
          </div>
        </div>

        <div class="mt-4 text-center">
          <button
            @click="goHome"
            class="text-sm text-gray-400 hover:text-gray-600 underline transition"
          >
            다음에 작성하기 (대시보드로 이동)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';

import ProgressBar from '@/components/userInfo/health/ProgressBar.vue';
import StepGenderBirth from '@/components/userInfo/health/StepGenderBirth.vue';
import StepHeight from '@/components/userInfo/health/StepHeight.vue';
import StepWeight from '@/components/userInfo/health/StepWeight.vue';
import StepTargetWeight from '@/components/userInfo/health/StepTargetWeight.vue';
import StepActivityLevel from '@/components/userInfo/health/StepActivityLevel.vue';
import { useAuthStore } from '@/stores/Auth';

const router = useRouter();
const store = useUserStore();
const authStore = useAuthStore();

const isLoggedIn = authStore.isLoggedIn;

const components = [
  StepGenderBirth,
  StepHeight,
  StepWeight,
  StepTargetWeight,
  StepActivityLevel,
];

// 단계별 제목 추가
const stepTitles = [
  '성별과 생년월일을 알려주세요',
  '현재 키를 입력해주세요',
  '현재 몸무게를 입력해주세요',
  '목표하는 몸무게를 알려주세요',
  '평소 활동량을 선택해주세요',
];

const step = ref(1);
const formData = reactive(store.healthInfo);
const currentComponent = computed(() => components[step.value - 1]);

function nextStep() {
  if (step.value < components.length) step.value++;
}

function prevStep() {
  if (step.value > 1) step.value--;
}

async function submit() {
  try {
    const successMessage = await store.submitBodyProfileInfo();

    // 1. 성공 메시지 표시 (alert 사용)
    alert(successMessage);

    // 2. 대시보드로 이동
    if (isLoggedIn) {
      router.push({ name: 'dashBoard' });
    } else {
      router.push({ name: 'login' });
    }
  } catch (error) {
    // 1. 실패 메시지 표시 (alert 사용)
    alert(`[등록 실패] ${error.message}`);

    // 2. 실패 시 페이지 이동 없음 (사용자가 수정할 수 있도록 현재 페이지 유지)
  }
}

function goHome() {
  if (isLoggedIn) {
    router.push({ name: 'dashBoard' });
  } else {
    router.push({ name: 'login' });
  }
}
</script>

<style scoped>
/* 페이지 전환 애니메이션 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
