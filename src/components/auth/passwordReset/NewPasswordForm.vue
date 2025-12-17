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

// 1. Props: 라우터 뷰에서 토큰을 받습니다.
const props = defineProps({
  resetToken: {
    type: String,
    required: true,
  },
});

// 2. State
const passwordFieldsRef = ref(null);
const newPassword = ref(''); // PasswordFields에서 바인딩될 새 비밀번호
const pwCheck = ref(''); // PasswordFields에서 바인딩될 새 비밀번호 확인
// 🚨 새로운 상태 추가: 하위 컴포넌트에서 emit 받은 유효성 상태를 저장
const isPasswordValid = ref(false);
const isPasswordMatch = ref(false); // 👈 상태 추가
const formMsg = ref('');
const formMsgStatus = ref('');
const isLoading = ref(false);

// 3. 로딩 스피너는 NewPasswordForm.vue의 style 블록에 정의해야 합니다. (생략)

// 4. 비밀번호 재설정 제출 로직
const submitPasswordReset = async () => {
  // 🚨🚨🚨 핵심 수정: nextTick을 기다려, 모든 반응성 업데이트가 완료된 후 로직 실행
  await nextTick();
  const passwordLogic = passwordFieldsRef.value;
  formMsg.value = '';
  formMsgStatus.value = '';

  // 🚨 1. 필수 필드 검사 (비밀번호가 비어있지 않은지)
  if (!newPassword.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '새 비밀번호를 입력해주세요.';
    passwordLogic.passwordInput.focus();
    return;
  }

  // 🚨 2. 정규식 유효성 체크
  // if (!passwordLogic.isValidRegex.value) {
  //   console.log('도대체 뭐가 안되는거임? :: ', passwordLogic);
  //   console.log(
  //     '도대체 뭐가 안되는거임? :: ',
  //     passwordLogic.isValidRegex.value,
  //   );
  //   console.log('도대체 뭐가 안되는거임? :: ', passwordLogic.value);
  //   formMsgStatus.value = 'error';
  //   formMsg.value = '비밀번호가 요구 조건을 만족하지 않습니다.';
  //   passwordLogic.passwordInput.focus();
  //   return;
  // }
  // defineExpose 접근 대신, 직접 바인딩 받은 상태를 사용
  if (!isPasswordValid.value) {
    console.log('유효성 검사 실패: isPasswordValid:', isPasswordValid.value);
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호가 요구 조건을 만족하지 않습니다.';
    // 여전히 passwordInputRef는 ref 노출을 통해 접근
    passwordFieldsRef.value.passwordInput.focus();
    return;
  }

  // 🚨 3. 일치 여부 체크
  // if (!passwordLogic.isMatch.value) {
  //   formMsgStatus.value = 'error';
  //   formMsg.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
  //   passwordLogic.passwordInput.focus();
  //   return;
  // }
  if (!isPasswordMatch.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    passwordFieldsRef.value.passwordInput.focus();
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      token: props.resetToken, // 부모로부터 받은 토큰
      newPassword: newPassword.value,
    };

    // 🚨 백엔드 API 호출: 비밀번호 재설정 API는 새 비밀번호와 토큰을 요구합니다.
    const res = await store.confirmPasswordReset(payload);

    // 🚨 수정된 성공 조건 확인 로직 🚨
    if (res === '비밀번호가 변경되었습니다.' || res.code === 0) {
      // <-- 문자열 응답 확인
      alert('비밀번호가 성공적으로 재설정되었습니다. 로그인 해주세요.');
      router.push({ name: 'login' });
    } else {
      // 서버에서 토큰 만료 등 오류가 발생했을 경우 (JSON 응답일 경우)
      // res가 문자열이 아닌 객체이고, code가 0이 아닐 때만 msg를 사용
      formMsgStatus.value = 'error';
      // 문자열 응답이 아닌 경우 (오류 응답)의 msg를 사용하거나 기본 실패 메시지 사용
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
/* 🚨 로딩 스피너 CSS (PasswordFields.vue에도 있지만, 버튼 로딩을 위해 여기에 추가) */
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
