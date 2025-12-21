<template>
  <form @submit.prevent="submitLogin" class="flex flex-col gap-7 mt-6">
    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">이메일</label>
      <input
        type="email"
        v-model="email"
        placeholder="example@ssafy.com"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-[#ffffff] focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />
      <p class="mt-1 text-sm text-red-600">{{ emailMsg }}</p>
    </div>

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">비밀번호</label>
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호를 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-[#ffffff] focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />
      <p v-show="password" class="mt-1 text-sm text-green-600">
        {{ passwordMsg }}
      </p>
    </div>
    <div
      class="text-sm text-right text-gray-400 hover:underline hover:text-blue-600 cursor-pointer"
    >
      <RouterLink to="/auth/password-reset">
        비밀번호를 잊어버리셨나요?
      </RouterLink>
    </div>

    <button
      type="submit"
      class="w-full py-3 text-white text-lg font-semibold rounded-xl orange-bg-color hover:orange-bg-color transition shadow"
    >
      로그인
    </button>

    <div class="md:hidden text-center">
      <RouterLink
        to="/auth/signup"
        class="text-sm text-[#68b478] hover:underline"
      >
        아직 회원가입이 안되셨나요?
      </RouterLink>
    </div>
  </form>
</template>
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import router from '@/router';

const store = useAuthStore();

const email = ref('');
const password = ref('');

const emailMsg = ref('');
const passwordMsg = ref('');
const emailInput = ref(null);
const passwordInput = ref(null);

const submitLogin = async () => {
  if (!email.value) {
    emailMsg.value = '이메일을 입력해주세요!';
    emailInput.value?.focus();
    return;
  }

  if (!password.value) {
    alert('비밀번호를 입력해주세요!');
    passwordInput.value?.focus();
    return;
  }

  try {
    const res = await store.getLogin({
      email: email.value,
      password: password.value,
    });
    console.log('로그인 콘솔::', res);
    if (res.code === 0) {
      alert('로그인 성공!');
      router.push({ name: 'dashBoard' });
    } else {
      if (res.code === 2001) {
        emailMsg.value = res.msg;
        emailInput.value?.focus();
      } else if (res.code === 1004) {
        alert(res.msg);

        passwordInput.value?.focus();
      } else {
        emailMsg.value = '이메일이 존재하지 않습니다. 회원가입을 해주세요';
      }
    }
  } catch (err) {
    if (err.response) {
      console.error('에러가 뭐야', err);
    }
    emailMsg.value = '서버 오류가 발생했습니다.';
  }
};
</script>

<style scoped></style>
