<template>
  <form @submit.stop.prevent="sendEmail">
    <div class="flex flex-col my-10">
      <label class="text-base font-semibold text-[#8A8F6E]">이메일</label>
      <div class="flex gap-3 mt-2">
        <input
          type="email"
          v-model="email"
          placeholder="example@ssafy.com"
          ref="emailInput"
          class="flex-1 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        />
        <button
          type="submit"
          :disabled="isLoading"
          class="px-4 py-3 text-white rounded-xl bg-[#D3A373] transition shadow flex items-center justify-center"
          :class="{
            'hover:': !isLoading,
            'orange-bg-color cursor-not-allowed': isLoading,
          }"
        >
          <span v-if="isLoading" class="flex items-center">
            <div class="spinner mr-2"></div>
            전송 중...
          </span>
          <span v-else> 전송 </span>
        </button>
      </div>

      <p
        class="mt-1 text-sm"
        :class="{
          'text-red-600': emailStatus === 'error',
          'text-green-600': emailStatus === 'success',
        }"
      >
        {{ emailMsg }}
      </p>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/Auth';

const store = useAuthStore();
const email = ref('');
const emailMsg = ref('');
const emailInput = ref(null);
const emailStatus = ref('');
const isLoading = ref(false);

const sendEmail = async () => {
  const trimmedEmail = email.value.trim();

  if (!trimmedEmail) {
    emailStatus.value = 'error';
    emailMsg.value = '이메일을 입력해주세요!';
    emailInput.value?.focus();
    return;
  }

  isLoading.value = true;
  emailStatus.value = ''; // 상태 초기화
  emailMsg.value = '';

  try {
    const result = await store.requestPasswordReset(email.value);
    if (result.success) {
      emailStatus.value = 'success';
      emailMsg.value = result.message;
    } else {
      emailStatus.value = 'error';
      emailMsg.value = result.message || '이메일 전송에 실패했습니다.';
    }
  } catch (error) {
    emailStatus.value = 'error';
    emailMsg.value = `요청 실패: 서버와의 통신에 문제가 발생했습니다.`;
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 🚨 로딩 스피너 CSS */
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ffffff; /* 스피너 색상 */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
