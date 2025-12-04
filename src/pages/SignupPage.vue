<template>
  <div class="min-h-screen flex items-center justify-center bg-[#ffffff]">
    <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <!-- LEFT 박스: 로그인 폼 -->
      <div class="bg-[#ffffff] rounded-2xl shadow-md p-10 flex flex-col gap-6">
        <slot name="left">
          <h2 class="text-3xl flex justify-center">SIGNUP</h2>
          <hr />
          <SignupForm />
        </slot>
      </div>

      <!-- RIGHT 박스: 회원가입 유도 -->
      <div
        class="bg-[#ffffff] backdrop-blur-sm rounded-2xl shadow-md p-10 flex flex-col justify-center items-center gap-4"
      >
        <slot name="right">
          <p>이미 계정이 있으신가요?</p>
          <RouterLink to="/auth/login" class="hover:text-[#68b478]"
            >로그인 하러가기</RouterLink
          >
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import SignupForm from '@/components/auth/SignupForm.vue';
</script>
