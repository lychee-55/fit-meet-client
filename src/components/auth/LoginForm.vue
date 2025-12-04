<!-- 여기는 화면 -->

<!-- 
1. 이메일 input
2. 이메일 input확인 div
3. 비밀번호 input
4. 비번확인 div
5. 로그인 버튼
6. 폼데이터 전송 (이메일, 비번, 로그인(통괄))
-->
<template>
  <form @submit.prevent="submitLogin" class="flex flex-col gap-7 my-6">
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

    <!-- 버튼과 인풋 사이 간격 크게 -->
    <button
      type="submit"
      class="w-full py-3 mt-6 text-white text-lg font-semibold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
    >
      로그인
    </button>
  </form>
</template>
<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/User';
import router from '@/router';
// import { nextTick } from 'vue';

const store = useUserStore();

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
      router.push({ name: 'home' });
    } else {
      if (res.code === 2001) {
        emailMsg.value = res.msg;
        // await nextTick(); // DOM 업데이트 이후에 실행됨
        emailInput.value?.focus();
      } else if (res.code === 1004) {
        alert(res.msg);

        // await nextTick(); // DOM 업데이트 이후에 실행됨
        // emailInput.value?.focus(); 어차피 아래 password만 focus됨.
        passwordInput.value?.focus();
      }
    }
  } catch (err) {
    emailMsg.value = '서버 오류가 발생했습니다.';
  }
};
</script>

<!-- <script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import router from '@/router';

const email = ref('');
const password = ref('');

const emailInput = ref(null);
const passwordInput = ref(null);

const emailMsg = ref('');
const passwordMsg = ref('');
// const passwordMsg = computed(() => {
//   return password.value ? "비밀번호 입력 완료" : "";
// });

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
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        email: email.value,
        password: password.value,
      },
    );

    if (res.data.code === 0) {
      // 로그인 성공
      email.value = '';
      password.value = '';
      emailMsg.value = '';
      alert('로그인 성공!');
      router.push({ name: 'home' });
    } else {
      // 서버가 실패 원인 전달
      if (res.data.message === 'email') {
        emailMsg.value = '존재하지 않는 이메일입니다.';
        emailInput.value?.focus();
      } else if (res.data.message === 'password') {
        alert('비밀번호가 일치하지 않습니다.');
        passwordInput.value?.focus();
      } else {
        alert('로그인 실패: ' + res.data.message);
      }
    }
  } catch (err) {
    emailMsg.value = '서버 오류가 발생했습니다';
    emailInput.value?.focus();
  }
};
</script> -->

<style scoped>
/* .container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 50px auto;
}

input {
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

#checkEmail {
  color: red;
}

#checkPassword {
  color: green;
} */
</style>
