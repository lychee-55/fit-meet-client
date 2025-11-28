<!-- 여기는 화면 -->
<!-- 
1. 이메일 input
2. 이메일 input 중복확인 div
3. 닉네임 input
5. 비밀번호 input
6. 비번확인 input (두개가 일치하는지 동적 확인 => 정규식 패턴 확인 )
7. 프로필 사진은...?

8. 회원가입 버튼
9. 폼데이터 전송 (이메일중복 확인, 회원가입)
-->
<template>
  <div class="container">
    <form @submit.prevent="submitSignup">
      <!-- 이메일 -->
      <div class="emailInputDiv">
        <input type="email" v-model="email" placeholder="example@ssafy.com" ref="emailInput" />
        <button type="button" @click="checkEmail">중복확인</button>
      </div>
      <div
        id="checkEmail"
        :class="{ 'text-red': emailStatus === 'error', 'text-green': emailStatus === 'success' }"
      >
        {{ emailMsg }}
      </div>

      <!-- 비밀번호 -->
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호를 입력하세요"
        ref="passwordInput"
      />

      <!-- 비밀번호 확인 -->
      <input type="password" v-model="pwCheck" placeholder="비밀번호를 다시 입력해주세요" />

      <div
        v-show="password && pwCheck"
        id="checkPassword"
        :class="{ 'text-red': pwStatus === 'error', 'text-green': pwStatus === 'success' }"
      >
        {{ passwordMsg }}
      </div>

      <div
        id="formMsg"
        :class="{
          'text-red': formMsgStatus === 'error',
          'text-green': formMsgStatus === 'success',
        }"
      >
        {{ formMsg }}
      </div>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";

// 입력값
const email = ref("");
const password = ref("");
const pwCheck = ref("");

// DOM ref
const emailInput = ref(null);
const passwordInput = ref(null);

const emailStatus = ref("");
const pwStatus = ref("");
const formMsgStatus = ref("");

// 중복확인 여부
const isEmailChecked = ref(false);

// 메시지
const formMsg = ref("");
const emailMsg = ref("");
const passwordMsg = computed(() => {
  if (!password.value || !pwCheck.value) return "";
  // return password.value === pwCheck.value
  //   ? "비밀번호가 일치합니다."
  //   : "비밀번호가 일치하지 않습니다.";
  if (password.value === pwCheck.value) {
    pwStatus.value = "success";
    return "비밀번호가 일치합니다.";
  } else {
    pwStatus.value = "error";
    return "비밀번호가 일치하지 않습니다.";
  }
});

// 비밀번호 일치 여부
const isCheckedPw = computed(() => {
  return password.value && pwCheck.value && password.value === pwCheck.value;
});

// 이메일이 바뀌면 중복확인 다시 해야함
watch(email, () => {
  isEmailChecked.value = false;
  emailMsg.value = "";
});

// ✔ 이메일 중복확인 함수
const checkEmail = async () => {
  if (!email.value) {
    emailMsg.value = "이메일을 입력해주세요!";
    emailStatus.value = "error";
    emailInput.value?.focus();
    return;
  }

  try {
    const res = await axios.get("이메일 중복 조회 api", {
      params: { email: email.value },
    });

    if (res.data.exists) {
      emailMsg.value = "이미 존재하는 이메일 입니다 :(";
      emailStatus.value = "error";
      isEmailChecked.value = false;
    } else {
      emailMsg.value = "사용 가능한 이메일입니다 :)";
      emailStatus.value = "success";
      isEmailChecked.value = true;
    }
  } catch (err) {
    emailMsg.value = "서버 오류가 발생했습니다";
  }
};

// ✔ 회원가입 요청
const submitSignup = async () => {
  // 1. 이메일 중복확인 체크
  if (!isEmailChecked.value) {
    emailMsg.value = "이메일 중복확인을 해주세요!";
    emailInput.value?.focus();
    return;
  }

  // 2. 비밀번호 체크
  if (!isCheckedPw.value) {
    alert("비밀번호가 일치하지 않습니다!");
    passwordInput.value?.focus();
    return;
  }

  try {
    const res = await axios.post("회원가입을 할 api", {
      email: email.value,
      password: password.value,
    });

    if (res.data.success) {
      alert("회원가입 성공!");

      // 초기화
      email.value = "";
      password.value = "";
      pwCheck.value = "";
      isEmailChecked.value = false;
    } else {
      alert("회원가입 실패: " + res.data.message);
    }
  } catch (err) {
    alert("서버 오류가 발생했습니다.");
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

.text-red {
  color: red;
}

.text-green {
  color: green;
}
</style>
