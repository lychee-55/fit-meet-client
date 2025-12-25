<template>
  <div class="p-4 rounded-lg bg-white max-w-3xl mx-auto">
    <h3 class="text-xl font-semibold text-gray-700 mb-4">비밀번호 변경</h3>
    <p class="text-sm text-gray-500 mb-6">
      보안을 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.
    </p>

    <form class="space-y-4" @submit.stop.prevent="handleChangePassword">
      <div>
        <label for="current-pw" class="text-base font-semibold text-[#8A8F6E]"
          >현재 비밀번호</label
        >
        <input
          type="password"
          id="current-pw"
          v-model="currentPassword"
          placeholder="현재 비밀번호를 입력하세요"
          :disabled="isSubmitting"
          class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        />
      </div>

      <PasswordFields
        ref="passwordFieldsRef"
        @update:password="val => (newPassword = val)"
        @update:isPasswordValid="val => (isPasswordValid = val)"
        @update:isMatch="val => (isMatch = val)"
      />

      <div v-if="errorMessage" class="text-red-600 text-sm py-2">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-green-600 text-sm py-2">
        {{ successMessage }}
      </div>

      <button
        type="submit"
        :disabled="!isFormValid || isSubmitting"
        class="w-full py-2 px-4 my-2 text-white text-base font-bold rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow-lg"
        :class="{
          'bg-gray-400 cursor-not-allowed hover:bg-gray-400 shadow-none':
            !isFormValid || isSubmitting,
        }"
      >
        {{ isSubmitting ? '변경 중...' : '비밀번호 변경' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PasswordFields from '@/components/auth/passwordReset/PasswordFields.vue';
import { useUserStore } from '@/stores/User';

const userStore = useUserStore();

const currentPassword = ref('');
const newPassword = ref('');
const isPasswordValid = ref(false);
const isMatch = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const passwordFieldsRef = ref(null);

// 폼 전체 유효성 검사
const isFormValid = computed(() => {
  return (
    currentPassword.value.trim() !== '' &&
    newPassword.value.trim() !== '' &&
    isPasswordValid.value &&
    isMatch.value
  );
});

// watch([isPasswordValid, isMatch], ([newValid, newMatch]) => {
//   // console.log(`[Parent Watch] isPasswordValid: ${newValid}, isMatch: ${newMatch}`);
// });

// 비밀번호 변경
const handleChangePassword = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    errorMessage.value = '모든 필드를 확인하고 유효성 검사를 통과해야 합니다.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const res = await userStore.updatePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    if (res.code === 0) {
      alert(res.msg);
      currentPassword.value = '';
    } else if (res.code === 1004) {
      errorMessage.value = '비밀번호가 일치하지 않습니다!';
      currentPassword.value = '';
    }
    if (passwordFieldsRef.value && passwordFieldsRef.value.clearFields) {
      passwordFieldsRef.value.clearFields();
    }
  } catch (error) {
    const errorMsg =
      error.response?.data?.msg ||
      '비밀번호 변경 중 알 수 없는 오류가 발생했습니다.';
    errorMessage.value = errorMsg;
  } finally {
    isSubmitting.value = false;
  }
};
</script>
