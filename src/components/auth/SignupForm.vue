<template>
  <form @submit.stop.prevent="submitSignup" class="flex flex-col gap-7 mt-6">
    <div class="flex flex-col gap-3">
      <label class="text-base font-semibold text-[#8A8F6E]">프로필 사진</label>

      <div class="flex justify-center items-center h-28">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          alt="프로필 미리보기"
          class="w-32 h-32 rounded-full object-cover border-4 border-[#D3A373] shadow-md transition-all duration-300"
        />
        <div
          v-else
          class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300 text-gray-500 text-xs"
        >
          미리보기
        </div>
      </div>

      <div class="flex justify-center mt-3">
        <input
          type="file"
          @change="handleFileChange"
          accept="image/*"
          ref="fileInput"
          id="profile-file-input"
          class="hidden"
        />

        <label
          for="profile-file-input"
          class="w-30 text-center px-4 py-3 text-white rounded-xl bg-[#8A8F6E] hover:bg-[#6e7256] transition shadow cursor-pointer text-sm font-medium"
        >
          사진 선택
        </label>
      </div>
    </div>
    <div class="flex flex-col">
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
          type="button"
          @click="checkEmail"
          class="px-4 py-3 text-sm text-white rounded-xl orange-bg-color hover:orange-bg-color transition shadow"
        >
          중복확인
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

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">이름</label>

      <input
        type="text"
        v-model="userName"
        placeholder="이름을 입력하세요..ex)홍길동"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        required
      />
    </div>

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">닉네임</label>

      <input
        type="text"
        v-model="nickname"
        placeholder="닉네임을 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        required
      />
    </div>

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">비밀번호</label>
      <p class="text-[10px] text-gray-600">
        비밀번호는 8~20자이며, 영문자ㆍ숫자ㆍ특수문자를 각각 최소 1자 이상
        포함해야 합니다.
      </p>

      <input
        type="password"
        v-model="password"
        ref="passwordInput"
        placeholder="비밀번호를 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />

      <p
        v-show="password && passwordValidationMsg"
        class="mt-1 text-sm"
        :class="{
          'text-red-600': !isPasswordValid,
          'text-green-600': isPasswordValid,
        }"
      >
        {{ passwordValidationMsg }}
      </p>
    </div>

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]"
        >비밀번호 확인</label
      >

      <input
        type="password"
        v-model="pwCheck"
        placeholder="비밀번호를 다시 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />

      <p
        v-show="password && pwCheck"
        class="mt-1 text-sm"
        :class="{
          'text-red-600': pwStatus === 'error',
          'text-green-600': pwStatus === 'success',
        }"
      >
        {{ passwordMsg }}
      </p>
      <p
        class="text-sm mt-1"
        :class="{
          'text-red-600': formMsgStatus === 'error',
          'text-green-600': formMsgStatus === 'success',
        }"
      >
        {{ formMsg }}
      </p>
    </div>

    <button
      type="submit"
      class="w-full py-3 mt-2 text-white text-lg font-semibold rounded-xl orange-bg-color hover:orange-bg-color transition shadow"
    >
      회원가입
    </button>

    <div class="md:hidden text-center">
      <RouterLink
        to="/auth/login"
        class="text-sm text-[#68b478] hover:underline"
      >
        이미 계정이 있으신가요? 로그인하기
      </RouterLink>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import router from '@/router';

const store = useAuthStore();

const email = ref('');
const userName = ref('');
const nickname = ref('');
const password = ref('');
const pwCheck = ref('');
const formMsg = ref(''); // 서버 오류 및 필수 필드 누락 메시지 용도

const formMsgStatus = ref('');
// 🚨 추가: 비밀번호 정규식 (8~20자, 영문/숫자/특수문자 각 1개 이상)
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

// 🚨 추가: 비밀번호 유효성 상태 및 메시지
const isPasswordValid = ref(false);
const passwordValidationMsg = ref('');

watch([password, pwCheck], () => {
  // 비밀번호가 변경되면 전체 폼 메시지 초기화
  formMsg.value = '';
  formMsgStatus.value = '';
});

// 🚨 추가: 비밀번호 정규식 유효성 검사
watch(password, newPassword => {
  if (!newPassword) {
    isPasswordValid.value = false;
    passwordValidationMsg.value = '';
    return;
  }

  if (PASSWORD_REGEX.test(newPassword)) {
    isPasswordValid.value = true;
    passwordValidationMsg.value = '사용 가능한 비밀번호입니다.';
  } else {
    isPasswordValid.value = false;
    passwordValidationMsg.value =
      '비밀번호는 8~20자, 영문자/숫자/특수문자를 포함해야 합니다.';
  }
});

