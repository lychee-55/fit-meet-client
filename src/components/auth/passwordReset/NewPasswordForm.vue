<template>
  <form
    @submit.stop.prevent="submitPasswordReset"
    class="flex flex-col gap-7 mt-6"
  >
    <div
      class="p-4 bg-yellow-50 border-l-4 border-[#D3A373] text-sm text-gray-700 rounded-md"
    >
      비밀번호를 재설정합니다. 사용할
      <span class="font-bold">새 비밀번호</span>를 입력해주세요.
    </div>

    <PasswordFields
      ref="passwordFieldsRef"
      @update:password="newPassword = $event"
      @update:pw-check="pwCheck = $event"
      @update:is-password-valid="isPasswordValid = $event"
      @update:is-match="isPasswordMatch = $event"
    />

    <p
      class="text-sm mt-1"
      :class="{
        'text-red-600': formMsgStatus === 'error',
        'text-green-600': formMsgStatus === 'success',
      }"
    >
      {{ formMsg }}
    </p>

    <button
      type="submit"
      :disabled="isLoading"
      class="w-full py-3 mt-2 text-white text-lg font-semibold rounded-xl bg-[#D3A373] transition shadow"
      :class="{
        'orange-bg-color': !isLoading,
        'orange-bg-color cursor-not-allowed': isLoading,
      }"
    >
      <span v-if="isLoading" class="flex items-center justify-center">
        <div class="spinner mr-2"></div>
        재설정 중...
      </span>
      <span v-else> 비밀번호 재설정 </span>
    </button>
  </form>
</template>

<script setup>
import { ref, defineProps, nextTick } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import router from '@/router';
import PasswordFields from '@/components/auth/passwordReset/PasswordFields.vue'; // 🚨 재사용 컴포넌트 임포트

const store = useAuthStore();

const props = defineProps({
  resetToken: {
    type: String,
    required: true,
  },
});

const passwordFieldsRef = ref(null);
const newPassword = ref('');
const pwCheck = ref('');

const isPasswordValid = ref(false);
const isPasswordMatch = ref(false);
const formMsg = ref('');
const formMsgStatus = ref('');
const isLoading = ref(false);

// 비밀번호 재설정 로직
const submitPasswordReset = async () => {
  await nextTick();
  const passwordLogic = passwordFieldsRef.value;
  formMsg.value = '';
  formMsgStatus.value = '';

  // 필수 필드 검사
  if (!newPassword.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '새 비밀번호를 입력해주세요.';
    passwordLogic.passwordInput.focus();
    return;
  }

  // defineExpose 접근 대신, 직접 바인딩 받은 상태를 사용
  if (!isPasswordValid.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호가 요구 조건을 만족하지 않습니다.';
    passwordFieldsRef.value.passwordInput.focus();
    return;
  }

  if (!isPasswordMatch.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    passwordFieldsRef.value.passwordInput.focus();
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      token: props.resetToken,
      newPassword: newPassword.value,
    };

    // 비밀번호 재설정
    const res = await store.confirmPasswordReset(payload);

    if (res === '비밀번호가 변경되었습니다.' || res.code === 0) {
      alert('비밀번호가 성공적으로 재설정되었습니다. 로그인 해주세요.');
      router.push({ name: 'login' });
    } else {
      formMsgStatus.value = 'error';
      const errorMessage = res.msg || '비밀번호 재설정에 실패했습니다.';
      formMsg.value = errorMessage;
    }
  } catch (err) {
    formMsgStatus.value = 'error';
    formMsg.value = '요청 처리 중 오류가 발생했습니다.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ffffff;
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
