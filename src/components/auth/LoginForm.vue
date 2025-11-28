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
  <div class="container">
    <form @submit.prevent="submitLogin">
      <input
        type="email"
        name="email"
        v-model="email"
        placeholder="example@ssafy.com"
        ref="emailInput"
      />
      <div id="checkEmail">{{ emailMsg }}</div>

      <input
        type="password"
        name="password"
        v-model="password"
        placeholder="비밀번호를 입력하세요"
        ref="passwordInput"
      />
      <div v-show="password" id="checkPassword">{{ passwordMsg }}</div>

      <button type="submit">로그인</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");

const emailInput = ref(null);
const passwordInput = ref(null);

const emailMsg = ref("");
const passwordMsg = ref("");
// const passwordMsg = computed(() => {
//   return password.value ? "비밀번호 입력 완료" : "";
// });

const submitLogin = async () => {
  if (!email.value) {
    emailMsg.value = "이메일을 입력해주세요!";
    emailInput.value?.focus();
    return;
  }

  if (!password.value) {
    alert("비밀번호를 입력해주세요!");
    passwordInput.value?.focus();
    return;
  }

  try {
    const res = await axios.post("/로그인해야하는 api", {
      email: email.value,
      password: password.value,
    });

    if (res.data.success) {
      // 로그인 성공
      email.value = "";
      password.value = "";
      emailMsg.value = "";
      alert("로그인 성공!");
    } else {
      // 서버가 실패 원인 전달
      if (res.data.message === "email") {
        emailMsg.value = "존재하지 않는 이메일입니다.";
        emailInput.value?.focus();
      } else if (res.data.message === "password") {
        alert("비밀번호가 일치하지 않습니다.");
        passwordInput.value?.focus();
      } else {
        alert("로그인 실패: " + res.data.message);
      }
    }
  } catch (err) {
    emailMsg.value = "서버 오류가 발생했습니다";
    emailInput.value?.focus();
  }
};
</script>

<style scoped>
.container {
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
}
</style>