const emailStatus = ref('');
const emailMsg = ref('');
const isEmailChecked = ref(false);

const emailInput = ref(null);
const passwordInput = ref(null);

// 비밀번호 확인 (일치 여부만 체크)
const pwStatus = ref('');
const passwordMsg = computed(() => {
  if (!password.value || !pwCheck.value) return '';
  if (formMsgStatus.value === 'error') return ''; // 서버 오류 발생 시 숨김

  if (password.value === pwCheck.value) {
    pwStatus.value = 'success';
    return '비밀번호가 일치합니다.';
  } else {
    pwStatus.value = 'error';
    return '비밀번호가 일치하지 않습니다.';
  }
});

const fileInput = ref(null); // 파일 인풋 참조

const profileFile = ref(null);
const previewUrl = ref(null); // 이미지 미리보기 URL

// 파일 선택 시 호출되는 함수
const handleFileChange = event => {
  const file = event.target.files[0];
  if (file) {
    profileFile.value = file;
    // 미리보기 URL 생성
    previewUrl.value = URL.createObjectURL(file);
  } else {
    profileFile.value = null;
    previewUrl.value = null;
  }
};

watch(email, () => {
  isEmailChecked.value = false;
  emailMsg.value = '';
});

// ⭐ 이메일 중복 체크
const checkEmail = async () => {
  const trimmedEmail = email.value.trim();

  // 🔥 공백이거나 빈 문자열이면 서버에 요청 보내지 않도록 막기
  if (!trimmedEmail) {
    emailStatus.value = 'error';
    emailMsg.value = '이메일을 입력해주세요!';
    emailInput.value?.focus();
    return;
  }

  const result = await store.checkEmail(email.value);

  console.log('이메일 중복확인:: ', result);
  if (result.available) {
    emailStatus.value = 'success';
    emailMsg.value = '사용 가능한 이메일입니다 :)';
    isEmailChecked.value = true;
  } else {
    emailStatus.value = 'error';
    emailMsg.value = result.message;
    isEmailChecked.value = false;
    emailInput.value?.focus();
  }
};

// ⭐ 회원가입
const submitSignup = async () => {
  // 🚨 1. 모든 필수 필드 공백 검사
  if (
    !email.value ||
    !userName.value ||
    !nickname.value ||
    !password.value ||
    !pwCheck.value
  ) {
    formMsgStatus.value = 'error';
    formMsg.value = '모든 필수 정보를 입력해주세요.';
    return; // 즉시 제출 중단
  }

  // 🚨 2. 이메일 중복 확인 여부 체크
  if (!isEmailChecked.value) {
    emailMsg.value = '이메일 중복확인을 해주세요!';
    emailStatus.value = 'error';
    emailInput.value?.focus();
    return;
  }

  // 🚨 3. 비밀번호 정규식 유효성 체크
  if (!isPasswordValid.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호가 요구 조건을 만족하지 않습니다.';
    passwordInput.value?.focus();
    return;
  }

  // 🚨 4. 비밀번호 일치 여부 체크
  if (password.value !== pwCheck.value) {
    formMsgStatus.value = 'error';
    formMsg.value = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    passwordInput.value?.focus();
    return;
  }

  // 유효성 검사 통과 후 데이터 전송 준비
  const formData = new FormData();

  // 1. 텍스트 데이터
  formData.append('email', email.value);
  formData.append('password', password.value);
  formData.append('name', userName.value);
  formData.append('nickname', nickname.value);

  // 2. 파일 데이터
  if (profileFile.value) {
    formData.append('profileImage', profileFile.value);
  }

  try {
    // FormData 내용 디버깅 (필요 시 주석 해제)
    // console.log('--- 프론트에서 전달하는 FormData 내용 ---');
    // for (const [key, value] of formData.entries()) {
    //     if (value instanceof File) {
    //         console.log(`[File] ${key}: ${value.name} (${value.size} bytes)`);
    //     } else {
    //         console.log(`[Text] ${key}: ${value}`);
    //     }
    // }
    // console.log('-------------------------------------------');

    // Auth Store의 createUser 함수 호출
    const res = await store.createUser(formData);
    if (res.code === 0) {
      alert('회원가입 성공!');
      router.push({ name: 'login' });
      // router.push({ name: 'userHealthInfo' });
    }
  } catch (err) {
    // 서버에서 발생한 특정 오류 처리 (예: 비밀번호 유효성 검사 실패)
    if (err.code === 1012) {
      formMsgStatus.value = 'error';
      formMsg.value = err.msg;
      passwordInput.value?.focus();
      return;
    }

    // 기타 서버 오류
    formMsgStatus.value = 'error';
    formMsg.value = '서버 오류가 발생했습니다.';
    console.error(err);
  }
};
</script>

<style scoped></style>
